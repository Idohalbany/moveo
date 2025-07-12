import * as React from 'react';
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
  Tabs,
  Tab,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import { taskApi } from '../services/api';
import type { Task, CreateTaskRequest, UpdateTaskRequest } from '../types';

export default function TasksPage() {
  return (
    // <RoleProtectedRoute allowedRoles={['ADMIN']}>
      <TasksContent />
    // </RoleProtectedRoute>
  );
}

function TasksContent() {
  // const navigate = useNavigate();
  const [tasks, setTasks] = React.useState<Task[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);
  const [taskName, setTaskName] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Load tasks on component mount
  React.useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const tasksData = await taskApi.list();
      setTasks(tasksData);
    } catch (error) {
      showSnackbar('Failed to load tasks', 'error');
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (task?: Task) => {
    setEditingTask(task || null);
    setTaskName(task?.title || '');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
    setTaskName('');
  };

  const handleSaveTask = async () => {
    if (!taskName.trim()) {
      showSnackbar('Task name is required', 'error');
      return;
    }

    try {
      if (editingTask) {
        // Update existing task
        const updateData: UpdateTaskRequest = { name: taskName.trim() };
        await taskApi.update(editingTask.id, updateData);
        showSnackbar('Task updated successfully', 'success');
      } else {
        // Create new task
        const createData: CreateTaskRequest = { name: taskName.trim() };
        await taskApi.create(createData);
        showSnackbar('Task created successfully', 'success');
      }
      
      handleCloseDialog();
      loadTasks(); // Reload tasks
    } catch (error) {
      showSnackbar(
        `Failed to ${editingTask ? 'update' : 'create'} task`,
        'error'
      );
      console.error('Error saving task:', error);
    }
  };

  const handleDeleteTask = async (task: Task) => {
    if (!window.confirm(`Are you sure you want to delete the task "${task.name}"?`)) {
      return;
    }

    try {
      await taskApi.delete(task.id);
      showSnackbar('Task deleted successfully', 'success');
      loadTasks(); // Reload tasks
    } catch (error) {
      showSnackbar('Failed to delete task', 'error');
      console.error('Error deleting task:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Suggested Tasks Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage suggested tasks for your call center system (Bonus Feature)
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Suggested Tasks ({tasks.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Add Task
          </Button>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tasks.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No suggested tasks found. Create your first task to get started.
            </Typography>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Created</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id}>
                    <TableCell>{task.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {task.title}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {task.createdAt
                        ? new Date(task.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(task)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTask(task)}
                        color="error"
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



      {/* Add/Edit Task Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTask ? 'Edit Suggested Task' : 'Add New Suggested Task'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Task Name"
            fullWidth
            variant="outlined"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            placeholder="e.g., Notify Fire Department, Shut Down Power"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTask} variant="contained">
            {editingTask ? 'Update' : 'Create'}
          </Button>
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
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
