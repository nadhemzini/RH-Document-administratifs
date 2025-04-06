import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import GroupIcon from "@mui/icons-material/Group";

interface EmployeeCardProps {
    employeeCount: number;
    employeename?: string;

}

const EmployeeCard: React.FC<EmployeeCardProps> = ({ employeeCount, employeename }) => {
    return (
        <Card style={{ marginRight: 10 }} sx={{ minWidth: 275, borderRadius: 3, boxShadow: 3 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {employeename}
                </Typography>
                <Typography variant="h5" component="div" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <GroupIcon color="primary" />
                    {employeeCount}
                </Typography>
                <Typography sx={{ mt: 1.5 }} color="text.secondary">
                    {employeename} Employees
                </Typography>
            </CardContent>
        </Card>
    );
};

export default EmployeeCard;
