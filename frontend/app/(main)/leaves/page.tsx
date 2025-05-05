'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputTextarea } from 'primereact/inputtextarea';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Leave } from '@/types/Leave'; // Adjust path if needed
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';

const Leaves = () => {
    const toast = useRef<Toast>(null);
    const [leave, setLeave] = useState<Leave>({
        requestedBy: '',
        startDate: null,
        endDate: null,
        reason: '',
        type: '',
    });

    const leaveTypeOptions = [
        { label: 'Annual Leave', value: 'ANNUAL' },
        { label: 'Sick Leave', value: 'SICK' },
        { label: 'Maternity Leave', value: 'MATERNITY' },
        { label: 'Unpaid Leave', value: 'UNPAID' },
    ];

    // Set user ID from localStorage
    useEffect(() => {
        const user = localStorage.getItem('user');
        if (user) {
            try {
                const parsed = JSON.parse(user);
                setLeave(prev => ({ ...prev, requestedBy: parsed._id }));
            } catch (err) {
                console.error('Error parsing user from localStorage', err);
            }
        }
    }, []);

    const handleChange = (field: keyof Leave, value: any) => {
        setLeave(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        const { requestedBy, startDate, endDate, reason, type } = leave;

        if (!requestedBy || !startDate || !endDate || !reason || !type) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation Error',
                detail: 'All fields are required.',
                life: 3000,
            });
            return;
        }

        if (endDate < startDate) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Date Error',
                detail: 'End date cannot be before start date.',
                life: 3000,
            });
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('http://localhost:5000/api/leave/requestLeave', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...leave,
                    startDate: startDate.toISOString(),
                    endDate: endDate.toISOString(),
                }),
            });

            if (response.ok) {

                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Leave submitted successfully.',
                    life: 3000,
                });
                setLeave({
                    requestedBy,
                    startDate: null,
                    endDate: null,
                    reason: '',
                    type: '',
                });
            } else {
                const errorData = await response.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Submission Failed',
                    detail: errorData.message || 'Server error occurred.',
                    life: 3000,
                });
            }
        } catch (error) {
            console.error('Submit error:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'An unexpected error occurred.',
                life: 3000,
            });
        }
    };

    return (
        <ProtectedPage>
            <div className="grid">
                <Toast ref={toast} />
                <div className="col-12">
                    <div className="card p-fluid">
                        <h5>Request Leave</h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="type">Leave Type</label>
                                <Dropdown
                                    id="type"
                                    value={leave.type}
                                    options={leaveTypeOptions}
                                    onChange={(e) => handleChange('type', e.value)}
                                    placeholder="Select a type"
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="startDate">Start Date</label>
                                <Calendar
                                    value={leave.startDate}
                                    onChange={(e) => handleChange('startDate', e.value ?? null)}
                                    showIcon
                                    showButtonBar
                                />
                            </div>
                            <div className="field col">
                                <label htmlFor="endDate">End Date</label>
                                <Calendar
                                    value={leave.endDate}
                                    onChange={(e) => handleChange('endDate', e.value ?? null)}
                                    showIcon
                                    showButtonBar
                                />
                            </div>
                        </div>
                        <div className="field">
                            <label htmlFor="reason">Reason</label>
                            <InputTextarea
                                id="reason"
                                value={leave.reason}
                                onChange={(e) => handleChange('reason', e.target.value)}
                                rows={5}
                                cols={30}
                                placeholder="Enter the reason for leave"
                            />
                        </div>
                        <Button label="Submit" onClick={handleSubmit} className="mt-3" />
                    </div>
                </div>
            </div>
        </ProtectedPage>
    );
};

export default Leaves;
