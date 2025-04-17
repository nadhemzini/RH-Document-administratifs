'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { User } from '../../../types/User';
import { Avatar } from 'primereact/avatar';


const emptyUser: User = {
    id: '',
    name: '',
    email: '',
    sexe: 'Homme',
    cin: '',
    role: 'employee',
    dob: '',
    address: '',
    phone: '',
};

export default function UserCrud() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState<User>(emptyUser);
    const [selectedUsers, setSelectedUsers] = useState<User[] | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'RH', value: 'RH' },
        { label: 'Employee', value: 'employee' },
    ];

    const sexeOptions = [
        { label: 'Homme', value: 'Homme' },
        { label: 'Femme', value: 'Femme' },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            const fakeData: User[] = [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    sexe: 'Homme',
                    cin: '12345678',
                    role: 'admin',
                    dob: '1990-01-01',
                    address: '123 Main St',
                    phone: '12345678',
                },
            ];
            setUsers(fakeData);
        };

        fetchUsers();
    }, []);

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    };

    const hideDeleteUserDialog = () => setDeleteUserDialog(false);

    const hideDeleteUsersDialog = () => setDeleteUsersDialog(false);

    const saveUser = () => {
        setSubmitted(true);

        if (
            !user.name.trim() ||
            !user.email.trim() ||
            !user.cin.trim() ||
            !user.phone.trim() ||
            !user.dob ||
            !user.address.trim() ||
            !user.sexe ||
            !user.role
        ) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'All fields are required.',
                life: 3000,
            });
            return;
        }

        if (!/^\d{8}$/.test(user.cin)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'CIN must be exactly 8 digits.',
                life: 3000,
            });
            return;
        }

        if (!/^\d{8}$/.test(user.phone)) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'Phone number must be exactly 8 digits.',
                life: 3000,
            });
            return;
        }

        let _users = [...(users || [])];
        if (user.id) {
            const index = _users.findIndex((u) => u.id === user.id);
            _users[index] = user;
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Updated',
                life: 3000,
            });
        } else {
            user.id = createId();
            _users.push(user);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'User Created',
                life: 3000,
            });
        }

        setUsers(_users);
        setUserDialog(false);
        setUser(emptyUser);
    };

    const editUser = (user: User) => {
        setUser({ ...user });
        setUserDialog(true);
    };

    const confirmDeleteUser = (user: User) => {
        setUser(user);
        setDeleteUserDialog(true);
    };

    const deleteUser = () => {
        let _users = users?.filter((val) => val.id !== user.id) || [];
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'User Deleted', life: 3000 });
    };

    const confirmDeleteSelected = () => setDeleteUsersDialog(true);

    const deleteSelectedUsers = () => {
        let _users = users?.filter((val) => !selectedUsers?.includes(val)) || [];
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUsers(null);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Users Deleted', life: 3000 });
    };

    const onInputChange = (e: any, name: keyof User) => {
        const val = name === 'dob' ? e.value.toISOString().split('T')[0] : e.target ? e.target.value : e.value;
        setUser({ ...user, [name]: val });
    };

    const createId = () => Math.random().toString(36).substr(2, 9);

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const actionBodyTemplate = (rowData: User) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
        </>
    );


    const avatarBodyTemplate = (rowData: User) => {
        return (
            <Avatar label={rowData.name?.charAt(0).toUpperCase()} shape="circle" className="mr-2" style={{ backgroundColor: '#2196F3', color: '#ffffff' }} />
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Users</h2>
            <div className="flex justify-between items-center mb-4">
                <div>
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} className="mr-2" />
                    <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={confirmDeleteSelected} disabled={!selectedUsers || !selectedUsers.length} className="mr-2" />
                    <Button label="Export CSV" icon="pi pi-upload" className="mr-2" onClick={exportCSV} />
                </div>
            </div>


            <DataTable
                ref={dt}
                value={users || []}
                selection={selectedUsers}
                onSelectionChange={(e) => setSelectedUsers(e.value as unknown as User[] | null)}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                selectionMode="multiple"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column header="Avatar" body={avatarBodyTemplate} />
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="sexe" header="Sexe" sortable />
                <Column field="cin" header="CIN" sortable />
                <Column field="role" header="Role" sortable />
                <Column field="dob" header="Date of Birth" sortable />
                <Column field="address" header="Address" sortable />
                <Column field="phone" header="Phone" sortable />
                <Column body={actionBodyTemplate} headerStyle={{ width: '10rem' }} />
            </DataTable>

            <Dialog visible={userDialog} style={{ width: '500px' }} header="User Details" modal className="p-fluid" onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={user.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required />
                </div>
                <div className="field">
                    <label htmlFor="sexe">Sexe</label>
                    <Dropdown id="sexe" value={user.sexe} options={sexeOptions} onChange={(e) => onInputChange(e, 'sexe')} placeholder="Select Sexe" />
                </div>
                <div className="field">
                    <label htmlFor="cin">CIN</label>
                    <InputText id="cin" value={user.cin} onChange={(e) => onInputChange(e, 'cin')} className={submitted && !/^\d{8}$/.test(user.cin) ? 'p-invalid' : ''} />
                    {submitted && !/^\d{8}$/.test(user.cin) && <small className="p-error">CIN must be 8 digits.</small>}
                </div>
                <div className="field">
                    <label htmlFor="role">Role</label>
                    <Dropdown id="role" value={user.role} options={roleOptions} onChange={(e) => onInputChange(e, 'role')} placeholder="Select Role" />
                </div>
                <div className="field">
                    <label htmlFor="dob">Date of Birth</label>
                    <Calendar id="dob" value={user.dob ? new Date(user.dob) : null} onChange={(e) => onInputChange(e, 'dob')} dateFormat="yy-mm-dd" placeholder="YYYY-MM-DD" showIcon />
                </div>
                <div className="field">
                    <label htmlFor="address">Address</label>
                    <InputText id="address" value={user.address} onChange={(e) => onInputChange(e, 'address')} />
                </div>
                <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <InputText id="phone" value={user.phone} onChange={(e) => onInputChange(e, 'phone')} className={submitted && !/^\d{8}$/.test(user.phone) ? 'p-invalid' : ''} />
                    {submitted && !/^\d{8}$/.test(user.phone) && <small className="p-error">Phone must be 8 digits.</small>}
                </div>

                <div className="flex justify-content-end mt-4">
                    <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} className="mr-2" />
                    <Button label="Save" icon="pi pi-check" onClick={saveUser} />
                </div>
            </Dialog>

            <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={
                <>
                    <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
                    <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
                </>
            } onHide={hideDeleteUserDialog}>
                <div className="confirmation-content">Are you sure you want to delete <b>{user.name}</b>?</div>
            </Dialog>

            <Dialog visible={deleteUsersDialog} style={{ width: '450px' }} header="Confirm" modal footer={
                <>
                    <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
                    <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
                </>
            } onHide={hideDeleteUsersDialog}>
                <div className="confirmation-content">Are you sure you want to delete the selected users?</div>
            </Dialog>
        </div>
    );
}
