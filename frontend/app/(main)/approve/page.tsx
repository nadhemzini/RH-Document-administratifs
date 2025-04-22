'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { Leave } from '@/types/Leave'; // Adjust this path if needed
const AdminLeaveApproval = () => {
    const toast = useRef<Toast>(null);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    // Simulate fetching leaves from the backend
    useEffect(() => {
        const fetchLeaves = async () => {
            // Mock data for testing, replace with an API call later
            const mockData: Leave[] = [
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    dateStart: new Date('2023-04-01'),
                    dateEnd: new Date('2023-04-05'),
                    reason: 'Vacation',
                    type: 'Paid Leave',
                    status: 'PENDING',
                },
                {
                    id: '2',
                    name: 'Jane Smith',
                    email: 'jane.smith@example.com',
                    dateStart: new Date('2023-05-01'),
                    dateEnd: new Date('2023-05-05'),
                    reason: 'Sick Leave',
                    type: 'Sick Leave',
                    status: 'PENDING',
                },
            ];
            setLeaves(mockData);
        };

        fetchLeaves();
    }, []);

    // Function to update the leave status to 'APPROVED' or 'REJECTED'
    const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        try {
            // Simulate a backend request to update the leave status
            // Replace this with an actual API call

            /* Backend API for status update (this is a comment showing how it would work)
            const response = await fetch(`http://localhost:3001/api/leaves/${id}/status`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status }),
            });

            if (response.ok) {
                // Update the local state with the new status
                const updatedLeave = await response.json();
                setLeaves((prevLeaves) =>
                    prevLeaves.map((leave) => (leave.id === updatedLeave.id ? updatedLeave : leave))
                );
                toast.current?.show({
                    severity: 'success',
                    summary: 'Status Updated',
                    detail: `Leave request has been ${status}`,
                    life: 3000,
                });
            } else {
                throw new Error('Failed to update status');
            }
            */

            // Mock success response
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) =>
                    leave.id === id ? { ...leave, status } : leave
                )
            );
            toast.current?.show({
                severity: 'success',
                summary: 'Status Updated',
                detail: `Leave request has been ${status}`,
                life: 3000,
            });
        } catch (error) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update leave status',
                life: 3000,
            });
            console.error(error);
        }
    };

    // Grid layout for DataView
    const dataviewGridItem = (leave: Leave) => (
        <div className="col-12 md:col-4 lg:col-3">
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-column align-items-center text-center mb-3">
                    <div className="text-xl font-bold">{leave.name}</div>
                    <div className="text-sm mb-1">{leave.email}</div>
                    <div><strong>Type:</strong> {leave.type}</div>
                    <div><strong>Reason:</strong> {leave.reason}</div>
                    <div className="text-sm mb-2">
                        {leave.dateStart ? new Date(leave.dateStart).toLocaleDateString() : 'N/A'} →
                        {leave.dateEnd ? new Date(leave.dateEnd).toLocaleDateString() : 'N/A'}
                    </div>
                    <span
                        className={`p-tag p-tag-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}`}
                    >
                        {leave.status}
                    </span>
                    <div className="mt-2">
                        <Button
                            label="Approve"
                            icon="pi pi-check"
                            onClick={() => leave.id && handleStatusChange(leave.id, 'APPROVED')}
                            disabled={leave.status !== 'PENDING'}
                            className="p-button-success mr-2"
                        />
                        <Button
                            label="Reject"
                            icon="pi pi-times"
                            onClick={() => leave.id && handleStatusChange(leave.id, 'REJECTED')}
                            disabled={leave.status !== 'PENDING'}
                            className="p-button-danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // Template for DataView component
    const itemTemplate = (leave: Leave, layout: 'grid' | 'list') => {
        return layout === 'list' ? (
            <div className="col-12">
                {/* Add your list view template here */}
                <div>{leave.name}</div>
            </div>
        ) : (
            dataviewGridItem(leave)
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Leave Approval</h5>
                    <Toast ref={toast} />
                    <DataView
                        value={leaves}
                        layout={layout}
                        paginator
                        rows={9}
                        itemTemplate={itemTemplate}
                    />
                </div>
            </div>
        </div>
    );
};

export default AdminLeaveApproval;
