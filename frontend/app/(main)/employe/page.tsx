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
import { Employee } from '@/types/Employee';  // Assuming your Employee interface is in the correct path

const emptyEmployee: Employee = {
    id: 0,
    nom: '',
    cin: '',
    email: '',
    prenom: '',
    sexe: 'Homme',
    grade: '',
    departement: '',
    adresse: '',
    anciennete: 0,
    handicap: false,
    natureTravail: '',
};

export default function EmployeeCrud() {
    const [employees, setEmployees] = useState<Employee[] | null>(null);
    const [employeeDialog, setEmployeeDialog] = useState(false);
    const [deleteEmployeeDialog, setDeleteEmployeeDialog] = useState(false);
    const [deleteEmployeesDialog, setDeleteEmployeesDialog] = useState(false);
    const [employee, setEmployee] = useState<Employee>(emptyEmployee);
    const [selectedEmployees, setSelectedEmployees] = useState<Employee[] | null>(null);
    const [submitted, setSubmitted] = useState(false);

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

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
        const fetchEmployees = async () => {
            const fakeData: Employee[] = [
                { id: 1, nom: 'John', cin: '123456', email: 'john@example.com', prenom: 'Doe', sexe: 'Homme', grade: 'A', departement: 'HR', adresse: '123 Main St', anciennete: 5, handicap: false, natureTravail: 'Full-time' },
                { id: 2, nom: 'Jane', cin: '654321', email: 'jane@example.com', prenom: 'Smith', sexe: 'Femme', grade: 'B', departement: 'Finance', adresse: '456 Oak St', anciennete: 3, handicap: true, natureTravail: 'Part-time' },
            ];
            setEmployees(fakeData);
        };

        fetchEmployees();
    }, []);

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

    const saveEmployee = () => {
        setSubmitted(true);
        if (!employee.nom.trim() || !employee.email.trim() || !employee.grade) {
            toast.current?.show({
                severity: 'error',
                summary: 'Validation Failed',
                detail: 'All fields are required.',
                life: 3000,
            });
            return;
        }

        let _employees = [...(employees || [])];
        if (employee.id) {
            const index = _employees.findIndex((e) => e.id === employee.id);
            _employees[index] = employee;
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employee Updated',
                life: 3000,
            });
        } else {
            employee.id = createId();
            _employees.push(employee);
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Employee Created',
                life: 3000,
            });
        }

        setEmployees(_employees);
        setEmployeeDialog(false);
        setEmployee(emptyEmployee);
    };

    const editEmployee = (employee: Employee) => {
        setEmployee({ ...employee });
        setEmployeeDialog(true);
    };

    const confirmDeleteEmployee = (employee: Employee) => {
        setEmployee(employee);
        setDeleteEmployeeDialog(true);
    };

    const deleteEmployee = () => {
        let _employees = employees?.filter((val) => val.id !== employee.id) || [];
        setEmployees(_employees);
        setDeleteEmployeeDialog(false);
        setEmployee(emptyEmployee);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Employee Deleted', life: 3000 });
    };

    const confirmDeleteSelected = () => {
        setDeleteEmployeesDialog(true);
    };

    const deleteSelectedEmployees = () => {
        let _employees = employees?.filter((val) => !selectedEmployees?.includes(val)) || [];
        setEmployees(_employees);
        setSelectedEmployees(null);
        setDeleteEmployeesDialog(false);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Selected Employees Deleted',
            life: 3000,
        });
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const onInputChange = (e: any, name: keyof Employee) => {
        const val = e.target ? e.target.value : e.value;
        setEmployee({ ...employee, [name]: val });
    };

    const createId = () => Math.floor(Math.random() * 1000000);

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
                <Button
                    label="Export CSV"
                    icon="pi pi-upload"
                    className="p-button-help"
                    onClick={exportCSV}
                />
            </div>

            <DataTable
                ref={dt}
                value={employees || []}
                selection={selectedEmployees}
                onSelectionChange={(e) => setSelectedEmployees(e.value as Employee[])}
                dataKey="id"
                paginator
                rows={10}
                rowsPerPageOptions={[5, 10, 25]}
                selectionMode="multiple"
                header="Manage Employees"
            >
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
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

            {/* Dialog: Add/Edit Employee */}
            <Dialog visible={employeeDialog} style={{ width: '500px' }} header="Employee Details" modal className="p-fluid" onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="nom">Nom</label>
                    <InputText id="nom" value={employee.nom} onChange={(e) => onInputChange(e, 'nom')} required autoFocus />
                </div>
                <div className="field">
                    <label htmlFor="prenom">Prenom</label>
                    <InputText id="prenom" value={employee.prenom} onChange={(e) => onInputChange(e, 'prenom')} required />
                </div>
                <div className="field">
                    <label htmlFor="email">Email</label>
                    <InputText id="email" value={employee.email} onChange={(e) => onInputChange(e, 'email')} required />
                </div>
                <div className="field">
                    <label htmlFor="sexe">Sexe</label>
                    <Dropdown id="sexe" value={employee.sexe} options={sexeOptions} onChange={(e) => onInputChange(e, 'sexe')} placeholder="Select Sexe" />
                </div>
                <div className="field">
                    <label htmlFor="grade">Grade</label>
                    <InputText id="grade" value={employee.grade} onChange={(e) => onInputChange(e, 'grade')} required />
                </div>
                <div className="field">
                    <label htmlFor="departement">Departement</label>
                    <InputText id="departement" value={employee.departement} onChange={(e) => onInputChange(e, 'departement')} />
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
                <div className="field">
                    <label htmlFor="adresse">Adresse</label>
                    <InputText id="adresse" value={employee.adresse} onChange={(e) => onInputChange(e, 'adresse')} />
                </div>

                <div className="footer">
                    <Button label="Cancel" icon="pi pi-times" onClick={hideDialog} className="p-button-text" />
                    <Button label="Save" icon="pi pi-check" onClick={saveEmployee} />
                </div>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                visible={deleteEmployeeDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={hideDeleteEmployeeDialog} className="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" onClick={deleteEmployee} severity="danger" />
                    </div>
                }
                onHide={hideDeleteEmployeeDialog}
            >
                <div>Are you sure you want to delete this employee?</div>
            </Dialog>

            {/* Delete Selected Employees Confirmation */}
            <Dialog
                visible={deleteEmployeesDialog}
                style={{ width: '450px' }}
                header="Confirm"
                modal
                footer={
                    <div>
                        <Button label="No" icon="pi pi-times" onClick={hideDeleteEmployeesDialog} className="p-button-text" />
                        <Button label="Yes" icon="pi pi-check" onClick={deleteSelectedEmployees} severity="danger" />
                    </div>
                }
                onHide={hideDeleteEmployeesDialog}
            >
                <>Are you sure you want to delete the selected employees?</>
            </Dialog>
        </div>
    );
}
