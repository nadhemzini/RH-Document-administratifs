'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Task } from '../../../types/Task';
// import axios from 'axios';

const statusOptions = [
    { label: 'In Progress', value: 'IN_PROGRESS' },
    { label: 'Completed', value: 'COMPLETED' },
];

const AdminTaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([
        {
            id: 1,
            title: 'Setup project',
            description: 'Initialize repo and project structure',
            assignedTo: 'John',
            status: 'IN_PROGRESS',
            deadline: new Date('2025-04-30'),
        },
    ]);

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        deadline: null as Date | null,
    });

    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);

    const fetchTasks = async () => {
        // const res = await axios.get('/api/tasks');
        // setTasks(res.data);
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const handleCreateTask = async () => {
        const newId = tasks.length + 1;
        const task: Task = {
            id: newId,
            title: newTask.title,
            description: newTask.description,
            assignedTo: newTask.assignedTo,
            status: 'IN_PROGRESS',
            deadline: newTask.deadline ?? undefined,
        };

        // await axios.post('/api/tasks', task);

        setTasks([...tasks, task]);
        setNewTask({ title: '', description: '', assignedTo: '', deadline: null });
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
        <Button
            label="Details"
            icon="pi pi-eye"
            onClick={() => {
                setSelectedTask(task);
                setDialogVisible(true);
            }}
        />
    );

    const filteredTasks = filterStatus
        ? tasks.filter((t) => t.status === filterStatus)
        : tasks;

    return (
        <div className="card">
            <h4>Admin Task Manager</h4>

            <div className="grid mb-4">
                <div className="col-12 md:col-3">
                    <Dropdown
                        value={filterStatus}
                        options={statusOptions}
                        onChange={(e) => setFilterStatus(e.value)}
                        placeholder="Filter by Status"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-2">
                    <InputText
                        placeholder="Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-2">
                    <InputText
                        placeholder="Assigned To"
                        value={newTask.assignedTo}
                        onChange={(e) => setNewTask({ ...newTask, assignedTo: e.target.value })}
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-3">
                    <Calendar
                        value={newTask.deadline}
                        onChange={(e) => setNewTask({ ...newTask, deadline: e.value as Date })}
                        showIcon
                        placeholder="Deadline"
                        dateFormat="yy-mm-dd"
                        className="w-full"
                    />
                </div>

                <div className="col-12 md:col-2">
                    <Button label="Add Task" icon="pi pi-plus" onClick={handleCreateTask} />
                </div>
            </div>

            <DataTable value={filteredTasks} responsiveLayout="scroll">
                <Column field="title" header="Title" />
                <Column field="assignedTo" header="Assigned To" />
                <Column field="status" header="Status" body={statusBodyTemplate} />
                <Column field="deadline" header="Deadline" body={deadlineBodyTemplate} />
                <Column field="description" header="Description" />
                <Column header="Actions" body={actionBodyTemplate} />
            </DataTable>

            <Dialog header="Task Details" visible={dialogVisible} onHide={() => setDialogVisible(false)} modal>
                {selectedTask && (
                    <div>
                        <h5>{selectedTask.title}</h5>
                        <p><strong>Assigned to:</strong> {selectedTask.assignedTo}</p>
                        <p><strong>Status:</strong> {selectedTask.status}</p>
                        <p><strong>Description:</strong> {selectedTask.description}</p>
                        <p><strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : '—'}</p>
                    </div>
                )}
            </Dialog>
        </div>
    );
};

export default AdminTaskManager;
