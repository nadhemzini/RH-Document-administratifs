import React, { useState } from "react";
import { TextField, Button, Box, Paper } from "@mui/material";

interface Props {
    onAdd: (title: string, description: string) => void;
}

const TaskForm: React.FC<Props> = ({ onAdd }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (title.trim()) {
            onAdd(title, description);
            setTitle("");
            setDescription("");
        }
    };

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <form onSubmit={handleSubmit}>
                <Box display="flex" flexDirection="column" gap={2}>
                    <TextField
                        label="Titre"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}

                        rows={3}
                    />
                    <Button type="submit" variant="contained">
                        Ajouter la tâche
                    </Button>
                </Box>
            </form>
        </Paper>
    );
};

export default TaskForm;
