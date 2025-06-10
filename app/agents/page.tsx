"use client";

import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Switch,
  Button,
  Box,
  CircularProgress,
  Alert,
  Collapse,
  TextField,
  Card,
  CardContent,
  Stack,
  ListItemButton,
  FormControlLabel,
  Chip,
  IconButton,
} from "@mui/material";
import { ExpandLess, ExpandMore, Add, Remove } from "@mui/icons-material";
import { SupportAgent } from "@/types/support-agent";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function AgentsPage() {
  const [agents, setAgents] = useState<SupportAgent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedAgentId, setExpandedAgentId] = useState<string | null>(null);
  const [editingAgent, setEditingAgent] = useState<SupportAgent | null>(null);

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        const res = await fetch(`/api/agents`);
        if (!res.ok) {
          throw new Error("Failed to fetch agents");
        }
        const data = await res.json();
        setAgents(data);
        setError(null);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgents();
  }, []);

  const handleToggleExpand = (agentId: string) => {
    if (expandedAgentId === agentId) {
      setExpandedAgentId(null);
      setEditingAgent(null);
    } else {
      setExpandedAgentId(agentId);
      const agentToEdit = agents.find((agent) => agent.id === agentId);
      setEditingAgent(agentToEdit || null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (editingAgent) {
      const { name, value, type, checked } = e.target;
      setEditingAgent({
        ...editingAgent,
        [name]: type === 'checkbox' ? checked : value,
      });
    }
  };

  const handleSpecialtyChange = (index: number, value: string) => {
    if (editingAgent) {
      const newSpecialties = [...editingAgent.specialties];
      newSpecialties[index] = value;
      setEditingAgent({
        ...editingAgent,
        specialties: newSpecialties,
      });
    }
  };

  const handleAddSpecialty = () => {
    if (editingAgent) {
      setEditingAgent({
        ...editingAgent,
        specialties: [...editingAgent.specialties, ""],
      });
    }
  };

  const handleRemoveSpecialty = (index: number) => {
    if (editingAgent) {
      setEditingAgent({
        ...editingAgent,
        specialties: editingAgent.specialties.filter((_, i) => i !== index),
      });
    }
  };

  const handleSave = async (agentId: string) => {
    if (!editingAgent) return;

    // Optimistically update UI
    const originalAgents = agents;
    setAgents(prevAgents => prevAgents.map(agent => agent.id === agentId ? editingAgent : agent));
    setExpandedAgentId(null);
    setEditingAgent(null);

    try {
      const response = await fetch(`/api/agents/${agentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editingAgent),
      });

      if (!response.ok) {
        throw new Error("Failed to save agent");
      }
    } catch (err: any) {
      setError(err.message);
      // Revert on failure
      setAgents(originalAgents);
    }
  };

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
            Support Agents
          </Typography>
        </Box>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <List>
            {agents.map((agent) => (
              <ListItem key={agent.id} disablePadding sx={{ flexDirection: 'column', alignItems: 'stretch' }}>
                 <ListItemButton onClick={() => handleToggleExpand(agent.id)}>
                    <ListItemText
                      primary={agent.name}
                      secondary={agent.description}
                    />
                    <Stack direction="row" spacing={1} sx={{ ml: 2, alignItems: 'center' }}>
                      <Chip label="Active" size="small" color={agent.active ? "success" : "default"} />
                      <Chip label="Autonomous" size="small" color={agent.autonomous ? "success" : "default"} />
                    </Stack>
                    {expandedAgentId === agent.id ? <ExpandLess /> : <ExpandMore />}
                 </ListItemButton>
                <Collapse in={expandedAgentId === agent.id} timeout="auto" unmountOnExit>
                  {editingAgent && (
                  <Card sx={{ mt: 1 }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <TextField
                          label="Name"
                          name="name"
                          value={editingAgent.name}
                          onChange={handleInputChange}
                          fullWidth
                        />
                        <TextField
                          label="Description"
                          name="description"
                          value={editingAgent.description}
                          onChange={handleInputChange}
                          fullWidth
                          multiline
                          rows={3}
                        />
                         <TextField
                          label="Personality"
                          name="personality"
                          value={editingAgent.personality}
                          onChange={handleInputChange}
                          fullWidth
                          multiline
                          rows={3}
                        />
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>Specialties</Typography>
                          {editingAgent.specialties.map((specialty, index) => (
                            <Stack direction="row" key={index} spacing={1} sx={{ mb: 1, alignItems: 'center' }}>
                              <TextField
                                placeholder="Enter a specialty description"
                                value={specialty}
                                onChange={(e) => handleSpecialtyChange(index, e.target.value)}
                                fullWidth
                                multiline
                              />
                              <IconButton onClick={() => handleRemoveSpecialty(index)} aria-label="Remove specialty">
                                <Remove />
                              </IconButton>
                            </Stack>
                          ))}
                          <Button startIcon={<Add />} onClick={handleAddSpecialty}>
                            Add Specialty
                          </Button>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ mb: 1 }}>Memory</Typography>
                          {editingAgent.memory && Object.keys(editingAgent.memory).length > 0 ? (
                            Object.entries(editingAgent.memory).map(([key, value]) => (
                              <Box key={key} sx={{ mb: 2, p: 2, border: '1px solid', borderColor: 'grey.200', borderRadius: 1 }}>
                                <Typography variant="body1" component="p" gutterBottom sx={{ fontWeight: 500 }}>
                                  {key}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                  Preferred response:
                                </Typography>
                                <Chip label={value.humanPreference} color="success" size="small" sx={{ mb: 1.5 }} />

                                {value.options.filter(o => o !== value.humanPreference).length > 0 && (
                                  <>
                                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                      Other options considered:
                                    </Typography>
                                    <Stack direction="row" spacing={1} useFlexGap flexWrap="wrap">
                                      {value.options.filter(o => o !== value.humanPreference).map(option => (
                                          <Chip key={option} label={option} size="small" variant="outlined" />
                                      ))}
                                    </Stack>
                                  </>
                                )}
                              </Box>
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">This agent has no memories.</Typography>
                          )}
                        </Box>
                        <FormControlLabel
                          control={
                            <Switch
                              checked={editingAgent.autonomous}
                              onChange={handleInputChange}
                              name="autonomous"
                            />
                          }
                          label="Autonomous"
                        />
                         <FormControlLabel
                          control={
                            <Switch
                              checked={editingAgent.active}
                              onChange={handleInputChange}
                              name="active"
                            />
                          }
                          label="Active"
                        />
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                          <Button onClick={() => handleToggleExpand(agent.id)}>Cancel</Button>
                          <Button onClick={() => handleSave(agent.id)} variant="contained">Save</Button>
                        </Box>
                      </Stack>
                    </CardContent>
                  </Card>
                  )}
                </Collapse>
              </ListItem>
            ))}
          </List>
        )}
      </Container>
    </Box>
  );
} 