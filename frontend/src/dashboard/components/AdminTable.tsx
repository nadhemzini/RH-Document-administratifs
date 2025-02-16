import * as React from 'react';
import { DataGrid, GridColDef, GridToolbar } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import UserModal from './UserModal';
import { Button } from '@mui/material';
import { formdata } from '../interfaces/formdata';

// Example data structure
const rows = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'RH' },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', role: 'Enseignant' },
];

export default function AdminTable() {
    const [data, setData] = React.useState(rows);
    const [open, setOpen] = React.useState(false);
    const [formData, setFormData] = React.useState({
        id: 0,
        name: '',
        email: '',
        password: '',
        role: '',
    });

    const handleOpen = (row = { id: 0, name: '', email: '', password: '', role: '' }) => {
        setFormData(row);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setFormData({ id: 0, name: '', email: '', password: '', role: '' });
    };

    const handleSubmit = (formData: formdata) => {
        if (!formData.name || !formData.email || !formData.role) {
            alert('Please fill in all required fields.');
            return;
        }

        if (formData.id) {
            // Update existing row
            setData(data.map((row) => (row.id === formData.id ? { ...row, ...formData } : row)));
        } else {
            // Add new row
            const newRow = { ...formData, id: (data.length + 1) };
            setData([...data, newRow]);
        }
        handleClose();
    };

    const handleDelete = (id: number) => {
        setData(data.filter((row) => row.id !== id));
    };

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 90 },
        { field: 'name', headerName: 'Name', width: 200 },
        { field: 'email', headerName: 'Email', width: 250 },
        { field: 'role', headerName: 'Role', width: 150 },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            renderCell: (params) => (
                <>
                    <IconButton color="primary" onClick={() => handleOpen(params.row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton color="error" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon />
                    </IconButton>
                </>
            ),
        },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <div style={{ position: 'relative', width: '100%', display: 'flex', justifyContent: 'flex-end' }}>

                <Button style={{ border: '2px solid', width: '20%' }} onClick={() => handleOpen()}>Add User</Button>
            </div>
            <DataGrid rows={data} columns={columns} slots={{ toolbar: GridToolbar }} pageSize={5} rowsPerPageOptions={[5]} />
            <UserModal open={open} handleClose={handleClose} formData={formData} handleSubmit={handleSubmit} />
        </div>
    );
}
