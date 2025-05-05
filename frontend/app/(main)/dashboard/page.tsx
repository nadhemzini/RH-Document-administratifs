'use client';

import React, { useEffect, useState } from 'react';
import { Chart } from 'primereact/chart';
import { Button } from 'primereact/button';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';
import { getAllUsers } from '../../../service/userService';
import { getAllEmployees } from '../../../service/employeeService';
import { getAllLeaves } from '../../../service/leaveService';

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

type Employee = {
    name: string;
    department: string;
    role: string;
    grade?: string;
};

const HRDashboard = () => {
    const [totalEmployees, setTotalEmployees] = useState(0);
    const [totalAdmins, setTotalAdmins] = useState(0);
    const [totalLeaves, setTotalLeaves] = useState(0);
    const [totalAbsences, setTotalAbsences] = useState(0);
    const [users, setUsers] = useState<User[]>([]);
    const [employees, setEmployees] = useState<Employee[]>([]);

    const [absenceChart, setAbsenceChart] = useState({});
    const [roleChart, setRoleChart] = useState({});
    const [genderChart, setGenderChart] = useState({});
    const [gradeChart, setGradeChart] = useState({});
    const [employeeChart, setEmployeeChart] = useState({});

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const [usersData, employeesData, leavesData] = await Promise.all([
                getAllUsers(),
                getAllEmployees(),
                getAllLeaves()
            ]);

            const userList = usersData.users || [];
            const employeeList = employeesData.employees || [];
            const leaveList = leavesData.leaves || [];

            setUsers(userList);
            setEmployees(employeeList);

            setTotalEmployees(employeeList.length);
            setTotalAdmins(userList.filter((u: User) => u.role === 'admin').length);
            setTotalLeaves(leaveList.length);
            setTotalAbsences(leaveList.filter((l: any) => l.type === 'Maladie').length);

            buildUserCharts(userList);
            buildEmployeeChart(employeeList);
        } catch (err) {
            console.error('Error fetching dashboard data:', err);
        }
    };

    const buildUserCharts = (users: User[]) => {
        // Role distribution
        const roleCounts = users.reduce((acc: any, user) => {
            acc[user.role] = (acc[user.role] || 0) + 1;
            return acc;
        }, {});
        setRoleChart({
            labels: Object.keys(roleCounts),
            datasets: [{
                data: Object.values(roleCounts),
                backgroundColor: ['#42A5F5', '#66BB6A', '#FFA726']
            }]
        });

        // Gender distribution
        const male = users.filter(u => u.gender === 'Male').length;
        const female = users.filter(u => u.gender === 'Female').length;
        setGenderChart({
            labels: ['Male', 'Female'],
            datasets: [{
                data: [male, female],
                backgroundColor: ['#42A5F5', '#EC407A', '#9C27B0']
            }]
        });

        // Grade distribution
        const gradeCounts = users.reduce((acc: any, user) => {
            acc[user.grade] = (acc[user.grade] || 0) + 1;
            return acc;
        }, {});
        setGradeChart({
            labels: Object.keys(gradeCounts),
            datasets: [{
                label: 'Employees by Grade',
                data: Object.values(gradeCounts),
                backgroundColor: '#66BB6A'
            }]
        });

        // Dummy absence trend (can be replaced by real data later)
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May'];
        const dummyCounts = [2, 5, 3, 4, 6];
        setAbsenceChart({
            labels: months,
            datasets: [{
                label: 'Absences',
                data: dummyCounts,
                fill: false,
                borderColor: '#ff6b6b',
                tension: 0.4
            }]
        });
    };

    const buildEmployeeChart = (employees: Employee[]) => {
        const roleCounts = employees.reduce((acc: any, emp) => {
            acc[emp.role] = (acc[emp.role] || 0) + 1;
            return acc;
        }, {});
        setEmployeeChart({
            labels: Object.keys(roleCounts),
            datasets: [{
                label: 'Employees per Role',
                data: Object.values(roleCounts),
                backgroundColor: ['#42A5F5', '#FFA726']
            }]
        });
    };

    const handleExportPDF = () => {
        const doc = new jsPDF();
        doc.text('HR Report', 14, 20);
        autoTable(doc, {
            head: [['Name', 'Email', 'Gender', 'Role', 'Grade']],
            body: users.map(u => [u.name, u.email, u.gender, u.role, u.grade])
        });
        doc.save('hr-report.pdf');
    };

    return (
        <ProtectedPage>
            <div className="p-4">
                {/* KPI Cards */}
                <div className="grid mb-4">
                    <Card title="Total Employees" icon="pi pi-users" value={totalEmployees} />
                    <Card title="Total Admins" icon="pi pi-user" value={totalAdmins} />
                    <Card title="Total Leaves" icon="pi pi-calendar-plus" value={totalLeaves} />
                    <Card title="Total Maladie" icon="pi pi-calendar-times" value={totalAbsences} />
                </div>

                {/* Charts Section 1 */}
                <div className="grid mb-4">
                    <div className="col-12 md:col-6">
                        <div className="card h-full">
                            <h5 className="mb-3">Absence Overview</h5>
                            <Chart type="line" data={absenceChart} style={{ height: '300px' }} />
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="card h-full">
                            <h5 className="mb-3">Role Distribution (Users)</h5>
                            <Chart type="pie" data={roleChart} style={{ height: '300px' }} />
                        </div>
                    </div>
                </div>

                {/* Charts Section 2 */}
                <div className="grid mb-4">
                    <div className="col-12 md:col-6">
                        <div className="card h-full">
                            <h5 className="mb-3">Gender Distribution</h5>
                            <Chart type="pie" data={genderChart} style={{ height: '300px' }} />
                        </div>
                    </div>
                    <div className="col-12 md:col-6">
                        <div className="card h-full">
                            <h5 className="mb-3">Grade Distribution</h5>
                            <Chart type="bar" data={gradeChart} style={{ height: '300px' }} />
                        </div>
                    </div>
                </div>

                {/* Employees Chart */}
                <div className="grid mb-4">
                    <div className="col-12">
                        <div className="card">
                            <h5 className="mb-3">Employees per Role</h5>
                            <Chart type="bar" data={employeeChart} style={{ height: '350px' }} />
                        </div>
                    </div>
                </div>

                {/* Export Button */}
                <div className="flex justify-content-end">
                    <Button
                        label="Export HR Report as PDF"
                        icon="pi pi-file-pdf"
                        className="p-button-danger"
                        onClick={handleExportPDF}
                    />
                </div>
            </div>
        </ProtectedPage>
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
