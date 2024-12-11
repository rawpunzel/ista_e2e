import { v4 as uuidv4 } from "uuid";
import { AppointmentEvent, EventType } from "../events/AppointmentEvent";
import {
  Appointment,
  AvailableTimeslot,
  Technician,
} from "../models/Appointment";
import EventStore from "./EventStore";

class AppointmentService {
  private technicians: Technician[] = [
    { id: "t1", name: "John Doe", age: 35, gender: "Male" },
    { id: "t2", name: "Jane Smith", age: 30, gender: "Female" },
    { id: "t3", name: "Alex Johnson", age: 28, gender: "Non-binary" },
  ];

  async createAppointment(
    appointmentData: Omit<Appointment, "id">
  ): Promise<Appointment> {
    const appointment: Appointment = {
      id: uuidv4(),
      ...appointmentData,
    };

    const event: AppointmentEvent = {
      id: uuidv4(),
      type: EventType.CREATED,
      appointment,
      timestamp: new Date(),
    };

    await EventStore.saveEvent(event);
    return appointment;
  }

  async getAppointments(): Promise<Appointment[]> {
    const events = await EventStore.getAllEvents();
    const appointments: { [id: string]: Appointment } = {};

    events.forEach((event) => {
      switch (event.type) {
        case EventType.CREATED:
        case EventType.UPDATED:
          appointments[event.appointment.id] = event.appointment;
          break;
        case EventType.DELETED:
          delete appointments[event.appointment.id];
          break;
      }
    });

    return Object.values(appointments);
  }

  async rescheduleAppointment(
    id: string,
    newAppointmentData: Partial<Appointment>
  ): Promise<Appointment | null> {
    const appointments = await this.getAppointments();
    const appointmentIndex = appointments.findIndex((a) => a.id === id);

    if (appointmentIndex === -1) {
      return null;
    }

    const updatedAppointment = {
      ...appointments[appointmentIndex],
      ...newAppointmentData,
      id,
    };

    const event: AppointmentEvent = {
      id: uuidv4(),
      type: EventType.UPDATED,
      appointment: updatedAppointment,
      timestamp: new Date(),
    };

    await EventStore.saveEvent(event);
    return updatedAppointment;
  }

  async getAvailableTimeslots(
    appointmentId: string
  ): Promise<AvailableTimeslot[]> {
    // This is a mock implementation. In a real-world scenario, you'd implement
    // logic to find actual available timeslots based on technician schedules.
    return [
      {
        id: "ts1",
        day: "2024-09-18",
        startTime: "10:00",
        endTime: "11:00",
        technician: this.technicians[0],
      },
      {
        id: "ts2",
        day: "2024-09-19",
        startTime: "14:00",
        endTime: "15:00",
        technician: this.technicians[1],
      },
      {
        id: "ts3",
        day: "2024-09-20",
        startTime: "09:00",
        endTime: "10:00",
        technician: this.technicians[2],
      },
    ];
  }
}

export default new AppointmentService();
