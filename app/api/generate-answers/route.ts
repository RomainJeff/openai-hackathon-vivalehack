import { Agent, run, RunContext, RunState, tool } from '@openai/agents';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getTicketById, saveTicket } from '@/services/ticketService';
import { getSupportAgents } from '@/services/supportAgentService';
import { Ticket, TicketStatus } from '@/types/ticket';

const generateAnswerTool = tool({
  name: 'generateAnswer',
  description: 'Use this tool to draft 3 different possible answers to the customer query. The answers should be polite, helpful, and offer different approaches if possible (e.g., one direct answer, one with more questions for clarification, one with alternative solutions). Only if the ticket status is waiting_for_pickup.',
  parameters: z.object({
    answers: z.array(z.string()).describe('The answers to the customer query.'),
  }),
  execute: async (answers, runContext?: RunContext<Ticket>) => {
    const ticket = runContext?.context as Ticket;
    ticket.status = TicketStatus.PICKED_UP_BY_AGENT;
    ticket.proposedAnswers = answers.answers;
    saveTicket(ticket);

    return answers;
  },
});

const answerToCustomerTool = tool({
  name: 'answerToCustomer',
  description: 'Use this tool to answer the customer, only if the ticket status is picked_up_by_agent.',
  parameters: z.object({}),
  needsApproval: async (_context) => {
    const ticket = _context.context as Ticket;
    return ticket.status === TicketStatus.PICKED_UP_BY_AGENT;
  },
  execute: async (_args, runContext?: RunContext<Ticket>) => {
    const ticket = runContext?.context as Ticket;
    ticket.status = TicketStatus.ANSWERED;
    saveTicket(ticket);

    return 'Customer answered';
  }
});

const autonomousAnswerToCustomerTool = tool({
  name: 'answerToCustomer',
  description: 'Use this tool to answer the customer, only if the ticket status is picked_up_by_agent.',
  parameters: z.object({}),
  execute: async (_args, runContext?: RunContext<Ticket>) => {
    const ticket = runContext?.context as Ticket;
    ticket.status = TicketStatus.ANSWERED;
    saveTicket(ticket);

    return 'Customer answered';
  }
});

const supportAgents: Agent<Ticket>[] = [];

for (const agent of getSupportAgents()) {
  if (agent.active === true) {
    let tools = [answerToCustomerTool, generateAnswerTool];
    if (agent.autonomous) {
      tools = [autonomousAnswerToCustomerTool, generateAnswerTool];
    }

    const supportAgent = new Agent<Ticket>({
      name: agent.name,
      instructions: [
        'You will be given a ticket with a customer query and a ticket status.',
        'If the ticket status is waiting_for_pickup, call the generate answer tool to generate a list of answers, then call the answer to customer tool to answer the customer query.',
        'If the ticket status is picked_up_by_agent, call the answer to customer tool to answer the customer query.',
        'Here is your description:',
        agent.description,
        'Here is your personality:',
        agent.personality,
        'Here is your memory:',
        agent.memory.join('\n'),
      ].join('\n\n'),
      tools: tools,
      model: 'gpt-4o',
      handoffDescription: [
        'Here are the agent specialities so that you can handoff to the right agent:',
        agent.specialties.join('\n'),
      ].join('\n\n')
    });
    supportAgents.push(supportAgent);
  }
}

const customerSupportOrchestrator = new Agent<Ticket>({
  name: 'Customer Support Orchestrator',
  instructions: 'Choose the right agent to handle the ticket. Only handoff to one agent.',
  handoffs: supportAgents,
});

export async function POST(request: Request) {
  const body = await request.json();
  const ticketId: string = body.ticketId;

  if (!ticketId) {
    return NextResponse.json(
      { error: 'ticketId is required' },
      { status: 400 },
    );
  }

  const ticket = getTicketById(ticketId);
  if (!ticket) {
    return NextResponse.json({ error: 'Ticket not found' }, { status: 404 });
  }

  try {
    if (ticket.status === TicketStatus.WAITING_FOR_PICKUP || ticket.status === TicketStatus.PICKED_UP_BY_AGENT) {
      await handleCustomerSupportTicket(ticket);
      return NextResponse.json({ message: 'Customer support ticket processeded, waiting for human intervention' });
    } else if (ticket.status === TicketStatus.HUMAN_FEEDBACK_PROVIDED) {
      const agent = await handleHumanIntervention(ticket);
      return NextResponse.json({ agent });
    } else {
      return NextResponse.json({ error: 'Invalid ticket status' }, { status: 400 });
    }
  } catch (error) {
    console.error('Error handling customer support:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to handle customer support';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleHumanIntervention(ticket: Ticket) {
  console.log('Processing human intervention for ticket:', ticket.id);

  const state = await RunState.fromString(customerSupportOrchestrator, ticket.agentState);

  for (const interruption of state._currentStep?.data.interruptions) {
    state.approve(interruption);
  }

  const result = await run(customerSupportOrchestrator, state);

  return result.lastAgent?.name;
}

async function handleCustomerSupportTicket(ticket: Ticket) {
  console.log('Processing ticket:', ticket.id);

  const result = await run(
    customerSupportOrchestrator,
    `Here is the customer query: "${ticket.content}", the ticket status is ${ticket.status}`,
    { context: ticket },
  );

  ticket.agentState = JSON.stringify(result.state);
  ticket.status = TicketStatus.AGENT_WAITING_FOR_HUMAN;
  saveTicket(ticket);

  return ticket;
}
