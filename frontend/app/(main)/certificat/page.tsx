'use client';

import React, { useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import jsPDF from 'jspdf';

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
    position: string;
    department: string;
    startDate: string;
}

const mockEmployees: Employee[] = [
    {
        id: 1,
        firstName: 'Alice',
        lastName: 'Smith',
        position: 'Teacher',
        department: 'Mathematics',
        startDate: '2020-09-01',
    },
    {
        id: 2,
        firstName: 'Bob',
        lastName: 'Johnson',
        position: 'Administrative Assistant',
        department: 'HR',
        startDate: '2019-02-15',
    },
];

const documentTypes = [
    { label: 'Work Certificate', value: 'certificate' },
    { label: 'Leave Attestation', value: 'leave' },
];

const DocumentGenerator = () => {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    const generatePDF = () => {
        if (!selectedEmployee || !selectedDoc) return;

        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();

        doc.setFontSize(14);
        doc.text('ISIMM', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Date: ${today}`, 160, 30);

        doc.setFontSize(16);
        doc.text(selectedDoc === 'certificate' ? 'Work Certificate' : 'Leave Attestation', 105, 50, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`This is to certify that Mr./Ms. ${selectedEmployee.firstName} ${selectedEmployee.lastName},`, 20, 70);
        doc.text(`working as a ${selectedEmployee.position} in the ${selectedEmployee.department} department,`, 20, 80);
        doc.text(`has been employed with us since ${selectedEmployee.startDate}.`, 20, 90);

        if (selectedDoc === 'leave') {
            doc.text(`This attestation confirms the leave granted as per organizational policy.`, 20, 100);
        }

        doc.text('This document is issued upon request.', 20, 120);

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    return (
        <div className="card p-4">
            <h4>Document Generator</h4>
            <div className="p-fluid grid">
                <div className="col-12 md:col-4">
                    <label>Select Document Type</label>
                    <Dropdown value={selectedDoc} options={documentTypes} onChange={(e) => setSelectedDoc(e.value)} placeholder="Select Type" />
                </div>
                <div className="col-12 md:col-4">
                    <label>Select Employee</label>
                    <Dropdown
                        value={selectedEmployee}
                        options={mockEmployees}
                        onChange={(e) => setSelectedEmployee(e.value)}
                        optionLabel={(e) => `${e.firstName} ${e.lastName}`}
                        placeholder="Select Employee"
                    />
                </div>
                <div className="col-12 md:col-4 flex align-items-end">
                    <Button label="Generate & Preview PDF" icon="pi pi-eye" onClick={generatePDF} disabled={!selectedDoc || !selectedEmployee} />
                </div>
            </div>

            {pdfUrl && (
                <div className="mt-4">
                    <h5>PDF Preview</h5>
                    <iframe src={pdfUrl} width="100%" height="500px" style={{ border: '1px solid #ccc' }} />
                    <a href={pdfUrl} download={`document-${selectedEmployee?.lastName}.pdf`}>
                        <Button label="Download PDF" icon="pi pi-download" className="mt-2" />
                    </a>
                </div>
            )}
        </div>
    );
};

export default DocumentGenerator;
