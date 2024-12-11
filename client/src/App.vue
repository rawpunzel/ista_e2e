<template>
  <div id="app">
    <header>
      <h1>Terminierungsportal</h1>
    </header>
    <main>
      <AppointmentList ref="appointmentList" />
    </main>
  </div>
</template>

<script>
import AppointmentList from "@/components/AppointmentList.vue";

export default {
  name: "App",
  components: {
    AppointmentList,
  },
};
</script>

<style>
:root {
  --primary-color: #4a90e2;
  --secondary-color: #f5f7fa;
  --text-color: #333;
  --border-color: #e0e0e0;
}

body {
  font-family: "Roboto", Arial, sans-serif;
  line-height: 1.6;
  color: var(--text-color);
  background-color: var(--secondary-color);
  margin: 0;
  padding: 0;
}

#app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  background-color: var(--primary-color);
  color: white;
  text-align: center;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

h1 {
  margin: 0;
  font-size: 2rem;
}

main {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}
</style>
