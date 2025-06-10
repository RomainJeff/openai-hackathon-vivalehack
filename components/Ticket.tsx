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

export default function Ticket() {
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
                AI Response Generator
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
                          {currentTicket.customer.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          •
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {currentTicket.customer.email}
                        </Typography>
                      </Stack>
                    </Box>
                    <Chip label={currentTicket.id} variant="outlined" />
                  </Box>
                }
              />
              <CardContent>
                <Paper sx={{ p: 2, bgcolor: "grey.100" }}>
                  <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                    <Person fontSize="small" color="action" />
                    <Typography variant="body2" fontWeight="medium">
                      Customer Message:
                    </Typography>
                  </Stack>
                  <Typography variant="body1" sx={{ lineHeight: 1.6 }}>
                    {currentTicket.description}
                  </Typography>
                </Paper>
              </CardContent>
            </Card>
          </Box>
  
          <Grid container spacing={3}>
            {/* AI Proposals */}
            <Grid item xs={12} lg={8}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <AutoAwesome color="secondary" />
                <Typography variant="h5" component="h2" fontWeight="600">
                  AI Response Proposals
                </Typography>
              </Stack>
  
              <Stack spacing={3}>
                {aiProposals.map((proposal, index) => (
                  <Card
                    key={proposal.id}
                    elevation={selectedProposal?.id === proposal.id ? 8 : 2}
                    sx={{
                      cursor: "pointer",
                      transition: "all 0.2s",
                      border: selectedProposal?.id === proposal.id ? 2 : 0,
                      borderColor: "primary.main",
                      bgcolor: selectedProposal?.id === proposal.id ? "primary.50" : "white",
                      "&:hover": {
                        boxShadow: 6,
                        bgcolor: "grey.50",
                      },
                    }}
                    onClick={() => handleSelectProposal(proposal)}
                  >
                    <CardHeader
                      avatar={
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            background: "linear-gradient(45deg, #2196F3 30%, #9C27B0 90%)",
                            fontWeight: "bold",
                          }}
                        >
                          {index + 1}
                        </Avatar>
                      }
                      title={
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip label={proposal.tone} color={getToneColor(proposal.tone) as any} size="small" />
                          <Chip
                            label={proposal.approach}
                            color={getApproachColor(proposal.approach) as any}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      }
                      subheader={
                        <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <Star fontSize="small" sx={{ color: "warning.main" }} />
                            <Typography variant="body2" fontWeight="medium">
                              {proposal.confidence}% confidence
                            </Typography>
                          </Stack>
                          <Stack direction="row" alignItems="center" spacing={0.5}>
                            <AccessTime fontSize="small" />
                            <Typography variant="body2">{proposal.estimatedReadTime} read</Typography>
                          </Stack>
                        </Stack>
                      }
                      action={
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCopyResponse(proposal.responseText)
                          }}
                        >
                          <ContentCopy />
                        </IconButton>
                      }
                    />
  
                    <CardContent>
                      <Stack spacing={2}>
                        {/* AI Reasoning */}
                        <Paper sx={{ p: 2, bgcolor: "primary.50" }}>
                          <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <SmartToy fontSize="small" color="primary" />
                            <Typography variant="body2" fontWeight="medium" color="primary.main">
                              AI Reasoning
                            </Typography>
                          </Stack>
                          <Typography variant="body2" color="primary.dark">
                            {proposal.reasoning}
                          </Typography>
                        </Paper>
  
                        {/* Response Preview */}
                        <Accordion>
                          <AccordionSummary expandIcon={<ExpandMore />}>
                            <Stack direction="row" alignItems="center" spacing={1}>
                              <ChatBubble fontSize="small" />
                              <Typography variant="body2" fontWeight="medium">
                                Proposed Response
                              </Typography>
                            </Stack>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Paper sx={{ p: 2, bgcolor: "grey.50" }}>
                              <Typography
                                variant="body2"
                                component="pre"
                                sx={{
                                  whiteSpace: "pre-wrap",
                                  fontFamily: "inherit",
                                  lineHeight: 1.6,
                                  margin: 0,
                                }}
                              >
                                {proposal.responseText}
                              </Typography>
                            </Paper>
                          </AccordionDetails>
                        </Accordion>
  
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1 }}>
                          <Button
                            variant={selectedProposal?.id === proposal.id ? "contained" : "outlined"}
                            startIcon={<ThumbUp />}
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSelectProposal(proposal)
                            }}
                          >
                            {selectedProposal?.id === proposal.id ? "Selected" : "Use This Response"}
                          </Button>
                          <Typography variant="caption" color="text.secondary">
                            {proposal.responseText.length} characters
                          </Typography>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </Grid>
  
            {/* Selected Response Editor */}
            <Grid item xs={12} lg={4}>
              <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
                <Edit color="success" />
                <Typography variant="h5" component="h2" fontWeight="600">
                  Final Response
                </Typography>
              </Stack>
  
              {selectedProposal ? (
                <Card elevation={3}>
                  <CardHeader
                    title={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6">Edit & Send</Typography>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={selectedProposal.tone}
                            color={getToneColor(selectedProposal.tone) as any}
                            size="small"
                          />
                          <Chip
                            label={selectedProposal.approach}
                            color={getApproachColor(selectedProposal.approach) as any}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>
                      </Box>
                    }
                    subheader={`Based on AI Proposal #${aiProposals.findIndex((p) => p.id === selectedProposal.id) + 1}`}
                  />
  
                  <CardContent>
                    <Stack spacing={3}>
                      <Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            Your Response
                          </Typography>
                          <Button
                            variant="text"
                            size="small"
                            startIcon={<Edit />}
                            onClick={() => setIsEditing(!isEditing)}
                          >
                            {isEditing ? "Preview" : "Edit"}
                          </Button>
                        </Box>
  
                        {isEditing ? (
                          <TextField
                            multiline
                            rows={12}
                            fullWidth
                            value={editedResponse}
                            onChange={(e) => setEditedResponse(e.target.value)}
                            placeholder="Edit your response..."
                            sx={{
                              "& .MuiInputBase-input": {
                                fontFamily: "monospace",
                                fontSize: "0.875rem",
                              },
                            }}
                          />
                        ) : (
                          <Paper sx={{ p: 2, bgcolor: "grey.50", minHeight: 300 }}>
                            <Typography
                              variant="body2"
                              component="pre"
                              sx={{
                                whiteSpace: "pre-wrap",
                                fontFamily: "inherit",
                                lineHeight: 1.6,
                                margin: 0,
                              }}
                            >
                              {editedResponse}
                            </Typography>
                          </Paper>
                        )}
                      </Box>
  
                      <Divider />
  
                      <Stack spacing={2}>
                        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                          <Typography variant="body2" color="text.secondary">
                            Characters: {editedResponse.length}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Est. read time: {selectedProposal.estimatedReadTime}
                          </Typography>
                        </Box>
  
                        <Button variant="contained" size="large" fullWidth startIcon={<Send />} sx={{ py: 1.5 }}>
                          Send Response to Customer
                        </Button>
  
                        <Grid container spacing={1}>
                          <Grid item xs={6}>
                            <Button variant="outlined" size="small" fullWidth>
                              Save Draft
                            </Button>
                          </Grid>
                          <Grid item xs={6}>
                            <Button variant="outlined" size="small" fullWidth>
                              Preview Email
                            </Button>
                          </Grid>
                        </Grid>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              ) : (
                <Card sx={{ bgcolor: "grey.100", border: "2px dashed", borderColor: "grey.300" }}>
                  <CardContent sx={{ textAlign: "center", py: 6 }}>
                    <ChatBubble sx={{ fontSize: 48, color: "grey.400", mb: 2 }} />
                    <Typography variant="h6" gutterBottom>
                      Select an AI Proposal
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Choose one of the AI-generated responses to customize and send
                    </Typography>
                  </CardContent>
                </Card>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    )
};