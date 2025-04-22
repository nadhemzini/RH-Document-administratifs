'use client';

import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Avatar } from 'primereact/avatar';
import { Divider } from 'primereact/divider';
import { Tag } from 'primereact/tag';
import { User } from '../../../types/User'; // Adjust the import path as necessary

const UserProfile = () => {
    const [user, setUser] = useState<User | null>(null);

    // useEffect(() => {
    //     // Fetch current user data from your API
    //     fetch('/api/me', {
    //         method: 'GET',
    //         credentials: 'include',
    //     })
    //         .then(res => res.json())
    //         .then(data => setUser(data))
    //         .catch(err => console.error(err));
    // }, []);

    useEffect(() => {
        // Mock API response
        const mockUser: User = {
            name: 'nadhemzini',
            email: 'nadhemzini@gmail.com',
            phone: '12345678',
            cin: '12345678',
            sexe: 'Homme',
            dob: '1990-01-01',
            address: '123 Main Street, City, Country',
            role: 'admin',
            id: '1'
        };

        // Simulate API call
        setTimeout(() => {
            setUser(mockUser);
        }, 1000); // Simulate a 1-second delay
    }, []);
    if (!user) return <p>Loading profile...</p>;

    return (
        <div className="p-d-flex p-jc-center p-mt-5">
            <Card title="My Profile" className="w-full md:w-30rem">
                <div className="p-d-flex p-ai-center p-flex-column">
                    <Avatar label={user.name.charAt(0)} size="xlarge" className="mb-3" />
                    <h3>{user.name}</h3>
                    <Tag value={user.role} severity="info" />
                </div>

                <Divider />

                <div className="p-mb-2"><strong>Email:</strong> {user.email}</div>
                <div className="p-mb-2"><strong>Phone:</strong> {user.phone}</div>
                <div className="p-mb-2"><strong>CIN:</strong> {user.cin}</div>
                <div className="p-mb-2"><strong>Gender:</strong> {user.sexe}</div>
                <div className="p-mb-2"><strong>Date of Birth:</strong> {user.dob}</div>
                <div className="p-mb-2"><strong>Address:</strong> {user.address}</div>
            </Card>
        </div>
    );
};

export default UserProfile;
