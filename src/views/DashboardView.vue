<template>
  <div class="dashboard">
    <h1>Panel de Control</h1>
    <div class="stats-grid">
      <div class="stat-card">
        <h3>Pacientes</h3>
        <p class="stat-number">{{ pacientesCount }}</p>
        <router-link to="/pacientes" class="stat-link">Ver todos →</router-link>
      </div>
      <div class="stat-card">
        <h3>Médicos</h3>
        <p class="stat-number">{{ medicosCount }}</p>
        <router-link to="/medicos" class="stat-link">Ver todos →</router-link>
      </div>
      <div class="stat-card">
        <h3>Citas</h3>
        <p class="stat-number">{{ citasCount }}</p>
        <router-link to="/citas" class="stat-link">Ver todas →</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const pacientesCount = ref(0);
const medicosCount = ref(0);
const citasCount = ref(0);

onMounted(async () => {
  const [pacientes, medicos, citas] = await Promise.all([
    api.get('/pacientes'),
    api.get('/medicos'),
    api.get('/citas')
  ]);
  pacientesCount.value = pacientes.data.length;
  medicosCount.value = medicos.data.length;
  citasCount.value = citas.data.length;
});
</script>

<style scoped>
.dashboard {
  padding: 2rem;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}
.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  text-align: center;
}
.stat-number {
  font-size: 3rem;
  font-weight: bold;
  color: #667eea;
  margin: 1rem 0;
}
.stat-link {
  color: #667eea;
  text-decoration: none;
}
</style>