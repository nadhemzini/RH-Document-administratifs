export interface Leave {
    id?: string;
    requestedBy: string;
    startDate: Date | null;
    endDate: Date | null;
    reason: string;
    type: string;
    status?: 'PENDING' | 'APPROVED' | 'REJECTED';
    solde?: number;
    globalQuota?: number;
}
