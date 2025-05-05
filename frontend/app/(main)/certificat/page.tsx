'use client';

import React, { useState, useEffect } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import jsPDF from 'jspdf';
import { getAllEmployees } from '@/service/employeeService';

import { Employee } from '@/types/Employee';
import ProtectedPage from '@/app/(full-page)/components/ProtectedPage';
const documentTypes = [
    { label: 'Work Certificate', value: 'certificate' },
    { label: 'Leave Attestation', value: 'leave' },
];

const DocumentGenerator = () => {
    const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
    const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const data = await getAllEmployees();
                setEmployees(data.employees);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };
        fetchEmployees();
    }, []);

    const generatePDF = () => {
        if (!selectedEmployee || !selectedDoc) return;

        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();

        doc.setFontSize(14);
        doc.text('ISIMM', 105, 20, { align: 'center' });

        doc.setFontSize(12);
        doc.text(`Date: ${today}`, 160, 30);

        doc.setFontSize(16);
        doc.text(
            selectedDoc === 'certificate' ? 'Work Certificate' : 'Leave Attestation',
            105,
            50,
            { align: 'center' }
        );

        doc.setFontSize(12);
        doc.text(`This is to certify that Mr./Ms. ${selectedEmployee.name}`, 20, 70);
        doc.text(`working as a ${selectedEmployee.grade} in the ${selectedEmployee.department} department,`, 20, 80);
        doc.text(`has been employed with us since ${selectedEmployee.academicYear}.`, 20, 90);

        if (selectedDoc === 'leave') {
            doc.text(`This attestation confirms the leave granted as per organizational policy.`, 20, 100);
        }

        doc.text('This document is issued upon request.', 20, 120);

        const blob = doc.output('blob');
        const url = URL.createObjectURL(blob);
        setPdfUrl(url);
    };

    return (
        <ProtectedPage>
            <div className="card p-4">
                <h4>Document Generator</h4>
                <div className="p-fluid grid">
                    <div className="col-12 md:col-4">
                        <label>Select Document Type</label>
                        <Dropdown
                            value={selectedDoc}
                            options={documentTypes}
                            onChange={(e) => setSelectedDoc(e.value)}
                            placeholder="Select Type"
                        />
                    </div>
                    <div className="col-12 md:col-4">
                        <label>Select Employee</label>
                        <Dropdown
                            value={selectedEmployee}
                            options={employees}
                            onChange={(e) => setSelectedEmployee(e.value)}
                            optionLabel="firstName"

                            placeholder="Select Employee"
                            itemTemplate={(emp: Employee) => (
                                <div>
                                    {emp.name}
                                </div>
                            )}
                        />
                    </div>
                    <div className="col-12 md:col-4 flex align-items-end">
                        <Button
                            label="Generate & Preview PDF"
                            icon="pi pi-eye"
                            onClick={generatePDF}
                            disabled={!selectedDoc || !selectedEmployee}
                        />
                    </div>
                </div>

                {pdfUrl && (
                    <div className="mt-4">
                        <h5>PDF Preview</h5>
                        <iframe src={pdfUrl} width="100%" height="500px" style={{ border: '1px solid #ccc' }} />
                        <a href={pdfUrl} download={`document-${selectedEmployee?.name}-${selectedEmployee?.role}.pdf`}>
                            <Button label="Download PDF" icon="pi pi-download" className="mt-2" />
                        </a>
                    </div>
                )}
            </div>
        </ProtectedPage>
    );
};

export default DocumentGenerator;
