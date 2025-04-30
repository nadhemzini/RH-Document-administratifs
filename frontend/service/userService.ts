import axios from '../app/axios'; // ✅ uses token-enabled axios instance
import { User } from '@/types/User'; // Adjust this path if needed

const API_URL = '/user'; // base endpoint


// Get all users
export const getAllUsers = async () => {
    const res = await axios.get(API_URL);
    return res.data;
};

// Get user by ID
export const getUserById = async (id: number) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Create a new user
export const createUser = async (user: User) => {
    const res = await axios.post(`${API_URL}/addUser`, user);
    return res.data;
};

// Update user
export const updateUser = async (id: number, user: Partial<User>) => {
    const res = await axios.put(`${API_URL}/${id}`, user);
    return res.data;
};

// Delete user
export const deleteUser = async (id: number) => {
    const res = await axios.delete(`${API_URL}/${id}`);
    return res.data;
};
