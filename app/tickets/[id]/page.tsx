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
  CardContent,
} from "@mui/material"
import { Send, ContentCopy } from "@mui/icons-material"
import { Ticket } from "@/types/ticket"

interface AIResponseProposal {
  id: string
  tone: "professional" | "friendly" | "empathetic" | "direct"
  approach: "solution-focused" | "investigative" | "escalation" | "educational"
  confidence: number
  responseText: string
  reasoning: string
  estimatedReadTime: string
}

const aiProposals: AIResponseProposal[] = [
  {
    id: "proposal-1",
    tone: "empathetic",
    approach: "solution-focused",
    confidence: 94,
    estimatedReadTime: "30 sec",
    responseText: `Hi Sarah,

I completely understand your frustration, especially with your presentation coming up tomorrow morning. Let me get this resolved for you right away.

I can see that your premium payment was processed successfully yesterday. This appears to be a synchronization delay between our payment and access systems. I'm manually refreshing your account permissions now, which should restore your premium features within the next 5 minutes.

I'll send you a confirmation email once everything is active, and I'll also include a direct link to the analytics dashboard to save you time.

If you don't see the changes within 5 minutes, please reply to this email and I'll escalate this immediately to ensure you're ready for tomorrow's presentation.

Best regards,
Support Team`,
    reasoning:
      "Acknowledges the urgency and emotional impact, provides immediate action, sets clear expectations, and offers escalation path. High empathy with solution focus.",
  },
  {
    id: "proposal-2",
    tone: "professional",
    approach: "investigative",
    confidence: 87,
    estimatedReadTime: "45 sec",
    responseText: `Dear Sarah,

Thank you for contacting us regarding the premium feature access issue.

I have reviewed your account and confirmed that your premium subscription payment was successfully processed on [date]. However, I notice there may be a synchronization delay affecting your feature access.

To resolve this, I will:
1. Manually sync your account permissions
2. Verify all premium features are properly enabled
3. Run a system check to prevent future occurrences

This process typically takes 5-10 minutes. I will monitor your account during this time and send you a confirmation email once complete.

Additionally, I'm documenting this issue to help our technical team improve the payment-to-access workflow.

Please don't hesitate to reach out if you have any questions or if the issue persists.

Sincerely,
Customer Support`,
    reasoning:
      "Professional tone with systematic approach. Provides transparency about the process and shows proactive problem-solving for future prevention.",
  },
  {
    id: "proposal-3",
    tone: "friendly",
    approach: "solution-focused",
    confidence: 91,
    estimatedReadTime: "25 sec",
    responseText: `Hey Sarah!

Thanks for reaching out - and congrats on upgrading to premium! 🎉

I can see your payment went through perfectly, but it looks like there's just a small hiccup with getting your new features activated. This happens occasionally and is super easy to fix.

I'm taking care of it right now and you should see all your premium features (including that analytics dashboard) pop up within the next few minutes. 

I'll shoot you a quick email once everything's live so you know you're all set for tomorrow's presentation!

Thanks for your patience!
The Support Team`,
    reasoning:
      "Casual, friendly tone that celebrates the upgrade while minimizing the problem. Quick resolution with personal touch and acknowledgment of their timeline.",
  },
]

export default function TicketPage() {
  const params = useParams<{ id: string }>()
  const [ticket, setTicket] = useState<Ticket | null>(null)
  const [selectedProposal, setSelectedProposal] =
    useState<AIResponseProposal | null>(null)
  const [editedResponse, setEditedResponse] = useState("")

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const response = await fetch(`/api/tickets/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setTicket(data)
        } else {
          console.error("Failed to fetch ticket")
          setTicket(null)
        }
      } catch (error) {
        console.error("An error occurred while fetching the ticket:", error)
        setTicket(null)
      }
    }

    if (params.id) {
      fetchTicket()
    }
  }, [params.id])

  const handleSelectProposal = (proposal: AIResponseProposal) => {
    setSelectedProposal(proposal)
    setEditedResponse(proposal.responseText)
  }

  const handleCopyResponse = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const getToneColor = (tone: string) => {
    switch (tone) {
      case "empathetic":
        return "secondary"
      case "professional":
        return "primary"
      case "friendly":
        return "success"
      case "direct":
        return "warning"
      default:
        return "default"
    }
  }

  const getApproachColor = (approach: string) => {
    switch (approach) {
      case "solution-focused":
        return "success"
      case "investigative":
        return "info"
      case "escalation":
        return "error"
      case "educational":
        return "primary"
      default:
        return "default"
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
          <Typography variant="h6" component="h2" gutterBottom>
            {ticket.subject}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            From: {ticket.email} - Ticket ID: {params.id}
          </Typography>
          <Typography variant="body1">{ticket.content}</Typography>
        </Box>

        <Typography variant="h6" component="h2" sx={{ mb: 2 }}>
          Suggested Answers
        </Typography>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={2}
          sx={{ mb: 4, alignItems: "stretch" }}
        >
          {aiProposals.slice(0, 3).map((proposal, index) => (
            <Card
              key={proposal.id}
              onClick={() => handleSelectProposal(proposal)}
              elevation={selectedProposal?.id === proposal.id ? 8 : 2}
              sx={{
                cursor: "pointer",
                border: "2px solid",
                borderColor:
                  selectedProposal?.id === proposal.id
                    ? "primary.main"
                    : "transparent",
                flex: 1,
                display: "flex",
                flexDirection: "column",
                transition: 'all 0.2s',
              }}
            >
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Answer {index + 1}</Typography>
                <Stack direction="row" spacing={1} sx={{ my: 1 }}>
                  <Chip
                    label={proposal.tone}
                    color={getToneColor(proposal.tone)}
                    size="small"
                  />
                  <Chip
                    label={proposal.approach}
                    color={getApproachColor(proposal.approach)}
                    size="small"
                  />
                </Stack>
                <Typography variant="body2" color="text.secondary">
                  Confidence: {proposal.confidence}%
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>

        {selectedProposal && (
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
              <Button
                variant="outlined"
                startIcon={<ContentCopy />}
                onClick={() => handleCopyResponse(editedResponse)}
              >
                Copy
              </Button>
              <Button variant="contained" color="primary" startIcon={<Send />}>
                Send Response
              </Button>
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  )
} 