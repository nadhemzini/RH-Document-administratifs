import { Metadata } from 'next';
import Layout from '../../layout/layout';

interface AppLayoutProps {
    children: React.ReactNode;
}

export const metadata: Metadata = {
    title: 'ISIMM',
    description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'PrimeReact SAKAI-REACT',
        url: 'https://sakai.primereact.org/',
        description: 'The ultimate collection of design-agnostic, flexible and accessible React UI Components.',
        images: ['../../public/layout/images/ISIM_LOGO_ar-removebg-preview.png'],
        ttl: 604800
    },
    icons: {
        icon: '../../public/layout/images/ISIM_LOGO_ar-removebg-preview.png'
    }
};

export default function AppLayout({ children }: AppLayoutProps) {
    return <Layout>
        {children}
    </Layout>;
}
