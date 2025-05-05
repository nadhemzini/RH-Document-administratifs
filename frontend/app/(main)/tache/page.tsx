'use client';

import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';
import axios from 'axios';
import { Task } from '@/types/Task'; // Adjust the path if needed
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';

const AdminTaskManager = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [employees, setEmployees] = useState<{ label: string; value: string }[]>([]);
    const [employeeMap, setEmployeeMap] = useState<{ [key: string]: string }>({});
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        assignedTo: '',
        deadline: null as Date | null,
    });

    const [filterStatus, setFilterStatus] = useState<string | null>(null);
    const [selectedTask, setSelectedTask] = useState<Task | null>(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const toast = useRef<Toast>(null);

    const fetchEmployees = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/user/getEmployees', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const options = res.data.employees.map((emp: any) => ({
                label: emp.name,
                value: emp._id,
            }));
            const map: { [key: string]: string } = {};
            options.forEach((emp: { value: string | number; label: string; }) => (map[emp.value] = emp.label));
            setEmployees(options);
            setEmployeeMap(map);
        } catch (error) {
            console.error('Error fetching employees:', error);
        }
    };

    const fetchTasks = async () => {
        try {
            const res = await axios.get('http://localhost:5000/api/task/assignedTasks', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setTasks(res.data.tasks || res.data);
        } catch (error: any) {
            console.error('Error fetching tasks:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to fetch tasks',
            });
        }
    };

    const handleCreateTask = async () => {
        const { title, description, assignedTo, deadline } = newTask;
        if (!title || !description || !assignedTo || !deadline) {
            toast.current?.show({ severity: 'warn', summary: 'Missing Fields', detail: 'Please fill in all fields.' });
            return;
        }

        try {
            await axios.post(
                'http://localhost:5000/api/task/addTask',
                { title, description, assignedTo, deadline },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            toast.current?.show({ severity: 'success', summary: 'Task Created' });
            setNewTask({ title: '', description: '', assignedTo: '', deadline: null });
            await fetchTasks();
        } catch (error: any) {
            console.error('Error creating task:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Server error',
            });
        }
    };

    const handleDeleteTask = async (id: string) => {
        try {
            await axios.delete(`http://localhost:5000/api/task/deleteTask/${id}`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },
            });
            toast.current?.show({ severity: 'success', summary: 'Task Deleted' });
            await fetchTasks();
        } catch (error: any) {
            console.error('Error deleting task:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.response?.data?.message || 'Failed to delete task',
            });
        }
    };

    useEffect(() => {
        fetchEmployees();
        fetchTasks();
    }, []);

    const statusBodyTemplate = (task: Task) => (
        <span className={`p-tag p-tag-${task.status === 'Completed' ? 'success' : 'warning'}`}>
            {task.status === 'Completed' ? 'Completed' : 'In Progress'}
        </span>
    );

    const deadlineBodyTemplate = (task: Task) => (
        <span>{task.deadline ? new Date(task.deadline).toLocaleDateString() : '—'}</span>
    );

    const assignedToBodyTemplate = (task: Task) => (
        <span>{employeeMap[task.assignedTo] || task.assignedTo}</span>
    );

    const actionBodyTemplate = (task: Task) => (
        <div className="flex gap-2">
            <Button
                label="Details"
                icon="pi pi-eye"
                className="p-button-sm p-button-info"
                onClick={() => {
                    setSelectedTask(task);
                    setDialogVisible(true);
                }}
            />
            <Button
                label="Delete"
                icon="pi pi-trash"
                className="p-button-sm p-button-danger"
                onClick={() => handleDeleteTask(task._id)}
            />
        </div>
    );

    const filteredTasks = filterStatus ? tasks.filter((t) => t.status === filterStatus) : tasks;

    return (
        <ProtectedPage>
            <div className="card">
                <Toast ref={toast} />
                <h4>Admin Task Manager</h4>

                <div className="grid mb-4">
                    <div className="col-12 md:col-3">
                        <Dropdown
                            value={filterStatus}
                            options={[
                                { label: 'In Progress', value: 'IN_PROGRESS' },
                                { label: 'Completed', value: 'Completed' },
                            ]}
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

                    <div className="col-12 md:col-3">
                        <InputText
                            placeholder="Description"
                            value={newTask.description}
                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                            className="w-full"
                        />
                    </div>

                    <div className="col-12 md:col-2">
                        <Dropdown
                            value={newTask.assignedTo}
                            options={employees}
                            onChange={(e) => setNewTask({ ...newTask, assignedTo: e.value })}
                            placeholder="Assign to"
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
                    <Column header="Assigned To" body={assignedToBodyTemplate} />
                    <Column field="status" header="Status" body={statusBodyTemplate} />
                    <Column field="deadline" header="Deadline" body={deadlineBodyTemplate} />
                    <Column field="description" header="Description" />
                    <Column header="Actions" body={actionBodyTemplate} />
                </DataTable>

                <Dialog header="Task Details" visible={dialogVisible} onHide={() => setDialogVisible(false)} modal>
                    {selectedTask && (
                        <div>
                            <h5>{selectedTask.title}</h5>
                            <p><strong>Assigned to:</strong> {employeeMap[selectedTask.assignedTo] || selectedTask.assignedTo}</p>
                            <p><strong>Status:</strong> {selectedTask.status}</p>
                            <p><strong>Description:</strong> {selectedTask.description}</p>
                            <p><strong>Deadline:</strong> {selectedTask.deadline ? new Date(selectedTask.deadline).toLocaleDateString() : '—'}</p>
                        </div>
                    )}
                </Dialog>
            </div>
        </ProtectedPage>
    );
};

export default AdminTaskManager;
