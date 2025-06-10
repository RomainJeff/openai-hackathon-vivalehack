import { NextResponse } from 'next/server';
import { getTicketById, saveTicket } from '@/services/ticketService';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const ticket = getTicketById(params.id);

    if (ticket) {
      return NextResponse.json(ticket);
    } else {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('Error fetching ticket:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingTicket = getTicketById(params.id);

    if (!existingTicket) {
      return NextResponse.json({ message: 'Ticket not found' }, { status: 404 });
    }

    const body = await request.json();
    const updatedTicket = { ...existingTicket, ...body };

    saveTicket(updatedTicket);

    return NextResponse.json(updatedTicket);
  } catch (error) {
    console.error('Error updating ticket:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
