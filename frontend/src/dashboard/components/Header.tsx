import * as React from 'react';
import Stack from '@mui/material/Stack';
import NotificationsRoundedIcon from '@mui/icons-material/NotificationsRounded';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

import Search from './Search';



export default function Header({ pageTitle }: { pageTitle: string }) {
  return (
    <Stack
      direction="row"
      sx={{
        display: { xs: 'none', md: 'flex' },
        width: '50%',
        alignItems: { xs: 'flex-start', md: 'center' },
        justifyContent: 'space-between',
        maxWidth: { sm: '100%', md: '1700px' },
        position: 'absolute',
        top: 0,
        pt: 1.5,
      }}
      spacing={2}
    >
      <NavbarBreadcrumbs pageTitle={pageTitle} />
      <Stack direction="row" sx={{ gap: 1 }}>
        {/* <Search />*/}
        <CustomDatePicker />
        {/*<MenuButton showBadge aria-label="Open notifications">
          <NotificationsRoundedIcon />
        </MenuButton>*/}
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}
