'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Task } from '@/types/Task';
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';

const AssignedTaskTracker = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [filteredTasks, setFilteredTasks] = useState<Task[] | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | null>(null);
    const [sortField, setSortField] = useState<string>('');

    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');

    const fetchTasks = async () => {
        if (!user._id || !token) {
            console.error('User ID or token not found in localStorage');
            return;
        }

        try {
            const res = await fetch(`http://localhost:5000/api/task/getTasks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const data = await res.json();
            setTasks(data.tasks || []);
        } catch (err) {
            console.error('Error fetching tasks:', err);
        }
    };

    const markAsComplete = async (taskId: string) => {
        try {
            const res = await fetch(`http://localhost:5000/api/task/markTaskAsComplete/${taskId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const result = await res.json();

            if (res.ok) {
                // ✅ update task locally instead of refetching
                setTasks(prevTasks =>
                    prevTasks.map(task =>
                        task._id === taskId ? { ...task, status: 'Completed' } : task
                    )
                );

                // Also update filtered tasks if they exist
                setFilteredTasks(prev =>
                    prev?.map(task =>
                        task._id === taskId ? { ...task, status: 'Completed' } : task
                    ) || null
                );
            } else {
                console.error(result.message || 'Failed to complete task');
            }
        } catch (err) {
            console.error('Error marking task as complete:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setGlobalFilter(value);

        if (!value) {
            setFilteredTasks(null);
            return;
        }

        const filtered = tasks.filter(
            (task) =>
                task.title.toLowerCase().includes(value) ||
                task.description.toLowerCase().includes(value)
        );
        setFilteredTasks(filtered);
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;
        if (value.startsWith('!')) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
        setSortKey(value);
    };

    const sortOptions = [
        { label: 'Deadline: Newest First', value: '!deadline' },
        { label: 'Deadline: Oldest First', value: 'deadline' },
    ];

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} onChange={onSortChange} placeholder="Sort by" />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilter} onChange={onFilter} placeholder="Search tasks..." />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as 'grid' | 'list')} />
        </div>
    );

    const renderStatus = (status: string) => (
        <span className={`p-tag p-tag-${status === 'Completed' ? 'success' : 'warning'}`}>
            {status === 'Completed' ? 'Completed' : 'Pending'}
        </span>
    );

    const renderDates = (task: Task) => (
        <div className="text-sm mb-2">
            {task.deadline ? `Deadline: ${new Date(task.deadline).toLocaleDateString()}` : 'No deadline'}
        </div>
    );

    const listItem = (task: Task) => (
        <div className="col-12">
            <div className="flex flex-column md:flex-row align-items-center p-3 w-full border-1 surface-border">
                <div className="flex-1">
                    <div className="mb-1"><strong>Title:</strong> {task.title}</div>
                    <div className="mb-1"><strong>Description:</strong> {task.description}</div>
                    {renderDates(task)}
                    {renderStatus(task.status!)}
                </div>
                <Button
                    label="Mark Complete"
                    icon="pi pi-check"
                    className="p-button-success ml-3"
                    onClick={() => markAsComplete(task._id)}
                    disabled={task.status === 'Completed'}
                />
            </div>
        </div>
    );

    const gridItem = (task: Task) => (
        <div className="col-12 md:col-4 lg:col-3">
            <div className="card m-2 text-center">
                <div className="mb-2"><strong>{task.title}</strong></div>
                <div className="mb-2">{task.description}</div>
                {renderDates(task)}
                {renderStatus(task.status!)}
                <Button
                    label="Complete"
                    icon="pi pi-check"
                    className="p-button-sm p-button-success mt-2"
                    onClick={() => markAsComplete(task._id)}
                    disabled={task.status === 'Completed'}
                />
            </div>
        </div>
    );

    const itemTemplate = (task: Task, layoutType: 'grid' | 'list') =>
        layoutType === 'list' ? listItem(task) : gridItem(task);

    return (
        <ProtectedPage>
            <div className="grid">
                <div className="col-12">
                    <div className="card">
                        <h5>My Assigned Tasks</h5>
                        <DataView
                            value={filteredTasks || tasks}
                            layout={layout}
                            paginator
                            rows={9}
                            sortOrder={sortOrder}
                            sortField={sortField}
                            itemTemplate={itemTemplate}
                            header={dataViewHeader}
                        />
                    </div>
                </div>
            </div>
        </ProtectedPage>
    );
};

export default AssignedTaskTracker;
