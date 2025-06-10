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
    case TicketStatus.AGENT_WAITING_FOR_HUMAN:
      return <Chip label="Waiting for Human" color="info" />;
    case TicketStatus.CLOSED:
      return <Chip label="Closed" color="success" />;
    default:
      return <Chip label={status} />;
  }
};

export default function TicketsPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function getTickets() {
      try {
        const res = await fetch(`/api/tickets`);
        if (!res.ok) {
          throw new Error("Failed to fetch tickets");
        }
        const data = await res.json();
        setTickets(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
    getTickets();
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