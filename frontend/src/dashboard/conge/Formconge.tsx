import React, { useState } from 'react';
import {
    TextField,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Grid,
    Typography,
    Box,
    Paper,
    SelectChangeEvent,
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { Conge } from '../interfaces/conge';
import { Errors } from '../interfaces/conge';

const Formconge = () => {
    const [formData, setFormData] = useState<Conge>({
        employeeName: '',
        leaveType: '',
        startDate: null,
        endDate: null,
        reason: '',
    });

    const [errors, setErrors] = useState<Errors>({
        employeeName: '',
        leaveType: '',
        startDate: '',
        endDate: '',
        reason: '',
    });

    // Handle input changes for TextField
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    // Handle input changes for Select
    const handleSelectChange = (e: SelectChangeEvent<string>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
        setErrors({
            ...errors,
            [name]: '',
        });
    };

    // Handle date changes
    const handleDateChange = (date: Date | null, field: string) => {
        setFormData({
            ...formData,
            [field]: date,
        });

        // Validate end date
        if (field === 'endDate' && formData.startDate && date && date < formData.startDate) {
            setErrors({
                ...errors,
                endDate: 'End Date cannot be before Start Date',
            });
        } else {
            setErrors({
                ...errors,
                [field]: '',
            });
        }
    };

    // Validate form
    const validate = () => {
        let isValid = true;
        const newErrors: Errors = { ...errors };

        if (!formData.employeeName) {
            newErrors.employeeName = 'Employee Name is required';
            isValid = false;
        }

        if (!formData.leaveType) {
            newErrors.leaveType = 'Leave Type is required';
            isValid = false;
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start Date is required';
            isValid = false;
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End Date is required';
            isValid = false;
        } else if (formData.startDate && formData.endDate < formData.startDate) {
            newErrors.endDate = 'End Date cannot be before Start Date';
            isValid = false;
        }

        if (!formData.reason) {
            newErrors.reason = 'Reason for Leave is required';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    // Handle form submission
    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form Data:', formData);
            alert('Leave request submitted successfully!');
        }
    };

    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                }}
            >
                <Paper elevation={3} sx={{ padding: 4, width: '100%', maxWidth: 600 }}>
                    <Typography variant="h4" align="center" gutterBottom>
                        Leave Request Form
                    </Typography>
                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            {/* Employee Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Employee Name"
                                    name="employeeName"
                                    value={formData.employeeName}
                                    onChange={handleInputChange}
                                    error={!!errors.employeeName}
                                    helperText={errors.employeeName}
                                />
                            </Grid>

                            {/* Leave Type */}
                            <Grid item xs={12}>
                                <FormControl fullWidth error={!!errors.leaveType}>
                                    <InputLabel>Leave Type</InputLabel>
                                    <Select
                                        name="leaveType"
                                        label="Leave Type"
                                        value={formData.leaveType}
                                        onChange={handleSelectChange}
                                    >
                                        <MenuItem value="annual">Annual Leave</MenuItem>
                                        <MenuItem value="sick">Sick Leave</MenuItem>
                                        <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                                        <MenuItem value="maternity">Maternity Leave</MenuItem>
                                        <MenuItem value="paternity">Paternity Leave</MenuItem>
                                    </Select>
                                    {errors.leaveType && (
                                        <Typography variant="caption" color="error">
                                            {errors.leaveType}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Grid>

                            {/* Start Date */}
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date"
                                    value={formData.startDate}
                                    onChange={(date) => handleDateChange(date, 'startDate')}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!errors.startDate} helperText={errors.startDate} />
                                    )}
                                />
                            </Grid>

                            {/* End Date */}
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="End Date"
                                    value={formData.endDate}
                                    onChange={(date) => handleDateChange(date ? new Date(date) : null, 'endDate')}
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth error={!!errors.endDate} helperText={errors.endDate} />
                                    )}
                                />
                            </Grid>

                            {/* Reason for Leave */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Reason for Leave"
                                    name="reason"
                                    value={formData.reason}
                                    onChange={handleInputChange}
                                    error={!!errors.reason}
                                    helperText={errors.reason}
                                    multiline
                                    rows={4}
                                />
                            </Grid>

                            {/* Submit Button */}
                            <Grid item xs={12}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    size="large"
                                >
                                    Submit Leave Request
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Box>
        </LocalizationProvider>
    );
};

export default Formconge;