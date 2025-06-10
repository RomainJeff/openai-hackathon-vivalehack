import { Agent, run } from '@openai/agents';
import { z } from 'zod';
import { NextResponse } from 'next/server';

const AnswerProposals = z.object({
  proposals: z
    .array(
      z.object({
        title: z
          .string()
          .describe('A short, descriptive title for the proposed answer.'),
        body: z
          .string()
          .describe('The full text of the proposed answer for the customer.'),
      }),
    )
    .min(3)
    .max(3)
    .describe('Draft exactly 3 different answers for the customer query.'),
});

const supportAgent = new Agent({
  name: 'Customer Support Agent',
  instructions:
    'You are a helpful customer support agent. A customer has a problem. Your task is to draft 3 different possible answers to the customer query. Each answer should have a title and a body. The answers should be polite, helpful, and offer different approaches if possible (e.g., one direct answer, one with more questions for clarification, one with alternative solutions).',
  model: 'gpt-4o',
  outputType: AnswerProposals,
});

export async function POST(request: Request) {
  const body = await request.json();
  const customerQuery: string = body.customerQuery;

  if (!customerQuery) {
    return NextResponse.json(
      { error: 'customerQuery is required' },
      { status: 400 },
    );
  }

  try {
    const response = await handleCustomerSupport(customerQuery);
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

async function handleCustomerSupport(customerQuery: string) {
  console.log('Processing customer query:', customerQuery);
  const result = await run(
    supportAgent,
    `Here is the customer query: "${customerQuery}"`,
  );

  return result.finalOutput;
}
