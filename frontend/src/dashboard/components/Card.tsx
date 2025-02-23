import React from 'react';
import { Card as MuiCard, CardContent, Typography, CardActions, Button } from '@mui/material';
import { Conge } from '../interfaces/conge';

export default function CustomCard({ employeeName, reason, startDate, endDate }: Conge) {
    const handlerSubmit = () => {
        console.log('send email')
    }
    return (
        <MuiCard sx={{ minWidth: 275, margin: '15px' }}>
            <CardContent>
                <Typography gutterBottom sx={{ color: 'text.secondary', fontSize: 14 }}>
                    employeeName
                </Typography>
                <Typography variant="h5" component="div">
                    {employeeName}
                </Typography>
                <Typography sx={{ color: 'text.secondary', mb: 1.5 }}>Reason</Typography>
                <Typography variant="body2">
                    {reason}
                    <br />
                    from {startDate} to {endDate}

                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={handlerSubmit}>ReSend-email</Button>
            </CardActions>
        </MuiCard>
    );
}