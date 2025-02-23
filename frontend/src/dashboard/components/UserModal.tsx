import React from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Select,
    SelectChangeEvent,
} from '@mui/material';

interface UserModalProps {
    open: boolean;
    handleClose: () => void;
    formData: {
        id?: number;
        name: string;
        email: string;
        password: string
        role: string;
    };
    handleSubmit: (form: { id?: number; name: string; email: string; password: string; role: string }) => void;
}

export default function UserModal({ open, handleClose, formData, handleSubmit }: UserModalProps) {
    const [form, setForm] = React.useState(formData);

    React.useEffect(() => {
        setForm(formData);
    }, [formData]);

    const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: { target: { name: any; value: any; }; }) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        handleSubmit(form);
    };

    return (
        <Dialog open={open} onClose={handleClose}>
            <DialogTitle>{form.id ? 'Edit User' : 'Add User'}</DialogTitle>
            <form onSubmit={onSubmit}>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Name"
                        type="text"
                        fullWidth
                        value={form.name}
                        onChange={handleInputChange}
                        required
                        style={{ marginBottom: 20 }}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={form.email}
                        onChange={handleInputChange}
                        required
                        style={{ marginBottom: 20 }}
                    />

                    <Select
                        margin="dense"
                        name="role"
                        value={form.role}
                        onChange={handleSelectChange}
                        fullWidth
                        required
                        displayEmpty
                    >
                        <MenuItem value="" disabled>
                            Select Role
                        </MenuItem>
                        <MenuItem value="Admin">Admin</MenuItem>
                        <MenuItem value="RH">RH</MenuItem>
                        <MenuItem value="Enseignant">Enseignant</MenuItem>
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button type="submit" color="primary">
                        {form.id ? 'Save Changes' : 'Add User'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
}
