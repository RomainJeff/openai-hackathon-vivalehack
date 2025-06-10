"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import {
  Box,
  Typography,
  Button,
  Chip,
  TextField,
  Container,
  Stack,
  Card,
  Alert,
} from "@mui/material"
import { Send } from "@mui/icons-material"
import { Ticket, TicketStatus } from "@/types/ticket"
import { SupportAgent } from "@/types/support-agent"

const getStatusChip = (status: TicketStatus) => {
  switch (status) {
    case TicketStatus.WAITING_FOR_PICKUP:
      return <Chip label="Waiting for Agent" color="warning" />
    case TicketStatus.PICKED_UP_BY_AGENT:
      return <Chip label="Picked up by Agent" color="info" />
    case TicketStatus.AGENT_WAITING_FOR_HUMAN:
      return <Chip label="Waiting for Human" color="error" />
    case TicketStatus.HUMAN_FEEDBACK_PROVIDED:
      return <Chip label="Human Feedback Provided" color="success" />
    case TicketStatus.ANSWERED:
      return <Chip label="Answered" color="success" />
    default:
      return <Chip label={status} />
  }
}

export default function TicketPage() {
  const params = useParams<{ id: string }>()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [selectedProposal, setSelectedProposal] =
    useState<number | null>(null)
  const [editedResponse, setEditedResponse] = useState("")
  const [availableAgents, setAvailableAgents] = useState<SupportAgent[]>([]);

  const getHandoffToAgentChip = (handoffToAgentId: string | undefined) => {
    if (!handoffToAgentId) return null;
    return <Chip label={handoffToAgentId} color="info" variant="outlined" sx={{ ml: 1 }}/>;
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTicket(data)
        } else {
          console.error("Failed to fetch ticket")
        }
      } catch (error) {
        console.error("An error occurred while fetching the ticket:", error)
      }
    }

    const fetchAgents = async () => {
      const agents = await fetch("/api/agents");
      if (!agents.ok) {
        throw new Error("Failed to fetch agents");
      }
      const agentsData = await agents.json();
      setAvailableAgents(agentsData);
    }

    if (params.id) {
      fetchTicket()
      fetchAgents()
      const interval = setInterval(fetchTicket, 30000)
      return () => clearInterval(interval)
    }
  }, [params.id])

  const handleSelectProposal = (index: number) => {
    setSelectedProposal(index)
    setEditedResponse(ticket?.proposedAnswers[index] || "")
  }

  const handleSendToAgent = async () => {
    if (!ticket) return;

    try {
      const response = await fetch(`/api/tickets/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ finalAnswer: editedResponse, status: TicketStatus.HUMAN_FEEDBACK_PROVIDED }),
      });

      if (!response.ok) {
        console.error("Failed to update ticket");
      } else {
        const updatedTicket = await response.json();
        setTicket(updatedTicket);

        // Send the ticket to the agent again
        fetch("/api/generate-answers", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ticketId: ticket.id }),
        });

        // Update the agent memory
        const handoffAgent = availableAgents.find((agent) => agent.name === ticket.handoffToAgentId);
        const updatedMemory = {
          ...handoffAgent?.memory || {},
          [ticket.content]: {
            options: ticket.proposedAnswers,
            humanPreference: editedResponse,
          },
        }

        fetch(`/api/agents/${handoffAgent?.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ memory: updatedMemory }),
        });
      }
    } catch (error) {
      console.error("An error occurred while updating the ticket:", error);
    }
  }

  if (!ticket) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <Typography>Loading ticket...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
      <Container maxWidth="lg">
        <Box
          sx={{
            mb: 4,
            p: 2,
            border: "1px solid",
            borderColor: "grey.300",
            borderRadius: 1,
            bgcolor: "white",
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="h6" component="h2" gutterBottom>
                {ticket.subject}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                From: {ticket.email} - Ticket ID: {params.id}
              </Typography>
            </Box>
            <Box>
              {getStatusChip(ticket.status)}
              {getHandoffToAgentChip(ticket.handoffToAgentId)}
            </Box>
          </Box>
          <Typography variant="body1">{ticket.content}</Typography>
        </Box>

        {ticket.status === TicketStatus.AGENT_WAITING_FOR_HUMAN && (
          <>
          <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
            Proposed Answers
          </Typography>
          <Stack
            direction="column"
            spacing={1}
            sx={{ mb: 4 }}
          >
            {ticket.proposedAnswers.slice(0, 3).map((answer: string, index: number) => (
              <Card
                key={index}
                onClick={() => handleSelectProposal(index)}
                sx={{
                  cursor: "pointer",
                  border: "2px solid",
                  borderColor:
                    selectedProposal === index
                      ? "primary.main"
                      : "grey.200",
                  p: 2,
                  "&:hover": {
                    borderColor: selectedProposal === index ? "primary.main" : "primary.light",
                  },
                  transition: 'all 0.2s',
                }}
              >
                <Typography
                  variant="body1"
                  sx={
                    selectedProposal === index
                      ? { whiteSpace: "pre-wrap" }
                      : {
                          whiteSpace: "pre-wrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          display: "-webkit-box",
                          WebkitLineClamp: 4,
                          WebkitBoxOrient: "vertical",
                        }
                  }
                >
                  {answer}
                </Typography>
              </Card>
            ))}
          </Stack>

          {selectedProposal !== null && (
            <Box>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Final Response
              </Typography>
              <TextField
                multiline
                fullWidth
                rows={12}
                value={editedResponse}
                onChange={(e) => setEditedResponse(e.target.value)}
                variant="outlined"
                sx={{ mb: 2, bgcolor: "white" }}
              />
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button variant="contained" color="primary" onClick={handleSendToAgent} startIcon={<Send />}>
                  Send to agent
                </Button>
              </Stack>
            </Box>
          )}
          </>
        )}

        {(ticket.status === TicketStatus.HUMAN_FEEDBACK_PROVIDED || ticket.status === TicketStatus.ANSWERED) && (
            <>
              <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
                Final Response
              </Typography>
              <Typography variant="body1">{ticket.finalAnswer}</Typography>
            </>
        )}

        {(ticket.status === TicketStatus.ANSWERED) && (
            <Alert severity="success" sx={{ mt: 2,mb: 2 }}>
              The agent has successfully answered the user.
            </Alert>
        )}
      </Container>
    </Box>
  )
} 