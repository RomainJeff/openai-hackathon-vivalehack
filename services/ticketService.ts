import { Ticket } from "@/types/ticket";

import fs from 'fs';
import path from 'path';

const TICKETS_FILE = path.resolve(__dirname, './data/tickets.json');

const getTickets = (): Ticket[] => {
    try {
        const data = fs.readFileSync(TICKETS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error reading tickets:', error);
        return [];
    }
};

const getTicketById = (id: string): Ticket | undefined => {
    const tickets = getTickets();
    return tickets.find(ticket => ticket.id === id);
};

export const saveTicket = (ticket: Ticket) => {
    const tickets = getTickets();
    const existingTicketIndex = tickets.findIndex(t => t.id === ticket.id);

    if (existingTicketIndex !== -1) {
        tickets[existingTicketIndex] = ticket;
    } else {
        tickets.push(ticket);
    }

    try {
        fs.writeFileSync(TICKETS_FILE, JSON.stringify(tickets, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving tickets:', error);
    }
};