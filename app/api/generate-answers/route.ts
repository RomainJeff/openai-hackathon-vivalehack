import { Agent, run, RunContext, tool } from '@openai/agents';
import { z } from 'zod';
import { NextResponse } from 'next/server';
import { getTicketById } from '@/services/ticketService';
import { Ticket, TicketStatus } from '@/types/ticket';

const generateAnswerTool = tool({
  name: 'generateAnswer',
  description: 'Use this tool to draft 3 different possible answers to the customer query. The answers should be polite, helpful, and offer different approaches if possible (e.g., one direct answer, one with more questions for clarification, one with alternative solutions).',
  parameters: z.object({
    answers: z.array(z.string()).describe('The answers to the customer query.'),
  }),
  execute: async (answers, runContext?: RunContext<Ticket>) => {
    // TODO: Update the ticket with the answers
    return answers;
  },
});

const supportAgent = new Agent<Ticket>({
  name: 'Customer Support Agent',
  instructions: 'You are a helpful customer support agent.',
  tools: [generateAnswerTool],
  modelSettings: { toolChoice: 'generateAnswer' },
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
    supportAgent,
    `Here is the customer query: "${ticket.content}"`,
    { context: ticket },
  );

  return result.finalOutput;
}
