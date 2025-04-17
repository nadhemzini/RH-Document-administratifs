'use client';

import React, { useRef, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

interface Leave {
    name: string;
    email: string;
    dateStart: Date | null;
    dateEnd: Date | null;
    reason: string;
    type?: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    solde?: number;
}

const Leaves = () => {
    const [leave, setLeave] = useState<Leave>({
        name: '',
        email: '',
        dateStart: null,
        dateEnd: null,
        reason: '',
    });

    const toast = useRef<Toast>(null);

    const handleChange = (field: keyof Leave, value: string | Date | null) => {
        setLeave({ ...leave, [field]: value });
    };

    const handleSubmit = async () => {
        // Check if all fields are filled
        if (!leave.name || !leave.email || !leave.dateStart || !leave.dateEnd || !leave.reason) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation Failed',
                detail: 'Please fill all fields.',
                life: 3000,
            });
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(leave.email)) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation Failed',
                detail: 'Please enter a valid email address.',
                life: 3000,
            });
            return;
        }

        // Check if Date End is before Date Start
        if (leave.dateEnd < leave.dateStart) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Validation Failed',
                detail: 'End date cannot be before start date.',
                life: 3000,
            });
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/leaves', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...leave,
                    dateStart: leave.dateStart.toISOString(),
                    dateEnd: leave.dateEnd.toISOString(),
                }),
            });

            if (response.ok) {
                toast.current?.show({
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Leave submitted successfully!',
                    life: 3000,
                });
                setLeave({ name: '', email: '', dateStart: null, dateEnd: null, reason: '' });
            } else {
                const data = await response.json();
                toast.current?.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: `Error: ${data.message}`,
                    life: 3000,
                });
            }
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while submitting.',
                life: 3000,
            });
            console.error(err);
        }
    };

    return (
        <div className="grid">
            <Toast ref={toast} />
            <div className="col-12">
                <div className="card p-fluid">
                    <h5>Add Leave</h5>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={leave.name} onChange={(e) => handleChange('name', e.target.value)} />
                        </div>
                        <div className="field col">
                            <label htmlFor="email">Email</label>
                            <InputText id="email" value={leave.email} onChange={(e) => handleChange('email', e.target.value)} />
                        </div>
                    </div>
                    <div className="formgrid grid">
                        <div className="field col">
                            <label>Date start</label>
                            <Calendar
                                value={leave.dateStart}
                                onChange={(e) => handleChange('dateStart', e.value ?? null)}
                                showIcon
                                showButtonBar
                            />
                        </div>
                        <div className="field col">
                            <label>Date end</label>
                            <Calendar
                                value={leave.dateEnd}
                                onChange={(e) => handleChange('dateEnd', e.value ?? null)}
                                showIcon
                                showButtonBar
                            />
                        </div>
                    </div>
                    <h5>Reasons</h5>
                    <InputTextarea
                        placeholder="Your Message"
                        rows={5}
                        cols={30}
                        value={leave.reason}
                        onChange={(e) => handleChange('reason', e.target.value)}
                    />
                    <Button label="Submit" onClick={handleSubmit} className="mt-3" />
                </div>
            </div>
        </div>
    );
};

export default Leaves;