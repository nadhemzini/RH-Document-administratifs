'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Avatar } from 'primereact/avatar';
import { User } from '@/types/User';

const emptyUser: User = {
    id: '',
    name: '',
    email: '',
    role: 'enseignant',
};

export default function UserCrud() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
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
        { label: 'Enseignant', value: 'enseignant' },
    ];

    useEffect(() => {
        const fetchUsers = async () => {
            const fakeData: User[] = [
                { id: '1', name: 'John Doe', email: 'john@example.com', role: 'admin' },
                { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'enseignant' },
            ];
            setUsers(fakeData);
            setOnlineUsers(['1']);
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
        if (!user.name.trim() || !user.email.trim() || !user.role) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'All fields are required.',
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

    const confirmDeleteSelected = () => {
        setDeleteUsersDialog(true);
    };

    const deleteSelectedUsers = () => {
        let _users = users?.filter((val) => !selectedUsers?.includes(val)) || [];
        setUsers(_users);
        setSelectedUsers(null);
        setDeleteUsersDialog(false);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Users Deleted',
            life: 3000,
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: any, name: keyof User) => {
        const val = e.target ? e.target.value : e.value;
        setUser({ ...user, [name]: val });
    };

    const createId = () => Math.random().toString(36).substr(2, 9);

    const actionBodyTemplate = (rowData: User) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editUser(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteUser(rowData)} />
        </>
    );

    const avatarNameTemplate = (rowData: User) => (
        <div className="flex align-items-center">
            <Avatar
                label={rowData.name.charAt(0).toUpperCase()}
                shape="circle"
                className="mr-2"
                style={{ backgroundColor: '#2196F3', color: '#ffffff' }}
            />
            <span>{rowData.name}</span>
        </div>
    );

    const statusTemplate = (rowData: User) => {
        const isOnline = onlineUsers.includes(rowData.id);
        return (
            <span className={`px-2 py-1 rounded text-white text-sm ${isOnline ? 'bg-green-500' : 'bg-gray-400'}`}>
                {isOnline ? 'Online' : 'Offline'}
            </span>
        );
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Users</h2>

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedUsers || selectedUsers.length === 0}
                    />
                </div>
                <Button
                    label="Export CSV"
                    icon="pi pi-upload"
                    className="p-button-help"
                    onClick={exportCSV}
                />
            </div>

            <DataTable
                ref={dt}
                value={users || []}
                selection={selectedUsers}
                onSelectionChange={(e) => setSelectedUsers(e.value as User[])}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                selectionMode="multiple"
                header="Manage Users"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column header="User" body={avatarNameTemplate} />
                <Column field="email" header="Email" sortable />
                <Column field="role" header="Role" sortable />
                <Column header="Status" body={statusTemplate} />
                <Column body={actionBodyTemplate} headerStyle={{ width: '10rem' }} />
            </DataTable>

            {/* Dialog: Add/Edit User */}
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
                    <label htmlFor="role">Role</label>
                    <Dropdown id="role" value={user.role} options={roleOptions} onChange={(e) => onInputChange(e, 'role')} placeholder="Select Role" />
                </div>
                <div className="flex justify-content-end mt-4">
                    <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} className="mr-2" />
                    <Button label="Save" icon="pi pi-check" onClick={saveUser} />
                </div>
            </Dialog>

            {/* Dialog: Confirm Single Deletion */}
            <Dialog
                visible={deleteUserDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <>
                        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUserDialog} />
                        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteUser} />
                    </>
                }
                onHide={hideDeleteUserDialog}
            >
                <div className="confirmation-content">
                    Are you sure you want to delete <b>{user.name}</b>?
                </div>
            </Dialog>

            {/* Dialog: Confirm Multiple Deletions */}
            <Dialog
                visible={deleteUsersDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <>
                        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteUsersDialog} />
                        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedUsers} />
                    </>
                }
                onHide={hideDeleteUsersDialog}
            >
                <div className="confirmation-content">
                    Are you sure you want to delete the selected users?
                </div>
            </Dialog>
        </div>
    );
}
