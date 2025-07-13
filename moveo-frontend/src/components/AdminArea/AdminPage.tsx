import {
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
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCallback, useContext, useState } from 'react';
import { CreateTagPayload, Tag, UpdateTagPayload } from '@moveo/types';
import { ManagementAreaCtx } from '../../utils/ManagementAreaCtx';
import { createTag, deleteTag, updateTag } from '../../services';
import css from './AdminPage.module.scss';

export function AdminPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [tagName, setTagName] = useState('');

  const { tags, setTags } = useContext(ManagementAreaCtx);

  const handleOpenDialog = useCallback((tag?: Tag) => {
    setEditingTag(tag || null);
    setTagName(tag?.name || '');
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setEditingTag(null);
    setTagName('');
  }, []);

const handleSaveTag = useCallback(async () => {
  if (!tagName.trim()) return;

  try {
    if (editingTag) {
      const updateData: UpdateTagPayload = { name: tagName.trim() };
      const updatedTag = await updateTag(editingTag.id, updateData);

      setTags?.(tags?.map((t) =>
        t.id === editingTag.id ? { ...t, ...updatedTag } : t
      ) || []);
    } else {
      const createData: CreateTagPayload = { name: tagName.trim() };
      const newTag = await createTag(createData);

      setTags?.([...tags || [], newTag]);
    }

    handleCloseDialog();
  } catch (error) {
    console.error('Error saving tag:', error);
  }
}, [editingTag, tagName, setTags, tags]);


const handleDeleteTag = useCallback(async (tag: Tag) => {
  try {
    await deleteTag(tag.id);
    const newTags = tags?.filter((t) => t.id !== tag.id) || [];
    setTags?.(newTags);
  } catch (error) {
    console.error('Error deleting tag:', error);
  }
}, [tags, setTags]);

if (!tags) {
  return null;
}

  return (
   <div className={css.adminPage}>
      <div className={css.header}>
        <h1 className={css.title}>Admin Area</h1>
        <p className={css.subtitle}>Create and manage tags</p>
      </div>

      <div className={css.card}>
        <div className={css.cardHeader}>
          <h2 className={css.sectionTitle}>Tags ({tags?.length})</h2>
          <button className={css.addButton} onClick={() => handleOpenDialog()}>
            <AddIcon fontSize="small" />
            Add Tag
          </button>
        </div>

        {tags?.length === 0 && (
          <div className={css.emptyState}>
            <p className={css.emptyText}>
              Create your first tag.
            </p>
          </div>
        )}

        {tags?.length > 0 && (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tags?.map((tag, index) => (
                  <TableRow key={tag.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <span className={css.tagName}>{tag.name}</span>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => handleOpenDialog(tag)} color="primary">
                        <EditIcon />
                      </IconButton>
                      <IconButton size="small" onClick={() => handleDeleteTag(tag)} color="error">
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </div>

      <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{editingTag ? "Edit Tag" : "Add New Tag"}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Tag Name"
            fullWidth
            variant="outlined"
            value={tagName}
            onChange={(e) => setTagName(e.target.value)}
            placeholder="Enter tag name"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSaveTag} variant="contained">
            {editingTag ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}