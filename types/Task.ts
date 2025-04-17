export interface Task {
    id: number;
    title: string;
    description: string;
    assignedTo: string;
    status: 'IN_PROGRESS' | 'COMPLETED';
}
