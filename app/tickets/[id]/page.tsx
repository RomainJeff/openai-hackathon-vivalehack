"use client"

import { useState } from "react"
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Button,
  Chip,
  Avatar,
  TextField,
  Paper,
  Container,
  Grid,
  Divider,
  IconButton,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material"
import {
  SmartToy,
  Person,
  ThumbUp,
  Send,
  Star,
  AccessTime,
  ChatBubble,
  AutoAwesome,
  ContentCopy,
  Edit,
  ExpandMore,
} from "@mui/icons-material"

interface AIResponseProposal {
  id: string
  tone: "professional" | "friendly" | "empathetic" | "direct"
  approach: "solution-focused" | "investigative" | "escalation" | "educational"
  confidence: number
  responseText: string
  reasoning: string
  estimatedReadTime: string
}

const currentTicket = {
  id: "TK-001",
  title: "Unable to access premium features after payment",
  description:
    "I upgraded to premium yesterday but still cannot access the advanced analytics dashboard. Payment went through successfully. This is really frustrating as I need these features for my presentation tomorrow morning.",
  customer: {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
  },
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
  {
    id: "proposal-4",
    tone: "direct",
    approach: "escalation",
    confidence: 82,
    estimatedReadTime: "20 sec",
    responseText: `Hi Sarah,

I see your premium payment was processed but the features aren't activated yet. This requires immediate attention given your timeline.

I'm escalating this to our technical team right now and personally monitoring the resolution. You'll have access within 15 minutes maximum.

I'll email you the moment it's fixed and include direct links to all premium features.

If this isn't resolved within 15 minutes, I'll provide you with my direct contact for immediate assistance.

Support Team`,
    reasoning:
      "Direct, no-nonsense approach that acknowledges urgency and provides concrete timelines. Shows personal accountability and escalation path.",
  },
  {
    id: "proposal-5",
    tone: "professional",
    approach: "educational",
    confidence: 76,
    estimatedReadTime: "50 sec",
    responseText: `Dear Sarah,

Thank you for your premium subscription and for bringing this access issue to our attention.

Your payment has been successfully processed, but you're experiencing what we call a "permission sync delay." This occasionally occurs when our billing and access systems don't communicate in real-time.

Here's what's happening and how we're fixing it:

**The Issue:** Your account shows as premium in billing but not in our feature access system.
**The Solution:** I'm manually synchronizing these systems for your account.
**Timeline:** This process takes 5-10 minutes and I'll monitor it personally.
**Prevention:** We're implementing automatic sync checks to prevent this in the future.

You'll receive an email confirmation once your premium features are active, along with a quick guide to help you navigate the new analytics dashboard efficiently.

I apologize for any inconvenience this has caused.

Best regards,
Customer Support Team`,
    reasoning:
      "Educational approach that explains the technical issue clearly while providing solution. Builds trust through transparency and includes helpful resources.",
  },
]

