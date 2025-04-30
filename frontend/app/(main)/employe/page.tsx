'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dropdown } from 'primereact/dropdown';
import employeeService from '../../../service/employeeService';
import { Employee } from '@/types/Employee';

const emptyEmployee: Employee = {
    id: 0,
    nom: '',
    prenom: '',
    email: '',
    cin: '',
    sexe: 'Homme',
    grade: '',
    departement: '',
    adresse: '',
    anciennete: 0,
    handicap: false,
    natureTravail: '',
};

export default function EmployeeCrud() {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
    const [employee, setEmployee] = useState<Employee>(emptyEmployee);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[] | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Employee[]>>(null);

    const sexeOptions = [
        { label: 'Homme', value: 'Homme' },
        { label: 'Femme', value: 'Femme' },
    ];

    const handicapOptions = [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
    ];

    const natureTravailOptions = [
        { label: 'Full-time', value: 'Full-time' },
        { label: 'Part-time', value: 'Part-time' },
    ];

    useEffect(() => {
        loadEmployees();
    }, []);

    const loadEmployees = async () => {
        try {
            const data = await employeeService.getAllEmployees();
            setEmployees(data);
        } catch (error) {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Failed to load employees' });
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

    const hideDeleteEmployeeDialog = () => setDeleteEmployeeDialog(false);
    const hideDeleteEmployeesDialog = () => setDeleteEmployeesDialog(false);

    const saveEmployee = async () => {
        setSubmitted(true);

        if (!employee.nom || !employee.email || !employee.grade) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing Fields',
                detail: 'Nom, Email and Grade are required',
            });
            return;
        }

        try {
            if (employee.id) {
                await employeeService.updateEmployee(employee.id, employee);
                toast.current?.show({ severity: 'success', summary: 'Updated', detail: 'Employee updated' });
            } else {
                await employeeService.createEmployee(employee);
                toast.current?.show({ severity: 'success', summary: 'Created', detail: 'Employee created' });
            }

            setEmployeeDialog(false);
            loadEmployees();
            setEmployee(emptyEmployee);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Operation failed' });
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

    const deleteEmployee = async () => {
        try {
            await employeeService.deleteEmployee(employee.id);
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Employee deleted' });
            setDeleteEmployeeDialog(false);
            loadEmployees();
            setEmployee(emptyEmployee);
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Delete failed' });
        }
    };

    const confirmDeleteSelected = () => setDeleteEmployeesDialog(true);

    const deleteSelectedEmployees = async () => {
        try {
            const ids = selectedEmployees?.map((e) => e.id) || [];
            await employeeService.deleteMultipleEmployees(ids);
            toast.current?.show({ severity: 'success', summary: 'Deleted', detail: 'Selected employees deleted' });
            setSelectedEmployees(null);
            setDeleteEmployeesDialog(false);
            loadEmployees();
        } catch {
            toast.current?.show({ severity: 'error', summary: 'Error', detail: 'Batch delete failed' });
        }
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: any, name: keyof Employee) => {
        const val = e.target?.value ?? e.value;
        setEmployee({ ...employee, [name]: val });
    };

    const actionBodyTemplate = (rowData: Employee) => (
        <>
            <Button icon="pi pi-pencil" rounded outlined className="mr-2" onClick={() => editEmployee(rowData)} />
            <Button icon="pi pi-trash" rounded outlined severity="danger" onClick={() => confirmDeleteEmployee(rowData)} />
        </>
    );

    return (
        <div className="card">
            <Toast ref={toast} />
            <h2>Employees</h2>

            <div className="flex justify-between items-center mb-4 gap-2">
                <div className="flex gap-2">
                    <Button label="New" icon="pi pi-plus" severity="success" onClick={openNew} />
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        severity="danger"
                        onClick={confirmDeleteSelected}
                        disabled={!selectedEmployees || selectedEmployees.length === 0}
                    />
                </div>
                <Button label="Export CSV" icon="pi pi-upload" onClick={exportCSV} />
            </div>

            <DataTable
                ref={dt}
                value={employees}
                selection={selectedEmployees}
                onSelectionChange={(e) => setSelectedEmployees(e.value as Employee[] | null)}
                dataKey="id"
                paginator rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                selectionMode="multiple"
                header="Manage Employees"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }} />
                <Column field="nom" header="Nom" sortable />
                <Column field="prenom" header="Prenom" sortable />
                <Column field="email" header="Email" sortable />
                <Column field="grade" header="Grade" sortable />
                <Column field="sexe" header="Sexe" sortable />
                <Column field="departement" header="Departement" sortable />
                <Column field="anciennete" header="Anciennete" sortable />
                <Column field="natureTravail" header="Nature de Travail" sortable />
                <Column body={actionBodyTemplate} headerStyle={{ width: '10rem' }} />
            </DataTable>

            {/* Dialog: Add/Edit */}
            <Dialog visible={employeeDialog} style={{ width: '500px' }} header="Employee Details" modal className="p-fluid" onHide={hideDialog}>
                {[
                    ['nom', 'Nom'],
                    ['prenom', 'Prenom'],
                    ['email', 'Email'],
                    ['grade', 'Grade'],
                    ['departement', 'Departement'],
                    ['adresse', 'Adresse'],
                ].map(([field, label]) => (
                    <div className="field" key={field}>
                        <label htmlFor={field}>{label}</label>
                        <InputText id={field} value={employee[field as keyof Employee] as string} onChange={(e) => onInputChange(e, field as keyof Employee)} />
                    </div>
                ))}
                <div className="field">
                    <label htmlFor="sexe">Sexe</label>
                    <Dropdown id="sexe" value={employee.sexe} options={sexeOptions} onChange={(e) => onInputChange(e, 'sexe')} />
                </div>
                <div className="field">
                    <label htmlFor="natureTravail">Nature de Travail</label>
                    <Dropdown id="natureTravail" value={employee.natureTravail} options={natureTravailOptions} onChange={(e) => onInputChange(e, 'natureTravail')} />
                </div>
                <div className="field">
                    <label htmlFor="handicap">Handicap</label>
                    <Dropdown id="handicap" value={employee.handicap} options={handicapOptions} onChange={(e) => onInputChange(e, 'handicap')} />
                </div>
                <div className="field">
                    <label htmlFor="anciennete">Anciennete</label>
                    <InputText id="anciennete" value={employee.anciennete.toString()} onChange={(e) => onInputChange(e, 'anciennete')} />
                </div>

                <div className="footer mt-4">
                    <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
                    <Button label="Save" icon="pi pi-check" onClick={saveEmployee} />
                </div>
            </Dialog>

            {/* Delete Dialogs */}
            <Dialog visible={deleteEmployeeDialog} style={{ width: '450px' }} header="Confirm" modal footer={
                <div>
                    <Button label="No" icon="pi pi-times" onClick={hideDeleteEmployeeDialog} className="p-button-text" />
                    <Button label="Yes" icon="pi pi-check" onClick={deleteEmployee} severity="danger" />
                </div>
            } onHide={hideDeleteEmployeeDialog}>
                <p>Are you sure you want to delete this employee?</p>
            </Dialog>

            <Dialog visible={deleteEmployeesDialog} style={{ width: '450px' }} header="Confirm" modal footer={
                <div>
                    <Button label="No" icon="pi pi-times" onClick={hideDeleteEmployeesDialog} className="p-button-text" />
                    <Button label="Yes" icon="pi pi-check" onClick={deleteSelectedEmployees} severity="danger" />
                </div>
            } onHide={hideDeleteEmployeesDialog}>
                <p>Are you sure you want to delete the selected employees?</p>
            </Dialog>
        </div>
    );
}
