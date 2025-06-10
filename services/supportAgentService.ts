import { SupportAgent } from "@/types/support-agent";

import fs from 'fs';
import path from 'path';

const AGENTS_FILE = path.join(process.cwd(), 'data', 'support-agents.json');

export const getSupportAgents = (): SupportAgent[] => {
    try {
        const data = fs.readFileSync(AGENTS_FILE, 'utf-8');
        return JSON.parse(data);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            return [];
        }
        console.error('Error reading tickets:', error);
        return [];
    }
};

export const getSupportAgentById = (id: string): SupportAgent | undefined => {
    const agents = getSupportAgents();
    return agents.find(agent => agent.id === id);
};

export const saveSupportAgent = (agent: SupportAgent) => {
    const agents = getSupportAgents();
    const existingAgentIndex = agents.findIndex(a => a.id === agent.id);

    if (existingAgentIndex !== -1) {
        agents[existingAgentIndex] = agent;
    } else {
        agents.push(agent);
    }

    try {
        fs.writeFileSync(AGENTS_FILE, JSON.stringify(agents, null, 2), 'utf-8');
    } catch (error) {
        console.error('Error saving agents:', error);
    }
};