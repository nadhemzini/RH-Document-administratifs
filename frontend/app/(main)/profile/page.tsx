'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'admin' | 'RH';
}

interface Employee {
    _id: string;
    name: string;
    email: string;
    phone: string;
    gender: string;
    grade: string;
    department: string;
    address: string;
    disability: boolean;
    role: string;
    academicYear: string;
    dateOfBirth: Date | null;
}

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);
    const [employee, setEmployee] = useState<Employee | null>(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const parsed = JSON.parse(storedUser);
            if (parsed.role === 'admin' || parsed.role === 'RH') {
                setUser(parsed);
            } else {
                setEmployee(parsed);
            }
        }
    }, []);

    if (!user && !employee) return <p>Loading profile...</p>;

    return (
        <ProtectedPage>
            <div className="p-d-flex p-jc-center p-mt-5">
                <Card title="My Profile" className="w-full md:w-30rem">
                    {user && (
                        <>
                            <div className="p-d-flex p-ai-center p-flex-column">
                                <Avatar label={user.name.charAt(0)} size="xlarge" className="mb-3" />
                                <h3>{user.name}</h3>
                                <Tag value={user.role} severity="info" />
                            </div>

                            <Divider />

                            <div className="p-mb-2"><strong>Email:</strong> {user.email}</div>
                        </>
                    )}

                    {employee && (
                        <>
                            <div className="p-d-flex p-ai-center p-flex-column">
                                <Avatar label={employee.name.charAt(0)} size="xlarge" className="mb-3" />
                                <h3>{employee.name}</h3>
                                <Tag value={employee.role} severity="warning" />
                            </div>

                            <Divider />

                            <div className="p-mb-2"><strong>Email:</strong> {employee.email}</div>
                            <div className="p-mb-2"><strong>Phone:</strong> {employee.phone}</div>
                            <div className="p-mb-2"><strong>Gender:</strong> {employee.gender}</div>
                            <div className="p-mb-2"><strong>Grade:</strong> {employee.grade}</div>
                            <div className="p-mb-2"><strong>Department:</strong> {employee.department}</div>
                            <div className="p-mb-2"><strong>Address:</strong> {employee.address}</div>
                            <div className="p-mb-2"><strong>Disability:</strong> {employee.disability ? 'Yes' : 'No'}</div>
                            <div className="p-mb-2"><strong>Academic Year:</strong> {employee.academicYear}</div>
                            <div className="p-mb-2"><strong>Date of Birth:</strong> {employee.dateOfBirth ? new Date(employee.dateOfBirth).toLocaleDateString() : 'N/A'}</div>
                        </>
                    )}
                </Card>
            </div>
        </ProtectedPage>
    );
};

export default UserProfile;
