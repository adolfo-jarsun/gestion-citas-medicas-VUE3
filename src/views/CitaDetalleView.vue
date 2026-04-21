<template>
  <div v-if="cita" class="detalle-container">
    <h1>Detalle de Cita</h1>
    <div class="detalle-card">
      <h2>Paciente: {{ paciente?.nombre }}</h2>
      <p>Teléfono: {{ paciente?.telefono }}</p>
      <p>Email: {{ paciente?.email }}</p>
      
      <h2>Médico: {{ medico?.nombre }}</h2>
      <p>Especialidad: {{ medico?.especialidad }}</p>
      <p>Teléfono: {{ medico?.telefono }}</p>
      
      <h2>Cita</h2>
      <p>Fecha: {{ new Date(cita.fecha).toLocaleString() }}</p>
      <router-link to="/citas">Volver a Citas</router-link>
    </div>
  </div>
  <div v-else>Cargando...</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import api from '@/services/api';

const route = useRoute();
const cita = ref(null);
const paciente = ref(null);
const medico = ref(null);

onMounted(async () => {
  const citaId = route.params.id;
  const citaRes = await api.get(`/citas/${citaId}`);
  cita.value = citaRes.data;
  
  const [pacienteRes, medicoRes] = await Promise.all([
    api.get(`/pacientes/${cita.value.pacienteId}`),
    api.get(`/medicos/${cita.value.medicoId}`)
  ]);
  paciente.value = pacienteRes.data;
  medico.value = medicoRes.data;
});
</script>

<style scoped>
.detalle-container { padding: 2rem; max-width: 600px; margin: 0 auto; }
.detalle-card { background: white; padding: 2rem; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.detalle-card h2 { color: #667eea; margin-top: 1rem; }
.detalle-card a { display: inline-block; margin-top: 1rem; color: #667eea; text-decoration: none; }
</style>