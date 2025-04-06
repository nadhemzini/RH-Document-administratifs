import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid-pro/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar.tsx';
import Header from './components/Header.tsx';
import MainGrid from './components/MainGrid.tsx';
import SideMenu from './components/SideMenu.tsx';
import AppTheme from '../shared-theme/AppTheme.tsx';
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from './theme/customizations/index.ts';
import TaskTable from "./components/Tasktable.tsx";
import TaskDetails from "./components/TaskDetail.tsx";
import type { Task } from "./interfaces/Task.ts";
import { Container, Typography } from "@mui/material";
import { useEffect, useState } from 'react';
import axios from 'axios';
import TaskForm from "./components/TaskForm.tsx";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Task(props: { disableCustomTheme?: boolean }) {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await axios.get("http://localhost:5000/api/tasks");
                setTasks(response.data);
            } catch (error) {
                console.error("Erreur lors du chargement des tâches", error);
            }
        };

        fetchTasks();
    }, []);

    const handleSelectTask = (task: Task) => setSelectedTask(task);
    const handleAddTask = async (title: string, description: string) => {
        try {
            const response = await axios.post("http://localhost:5000/api/tasks", {
                title,
                description,
            });

            setTasks((prev) => [...prev, response.data]);
        } catch (error) {
            console.error("Erreur lors de l'ajout de la tâche", error);
        }
    };
    const handleMarkAsDone = async (taskId: number) => {
        try {
            await axios.patch(`http://localhost:5000/api/tasks/${taskId}`, {
                status: "Terminée",
            });

            // Update UI locally
            setTasks((prev) =>
                prev.map((task) =>
                    task.id === taskId ? { ...task, status: "Terminée" } : task
                )
            );
            setSelectedTask(null);
        } catch (error) {
            console.error("Erreur lors de la mise à jour", error);
        }
    };
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header pageTitle="Task" />
                        <Container sx={{ mt: 4 }}>
                            <TaskForm onAdd={handleAddTask} />
                            <Typography variant="h4" gutterBottom>
                                Tableau des Tâches RH
                            </Typography>
                            <TaskTable tasks={tasks} onSelect={handleSelectTask} />
                            {selectedTask && (
                                <TaskDetails task={selectedTask} onMarkDone={handleMarkAsDone} />
                            )}
                        </Container>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
