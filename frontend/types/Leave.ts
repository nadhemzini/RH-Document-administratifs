export interface Leave {
    _id?: string;
    requestedBy: string;
    startDate: Date | null;
    endDate: Date | null;
    reason: string;
    type: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
    solde?: number;
    globalQuota?: number;
}
