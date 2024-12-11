import express from "express";
import AppointmentService from "../services/AppointmentService";

export const appointmentRoutes = express.Router();

appointmentRoutes.post("/", async (req, res) => {
  try {
    const appointment = await AppointmentService.createAppointment(req.body);
    res.status(201).json(appointment);
  } catch (error) {
    res.status(500).json({ error: "Failed to create appointment" });
  }
});

appointmentRoutes.get("/", async (req, res) => {
  try {
    const appointments = await AppointmentService.getAppointments();
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch appointments" });
  }
});

appointmentRoutes.put("/:id/reschedule", async (req, res) => {
  try {
    const updatedAppointment = await AppointmentService.rescheduleAppointment(
      req.params.id,
      req.body
    );
    if (updatedAppointment) {
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ error: "Appointment not found" });
    }
  } catch (error) {
    res.status(500).json({ error: "Failed to reschedule appointment" });
  }
});

appointmentRoutes.get("/:id/available-timeslots", async (req, res) => {
  try {
    const availableTimeslots = await AppointmentService.getAvailableTimeslots(
      req.params.id
    );
    res.json(availableTimeslots);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch available timeslots" });
  }
});
