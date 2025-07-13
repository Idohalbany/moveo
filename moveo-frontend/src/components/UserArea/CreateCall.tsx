import {
  Chip,
  Autocomplete,
  TextField,
  CardContent,
  Card,
} from "@mui/material";
import { useContext, useMemo, useState } from "react";
import { Call, Tag, CreateCallPayload } from "@moveo/types";
import { Add as AddIcon } from "@mui/icons-material";
import { createCall } from "../../services";
import { ManagementAreaCtx } from "../../utils/ManagementAreaCtx";
import { useNavigate } from "react-router";
import css from "./CreateCall.module.scss";

export function CreateCall() {
  const navigate = useNavigate();
  const [callTitle, setCallTitle] = useState("");
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagAutoValue, setTagAutoValue] = useState<Tag | null>(null);
  const { tags, createNewCall } = useContext(ManagementAreaCtx);
  const canReset = useMemo(() => callTitle || selectedTags.length > 0, [callTitle, selectedTags]);


  const handleCreateCall = async () => {
    if (!callTitle.trim()) return;
    try {
      const payload: CreateCallPayload = {
        name: callTitle.trim(),
        tags: selectedTags.map((t) => t.id),
      };
      const created: Call = await createCall(payload);
      createNewCall?.(created);
      navigate(`/user/call/${created.id}`);
    } catch (error) {
      console.error("Failed to create call", error);
    }
  };

  const handleAddTag = (tagId: string) => {
    const tag = tags?.find((t) => t.id === tagId);
    if (!tag || selectedTags.some((t) => t.id === tagId)) return;
    setSelectedTags((prev) => [...prev, tag]);
    setTagAutoValue(null);
  };

  const handleRemoveTag = (tagId: string) => {
    setSelectedTags((prev) => prev.filter((tag) => tag.id !== tagId));
  };

  const handleReset = () => {
    setCallTitle("");
    setSelectedTags([]);
    setTagAutoValue(null);
  };

  return (
    <div className={css.wrapper}>
    <div className={css.scrollArea}>
      <h4 className={css.title}>Create New Call</h4>

      <TextField
        label="Call Name"
        fullWidth
        variant="outlined"
        value={callTitle}
        onChange={(e) => setCallTitle(e.target.value)}
        placeholder="Enter call name"
        sx={{ mb: 2 }}
      />

      <Card sx={{ mb: 2 }}>
        <CardContent>
          <p className={css.subtitle}>Assign Tags to Call</p>
          <Autocomplete
            options={tags || []}
            getOptionLabel={(option) => option.name}
            value={tagAutoValue}
            onChange={(_, value) => value && handleAddTag(value.id)}
            renderInput={(params) => <TextField {...params} label="Add Tag" />}
          />
          <div className={css.tagList}>
            {selectedTags.map((tag) => (
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
    </div>

    <div className={css.actions}>
      <button
        className={css.primaryButton}
        onClick={handleCreateCall}
        disabled={!callTitle.trim()}
      >
        <AddIcon />
        Create Call
      </button>

      <button
        className={css.outlineButton}
        disabled={!canReset}
        onClick={handleReset}
      >
        Reset Form
      </button>
    </div>
  </div>
  );
}