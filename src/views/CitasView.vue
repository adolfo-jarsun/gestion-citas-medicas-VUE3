<template>
  <div class="citas-container">
    <h1>Gestión de Citas</h1>
    
    <form @submit.prevent="crearCita" class="cita-form">
      <select v-model="nuevaCita.pacienteId" required>
        <option value="">Seleccionar Paciente</option>
        <option v-for="p in pacientes" :key="p.id" :value="p.id">{{ p.nombre }}</option>
      </select>
      <select v-model="nuevaCita.medicoId" required>
        <option value="">Seleccionar Médico</option>
        <option v-for="m in medicos" :key="m.id" :value="m.id">{{ m.nombre }} - {{ m.especialidad }}</option>
      </select>
      <input type="datetime-local" v-model="nuevaCita.fecha" required />
      <button type="submit">Agendar Cita</button>
    </form>

    <div class="citas-list">
      <div v-for="cita in citas" :key="cita.id" class="cita-card">
        <h3>Paciente: {{ obtenerPaciente(cita.pacienteId)?.nombre }}</h3>
        <p>Médico: {{ obtenerMedico(cita.medicoId)?.nombre }}</p>
        <p>Fecha: {{ new Date(cita.fecha).toLocaleString() }}</p>
        <router-link :to="`/cita/${cita.id}`">Ver Detalle</router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/services/api';

const citas = ref([]);
const pacientes = ref([]);
const medicos = ref([]);
const nuevaCita = ref({ pacienteId: '', medicoId: '', fecha: '' });

const cargarDatos = async () => {
  const [citasRes, pacientesRes, medicosRes] = await Promise.all([
    api.get('/citas'),
    api.get('/pacientes'),
    api.get('/medicos')
  ]);
  citas.value = citasRes.data;
  pacientes.value = pacientesRes.data;
  medicos.value = medicosRes.data;
};

const obtenerPaciente = (id) => pacientes.value.find(p => p.id === id);
const obtenerMedico = (id) => medicos.value.find(m => m.id === id);

const crearCita = async () => {
  await api.post('/citas', nuevaCita.value);
  cargarDatos();
  nuevaCita.value = { pacienteId: '', medicoId: '', fecha: '' };
};

onMounted(cargarDatos);
</script>

<style scoped>
.citas-container { padding: 2rem; }
.cita-form { display: flex; gap: 1rem; margin: 1rem 0; flex-wrap: wrap; }
.cita-form select, .cita-form input { padding: 0.5rem; flex: 1; }
.cita-form button { background: #667eea; color: white; border: none; padding: 0.5rem 1rem; cursor: pointer; }
.citas-list { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 1rem; margin-top: 2rem; }
.cita-card { background: white; padding: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.cita-card a { color: #667eea; text-decoration: none; }
</style>