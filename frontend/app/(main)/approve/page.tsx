'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { Leave } from '@/types/Leave';

const AdminLeaveApproval = () => {
    const toast = useRef<Toast>(null);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');

    useEffect(() => {
        const fetchLeaves = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                console.error('No token found in localStorage');
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/leave/allLeaves', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`);
                }

                const data = await response.json();
                setLeaves(data.leaves);
                console.log('Fetched leaves:', data.leaves);
            } catch (error) {
                console.error('Error fetching leaves:', error);
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to fetch leave data',
                    life: 3000,
                });
            }
        };

        fetchLeaves();
    }, []);

    const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.current?.show({
                severity: 'warn',
                summary: 'No Token',
                detail: 'Please login again',
                life: 3000,
            });
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/api/leave/approveLeave/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status }),
            });
            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            const updatedLeave = await response.json();
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) => (leave._id === updatedLeave._id ? updatedLeave : leave))
            );

            toast.current?.show({
                severity: 'success',
                summary: 'Status Updated',
                detail: `Leave request ${status.toLowerCase()}`,
                life: 3000,
            });
        } catch (error) {
            console.error('Error updating status:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to update leave status',
                life: 3000,
            });
        }
    };

    const dataviewGridItem = (leave: Leave) => (
        <div className="col-12 md:col-4 lg:col-3">
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-column align-items-center text-center mb-3">

                    <div><strong>Type:</strong> {leave.type}</div>
                    <div><strong>Reason:</strong> {leave.reason}</div>
                    <div className="text-sm mb-2">
                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} →
                        {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <span className={`p-tag p-tag-${leave.status === 'Approved' ? 'success' : leave.status === 'Rejected' ? 'danger' : 'warning'}`}>
                        {leave.status}
                    </span>
                    <div className="mt-2">
                        <Button
                            label="Approve"
                            icon="pi pi-check"
                            onClick={() => leave._id && handleStatusChange(leave._id, 'APPROVED')}
                            disabled={leave.status !== 'Pending'}
                            className="p-button-success mr-2"
                        />
                        <Button
                            label="Reject"
                            icon="pi pi-times"
                            onClick={() => leave._id && handleStatusChange(leave._id, 'REJECTED')}
                            disabled={leave.status !== 'Pending'}
                            className="p-button-danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (leave: Leave, layout: 'grid' | 'list') => {
        return layout === 'list' ? (
            <div className="col-12">aa</div> // You can improve list view here
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
