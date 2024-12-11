export interface Technician {
  id: string;
  name: string;
  age: number;
  gender: string;
}

export interface Appointment {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  technician: Technician;
  taskDescription: string;
}

export interface AvailableTimeslot {
  id: string;
  day: string;
  startTime: string;
  endTime: string;
  technician: Technician;
}
