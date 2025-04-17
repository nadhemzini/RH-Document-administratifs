export interface User {
    id: string;
    name: string;
    email: string;
    sexe: 'Homme' | 'Femme';
    cin: string;
    role: 'admin' | 'RH' | 'enseignant';
    dob: string;
    address: string;
    phone: string;
}
