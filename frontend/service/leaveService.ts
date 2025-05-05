import axios from '../app/axios'; // 
import { Leave } from '@/types/Leave'; // Adjust the path to your Leave interface if needed

const API_URL = '/leave'; // change if your backend uses a different path

// Get all leaves /leave/allLeaves
export const getAllLeaves = async () => {
    const res = await axios.get(`${API_URL}/allLeaves`);
    return res.data;
};

// Get leave by ID
export const getLeaveById = async (id: number) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Create a new leave request
export const createLeave = async (leave: Leave) => {
    const res = await axios.post(`${API_URL}/addLeave`, leave);
    return res.data;
};

// Update leave
export const updateLeave = async (id: number, leave: Partial<Leave>) => {
    const res = await axios.put(`${API_URL}/updateLeave/${id}`, leave);
    return res.data;
};

// Delete leave
export const deleteLeave = async (id: number) => {
    const res = await axios.delete(`${API_URL}/deleteLeave/${id}`);
    return res.data;
};
