export interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: string;
    status?: 'IN_PROGRESS' | 'COMPLETED';
    deadline?: Date;
}
