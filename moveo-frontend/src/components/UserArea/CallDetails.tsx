import {
  MenuItem,
  Card,
  Chip,
  TextField,
  Autocomplete,
  Select,
  InputLabel,
  Divider,
  CardContent,
  IconButton,
  FormControl,
} from "@mui/material";
import { Add, Delete } from "@mui/icons-material";
import { useParams } from "react-router";
import { useContext, useEffect, useState } from "react";
import {
  TaskStatus,
  TASK_STATUS_LABELS,
  Tag,
  CallDetailsType,
} from "@moveo/types";
import { ManagementAreaCtx } from "../../utils/ManagementAreaCtx";
import {
  createTask,
  getCallById,
  updateCall,
  updateTask,
  deleteTask,
} from "../../services";
import css from "./CallDetails.module.scss";

export function CallDetails() {
  const { callId } = useParams();
  const {
    setCalls,
    tags,
    setIsLoading,
    isLoading,
  } = useContext(ManagementAreaCtx);

  const [taskName, setTaskName] = useState("");
  const [taskStatus, setTaskStatus] = useState(TaskStatus.Open);
  const [callDetails, setCallDetails] = useState<CallDetailsType | null>(null);
  const [selectedTag, setSelectedTag] = useState<Tag | null>(null);

  useEffect(() => {
    if (!callId) return;
    loadCallDetails();
  }, [callId]);

  const loadCallDetails = async () => {
    try {
      setIsLoading?.(true);
      const call = await getCallById(callId!);
      setCallDetails(call);
    } catch (error) {
      console.error("Failed to fetch call details:", error);
    } finally {
      setIsLoading?.(false);
    }
  };

  const promoteCallToTop = (updated: CallDetailsType) => {
    const now = new Date().toISOString();
    const callWithUpdatedDate = { ...updated, updatedAt: now };

    setCalls?.((prev) => {
      const filtered = prev?.filter((c) => c.id !== updated.id) ?? [];
      return [callWithUpdatedDate, ...filtered];
    });
  };

  const handleAddTask = async () => {
    if (!taskName.trim() || !callId || !callDetails) return;

    try {
      const newTask = await createTask({
        callId,
        name: taskName.trim(),
        status: Number(taskStatus),
      });

      const updatedDetails = {
        ...callDetails,
        tasks: [...callDetails.tasks, newTask],
        updatedAt: new Date().toISOString(),
      };

      setCallDetails(updatedDetails);
      promoteCallToTop(updatedDetails);

      setTaskName("");
      setTaskStatus(TaskStatus.Open);
    } catch (error) {
      console.error("Failed to create:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!callDetails) return;

    try {
      await deleteTask(taskId);

      const updatedTasks = callDetails.tasks.filter((t) => t.id !== taskId);
      const updatedDetails = {
        ...callDetails,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString(),
      };

      setCallDetails(updatedDetails);
      promoteCallToTop(updatedDetails);
    } catch (error) {
      console.error("Failed to remove:", error);
    }
  };

  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    if (!callDetails) return;

    try {
      const updatedTask = await updateTask(taskId, { status: Number(status) });

      const updatedTasks = callDetails.tasks.map((t) =>
        t.id === taskId ? updatedTask : t
      );

      const updatedDetails = {
        ...callDetails,
        tasks: updatedTasks,
        updatedAt: new Date().toISOString(),
      };

      setCallDetails(updatedDetails);
      promoteCallToTop(updatedDetails);
    } catch (error) {
      console.error("Failed to update task status:", error);
    }
  };

  const handleAddTag = async (tagId: string) => {
    const tag = tags?.find((t) => t.id === tagId);
    if (!tag || callDetails?.tags.includes(tagId)) return;

    const updatedTagIds = [...callDetails!.tags, tagId];

    try {
      await updateCall(callDetails!.id, { tags: updatedTagIds });

      const updatedDetails: CallDetailsType = {
        ...callDetails!,
        tags: updatedTagIds,
        updatedAt: new Date().toISOString(),
      };

      setCallDetails(updatedDetails);
      promoteCallToTop(updatedDetails);
    } catch (error) {
      console.error("Failed to add tag:", error);
    }
  };

  const handleRemoveTag = async (tagId: string) => {
    if (!callDetails) return;

    const updatedTags = callDetails.tags.filter((id) => id !== tagId);

    try {
      await updateCall(callDetails.id, { tags: updatedTags });

      const updatedDetails = {
        ...callDetails,
        tags: updatedTags,
        updatedAt: new Date().toISOString(),
      };

      setCallDetails(updatedDetails);
      promoteCallToTop(updatedDetails);
    } catch (error) {
      console.error("Failed to remove tag:", error);
    }
  };

  if (!callDetails) return null;

  if (isLoading) {
    return <div className={css.loadingContainer}>Loading...</div>;
  }

  return (
    <div className={css.container}>
      <div className={css.header}>
        <h4 className={css.callTitle}>{callDetails.name}</h4>
        <p className={css.updatedAt}>
          Last updated: {new Date(callDetails.updatedAt).toLocaleString()}
        </p>
      </div>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <p className={css.subtitle}>Assign Tags</p>
          <Autocomplete
            options={tags ?? []}
            value={selectedTag}
            onChange={(_, tag) => {
              if (tag) handleAddTag(tag.id);
              setSelectedTag(null);
            }}
            getOptionLabel={(option) => option.name}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Add tag"
                placeholder="Enter tag name"
              />
            )}
          />

          <div className={css.tagContainer}>
            {tags
              ?.filter((tag) => callDetails.tags.includes(tag.id))
              .map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  color="primary"
                  onDelete={() => handleRemoveTag(tag.id)}
                />
              ))}
          </div>
        </CardContent>
      </Card>

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <p className={css.subtitle}>Create Task</p>
          <div className={css.taskInputRow}>
            <TextField
              label="Task Name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              fullWidth
            />
            <FormControl sx={{ minWidth: 160 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={taskStatus}
                onChange={(e) =>
                  setTaskStatus(e.target.value as TaskStatus)
                }
                label="Status"
              >
                {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                  <MenuItem key={key} value={key}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <button className={css.addTaskButton} onClick={handleAddTask}>
              <Add />
            </button>
          </div>
        </CardContent>
      </Card>

      <h6 className={css.taskSectionTitle}>Assigned Tasks</h6>
      <Divider className={css.divider} />
      {callDetails.tasks.length === 0 ? (
        <p className={css.noTasks}>No tasks assigned.</p>
      ) : (
        callDetails.tasks.map((task) => (
          <Card key={task.id} sx={{ mb: 1 }}>
            <CardContent
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <p className={css.taskName}>{task.name}</p>

              <div className={css.taskActions}>
                <FormControl size="small">
                  <Select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusChange(task.id, e.target.value as TaskStatus)
                    }
                  >
                    {Object.entries(TASK_STATUS_LABELS).map(([key, label]) => (
                      <MenuItem key={key} value={key}>
                        {label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <IconButton
                  onClick={() => handleDeleteTask(task.id)}
                  size="small"
                  color="error"
                >
                  <Delete />
                </IconButton>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
}