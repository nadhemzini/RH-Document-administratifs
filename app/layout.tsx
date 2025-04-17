'use client';
import { LayoutProvider } from '../layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '../styles/layout/layout.scss';
import '../styles/demo/Demos.scss';
import DarkModeToggle from './(main)/uikit/darkmode/page';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/lara-light-blue/theme.css`} rel="stylesheet" />
            </head>
            <body>
                <PrimeReactProvider>
                    <div
                        className="absolute"
                        style={{ top: '2rem', right: '2rem' }} // You can tweak these values
                    >
                        <DarkModeToggle />
                    </div>

                    <LayoutProvider>{children}</LayoutProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
