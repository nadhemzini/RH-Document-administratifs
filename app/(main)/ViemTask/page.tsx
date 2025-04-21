'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Task } from '../../../types/Task';
// import axios from 'axios'; // Uncomment when using API

// Simulate logged-in employee
const userName = 'Alice';

const statusOptions = [
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
];

const EmployeeTaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: 'Update Resume',
            description: 'Add latest projects and experiences.',
            assignedTo: 'Alice',
            status: 'IN_PROGRESS',
            deadline: new Date('2025-04-25'),
        },
        {
            id: 2,
            title: 'Client Meeting',
            description: 'Present quarterly performance report.',
            assignedTo: 'Alice',
            status: 'COMPLETED',
            deadline: new Date('2025-04-10'),
        }
    ]);

    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [filterStatus, setFilterStatus] = useState<string | null>(null);

    const fetchTasks = async () => {
        // const res = await axios.get('/api/tasks');
        // const myTasks = res.data.filter((t: Task) => t.assignedTo === userName);
        // setTasks(myTasks);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleMarkComplete = async (taskId: number) => {
        // await axios.put(`/api/tasks/${taskId}`, { status: 'COMPLETED' });

        // Update local state for demo/testing
        const updated = tasks.map((task): Task =>
            task.id === taskId ? { ...task, status: 'COMPLETED' as 'COMPLETED' } : task
        );
        setTasks(updated);
        setDialogVisible(false);
    };

    const statusBodyTemplate = (task: Task) => (
        <span className={`p-tag p-tag-${task.status === 'COMPLETED' ? 'success' : 'warning'}`}>
            {task.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
        </span>
    );

    const deadlineBodyTemplate = (task: Task) => (
        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span>
    );

    const actionBodyTemplate = (task: Task) => (
        <Button label="Details" icon="pi pi-eye" onClick={() => {
            setSelectedTask(task);
            setDialogVisible(true);
        }} />
    );

    const filteredTasks = filterStatus
        ? tasks.filter((t) => t.status === filterStatus)
        : tasks;

    return (
        <div className="card">
            <h4>My Tasks</h4>

            <div className="mb-3">
                <Dropdown
                    value={filterStatus}
                    options={statusOptions}
                    onChange={(e) => setFilterStatus(e.value)}
                    placeholder="Filter by Status"
                    className="w-full md:w-25rem"
                />
            </div>

            <DataTable value={filteredTasks} responsiveLayout="scroll">
                <Column field="title" header="Title" />
                <Column field="status" header="Status" body={statusBodyTemplate} />
                <Column field="deadline" header="Deadline" body={deadlineBodyTemplate} />
                <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>

            <Dialog header="Task Details" visible={dialogVisible} onHide={() => setDialogVisible(false)} modal>
                {selectedTask && (
                    <>
                        <h5>{selectedTask.title}</h5>
                        <p><strong>Description:</strong> {selectedTask.description}</p>
                        <p><strong>Assigned to:</strong> {selectedTask.assignedTo}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : '—'}</p>
                        <Button
                            label="Mark as Completed"
                            icon="pi pi-check"
                            className="mt-3"
                            disabled={selectedTask.status === 'COMPLETED'}
                            onClick={() => handleMarkComplete(selectedTask.id)}
                        />
                    </>
                )}
            </Dialog>
        </div>
    );
};

export default EmployeeTaskManager;
