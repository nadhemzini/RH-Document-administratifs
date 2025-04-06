import { Box, Button, Grid, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import Page from '../../assets/Page.png';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import React, { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';
import { toPng } from 'html-to-image';
import html2canvas from 'html2canvas';

import axios from 'axios';

interface CertificateData {
    name: string;
    reason: string;
    certificateType: string;
}

function CertificateForm() {
    const ref = useRef<HTMLDivElement>(null)

    const [names, setNames] = useState([]);
    const [selectedName, setSelectedName] = useState('');
    const [reason, setReason] = useState('');
    const [selectedCertificateType, setSelectedCertificateType] = useState('');

    const certificateTypes = ['Certificate', 'attestation'];

    // useEffect(() => {
    //     // Fetch names from the backend
    //     axios.get('/api/names')
    //         .then(response => {
    //             setNames(response.data);
    //         })
    //         .catch(error => {
    //             console.error('There was an error fetching the names!', error);
    //         });
    // }, []);

    const onButtonClick = useCallback(() => {
        if (ref.current === null) {
            return;
        }

        html2canvas(ref.current).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const imgProps = pdf.getImageProperties(imgData);
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${selectedCertificateType}.pdf`);
        }).catch((err) => {
            console.log(err);
        });
    }, [ref, selectedCertificateType]);


    const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
        event.preventDefault();
        const data: CertificateData = {
            name: selectedName,
            reason: reason,
            certificateType: selectedCertificateType
        };
        axios.post('/api/certificates', data)
            .then(response => {
                console.log('Certificate created successfully!', response);
            })
            .catch(error => {
                console.error('There was an error creating the certificate!', error);
            });
    };

    return (
        <Box
            component="form"
            sx={{ mt: 3, width: '100%' }}
            onSubmit={handleSubmit}
        >
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                        Certificate
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required>
                        <InputLabel id="name-label">Name</InputLabel>
                        {/* <Select
                            labelId="name-label"
                            id="name"
                            value={selectedName}
                            label="Name"
                            onChange={(e) => setSelectedName(e.target.value)}
                        >
                            {names.map((name) => (
                                <MenuItem key={name} value={name}>
                                    {name}
                                </MenuItem>
                            ))}
                        </Select> */}
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <FormControl fullWidth required>
                        <InputLabel id="certificate-type-label">Certificate Type</InputLabel>
                        <Select
                            labelId="certificate-type-label"
                            id="certificate-type"
                            value={selectedCertificateType}
                            label="Certificate Type"
                            onChange={(e) => setSelectedCertificateType(e.target.value)}
                        >
                            {certificateTypes.map((type) => (
                                <MenuItem key={type} value={type}>
                                    {type}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <TextField
                        required
                        fullWidth
                        id="reason"
                        label="Reason"
                        name="reason"
                        autoComplete="reason"
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                    />
                </Grid>
                <Grid item xs={12}>
                    <CssBaseline />
                    <Container style={{ height: '100%', width: '80%', position: 'relative' }} ref={ref} fixed>
                        <img src={Page} style={{ width: '100%', borderRadius: 10 }} alt="CertificateTemplate" />
                        <div style={{ position: 'absolute', top: 80, left: 0, height: '50%', width: '100%', boxSizing: 'border-box' }} >
                            <Typography variant="h1" color='textSecondary' sx={{ mb: 10 }}>{selectedCertificateType}</Typography>
                            <Typography variant="h2" style={{ padding: '20px' }} color='info' sx={{ mb: 5 }}>{selectedName}</Typography>
                            <Typography variant="h6" color='textPrimary' sx={{ mb: -20 }}> {reason}</Typography>
                        </div>
                    </Container>
                </Grid>
                <Grid item xs={12} container justifyContent="center">
                    <Button
                        style={{ marginTop: 20, height: 50, width: 200 }}
                        type="submit"
                        variant="contained"
                        color="primary"
                        onClick={onButtonClick}
                    >
                        Print
                    </Button>
                </Grid>
            </Grid>
        </Box>
    );
}

export default CertificateForm;