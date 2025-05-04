'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Checkbox } from 'primereact/checkbox';
import { getAllEmployees, createEmployee, updateEmployee, deleteEmployee } from '../../../service/employeeService';

import { Employee } from '@/types/Employee';

const emptyEmployee: Employee = {
    _id: '',
    name: '',
    email: '',
    phone: '',
    gender: '',
    grade: '',
    department: '',
    address: '',
    disability: false,
    role: 'employee',
    academicYear: '',
    dateOfBirth: null,
};

export default function EmployeeCrud() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [employee, setEmployee] = useState<Employee>(emptyEmployee);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[] | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const roles = [
        { label: 'Employee', value: 'employee' },
        { label: 'Enseignant', value: 'enseignant' },
    ];

    const departments = [
        { label: 'Administrative', value: 'Administrative' },
        { label: 'Math', value: 'Math' },
        { label: 'Informatics', value: 'Informatics' },
        { label: 'Technology', value: 'Technology' },
    ];

    const genders = [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
    ];

    useEffect(() => {
        fetchEmployees();
    }, []);

    const fetchEmployees = async () => {
        try {
            const data = await getAllEmployees();
            console.log('Fetched employees:', data);
            setEmployees(data.employees);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Could not fetch employees', life: 3000 });
        }
    };

    const openNew = () => {
        setEmployee(emptyEmployee);
        setSubmitted(false);
        setEmployeeDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setEmployeeDialog(false);
    };

    const hideDeleteDialog = () => setDeleteEmployeeDialog(false);

    const saveEmployee = async () => {
        setSubmitted(true);
        if (!employee.name || !employee.email || !employee.role) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'Name, Email, and Role are required.',
                life: 3000,
            });
            return;
        }

        try {
            if (employee._id) {
                await updateEmployee(employee._id, employee);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Employee Updated', life: 3000 });
            } else {
                console.log('Creating employee:', employee);
                await createEmployee(employee);
                toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Employee Created', life: 3000 });
            }
            fetchEmployees();
            setEmployeeDialog(false);
            setEmployee(emptyEmployee);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Save failed', life: 3000 });
        }
    };

    const editEmployee = (emp: Employee) => {
        setEmployee({ ...emp });
        setEmployeeDialog(true);
    };

    const confirmDeleteEmployee = (emp: Employee) => {
        setEmployee(emp);
        setDeleteEmployeeDialog(true);
    };

    const deleteSelectedEmployee = async () => {
        try {
            if (employee._id) {
                console.log('Deleting employee:', employee._id);
                await deleteEmployee(employee._id);
            } else {
                toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Employee ID is missing', life: 3000 });
            }
            toast.current?.show({ severity: 'success', summary: 'Success', detail: 'Employee Deleted', life: 3000 });
            fetchEmployees();
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Deletion failed', life: 3000 });
        }
        setDeleteEmployeeDialog(false);
    };

    const exportCSV = () => dt.current?.exportCSV();

    const onInputChange = (e: any, name: keyof Employee) => {
        const val = e.target?.value ?? e.value;
        setEmployee({ ...employee, [name]: val });
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Employees</h2>

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                </div>
                <Button label="Export CSV" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </div>

            <DataTable
                ref={dt}
                value={employees}
                selection={selectedEmployees}
                onSelectionChange={(e) => setSelectedEmployees(e.value)}
                dataKey="_id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                selectionMode="multiple"
                header="Manage Employees"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="name" header="Name" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="phone" header="Phone" />
                <Column field="gender" header="Gender" />
                <Column field="grade" header="Grade" />
                <Column field="address" header="Address" />
                <Column field="department" header="Department" />
                <Column field="disability" header="Disability" body={(row) => row.disability ? 'Yes' : 'No'} />
                <Column field="role" header="Role" />
                <Column field="academicYear" header="Academic Year" />
                <Column field="dateOfBirth" header="Birth Date" body={(row) => row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : ''} />
                <Column
                    body={(rowData) => (
                        <>
                            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEmployee(rowData)} />
                            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteEmployee(rowData)} />
                        </>
                    )}
                />
            </DataTable>

            <Dialog visible={employeeDialog} style={{ width: '500px' }} header="Employee Details" modal className="p-fluid" onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="name">Name</label>
                    <InputText id="name" value={employee.name} onChange={(e) => onInputChange(e, 'name')} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={employee.email} onChange={(e) => onInputChange(e, 'email')} required />
                </div>
                <div className="field">
                    <label htmlFor="phone">Phone</label>
                    <InputText id="phone" value={employee.phone} onChange={(e) => onInputChange(e, 'phone')} />
                </div>
                <div className="field">
                    <label htmlFor="address">Address</label>
                    <InputText id="address" value={employee.address} onChange={(e) => onInputChange(e, 'address')} />
                </div>
                <div className="field">
                    <label htmlFor="gender">Gender</label>
                    <Dropdown id="gender" value={employee.gender} options={genders} onChange={(e) => onInputChange(e, 'gender')} placeholder="Select Gender" />
                </div>
                <div className="field">
                    <label htmlFor="grade">Grade</label>
                    <InputText id="grade" value={employee.grade} onChange={(e) => onInputChange(e, 'grade')} />
                </div>
                <div className="field">
                    <label htmlFor="department">Department</label>
                    <Dropdown id="department" value={employee.department} options={departments} onChange={(e) => onInputChange(e, 'department')} placeholder="Select Department" />
                </div>
                <div className="field">
                    <label htmlFor="disability">Disability</label>
                    <Checkbox inputId="disability" checked={employee.disability} onChange={(e) => setEmployee({ ...employee, disability: e.checked ?? false })} />
                </div>
                <div className="field">
                    <label htmlFor="role">Role</label>
                    <Dropdown id="role" value={employee.role} options={roles} onChange={(e) => onInputChange(e, 'role')} placeholder="Select Role" />
                </div>
                <div className="field">
                    <label htmlFor="academicYear">Academic Year</label>
                    <InputText id="academicYear" value={employee.academicYear} onChange={(e) => onInputChange(e, 'academicYear')} />
                </div>
                <div className="field">
                    <label htmlFor="dateOfBirth">Date of Birth</label>
                    <Calendar id="dateOfBirth" value={employee.dateOfBirth ? new Date(employee.dateOfBirth) : null} onChange={(e) => onInputChange(e, 'dateOfBirth')} showIcon dateFormat="yy-mm-dd" />
                </div>

                <div className="flex justify-content-end mt-4">
                    <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} className="mr-2" />
                    <Button label="Save" icon="pi pi-check" onClick={saveEmployee} />
                </div>
            </Dialog>

            <Dialog
                visible={deleteEmployeeDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <>
                        <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteDialog} />
                        <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedEmployee} />
                    </>
                }
                onHide={hideDeleteDialog}
            >
                <div className="confirmation-content">Are you sure you want to delete <b>{employee.name}</b>?</div>
            </Dialog>
        </div>
    );
}
