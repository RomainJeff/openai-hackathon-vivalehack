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
import { useEffect, useState } from "react";

const getStatusChip = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.WAITING_FOR_PICKUP:
      return <Chip label="Waiting for Agent" color="warning" />;
    case TicketStatus.PICKED_UP_BY_AGENT:
      return <Chip label="Picked up by Agent" color="info" />;
    case TicketStatus.AGENT_WAITING_FOR_HUMAN:
      return <Chip label="Waiting for Human" color="info" />;
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

    const poll = async () => {
      try {
        const data = await fetchTickets();
        processAndSetTickets(data);
        setError(null);
      } catch (err: any) {
        // For polling, we don't want to show an error banner for a failed background fetch.
        console.error("Polling for tickets failed.", err);
      }
    };

    initialLoad();

    const intervalId = setInterval(poll, 10000);

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
          <Button variant="contained" component={Link} href="/tickets/add">
            New Ticket
          </Button>
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
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
} 