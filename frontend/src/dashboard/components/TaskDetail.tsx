import React from "react";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Task } from ".././interfaces/Task";

interface TaskDetailsProps {
    task: Task;
    onMarkDone: (taskId: number) => void;
}

const TaskDetails: React.FC<TaskDetailsProps> = ({ task, onMarkDone }) => {
    return (
        <Card sx={{ mt: 3 }}>
            <CardContent>
                <Typography variant="h6">{task.title}</Typography>
                <Typography variant="body2" sx={{ my: 1 }}>
                    {task.description}
                </Typography>
                <Typography color="text.secondary">Statut: {task.status}</Typography>
                {task.status === "En cours" && (
                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        onClick={() => onMarkDone(task.id)}
                    >
                        Marquer comme terminée
                    </Button>
                )}
            </CardContent>
        </Card>
    );
};

export default TaskDetails;
