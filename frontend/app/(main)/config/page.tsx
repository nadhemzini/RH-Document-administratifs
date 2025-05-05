'use client';

import React, { useRef, useState, useEffect } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const SystemSettings = () => {
    const toast = useRef<Toast>(null);
    const [value, setGlobalvalue] = useState<number>(30); // Default value

    useEffect(() => {
        const fetchGlobalQuota = async () => {
            try {
                const res = await fetch('http://localhost:5000/api/leave/getQuota', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                if (!res.ok) throw new Error('Failed to fetch global quota');

                const data = await res.json();
                console.log('Fetched global quota:', data.quota);
                setGlobalvalue(data.quota);
            } catch (err) {
                console.error('Failed to fetch global quota:', err);
            }
        };

        fetchGlobalQuota();
    }, []);

    const handleSave = async () => {
        try {
            const res = await fetch('http://localhost:5000/api/leave/quota', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                },

                body: JSON.stringify({ value }),
            });

            if (!res.ok) throw new Error('Failed to save');

            toast.current?.show({
                severity: 'success',
                summary: 'Saved',
                detail: 'Global leave quota updated!',
                life: 3000,
            });
        } catch (err) {
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Could not save global quota',
                life: 3000,
            });
            console.error(err);
        }
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h4>Global Leave Quota</h4>
            <div className="field">
                <label htmlFor="globalQuota">Leave Quota (days)</label>
                <InputNumber
                    id="globalQuota"
                    value={value}
                    onValueChange={(e) => setGlobalvalue(e.value || 0)}
                    min={0}
                />
            </div>
            <Button label="Save Quota" icon="pi pi-save" className="mt-3" onClick={handleSave} />
        </div>
    );
};

export default SystemSettings;