export default function TicketPage({ params }: { params: { id: string } }) {
    const [selectedProposal, setSelectedProposal] = useState<AIResponseProposal | null>(null)
    const [editedResponse, setEditedResponse] = useState("")
    const [isEditing, setIsEditing] = useState(false)
  
    const handleSelectProposal = (proposal: AIResponseProposal) => {
      setSelectedProposal(proposal)
      setEditedResponse(proposal.responseText)
      setIsEditing(false)
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
  
    return (
      <Box sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 3 }}>
        <Container maxWidth="xl">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
              <SmartToy color="primary" sx={{ fontSize: 32 }} />
              <Typography variant="h3" component="h1" fontWeight="bold">
                Evaneos Care AI Agents
              </Typography>
              <Chip label={`${aiProposals.length} AI Proposals`} color="primary" variant="outlined" />
            </Stack>
  
            {/* Current Ticket Context */}
            <Card elevation={2}>
              <CardHeader
                title={
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {currentTicket.title}
                      </Typography>
                      <Stack direction="row" alignItems="center" spacing={1}>
                        <Avatar sx={{ width: 24, height: 24, fontSize: 12 }}>SC</Avatar>
                        <Typography variant="body2" color="text.secondary">
                          {currentTicket.customer.name} ({currentTicket.customer.email}) - Ticket ID: {params.id}
                        </Typography>
                      </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                      <Chip
                        avatar={<Avatar>SC</Avatar>}
                        label="Customer"
                        variant="outlined"
                        color="default"
                      />
                      <Chip
                        icon={<AccessTime />}
                        label="2 hours ago"
                        variant="outlined"
                        color="default"
                      />
                      <Chip
                        icon={<ChatBubble />}
                        label="3 messages"
                        variant="outlined"
                        color="default"
                      />
                      <Chip
                        icon={<Star />}
                        label="High Priority"
                        variant="filled"
                        color="warning"
                      />
                    </Stack>
                  </Box>
                }
              />
              <CardContent>
                <Typography variant="body1" color="text.primary">
                  {currentTicket.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
  
          <Grid container spacing={4}>
            {/* AI Response Proposals */}
            <Grid item xs={12} md={5}>
              <Typography variant="h5" component="h3" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <AutoAwesome sx={{ mr: 1 }} />
                AI Response Proposals
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 2,
                  height: "calc(100vh - 300px)",
                  overflowY: "auto",
                }}
              >
                <Stack spacing={2}>
                  {aiProposals.map((proposal) => (
                    <Card
                      key={proposal.id}
                      onClick={() => handleSelectProposal(proposal)}
                      sx={{
                        cursor: "pointer",
                        border:
                          selectedProposal?.id === proposal.id
                            ? "2px solid"
                            : "2px solid transparent",
                        borderColor:
                          selectedProposal?.id === proposal.id
                            ? "primary.main"
                            : "transparent",
                        transition: "border-color 0.3s",
                        "&:hover": {
                          borderColor: "primary.light",
                        },
                      }}
                    >
                      <CardHeader
                        avatar={
                          <Avatar
                            sx={{
                              bgcolor: getToneColor(proposal.tone) + ".main",
                            }}
                          >
                            <SmartToy />
                          </Avatar>
                        }
                        title={
                          <Typography variant="h6" component="div">
                            {proposal.tone} & {proposal.approach}
                          </Typography>
                        }
                        subheader={`Confidence: ${proposal.confidence}% | Est. Read Time: ${proposal.estimatedReadTime}`}
                      />
                      <CardContent>
                        <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
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
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Typography variant="body2" color="text.secondary">
                              {proposal.responseText.substring(0, 100)}...
                            </Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography
                              variant="body2"
                              sx={{ whiteSpace: "pre-wrap" }}
                            >
                              {proposal.responseText}
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            </Grid>
  
            {/* Selected Response & Edit */}
            <Grid item xs={12} md={7}>
              <Typography variant="h5" component="h3" sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Person sx={{ mr: 1 }} />
                Final Response
              </Typography>
              <Paper
                elevation={2}
                sx={{
                  p: 3,
                  height: "calc(100vh - 300px)",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {selectedProposal ? (
                  <>
                    <Box sx={{ flexGrow: 1, mb: 2 }}>
                      {isEditing ? (
                        <TextField
                          multiline
                          fullWidth
                          rows={15}
                          value={editedResponse}
                          onChange={(e) => setEditedResponse(e.target.value)}
                          variant="outlined"
                        />
                      ) : (
                        <Typography
                          variant="body1"
                          sx={{ whiteSpace: "pre-wrap" }}
                        >
                          {editedResponse}
                        </Typography>
                      )}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<Send />}
                        >
                          Send Response
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={isEditing ? <ContentCopy /> : <Edit />}
                          onClick={() => {
                            if (isEditing) {
                              handleCopyResponse(editedResponse)
                            }
                            setIsEditing(!isEditing)
                          }}
                        >
                          {isEditing ? "Copy & Finish Editing" : "Edit"}
                        </Button>
                      </Stack>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <IconButton>
                          <ThumbUp />
                        </IconButton>
                        <Typography variant="caption" color="text.secondary">
                          Was this proposal helpful?
                        </Typography>
                      </Stack>
                    </Stack>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <Typography variant="h6" color="text.secondary">
                      Select an AI proposal from the left to view, edit, and send.
                    </Typography>
                  </Box>
                )}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
  } 