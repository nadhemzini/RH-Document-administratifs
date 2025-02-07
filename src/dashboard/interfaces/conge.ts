export interface Conge {
    employeeName: string;
    leaveType: string;
    startDate: Date | null;
    endDate: Date | null;
    reason: string;
}

export interface Errors {
    employeeName: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
}