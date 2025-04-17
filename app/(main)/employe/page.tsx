'use client';

import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { FilterMatchMode } from 'primereact/api';

interface Employee {
    id: number;
    nom: string;
    prenom: string;
    sexe: string;
    grade: string;
    departement: string;
    adresse: string;
    anciennete: number;
    handicap: boolean;
    natureTravail: string;
}

const GestionEmployes = () => {
    const [employes, setEmployes] = useState<Employee[]>([]);
    const [filters, setFilters] = useState({});
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const grades = ['Assistant', 'Maitre assistant', 'Professeur', 'Technicien'];
    const sexes = ['Homme', 'Femme'];
    const typesTravail = ['Temps plein', 'Temps partiel', 'Vacataire'];

    useEffect(() => {
        // Exemple de données simulées
        setEmployes([
            {
                id: 1,
                nom: 'Zini',
                prenom: 'Nadhem',
                sexe: 'Homme',
                grade: 'Maitre assistant',
                departement: 'Informatique',
                adresse: 'Tunis',
                anciennete: 5,
                handicap: false,
                natureTravail: 'Temps plein'
            },
            {
                id: 2,
                nom: 'Ben Ali',
                prenom: 'Sarra',
                sexe: 'Femme',
                grade: 'Professeur',
                departement: 'Maths',
                adresse: 'Sfax',
                anciennete: 10,
                handicap: true,
                natureTravail: 'Temps partiel'
            }
        ]);
        initFilters();
    }, []);

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            sexe: { value: null, matchMode: FilterMatchMode.EQUALS },
            grade: { value: null, matchMode: FilterMatchMode.EQUALS },
            natureTravail: { value: null, matchMode: FilterMatchMode.EQUALS },
            anciennete: { value: null, matchMode: FilterMatchMode.GREATER_THAN_OR_EQUAL_TO }
        });
    };

    const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        setFilters((prev: any) => ({ ...prev, global: { value, matchMode: FilterMatchMode.CONTAINS } }));
    };

    const exportPDF = () => {
        // Implémentation future avec jspdf par exemple
        console.log('Export to PDF triggered');
    };

    const renderHeader = () => {
        return (
            <div className="flex flex-column md:flex-row justify-content-between align-items-center gap-2">
                <h5 className="m-0">Gestion des Employés et Enseignants</h5>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText
                        value={globalFilterValue}
                        onChange={handleGlobalFilterChange}
                        placeholder="Recherche globale..."
                    />
                </span>
                <Button icon="pi pi-file-pdf" label="Exporter PDF" onClick={exportPDF} severity="secondary" />
            </div>
        );
    };

    const header = renderHeader();


    return (
        <div className="grid">
            <div className="col-12">
                <div className="card">
                    {header}
                    <DataTable
                        value={employes}
                        paginator
                        rows={10}
                        dataKey="id"
                        filters={filters}
                        filterDisplay="menu"
                        globalFilterFields={['nom', 'prenom', 'departement', 'grade']}
                        emptyMessage="Aucun employé trouvé"
                        showGridlines
                        responsiveLayout="scroll"
                    >
                        <Column field="nom" header="Nom" filter filterPlaceholder="Nom" />
                        <Column field="prenom" header="Prénom" filter filterPlaceholder="Prénom" />
                        <Column field="sexe" header="Sexe" filter filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={sexes}
                                onChange={(e) => options.filterApplyCallback(e.value)}
                                placeholder="Sexe"
                                showClear
                            />
                        )} />
                        <Column field="grade" header="Grade" filter filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={grades}
                                onChange={(e) => options.filterApplyCallback(e.value)}
                                placeholder="Grade"
                                showClear
                            />
                        )} />
                        <Column field="departement" header="Département" />
                        <Column field="adresse" header="Adresse" />
                        <Column field="anciennete" header="Ancienneté" filter filterPlaceholder="≥ Années" />
                        <Column field="natureTravail" header="Travail" filter filterElement={(options) => (
                            <Dropdown
                                value={options.value}
                                options={typesTravail}
                                onChange={(e) => options.filterApplyCallback(e.value)}
                                placeholder="Type"
                                showClear
                            />
                        )} />
                    </DataTable>
                </div>
            </div>
        </div>
    );
};

export default GestionEmployes;
