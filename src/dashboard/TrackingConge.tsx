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
import AdminTable from './components/AdminTable.js';
import { Button, hslToRgb } from '@mui/material';
import Card from "./components/Card.tsx";
import axios from 'axios';
import { Conge } from './interfaces/conge.ts';
import { useEffect, useState } from 'react';

const xThemeComponents = {
  ...chartsCustomizations,
  ...dataGridCustomizations,
  ...datePickersCustomizations,
  ...treeViewCustomizations,
};

export default function TrackingConge(props: { disableCustomTheme?: boolean }) {
  const [data, setData] = useState<Conge[]>([]);
  useEffect(() => {
    axios.get('http://localhost:3001/conge'

    ).then(response => { setData(response.data) })
      .catch(error => console.log(error))
  }, []);

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
              mx: 3,
              pb: 5,
              mt: { xs: 8, md: 0 },
            }}
          >

            <Header pageTitle="Tracking my leave" />
            <div style={{
              height: '100%', display: 'flex', alignItems: 'flex-start', fontSize: '1rem', fontWeight: 'semi-bold'
            }}>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>you can reville the tracking cout </p>{
              /* lhna resultat mta3 formule w est ce que ynajm ykoun fiha les conges li 3andhom*/}


            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
              {data.map((conge, index) => (
                <Card employeeName={conge.employeeName} endDate={conge.endDate} reason={conge.reason} startDate={conge.startDate} leaveType={conge.leaveType} />
              ))}
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />
              <Card />



            </div>
          </Stack>
        </Box>
      </Box>
    </AppTheme >
  );
}
