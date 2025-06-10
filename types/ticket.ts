export enum TicketStatus {
    WAITING_FOR_PICKUP = "waiting_for_pickup",
    PICKED_UP_BY_AGENT = "picked_up_by_agent",
    AGENT_WAITING_FOR_HUMAN = "agent_waiting_for_human",
    ANSWERED = "answered",
}

export interface Ticket {
    id: string;
    subject: string;
    content: string;
    email: string;
    status: TicketStatus;
    proposedAnswers: string[];
    agentState: any;
    finalAnswer: string;
    createdAt: Date;
    updatedAt: Date;
}