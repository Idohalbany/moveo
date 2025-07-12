import * as React from "react";
import {
  Typography,
  Box,
  Paper,
  Container,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Assignment as TaskIcon,
  Label as TagIcon,
} from "@mui/icons-material";
import { useSession } from "../SessionContext";
import { callApi, tagApi, taskApi } from "../services/api";
import type {
  Call,
  Tag,
  Task,
  CallTask,
  TaskStatus,
  CreateCallRequest,
  UpdateCallRequest,
  LinkTaskToCallRequest,
  LinkTagToCallRequest,
  UpdateCallTaskRequest,
} from "../types";

const TASK_STATUS_OPTIONS: TaskStatus[] = ["Open", "In Progress", "Completed"];

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case "Open":
      return "error";
    case "In Progress":
      return "warning";
    case "Completed":
      return "success";
    default:
      return "default";
  }
};

export default function CallsPage() {
  const { userRole } = useSession();
  const [calls, setCalls] = React.useState<Call[]>([]);
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [viewDialogOpen, setViewDialogOpen] = React.useState(false);
  const [editingCall, setEditingCall] = React.useState<Call | null>(null);
  const [selectedCall, setSelectedCall] = React.useState<Call | null>(null);
  const [callTitle, setCallTitle] = React.useState("");
  const [callTasks, setCallTasks] = React.useState<CallTask[]>([]);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({ open: false, message: "", severity: "success" });

  React.useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [callsData, tagsData, tasksData] = await Promise.all([
        callApi.list(),
        tagApi.list(),
        taskApi.list(),
      ]);
      setCalls(callsData);
      setTags(tagsData);
      setTasks(tasksData);
    } catch (error) {
      showSnackbar("Failed to load data", "error");
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadCallTasks = async (callId: number) => {
    try {
      const tasksData = await callApi.getTasks(callId);
      setCallTasks(tasksData);
    } catch (error) {
      showSnackbar("Failed to load call tasks", "error");
      console.error("Error loading call tasks:", error);
    }
  };

  const showSnackbar = (message: string, severity: "success" | "error") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (call?: Call) => {
    setEditingCall(call || null);
    setCallTitle(call?.title || "");
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingCall(null);
    setCallTitle("");
  };

  const handleOpenViewDialog = async (call: Call) => {
    setSelectedCall(call);
    await loadCallTasks(call.id);
    setViewDialogOpen(true);
  };

  const handleCloseViewDialog = () => {
    setViewDialogOpen(false);
    setSelectedCall(null);
    setCallTasks([]);
  };

  const handleSaveCall = async () => {
    if (!callTitle.trim()) {
      showSnackbar("Call title is required", "error");
      return;
    }

    try {
      if (editingCall) {
        const updateData: UpdateCallRequest = { title: callTitle.trim() };
        await callApi.update(editingCall.id, updateData);
        showSnackbar("Call updated successfully", "success");
      } else {
        const createData: CreateCallRequest = { title: callTitle.trim() };
        await callApi.create(createData);
        showSnackbar("Call created successfully", "success");
      }

      handleCloseDialog();
      loadData();
    } catch (error) {
      showSnackbar(
        `Failed to ${editingCall ? "update" : "create"} call`,
        "error"
      );
      console.error("Error saving call:", error);
    }
  };

  const handleDeleteCall = async (call: Call) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the call "${call.title}"?`
      )
    ) {
      return;
    }

    try {
      await callApi.delete(call.id);
      showSnackbar("Call deleted successfully", "success");
      loadData();
    } catch (error) {
      showSnackbar("Failed to delete call", "error");
      console.error("Error deleting call:", error);
    }
  };

  const handleAddTaskToCall = async (taskId: number) => {
    if (!selectedCall) return;

    try {
      const linkData: LinkTaskToCallRequest = {
        callId: selectedCall.id,
        taskId,
      };
      await callApi.linkTask(linkData);
      showSnackbar("Task added to call successfully", "success");
      await loadCallTasks(selectedCall.id);
    } catch (error) {
      showSnackbar("Failed to add task to call", "error");
      console.error("Error adding task to call:", error);
    }
  };

  const handleAddTagToCall = async (tagId: number) => {
    if (!selectedCall) return;

    try {
      let tagIds = selectedCall.tags
        ? selectedCall.tags.map((tag) => tag.id)
        : [];
      const tagExists = tagIds.includes(tagId);
      if (tagExists) {
        tagIds = tagIds.filter((id) => id !== tagId);
      } else {
        tagIds = [...tagIds, tagId];
      }
      const linkData: LinkTagToCallRequest = {
        tagIds,
      };
      await callApi.linkTag(selectedCall.id, linkData);
      showSnackbar(
        tagExists
          ? "Tag removed from call successfully"
          : "Tag added to call successfully",
        "success"
      );
      // Refresh calls and selectedCall after tag update
      const callsData = await callApi.list();
      setCalls(callsData);
      // Update selectedCall with the latest data
      const updatedCall = callsData.find((c) => c.id === selectedCall.id);
      if (updatedCall) setSelectedCall(updatedCall);
    } catch (error) {
      showSnackbar("Failed to update tags for call", "error");
      console.error("Error updating tags for call:", error);
    }
  };

  const handleUpdateTaskStatus = async (
    callTaskId: number,
    status: TaskStatus
  ) => {
    try {
      const updateData: UpdateCallTaskRequest = { status };
      await callApi.updateTask(callTaskId, updateData);
      showSnackbar("Task status updated successfully", "success");
      if (selectedCall) {
        await loadCallTasks(selectedCall.id);
      }
    } catch (error) {
      showSnackbar("Failed to update task status", "error");
      console.error("Error updating task status:", error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Calls Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage incoming calls and their tasks
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h6">Active Calls ({calls.length})</Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            New Call
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        ) : calls.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No calls found. Create your first call record to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Title</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {calls.map((call) => (
                  <TableRow key={call.id}>
                    <TableCell>{call.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {call.title}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenViewDialog(call)}
                        color="info"
                        title="View Details"
                      >
                        <ViewIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(call)}
                        color="primary"
                        title="Edit"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteCall(call)}
                        color="error"
                        title="Delete"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Paper>

      {/* Add/Edit Call Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingCall ? "Edit Call" : "Create New Call"}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Call Title"
            fullWidth
            variant="outlined"
            value={callTitle}
            onChange={(e) => setCallTitle(e.target.value)}
            placeholder="e.g., Gas leak report on Main Street"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveCall} variant="contained">
            {editingCall ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* View Call Details Dialog */}
      <Dialog
        open={viewDialogOpen}
        onClose={handleCloseViewDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>Call Details: {selectedCall?.title}</DialogTitle>
        <DialogContent>
          {selectedCall && (
            <Box>
              {/* Add Task Section */}
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Add/Remove tag to call
                  </Typography>
                  <Autocomplete
                    options={tags}
                    getOptionLabel={(option) => option.name}
                    onChange={(_, value) => {
                      if (value) {
                        handleAddTagToCall(value.id);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select a Tag to add/remove"
                        placeholder="Choose from available tasks..."
                      />
                    )}
                  />
                </CardContent>
                <CardContent>
                  <Typography variant="subtitle1" gutterBottom>
                    Add Task to Call
                  </Typography>
                  <Autocomplete
                    options={tasks}
                    getOptionLabel={(option) => option.title}
                    onChange={(_, value) => {
                      if (value) {
                        handleAddTaskToCall(value.id);
                      }
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select a task"
                        placeholder="Choose from available tasks..."
                      />
                    )}
                  />
                </CardContent>
              </Card>

              {/* Tag List */}
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                {selectedCall.tags && selectedCall.tags.length > 0 ? (
                  selectedCall.tags.map((tag) => (
                    <Chip
                      key={tag.id}
                      label={tag.name}
                      color="primary"
                      size="small"
                      sx={{ mb: 1 }}
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags assigned to this call yet.
                  </Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                <TaskIcon sx={{ mr: 1, verticalAlign: "middle" }} />
                Assigned Tasks ({callTasks.length})
              </Typography>

              {/* Tasks List */}
              {callTasks.length === 0 ? (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ py: 2 }}
                >
                  No tasks assigned to this call yet.
                </Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Task</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Actions</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {callTasks.map((callTask) => (
                      <TableRow key={callTask.id}>
                        <TableCell>
                          {callTask.name || `Task ${callTask.taskId}`}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={callTask.status}
                            color={getStatusColor(callTask.status)}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <FormControl size="small" sx={{ minWidth: 120 }}>
                            <Select
                              value={callTask.status}
                              onChange={(e) =>
                                handleUpdateTaskStatus(
                                  callTask.id,
                                  e.target.value as TaskStatus
                                )
                              }
                            >
                              {TASK_STATUS_OPTIONS.map((status) => (
                                <MenuItem key={status} value={status}>
                                  {status}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}

              {/* New Task Button */}
              <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 ,mt: 2}}>
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={async () => {
                    if (!selectedCall) return;
                    const name = window.prompt("Enter new task name:");
                    if (!name || !name.trim()) return;
                    try {
                      await callApi.createTask({
                        name: name.trim(),
                        callId: selectedCall.id,
                        status: "IN_PROGRESS",
                      });
                      showSnackbar("Task created and added to call", "success");
                      await loadCallTasks(selectedCall.id);
                    } catch (error) {
                      showSnackbar("Failed to create task", "error");
                      console.error("Error creating task:", error);
                    }
                  }}
                >
                  New Task
                </Button>
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseViewDialog}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
