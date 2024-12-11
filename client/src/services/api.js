import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

export default {
  getAppointments() {
    return apiClient.get("/appointments");
  },
  createAppointment(appointment) {
    return apiClient.post("/appointments", appointment);
  },
  rescheduleAppointment(id, newAppointmentData) {
    return apiClient.put(`/appointments/${id}/reschedule`, newAppointmentData);
  },
  getAvailableTimeslots(id) {
    return apiClient.get(`/appointments/${id}/available-timeslots`);
  },
};
