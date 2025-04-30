// components/ProtectedPage.tsx
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface ProtectedPageProps {
    children: React.ReactNode;
}

const ProtectedPage = ({ children }: ProtectedPageProps) => {
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            router.replace('../auth/access');
        }
    }, [router]);

    return <>{children}</>;
};

export default ProtectedPage;
