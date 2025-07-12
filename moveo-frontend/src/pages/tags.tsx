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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import RoleProtectedRoute from '../components/RoleProtectedRoute';
import { tagApi } from '../services/api';
import type { Tag, CreateTagRequest, UpdateTagRequest } from '../types';

export default function TagsPage() {
  return (
    // <RoleProtectedRoute allowedRoles={['ADMIN']}>
      <TagsContent />
    // </RoleProtectedRoute>
  );
}

function TagsContent() {
  const [tags, setTags] = React.useState<Tag[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingTag, setEditingTag] = React.useState<Tag | null>(null);
  const [tagName, setTagName] = React.useState('');
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({ open: false, message: '', severity: 'success' });

  // Load tags on component mount
  React.useEffect(() => {
    loadTags();
  }, []);

  const loadTags = async () => {
    try {
      setLoading(true);
      const tagsData = await tagApi.list();
      setTags(tagsData);
    } catch (error) {
      showSnackbar('Failed to load tags', 'error');
      console.error('Error loading tags:', error);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message: string, severity: 'success' | 'error') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (tag?: Tag) => {
    setEditingTag(tag || null);
    setTagName(tag?.name || '');
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTag(null);
    setTagName('');
  };

  const handleSaveTag = async () => {
    if (!tagName.trim()) {
      showSnackbar('Tag name is required', 'error');
      return;
    }

    try {
      if (editingTag) {
        // Update existing tag
        const updateData: UpdateTagRequest = { name: tagName.trim() };
        await tagApi.update(editingTag.id, updateData);
        showSnackbar('Tag updated successfully', 'success');
      } else {
        // Create new tag
        const createData: CreateTagRequest = { name: tagName.trim() };
        await tagApi.create(createData);
        showSnackbar('Tag created successfully', 'success');
      }
      
      handleCloseDialog();
      loadTags(); // Reload tags
    } catch (error) {
      showSnackbar(
        `Failed to ${editingTag ? 'update' : 'create'} tag`,
        'error'
      );
      console.error('Error saving tag:', error);
    }
  };

  const handleDeleteTag = async (tag: Tag) => {
    if (!window.confirm(`Are you sure you want to delete the tag "${tag.name}"?`)) {
      return;
    }

    try {
      await tagApi.delete(tag.id);
      showSnackbar('Tag deleted successfully', 'success');
      loadTags(); // Reload tags
    } catch (error) {
      showSnackbar('Failed to delete tag', 'error');
      console.error('Error deleting tag:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Tags Management
        </Typography>
        <Typography variant="subtitle1" color="text.secondary">
          Manage tags for your call center system
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6">
            Tags ({tags.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              variant="outlined"
              onClick={() => window.open('/tasks', '_blank')}
            >
              Manage Tasks
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => handleOpenDialog()}
            >
              Add Tag
            </Button>
          </Box>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
            <CircularProgress />
          </Box>
        ) : tags.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              No tags found. Create your first tag to get started.
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
                {tags.map((tag) => (
                  <TableRow key={tag.id}>
                    <TableCell>{tag.id}</TableCell>
                    <TableCell>
                      <Typography variant="body1" fontWeight="medium">
                        {tag.name}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      {tag.createdAt
                        ? new Date(tag.createdAt).toLocaleDateString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleOpenDialog(tag)}
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteTag(tag)}
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

      {/* Add/Edit Tag Dialog */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingTag ? 'Edit Tag' : 'Add New Tag'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            fullWidth
            variant="outlined"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="e.g., Emergency, Fire Department, Gas"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTag} variant="contained">
            {editingTag ? 'Update' : 'Create'}
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
