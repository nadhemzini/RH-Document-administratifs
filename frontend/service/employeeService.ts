import axios from '../app/axios'; // ✅ uses token-enabled axios instance
import { Employee } from '@/types/Employee';

const API_URL = '/user'; // base endpoint

// Get all employees
export const getAllEmployees = async () => {
    const res = await axios.get(`${API_URL}/getEmployees`);
    return res.data;
};

// Get employee by ID
export const getEmployeeById = async (id: string) => {
    const res = await axios.get(`${API_URL}/${id}`);
    return res.data;
};

// Create a new employee
export const createEmployee = async (employee: Employee) => {
    const payload = {
        ...employee,
        dateOfBirth: employee.dateOfBirth
            ? new Date(employee.dateOfBirth).toISOString().split('T')[0]
            : null,
        disability: Boolean(employee.disability),
    };

    console.log('🚀 Final payload:', JSON.stringify(payload, null, 2));

    const res = await axios.post(`${API_URL}/addUser`, payload);
    return res.data;
};

// Update an employee
export const updateEmployee = async (id: string, employee: Partial<Employee>) => {
    const res = await axios.put(`${API_URL}/updateEmployee/${id}`, employee);
    return res.data;
};

// Delete an employee
export const deleteEmployee = async (id: string) => {
    const res = await axios.delete(`${API_URL}/deleteUser/${id}`);
    return res.data;
};

// Delete multiple employees
export const deleteMultipleEmployees = async (ids: string[]) => {
    const res = await axios.post(`${API_URL}/deleteMultipleEmployees`, { ids });
    return res.data;
};
