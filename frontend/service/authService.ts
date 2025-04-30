import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export const login = async (email: string, password: string) => {
    const res = await axios.post(`${API_URL}/auth/login`, { email, password });
    return res.data;
    // should return { user, token }
};

export const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
};
