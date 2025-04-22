// Dashboard.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Dropdown } from 'primereact/dropdown';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import axios from 'axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

// Attach autoTable to jsPDF instance
// Extend jsPDF type to include autoTable
declare module 'jspdf' {
    interface jsPDF {
        autoTable: typeof autoTable;
    }
}

jsPDF.prototype.autoTable = autoTable;

type User = {
    name: string;
    email: string;
    role: string;
    gender: string;
    grade: string;
};

const HRDashboard = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(0);
    const [totalAbsences, setTotalAbsences] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [filters, setFilters] = useState({ gender: '', grade: '', role: '' });

    // Charts data
    const [absenceChart, setAbsenceChart] = useState({});
    const [roleChart, setRoleChart] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    useEffect(() => {
        applyFilters();
    }, [filters, users]);

    const fetchDashboardData = async () => {
        try {
            const [statsRes, usersRes, absRes] = await Promise.all([
                axios.get('/api/stats/summary'),
                axios.get('/api/users'),
                axios.get('/api/stats/absence-by-month')
            ]);

            setTotalEmployees(statsRes.data.totalEmployees);
            setTotalAdmins(statsRes.data.totalAdmins);
            setTotalLeaves(statsRes.data.totalLeaves);
            setTotalAbsences(statsRes.data.totalAbsences);
            setUsers(usersRes.data);

            buildCharts(usersRes.data, absRes.data);
        } catch (err) {
            console.error('Failed to fetch dashboard data', err);
        }
    };

    const buildCharts = (users: User[], absData: any) => {
        const roles = users.reduce((acc: any, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});

        setRoleChart({
            labels: Object.keys(roles),
            datasets: [
                {
                    data: Object.values(roles),
                    backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
                }
            ]
        });

        setAbsenceChart({
            labels: absData.months,
            datasets: [
                {
                    label: 'Absences',
                    data: absData.counts,
                    fill: false,
                    borderColor: '#ff6b6b',
                    tension: 0.4
                }
            ]
        });
    };

    const applyFilters = () => {
        let data = [...users];
        if (filters.gender) data = data.filter(u => u.gender === filters.gender);
        if (filters.grade) data = data.filter(u => u.grade === filters.grade);
        if (filters.role) data = data.filter(u => u.role === filters.role);
        setFilteredUsers(data);
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('HR Report', 14, 20);
        autoTable(doc, {
            head: [['Name', 'Email', 'Gender', 'Role', 'Grade']],
            body: filteredUsers.map(u => [u.name, u.email, u.gender, u.role, u.grade])
        });
        doc.save('hr-report.pdf');
    };

    return (
        <div className="grid p-4">
            {/* KPI Cards */}
            <div className="grid">
                <Card title="Total Employees" icon="pi pi-users" value={totalEmployees} />
                <Card title="Total Admins" icon="pi pi-user" value={totalAdmins} />
                <Card title="Total Leaves" icon="pi pi-calendar-plus" value={totalLeaves} />
                <Card title="Total Absences" icon="pi pi-calendar-times" value={totalAbsences} />
            </div>

            {/* Charts */}
            <div className="grid mt-4">
                <div className="col-12 md:col-6">
                    <div className="card">
                        <h5>Absence Overview</h5>
                        <Chart type="line" data={absenceChart} />
                    </div>
                </div>
                <div className="col-12 md:col-6">
                    <div className="card">
                        <h5>User Role Distribution</h5>
                        <Chart type="pie" data={roleChart} />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="card mt-4">
                <h5>Filter Users</h5>
                <div className="flex gap-4 mb-3">
                    <Dropdown value={filters.gender} options={['Homme', 'Femme']} placeholder="Select Gender" onChange={e => setFilters({ ...filters, gender: e.value })} />
                    <Dropdown value={filters.role} options={['admin', 'employee', 'RH']} placeholder="Select Role" onChange={e => setFilters({ ...filters, role: e.value })} />
                    <Dropdown value={filters.grade} options={['A1', 'A2', 'B1']} placeholder="Select Grade" onChange={e => setFilters({ ...filters, grade: e.value })} />
                </div>

                {/* Data Table */}
                <DataTable value={filteredUsers} paginator rows={5}>
                    <Column field="name" header="Name" />
                    <Column field="email" header="Email" />
                    <Column field="gender" header="Gender" />
                    <Column field="role" header="Role" />
                    <Column field="grade" header="Grade" />
                </DataTable>

                {/* PDF Button */}
                <div className="mt-3">
                    <Button icon="pi pi-file-pdf" label="Export PDF" onClick={handleExportPDF} />
                </div>
            </div>
        </div>
    );
};

const Card = ({ title, icon, value }: { title: string; icon: string; value: number }) => (
    <div className="col-12 lg:col-6 xl:col-3">
        <div className="card mb-0">
            <div className="flex justify-content-between mb-3">
                <div>
                    <span className="block text-500 font-medium mb-3">{title}</span>
                    <div className="text-900 font-medium text-xl">{value}</div>
                </div>
                <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                    <i className={`pi ${icon} text-blue-500 text-xl`} />
                </div>
            </div>
        </div>
    </div>
);

export default HRDashboard;
