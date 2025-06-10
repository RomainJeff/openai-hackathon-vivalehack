export enum TicketStatus {
    WAITING_FOR_PICKUP = "waiting_for_pickup",
    AGENT_WAITING_FOR_HUMAN = "agent_waiting_for_human",
    CLOSED = "closed",
}

export interface Ticket {
    id: string;
    subject: string;
    content: string;
    email: string;
    status: TicketStatus;
    agentState: any;
    finalAnswer: string;
    createdAt: Date;
    updatedAt: Date;
}