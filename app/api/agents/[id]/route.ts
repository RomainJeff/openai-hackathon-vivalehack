import { NextResponse } from 'next/server';
import { getSupportAgentById, saveSupportAgent } from '@/services/supportAgentService';

export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    const { id } = params;
    const agent = getSupportAgentById(id);

    if (!agent) {
        return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
    }

    return NextResponse.json(agent);
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  let body;
  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  const agent = getSupportAgentById(id);

  if (!agent) {
    return NextResponse.json({ message: 'Agent not found' }, { status: 404 });
  }

  const updatedAgent = { ...agent, ...body };

  saveSupportAgent(updatedAgent);

  return NextResponse.json(updatedAgent);
}
