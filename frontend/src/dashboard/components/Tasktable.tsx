import React from "react";
import {
    Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, Paper, Button
} from "@mui/material";
import { Task } from ".././interfaces/Task";

interface TaskTableProps {
    tasks: Task[];
    onSelect: (task: Task) => void;
}

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onSelect }) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Titre</TableCell>
                        <TableCell>Statut</TableCell>
                        <TableCell>Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {tasks.map((task) => (
                        <TableRow key={task.id}>
                            <TableCell>{task.title}</TableCell>
                            <TableCell>{task.status}</TableCell>
                            <TableCell>
                                <Button variant="outlined" onClick={() => onSelect(task)}>
                                    Voir Détails
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default TaskTable;
