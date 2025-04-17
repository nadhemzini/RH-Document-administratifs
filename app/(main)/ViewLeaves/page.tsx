'use client';

import React, { useState, useEffect } from 'react';
import { DataView, DataViewLayoutOptions } from 'primereact/dataview';
import { InputText } from 'primereact/inputtext';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';

interface Leave {
    name: string;
    email: string;
    dateStart: Date | null;
    dateEnd: Date | null;
    reason: string;
    type: string;
    status: 'PENDING' | 'APPROVED' | 'REJECTED';
}

const LeaveTracker = () => {
    const [dataViewValue, setDataViewValue] = useState<Leave[]>([]);
    const [filteredValue, setFilteredValue] = useState<Leave[] | null>(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [layout, setLayout] = useState<'grid' | 'list'>('grid'); // Default to grid layout
    const [sortKey, setSortKey] = useState<string | null>(null);
    const [sortOrder, setSortOrder] = useState<1 | -1 | null>(null);
    const [sortField, setSortField] = useState<string>('');
    const [solde, setSolde] = useState<number | null>(null); // State for solde

    const sortOptions = [
        { label: 'Date Start: Newest First', value: '!dateStart' },
        { label: 'Date Start: Oldest First', value: 'dateStart' },
    ];

    useEffect(() => {
        // Mock data for testing
        const mockData: Leave[] = [
            {
                name: 'nadhme zini',
                email: 'nadhem zini@gmail.coù',
                dateStart: new Date('2023-04-01'),
                dateEnd: new Date('2023-04-05'),
                reason: 'Vacation',
                type: 'Paid Leave',
                status: 'APPROVED',
            },
            {
                name: 'nader zini',
                email: 'naderzini@gmail.com',
                dateStart: new Date('2023-04-10'),
                dateEnd: new Date('2023-04-15'),
                reason: 'Medical Leave',
                type: 'Sick Leave',
                status: 'PENDING',
            },
            {
                name: 'lamine zini',
                email: 'laminezini@gmail.com',
                dateStart: new Date('2023-03-20'),
                dateEnd: new Date('2023-03-25'),
                reason: 'Family Emergency',
                type: 'Unpaid Leave',
                status: 'REJECTED',
            },
        ];
        setDataViewValue(mockData);

        // Fetch solde from backend (mocked here)
        const fetchSolde = async () => {
            try {
                // Replace with your backend API endpoint
                const response = await fetch('http://localhost:3001/api/solde');
                const data = await response.json();
                setSolde(data.solde); // Assuming the backend returns { solde: number }
            } catch (error) {
                console.error('Error fetching solde:', error);
            }
        };

        fetchSolde();
    }, []);

    const onFilter = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value.toLowerCase();
        setGlobalFilterValue(value);

        if (!value) {
            setFilteredValue(null);
            return;
        }

        const filtered = dataViewValue.filter((leave) =>
            leave.name.toLowerCase().includes(value) ||
            leave.reason.toLowerCase().includes(value) ||
            leave.email.toLowerCase().includes(value) ||
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
                    <div className="font-bold text-xl">{leave.name}</div>
                    <div className="text-sm text-gray-600 mb-1">{leave.email}</div>
                    <div className="mb-1"><strong>Type:</strong> {leave.type}</div>
                    <div className="mb-1"><strong>Reason:</strong> {leave.reason}</div>
                    <div className="mb-1 text-sm">
                        From: {leave.dateStart ? new Date(leave.dateStart).toLocaleDateString() : 'N/A'} →
                        To: {leave.dateEnd ? new Date(leave.dateEnd).toLocaleDateString() : 'N/A'}
                    </div>
                    <span className={`p-tag p-tag-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                        {leave.status}
                    </span>
                </div>
            </div>
        </div>
    );

    const dataviewGridItem = (leave: Leave) => (
        <div className="col-12 md:col-4 lg:col-3"> {/* Adjust column size for responsiveness */}
            <div className="card m-3 border-1 surface-border">
                <div className="flex flex-column align-items-center text-center mb-3">
                    <div className="text-xl font-bold">{leave.name}</div>
                    <div className="text-sm mb-1">{leave.email}</div>
                    <div className="mb-1"><strong>Type:</strong> {leave.type}</div>
                    <div className="mb-2"><strong>Reason:</strong> {leave.reason}</div>
                    <div className="text-sm mb-2">
                        {leave.dateStart ? new Date(leave.dateStart).toLocaleDateString() : 'N/A'} →
                        {leave.dateEnd ? new Date(leave.dateEnd).toLocaleDateString() : 'N/A'}
                    </div>
                    <span className={`p-tag p-tag-${leave.status === 'APPROVED' ? 'success' : leave.status === 'REJECTED' ? 'danger' : 'warning'}`}>
                        {leave.status}
                    </span>
                </div>
            </div>
        </div>
    );

    const itemTemplate = (leave: Leave, layout: 'grid' | 'list') => {
        if (!leave) return;
        return layout === 'list' ? dataviewListItem(leave) : dataviewGridItem(leave);
    };

    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    <h5>Leave Tracker</h5>
                    <p className="">This is your solde: <strong>{solde !== null ? `${solde} days` : 'Loading...'}</strong></p>
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