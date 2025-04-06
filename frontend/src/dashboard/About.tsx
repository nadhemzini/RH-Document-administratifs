import * as React from 'react';
import type { } from '@mui/x-date-pickers/themeAugmentation';
import type { } from '@mui/x-charts/themeAugmentation';
import type { } from '@mui/x-data-grid-pro/themeAugmentation';
import type { } from '@mui/x-tree-view/themeAugmentation';
import { alpha } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import AppNavbar from './components/AppNavbar.tsx';
import Header from './components/Header.tsx';
import MainGrid from './components/MainGrid.tsx';
import SideMenu from './components/SideMenu.tsx';
import AppTheme from '../shared-theme/AppTheme.tsx';
import {
    chartsCustomizations,
    dataGridCustomizations,
    datePickersCustomizations,
    treeViewCustomizations,
} from './theme/customizations/index.ts';
import AdminTable from './components/AdminTable.jsx';
import { Button, hslToRgb } from '@mui/material';
import { Container, Typography, Card, CardContent } from "@mui/material";

const xThemeComponents = {
    ...chartsCustomizations,
    ...dataGridCustomizations,
    ...datePickersCustomizations,
    ...treeViewCustomizations,
};

export default function Admin(props: { disableCustomTheme?: boolean }) {
    return (
        <AppTheme {...props} themeComponents={xThemeComponents}>
            <CssBaseline enableColorScheme />
            <Box sx={{ display: 'flex' }}>
                <SideMenu />
                <AppNavbar />
                {/* Main content */}
                <Box
                    component="main"
                    sx={(theme) => ({
                        flexGrow: 1,
                        backgroundColor: alpha(theme.palette.background.default, 1),
                        overflow: 'auto',
                    })}
                >
                    <Stack
                        spacing={2}
                        sx={{
                            alignItems: 'center',
                            height: '100%',
                            mx: 3,
                            pb: 5,
                            mt: { xs: 8, md: 0 },
                        }}
                    >
                        <Header pageTitle="About" />
                        <Container maxWidth="md" sx={{ py: 6 }}>
                            <Card sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                                <CardContent>
                                    <Typography variant="h3" color="primary" align="center" gutterBottom>
                                        About Our College
                                    </Typography>
                                    <Typography variant="body1" align="center" color="text.secondary" paragraph>
                                        Welcome to ISIMM, a premier institution dedicated to excellence in education, research, and innovation.
                                    </Typography>

                                    <Typography variant="h5" color="secondary" gutterBottom>
                                        Our Mission
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Our mission is to provide high-quality education, foster research, and empower students to achieve academic and personal success.
                                    </Typography>

                                    <Typography variant="h5" color="secondary" gutterBottom>
                                        Our Vision
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        To be a globally recognized institution that nurtures innovation, leadership, and social responsibility in students.
                                    </Typography>

                                    <Typography variant="h5" color="secondary" gutterBottom>
                                        Our History
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary" paragraph>
                                        Established in 2002, our college has grown into a center of academic excellence, producing outstanding graduates across various disciplines.
                                    </Typography>

                                    <Typography variant="h5" color="secondary" gutterBottom>
                                        Contact Us
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        📍 BP 223 Av. de la Corniche, Monastir 5000
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        📧 Email: contact@isimm.edu
                                    </Typography>
                                    <Typography variant="body1" color="text.secondary">
                                        📞 Phone: 70 011 920
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Container>
                    </Stack>
                </Box>
            </Box>
        </AppTheme>
    );
}
