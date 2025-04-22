export interface Leave {
    id?: string;
    name: string;
    email: string;
    dateStart: Date | null;
    dateEnd: Date | null;
    reason: string;
    type: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    solde?: number;
    globalQuota?: number;
}
