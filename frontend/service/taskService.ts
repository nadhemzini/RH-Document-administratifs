import { Task } from '@/types/Task';

const API_URL = 'http://localhost:5000/api/task';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    };
};

export const getAllTasks = async (): Promise<Task[]> => {
    const res = await fetch(`${API_URL}`, {
        method: 'GET',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to fetch tasks');
    return await res.json();
};

export const createTask = async (task: Omit<Task, 'id'>): Promise<Task> => {
    const res = await fetch(`${API_URL}/add`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(task),
    });
    if (!res.ok) throw new Error('Failed to create task');
    return await res.json();
};

export const updateTask = async (id: string, updatedTask: Partial<Task>): Promise<Task> => {
    const res = await fetch(`${API_URL}/update/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updatedTask),
    });
    if (!res.ok) throw new Error('Failed to update task');
    return await res.json();
};

export const deleteTask = async (id: string): Promise<void> => {
    const res = await fetch(`${API_URL}/delete/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error('Failed to delete task');
};
