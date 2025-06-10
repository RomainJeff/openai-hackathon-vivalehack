import { NextResponse, NextRequest } from 'next/server';
import { getSupportAgents, saveSupportAgent } from '@/services/supportAgentService';
import { SupportAgent } from '@/types/support-agent';

export async function GET() {
  const agents = getSupportAgents();
  return NextResponse.json(agents);
}

export async function POST(request: NextRequest) {
  const { name, personality, specialties, autonomous, description } = await request.json();

  if (!name || !personality || !specialties || autonomous === undefined || !description) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newAgent: SupportAgent = {
    id: crypto.randomUUID(),
    name,
    description: description,
    personality,
    memory: [],
    autonomous,
    specialties,
    active: true,
  };

  saveSupportAgent(newAgent);

  return NextResponse.json(newAgent, { status: 201 });
}
