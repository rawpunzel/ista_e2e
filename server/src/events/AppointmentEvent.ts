import { Appointment } from "../models/Appointment";

export enum EventType {
  CREATED = "CREATED",
  UPDATED = "UPDATED",
  DELETED = "DELETED",
}

export interface AppointmentEvent {
  id: string;
  type: EventType;
  appointment: Appointment;
  timestamp: Date;
}
