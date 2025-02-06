import React from 'react';
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
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Formconge = () => {
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
                    <form>
                        <Grid container spacing={3}>
                            {/* Employee Name */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Employee Name"
                                    name="employeeName"
                                />
                            </Grid>

                            {/* Leave Type */}
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <InputLabel>Leave Type</InputLabel>
                                    <Select name="leaveType" label="Leave Type">
                                        <MenuItem value="annual">Annual Leave</MenuItem>
                                        <MenuItem value="sick">Sick Leave</MenuItem>
                                        <MenuItem value="unpaid">Unpaid Leave</MenuItem>
                                        <MenuItem value="maternity">Maternity Leave</MenuItem>
                                        <MenuItem value="paternity">Paternity Leave</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            {/* Start Date */}
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="Start Date"
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                />
                            </Grid>

                            {/* End Date */}
                            <Grid item xs={12} sm={6}>
                                <DatePicker
                                    label="End Date"
                                    renderInput={(params) => (
                                        <TextField {...params} fullWidth />
                                    )}
                                />
                            </Grid>

                            {/* Reason for Leave */}
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Reason for Leave"
                                    name="reason"
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