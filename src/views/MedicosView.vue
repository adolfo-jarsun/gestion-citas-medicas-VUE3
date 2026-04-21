<template>
  <div class="medicos-container">
    <h1>Gestión de Médicos</h1>
    
    <div class="search-bar">
      <input type="text" v-model="searchTerm" placeholder="Buscar médico..." />
      <button @click="mostrarFormulario = true" class="btn-primary">+ Nuevo Médico</button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr><th>Nombre</th><th>Especialidad</th><th>Teléfono</th><th>Email</th><th>Acciones</th></tr>
        </thead>
        <tbody>
          <tr v-for="medico in medicosFiltrados" :key="medico.id">
            <td>{{ medico.nombre }}</td>
            <td>{{ medico.especialidad }}</td>
            <td>{{ medico.telefono }}</td>
            <td>{{ medico.email }}</td>
            <td><button @click="editarMedico(medico)" class="btn-edit">✏️</button>
                <button @click="eliminarMedico(medico.id)" class="btn-delete">🗑️</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="mostrarFormulario" class="modal">
      <div class="modal-content">
        <h2>{{ editando ? 'Editar Médico' : 'Nuevo Médico' }}</h2>
        <form @submit.prevent="guardarMedico">
          <input v-model="medicoForm.nombre" placeholder="Nombre" required />
          <input v-model="medicoForm.especialidad" placeholder="Especialidad" required />
          <input v-model="medicoForm.telefono" placeholder="Teléfono" />
          <input v-model="medicoForm.email" placeholder="Email" type="email" />
          <button type="submit">Guardar</button>
          <button type="button" @click="cerrarModal">Cancelar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

const medicos = ref([]);
const searchTerm = ref('');
const mostrarFormulario = ref(false);
const editando = ref(false);
const medicoForm = ref({});

const medicosFiltrados = computed(() => {
  if (!searchTerm.value) return medicos.value;
  return medicos.value.filter(m => m.nombre.toLowerCase().includes(searchTerm.value.toLowerCase()));
});

const cargarMedicos = async () => {
  const res = await api.get('/medicos');
  medicos.value = res.data;
};

const guardarMedico = async () => {
  if (editando.value) {
    await api.put(`/medicos/${medicoForm.value.id}`, medicoForm.value);
  } else {
    await api.post('/medicos', medicoForm.value);
  }
  cerrarModal();
  cargarMedicos();
};

const eliminarMedico = async (id) => {
  if (confirm('¿Estás seguro?')) {
    await api.delete(`/medicos/${id}`);
    cargarMedicos();
  }
};

const editarMedico = (medico) => {
  medicoForm.value = { ...medico };
  editando.value = true;
  mostrarFormulario.value = true;
};

const cerrarModal = () => {
  mostrarFormulario.value = false;
  editando.value = false;
  medicoForm.value = {};
};

onMounted(cargarMedicos);
</script>

<style scoped>
.medicos-container { padding: 2rem; }
.search-bar { display: flex; gap: 1rem; margin: 1rem 0; justify-content: space-between; }
.search-bar input { flex: 1; padding: 0.5rem; }
.btn-primary { background: #667eea; color: white; padding: 0.5rem 1rem; border: none; border-radius: 5px; cursor: pointer; }
.table-container { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; background: white; }
th, td { padding: 12px; text-align: left; border-bottom: 1px solid #ddd; }
th { background: #667eea; color: white; }
.btn-edit, .btn-delete { padding: 5px 10px; margin: 0 2px; border: none; border-radius: 3px; cursor: pointer; }
.btn-edit { background: #4CAF50; color: white; }
.btn-delete { background: #f44336; color: white; }
.modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center; }
.modal-content { background: white; padding: 2rem; border-radius: 10px; width: 400px; }
.modal-content input { width: 100%; padding: 0.5rem; margin: 0.5rem 0; }
.modal-content button { margin: 0.5rem; padding: 0.5rem 1rem; cursor: pointer; }
</style>