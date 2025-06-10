import { Agent, run, RunContext, tool } from '@openai/agents';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getTicketById, saveTicket } from '@/services/ticketService';
import { Ticket, TicketStatus } from '@/types/ticket';

const generateAnswerTool = tool({
  name: 'generateAnswer',
  description: 'Use this tool to draft 3 different possible answers to the customer query. The answers should be polite, helpful, and offer different approaches if possible (e.g., one direct answer, one with more questions for clarification, one with alternative solutions).',
  parameters: z.object({
    answers: z.array(z.string()).describe('The answers to the customer query.'),
  }),
  execute: async (answers, runContext?: RunContext<Ticket>) => {
    const ticket = runContext?.context as Ticket;
    ticket.status = TicketStatus.PICKED_UP_BY_AGENT;
    saveTicket(ticket);

    return answers;
  },
});

const generateAnswerAgent = new Agent<Ticket>({
  name: 'Generate Answer Agent',
  instructions: 'You are a helpful customer support agent.',
  tools: [generateAnswerTool],
  modelSettings: { toolChoice: 'generateAnswer' },
});

const answerToCustomerTool = tool({
  name: 'answerToCustomer',
  description: 'Use this tool to answer the customer.',
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

const answerToCustomerAgent = new Agent<Ticket>({
  name: 'Answer to Customer Agent',
  instructions: 'You are a helpful customer support agent.',
  tools: [answerToCustomerTool],
  modelSettings: { toolChoice: 'answerToCustomer' },
});

const orchestratorAgent = Agent.create({
  name: 'Orchestrator agent',
  instructions: [
    'You are the orchestrator agent. You will be given a ticket with a customer query and a ticket status.',
    'If the ticket status is waiting_for_pickup, you will hand off to the generate answer agent to generate a list of answers, then hand off to the answer to customer agent to answer the customer query.',
    'If the ticket status is picked_up_by_agent, you will hand off to the answer to customer agent to answer the customer query.',
  ].join('\n'),
  handoffs: [generateAnswerAgent, answerToCustomerAgent],
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
    const response = await handleCustomerSupport(ticket);
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error handling customer support:', error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to handle customer support';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

async function handleCustomerSupport(ticket: Ticket) {
  console.log('Processing ticket:', ticket.id);

  const result = await run(
    orchestratorAgent,
    `Here is the customer query: "${ticket.content}", the ticket status is ${ticket.status}`,
    { context: ticket },
  );

  ticket.agentState = JSON.stringify(result.state);
  ticket.status = TicketStatus.AGENT_WAITING_FOR_HUMAN;
  saveTicket(ticket);

  return result.finalOutput;
}
