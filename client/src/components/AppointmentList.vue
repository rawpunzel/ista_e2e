<template>
  <div class="appointment-list">
    <h2>Ihr Termin</h2>
    <ul>
      <li
        v-for="appointment in appointments"
        :key="appointment.id"
        class="appointment-item"
      >
        <div class="appointment-details">
          <h3>{{ appointment.day || "No date specified" }}</h3>
          <p>
            <strong>Zeitraum:</strong>
            {{ appointment.startTime || "Not specified" }} -
            {{ appointment.endTime || "Not specified" }}
          </p>
          <p>
            <strong>Durchzuführende Arbeit:</strong>
            {{ appointment.taskDescription || "No description" }}
          </p>
        </div>
        <div class="technician-details">
          <h4>Ihr Servicetechniker</h4>
          <p>
            <strong>Name:</strong>
            {{ appointment.technician?.name || "Not assigned" }}
          </p>
          <p>
            <strong>Alter:</strong> {{ appointment.technician?.age || "N/A" }}
          </p>
          <p>
            <strong>Geschlecht:</strong>
            {{ appointment.technician?.gender || "Not specified" }}
          </p>
        </div>
        <button
          @click="showRescheduleOptions(appointment.id)"
          class="btn-reschedule"
        >
          Verschieben
        </button>
        <div
          v-if="rescheduleOptions[appointment.id]"
          class="reschedule-options"
        >
          <h4>Wählen sie ihren Wunschtermin:</h4>
          <ul>
            <li
              v-for="option in rescheduleOptions[appointment.id]"
              :key="option.id"
            >
              <button
                @click="rescheduleAppointment(appointment.id, option)"
                class="btn-option"
              >
                {{ option.day }} {{ option.startTime }} - {{ option.endTime }}
                <br />
                Techniker: {{ option.technician.name }} ({{
                  option.technician.age
                }}
                Jahre alt, {{ option.technician.gender }})
              </button>
            </li>
          </ul>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import api from "@/services/api";
import { reactive } from "vue";

export default {
  name: "AppointmentList",
  data() {
    return {
      appointments: [],
      rescheduleOptions: reactive({}),
    };
  },
  methods: {
    async fetchAppointments() {
      try {
        const response = await api.getAppointments();
        this.appointments = response.data;
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    },
    async rescheduleAppointment(id, newAppointmentData) {
      try {
        await api.rescheduleAppointment(id, newAppointmentData);
        await this.fetchAppointments(); // Refresh the appointment list
        this.rescheduleOptions[id] = null;
      } catch (error) {
        console.error("Error rescheduling appointment:", error);
      }
    },
    async showRescheduleOptions(id) {
      try {
        const response = await api.getAvailableTimeslots(id);
        this.rescheduleOptions[id] = response.data;
      } catch (error) {
        console.error("Error fetching available timeslots:", error);
      }
    },
  },
  mounted() {
    this.fetchAppointments();
  },
};
</script>

<style scoped>
.appointment-list {
  background-color: #f9f9f9;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-top: 0;
  color: var(--primary-color);
}

ul {
  list-style-type: none;
  padding: 0;
}

.appointment-item {
  background-color: white;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: box-shadow 0.3s ease;
}

.appointment-item:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.appointment-details,
.technician-details {
  margin-bottom: 1rem;
}

.appointment-details h3,
.technician-details h4 {
  color: var(--primary-color);
}

.btn-reschedule,
.btn-option {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;
  display: inline-block;
}

.btn-reschedule:hover,
.btn-option:hover {
  background-color: #3a7bc8;
}

.reschedule-options {
  margin-top: 1rem;
  padding: 1rem;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: #f1f1f1;
}

.reschedule-options ul {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-option {
  width: 100%;
  text-align: left;
  white-space: normal;
}
</style>
