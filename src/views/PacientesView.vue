<template>
  <div class="pacientes-container">
    <h1>Gestión de Pacientes</h1>
    
    <div class="search-bar">
      <input 
        type="text" 
        v-model="searchTerm" 
        placeholder="Buscar paciente..."
      />
      <button @click="mostrarFormulario = true" class="btn-primary">
        + Nuevo Paciente
      </button>
    </div>

    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="paciente in pacientesFiltrados" :key="paciente.id">
            <td>{{ paciente.nombre }}</td>
            <td>{{ paciente.telefono }}</td>
            <td>{{ paciente.email }}</td>
            <td class="actions">
              <button @click="editarPaciente(paciente)" class="btn-edit">✏️</button>
              <button @click="eliminarPaciente(paciente.id)" class="btn-delete">🗑️</button>
            </td>
          </tr>
          <tr v-if="pacientesFiltrados.length === 0">
            <td colspan="4">No hay pacientes registrados</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para crear/editar -->
    <div v-if="mostrarFormulario" class="modal">
      <div class="modal-content">
        <h2>{{ editando ? 'Editar Paciente' : 'Nuevo Paciente' }}</h2>
        <form @submit.prevent="guardarPaciente">
          <input v-model="pacienteForm.nombre" placeholder="Nombre" required />
          <input v-model="pacienteForm.telefono" placeholder="Teléfono" />
          <input v-model="pacienteForm.email" placeholder="Email" type="email" />
          <div class="modal-actions">
            <button type="submit" class="btn-save">Guardar</button>
            <button type="button" @click="cerrarModal" class="btn-cancel">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '@/services/api';

const pacientes = ref([]);
const searchTerm = ref('');
const mostrarFormulario = ref(false);
const editando = ref(false);
const pacienteForm = ref({});

const pacientesFiltrados = computed(() => {
  if (!searchTerm.value) return pacientes.value;
  return pacientes.value.filter(p => 
    p.nombre.toLowerCase().includes(searchTerm.value.toLowerCase())
  );
});

const cargarPacientes = async () => {
  const response = await api.get('/pacientes');
  pacientes.value = response.data;
};

const guardarPaciente = async () => {
  if (editando.value) {
    await api.put(`/pacientes/${pacienteForm.value.id}`, pacienteForm.value);
  } else {
    await api.post('/pacientes', pacienteForm.value);
  }
  cerrarModal();
  cargarPacientes();
};

const eliminarPaciente = async (id) => {
  if (confirm('¿Estás seguro?')) {
    await api.delete(`/pacientes/${id}`);
    cargarPacientes();
  }
};

const editarPaciente = (paciente) => {
  pacienteForm.value = { ...paciente };
  editando.value = true;
  mostrarFormulario.value = true;
};

const cerrarModal = () => {
  mostrarFormulario.value = false;
  editando.value = false;
  pacienteForm.value = {};
};

onMounted(cargarPacientes);
</script>

<style scoped>
.pacientes-container {
  padding: 2rem;
}
.search-bar {
  display: flex;
  gap: 1rem;
  margin: 1rem 0;
  justify-content: space-between;
}
.search-bar input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.table-container {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  background: white;
}
th, td {
  padding: 12px;
  text-align: left;
  border-bottom: 1px solid #ddd;
}
th {
  background: #667eea;
  color: white;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
.btn-edit, .btn-delete {
  padding: 5px 10px;
  border: none;
  border-radius: 3px;
  cursor: pointer;
}
.btn-edit { background: #4CAF50; color: white; }
.btn-delete { background: #f44336; color: white; }
.btn-primary {
  background: #667eea;
  color: white;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0,0,0,0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  width: 400px;
}
.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 5px;
}
.modal-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
.btn-save, .btn-cancel {
  flex: 1;
  padding: 0.5rem;
  border: none;
  border-radius: 5px;
  cursor: pointer;
}
.btn-save { background: #4CAF50; color: white; }
.btn-cancel { background: #f44336; color: white; }
</style>