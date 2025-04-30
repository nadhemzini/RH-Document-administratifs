import axios from '../app/axios';
import { Employee } from '@/types/Employee';



const getAllEmployees = async (): Promise<Employee[]> => {
    const res = await axios.get('/employees');
    return res.data;
};

const createEmployee = async (employee: Employee): Promise<Employee> => {
    const res = await axios.post('/employees', employee);
    return res.data;
};

const updateEmployee = async (id: number, employee: Employee): Promise<Employee> => {
    const res = await axios.put(`/employees/${id}`, employee);
    return res.data;
};

const deleteEmployee = async (id: number): Promise<void> => {
    await axios.delete(`/employees/${id}`);
};

const deleteMultipleEmployees = async (ids: number[]): Promise<void> => {
    await axios.post('/employees/delete-multiple', { ids });
};

export default {
    getAllEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    deleteMultipleEmployees,
};
