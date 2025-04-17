'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { Task } from '../../../types/Task'; // if you're using a shared type file
import axios from 'axios';

// Simulate logged-in employee
const userName = 'Alice';

const statusOptions = [
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
];

const EmployeeTaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
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
        await axios.put(`/api/tasks/${taskId}`, { status: 'COMPLETED' });
        fetchTasks();
        setDialogVisible(false);
    };

    const statusBodyTemplate = (task: Task) => (
        <span className={`p-tag p-tag-${task.status === 'COMPLETED' ? 'success' : 'warning'}`}>
            {task.status === 'COMPLETED' ? 'Completed' : 'In Progress'}
        </span>
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
                <Column field="title" header="Task Title" />
                <Column field="status" header="Status" body={statusBodyTemplate} />
                <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>

            <Dialog header="Task Details" visible={dialogVisible} onHide={() => setDialogVisible(false)} modal>
                {selectedTask && (
                    <>
                        <h5>{selectedTask.title}</h5>
                        <p>{selectedTask.description}</p>
                        <p><strong>Assigned to:</strong> {selectedTask.assignedTo}</p>
                        <Button
                            label="Mark as Completed"
                            icon="pi pi-check"
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
