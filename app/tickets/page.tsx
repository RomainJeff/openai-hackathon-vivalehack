"use client";

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Chip,
  ListItemButton,
  Box,
  CircularProgress,
  Alert,
  Button,
} from "@mui/material";
import Link from "next/link";
import { Ticket, TicketStatus } from "@/types/ticket";
import { useEffect, useState, useRef } from "react";

const getStatusChip = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.WAITING_FOR_PICKUP:
      return <Chip label="Waiting for Agent" color="warning" />;
    case TicketStatus.PICKED_UP_BY_AGENT:
      return <Chip label="Picked up by Agent" color="info" />;
    case TicketStatus.AGENT_WAITING_FOR_HUMAN:
      return <Chip label="Waiting for Human" color="error" />;
    case TicketStatus.HUMAN_FEEDBACK_PROVIDED:
      return <Chip label="Human feedback provided" color="success" />;
    case TicketStatus.ANSWERED:
      return <Chip label="Answered" color="success" />;
    default:
      return <Chip label={status} />;
  }
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const processingTickets = useRef(new Set<string>());

  const getHandoffToAgentChip = (handoffToAgentId: string | undefined) => {
    if (!handoffToAgentId) return null;
    return <Chip label={handoffToAgentId} color="info" variant="outlined" sx={{ ml: 1 }}/>;
  };

  useEffect(() => {
    const fetchTickets = async () => {
      const res = await fetch(`/api/tickets`);
      if (!res.ok) {
        throw new Error("Failed to fetch tickets");
      }
      return res.json();
    };

    const processAndSetTickets = (data: Ticket[]) => {
      const sortedTickets = [...data].sort((a, b) => {
        const aIsWaiting = a.status === TicketStatus.AGENT_WAITING_FOR_HUMAN;
        const bIsWaiting = b.status === TicketStatus.AGENT_WAITING_FOR_HUMAN;
        if (aIsWaiting && !bIsWaiting) {
          return -1;
        }
        if (!aIsWaiting && bIsWaiting) {
          return 1;
        }
        return 0;
      });
      setTickets(sortedTickets);
    };

    const initialLoad = async () => {
      try {
        const data = await fetchTickets();
        processAndSetTickets(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    const sendTicketsToAgent = async (tickets: Ticket[]) => {
      // Cleanup processingTickets for tickets that are no longer waiting
      Array.from(processingTickets.current).forEach((ticketId) => {
        const ticket = tickets.find((t) => t.id === ticketId);
        if (!ticket || ticket.status !== TicketStatus.WAITING_FOR_PICKUP) {
          processingTickets.current.delete(ticketId);
        }
      });

      const waitingTickets = tickets.filter(
        (ticket) =>
          ticket.status === TicketStatus.WAITING_FOR_PICKUP &&
          !processingTickets.current.has(ticket.id)
      );
      for (const ticket of waitingTickets) {
        processingTickets.current.add(ticket.id);
        try {
          const response = await fetch("/api/generate-answers", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ ticketId: ticket.id }),
          });

          if (!response.ok) {
            console.error(`Failed to send ticket ${ticket.id} to agent.`);
            processingTickets.current.delete(ticket.id);
          }
        } catch (error) {
          console.error(`Error sending ticket ${ticket.id} to agent:`, error);
          processingTickets.current.delete(ticket.id);
        }
      }
    };

    const poll = async () => {
      try {
        const data = await fetchTickets();
        processAndSetTickets(data);
        setError(null);
        sendTicketsToAgent(data);
      } catch (err: any) {
        // For polling, we don't want to show an error banner for a failed background fetch.
        console.error("Polling for tickets failed.", err);
      }
    };

    initialLoad();

    const intervalId = setInterval(poll, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="h4" component="h1">
            Support Tickets
          </Typography>
          <Box>
            <Button variant="contained" component={Link} href="/agents" sx={{ mr: 1}}>
              Agents
            </Button>
            <Button variant="contained" component={Link} href="/tickets/add">
              New Ticket
            </Button>
          </Box>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {tickets.map((ticket) => (
              <ListItem key={ticket.id} disablePadding>
                <ListItemButton component={Link} href={`/tickets/${ticket.id}`}>
                  <ListItemText
                    primary={ticket.subject}
                    secondary={`Ticket ID: ${ticket.id}`}
                  />
                  {getStatusChip(ticket.status)}
                  {getHandoffToAgentChip(ticket.handoffToAgentId)}
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
} 