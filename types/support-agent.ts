export interface SupportAgentMemory {
    [key: string]: {
        options: string[];
        humanPreference: string;
    };
}

export interface SupportAgent {
    id: string;
    name: string;
    description: string;
    personality: string;
    memory: SupportAgentMemory;
    autonomous: boolean;
    specialties: string[];
    active: boolean;
}