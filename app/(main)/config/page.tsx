'use client';

import React, { useState } from 'react';
import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useRef } from 'react';

interface Settings {
    annualLeaveQuota: number;
    sickLeaveQuota: number;
    unpaidLeaveQuota: number;
    overtimeConversionRatio: number; // e.g., 1.5 = 1.5 hours off per 1 overtime hour
}

const SystemSettings = () => {
    const toast = useRef<Toast>(null);

    const [settings, setSettings] = useState<Settings>({
        annualLeaveQuota: 30,
        sickLeaveQuota: 15,
        unpaidLeaveQuota: 10,
        overtimeConversionRatio: 1.5,
    });

    const handleSave = () => {
        // Save logic (API call if needed)
        toast.current?.show({ severity: 'success', summary: 'Settings Saved', detail: 'Your changes have been saved successfully.', life: 3000 });
        // Send settings to backend here
    };

    return (
        <div className="card">
            <Toast ref={toast} />
            <h4>System Settings</h4>
            <div className="grid p-fluid">
                <div className="col-12 md:col-6">
                    <label htmlFor="annualLeaveQuota">Annual Leave Quota (days)</label>
                    <InputNumber id="annualLeaveQuota" value={settings.annualLeaveQuota} onValueChange={(e) => setSettings({ ...settings, annualLeaveQuota: e.value || 0 })} min={0} />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="sickLeaveQuota">Sick Leave Quota (days)</label>
                    <InputNumber id="sickLeaveQuota" value={settings.sickLeaveQuota} onValueChange={(e) => setSettings({ ...settings, sickLeaveQuota: e.value || 0 })} min={0} />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="unpaidLeaveQuota">Unpaid Leave Quota (days)</label>
                    <InputNumber id="unpaidLeaveQuota" value={settings.unpaidLeaveQuota} onValueChange={(e) => setSettings({ ...settings, unpaidLeaveQuota: e.value || 0 })} min={0} />
                </div>

                <div className="col-12 md:col-6">
                    <label htmlFor="overtimeConversionRatio">Overtime Conversion Ratio</label>
                    <InputNumber id="overtimeConversionRatio" value={settings.overtimeConversionRatio} onValueChange={(e) => setSettings({ ...settings, overtimeConversionRatio: e.value || 0 })} min={0} mode="decimal" step={0.1} />
                </div>

                <div className="col-12 mt-4">
                    <Button label="Save Settings" icon="pi pi-save" onClick={handleSave} />
                </div>
            </div>
        </div>
    );
};

export default SystemSettings;
