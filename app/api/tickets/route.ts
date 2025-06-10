import { NextResponse } from 'next/server';
import { getTickets, saveTicket } from '@/services/ticketService';
import { Ticket, TicketStatus } from '@/types/ticket';

export async function GET() {
  const tickets = getTickets();
  return NextResponse.json(tickets);
}

export async function POST(request: Request) {
  const { subject, email, content } = await request.json();

  if (!subject || !email || !content) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  const newTicket: Ticket = {
    id: `TK-${Date.now()}`,
    subject,
    email,
    content,
    status: TicketStatus.WAITING_FOR_PICKUP,
    agentState: {},
    finalAnswer: '',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  saveTicket(newTicket);

  return NextResponse.json(newTicket, { status: 201 });
} 