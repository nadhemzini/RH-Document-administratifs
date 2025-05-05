export interface Task {
    _id: string;
    title: string;
    description: string;
    assignedTo: string;
    status: 'Pending' | 'Completed'; // Explicitly define possible values
    deadline?: Date;
}
