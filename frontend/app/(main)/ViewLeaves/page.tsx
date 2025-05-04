'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Leave } from '@/types/Leave';

const LeaveTracker = () => {
    const [dataViewValue, setDataViewValue] = useState<Leave[]>([]);
    const [filteredValue, setFilteredValue] = useState<Leave[] | null>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid');
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | null>(null);
    const [sortField, setSortField] = useState<string>('');
    const [solde, setSolde] = useState<number | null>(null);

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');

        if (!user || !user._id) {
            console.error('User not found in localStorage or missing _id');
            return;
        }

        setSolde(user.leaveBalance);

        const fetchLeaves = async () => {
            try {
                const token = localStorage.getItem('token'); // Retrieve the token from local storage
                if (!token) {
                    console.error('Token not found in localStorage');
                    return;
                }

                const response = await fetch(`http://localhost:5000/api/leave/employeeLeaves/${user._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`, // Add Bearer token to the Authorization header
                    },
                });

                const data = await response.json();
                if (response.ok) {
                    console.log('Fetched leaves:', data.leaves);
                    setDataViewValue(data.leaves);
                } else {
                    console.error('Failed to fetch leaves:', data.message);
                }
            } catch (error) {
                console.error('Error fetching leaves:', error);
            }
        };

        fetchLeaves();
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setGlobalFilterValue(value);

        if (!value) {
            setFilteredValue(null);
            return;
        }

        const filtered = dataViewValue.filter((leave) =>
            leave.reason.toLowerCase().includes(value) ||
            leave.type.toLowerCase().includes(value)
        );

        setFilteredValue(filtered);
    };

    const onSortChange = (event: DropdownChangeEvent) => {
        const value = event.value;
        if (value.startsWith('!')) {
            setSortOrder(-1);
            setSortField(value.substring(1));
        } else {
            setSortOrder(1);
            setSortField(value);
        }
        setSortKey(value);
    };

    const sortOptions = [
        { label: 'Date Start: Newest First', value: '.startDate' },
        { label: 'Date Start: Oldest First', value: '.startDate' },
    ];

    const dataViewHeader = (
        <div className="flex flex-column md:flex-row md:justify-content-between gap-2">
            <Dropdown value={sortKey} options={sortOptions} optionLabel="label" placeholder="Sort by Date" onChange={onSortChange} />
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText value={globalFilterValue} onChange={onFilter} placeholder="Search..." />
            </span>
            <DataViewLayoutOptions layout={layout} onChange={(e) => setLayout(e.value as 'grid' | 'list')} />
        </div>
    );

    const dataviewListItem = (leave: Leave) => (
        <div className="col-12">
            <div className="flex flex-column md:flex-row align-items-center p-3 w-full">
                <div className="flex-1 flex flex-column align-items-center text-center md:text-left">
                    <div className="mb-1"><strong>Type:</strong> {leave.type}</div>
                    <div className="mb-1"><strong>Reason:</strong> {leave.reason}</div>
                    <div className="mb-1 text-sm">
                        From: {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} → To: {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <span className={`p-tag p-tag-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                        {leave.status}
                    </span>
                </div>
            </div>
        </div>
    );

    const dataviewGridItem = (leave: Leave) => (
        <div className="col-12 md:col-4 lg:col-3">
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-column align-items-center text-center mb-3">

                    <div className="mb-1"><strong>Type:</strong> {leave.type}</div>
                    <div className="mb-2"><strong>Reason:</strong> {leave.reason}</div>
                    <div className="text-sm mb-2">
                        {leave.startDate ? new Date(leave.startDate).toLocaleDateString() : 'N/A'} → {leave.endDate ? new Date(leave.endDate).toLocaleDateString() : 'N/A'}
                    </div>
                    <span className={`p-tag p-tag-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                        {leave.status}
                    </span>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (leave: Leave, layout: 'grid' | 'list') => {
        if (!leave) return null;
        return layout === 'list' ? dataviewListItem(leave) : dataviewGridItem(leave);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Leave Tracker</h5>
                    <p>This is your solde: <strong>{solde !== null ? `${solde}` : 'Loading...'}</strong></p>
                    <DataView
                        value={filteredValue || dataViewValue}
                        layout={layout}
                        paginator
                        rows={9}
                        sortOrder={sortOrder}
                        sortField={sortField}
                        itemTemplate={itemTemplate}
                        header={dataViewHeader}
                    />
                </div>
            </div>
        </div>
    );
};

export default LeaveTracker;
