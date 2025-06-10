import { Container, List, ListItem, ListItemText, Typography, Chip, ListItemButton } from "@mui/material";
import Link from "next/link";

const tickets = [
  {
    id: "TK-001",
    title: "Unable to access premium features after payment",
    status: "waiting for ai pickup",
  },
  {
    id: "TK-002",
    title: "Website is loading very slowly",
    status: "waiting for human feedback",
  },
  {
    id: "TK-003",
    title: "How do I reset my password?",
    status: "answered",
  },
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "waiting for ai pickup":
      return "warning";
    case "waiting for human feedback":
      return "info";
    case "answered":
      return "success";
    default:
      return "default";
  }
};

export default function TicketsPage() {
  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Support Tickets
      </Typography>
      <List>
        {tickets.map((ticket) => (
          <ListItem key={ticket.id} disablePadding>
            <ListItemButton component={Link} href={`/tickets/${ticket.id}`}>
              <ListItemText
                primary={ticket.title}
                secondary={`Ticket ID: ${ticket.id}`}
              />
              <Chip label={ticket.status} color={getStatusColor(ticket.status)} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
} 