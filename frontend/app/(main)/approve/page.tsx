'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataView } from 'primereact/dataview';
import { Leave } from '@/types/Leave';
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';

const AdminLeaveApproval = () => {
    const toast = useRef<Toast>(null);
    const [leaves, setLeaves] = useState<Leave[]>([]);
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [processingIds, setProcessingIds] = useState<string[]>([]); // Track currently updating leaves

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

    const handleStatusChange = async (id: string, status: 'Approved' | 'Rejected') => {
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

        setProcessingIds((prev) => [...prev, id]); // disable buttons immediately

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

            // update the leave status locally
            setLeaves((prevLeaves) =>
                prevLeaves.map((leave) =>
                    leave._id === id
                        ? { ...leave, status: status === 'Approved' ? 'Approved' : 'Rejected' }
                        : leave
                )
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
        } finally {
            setProcessingIds((prev) => prev.filter((itemId) => itemId !== id));
        }
    };

    const dataviewGridItem = (leave: Leave) => (
        <div className="col-12 md:col-4 lg:col-3">
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-column align-items-center text-center mb-3">
                    <div><strong>Type:</strong> {leave.type}</div>
                    <div><strong>Reason:</strong> {leave.reason}</div>
                    <div className="text-sm mb-2">
                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} →{' '}
                        {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <span
                        className={`p-tag p-tag-${leave.status === 'Approved'
                            ? 'success'
                            : leave.status === 'Rejected'
                                ? 'danger'
                                : 'warning'
                            }`}
                    >
                        {leave.status}
                    </span>
                    <div className="mt-2">
                        <Button
                            label="Approve"
                            icon="pi pi-check"
                            onClick={() =>
                                leave._id && handleStatusChange(leave._id, 'Approved')
                            }
                            disabled={
                                leave.status?.toLowerCase() !== 'pending' ||
                                processingIds.includes(leave._id!)
                            }
                            className="p-button-success mr-2"
                        />
                        <Button
                            label="Reject"
                            icon="pi pi-times"
                            onClick={() =>
                                leave._id && handleStatusChange(leave._id, 'Rejected')
                            }
                            disabled={
                                leave.status?.toLowerCase() !== 'pending' ||
                                processingIds.includes(leave._id!)
                            }
                            className="p-button-danger"
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (leave: Leave, layout: 'grid' | 'list') => {
        return layout === 'list' ? (
            <div className="col-12">List view not implemented</div>
        ) : (
            dataviewGridItem(leave)
        );
    };

    return (
        <ProtectedPage>


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
        </ProtectedPage>
    );
};

export default AdminLeaveApproval;
