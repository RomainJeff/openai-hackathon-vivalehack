export interface SupportAgent {
    id: string;
    name: string;
    description: string;
    personality: string;
    memory: string[];
    autonomous: boolean;
    specialties: string[];
    active: boolean;
}