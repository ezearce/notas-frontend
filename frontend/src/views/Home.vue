<script setup>
import { ref } from 'vue';
import NotaForm from '../components/NotaForm.vue';
import NotaList from '../components/NotaList.vue';

const notaEditada = ref(null);
const showForm = ref(false);
const claveLista = ref(0);

function refrescarNotas() {
  claveLista.value++;
  notaEditada.value = null;
  showForm.value = false;
}

function editarNota(nota) {
  notaEditada.value = nota;
  showForm.value = true;
}

function abrirForm() {
  notaEditada.value = null;
  showForm.value = true;
}

function cancelar() {
  showForm.value = false;
  notaEditada.value = null;
}
</script>

<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <!-- Título centrado -->
    <h1 class="text-5xl font-extrabold text-center text-white">🗒️ Mis Notas</h1>

    <!-- Botón agregar nota -->
    <div class="flex justify-end">
      <button 
        @click="abrirForm"
        class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 sm:px-2 sm:py-1 rounded text-base sm:text-sm"
      >
        + Agregar nota
      </button>
    </div>

    <!-- Formulario -->
    <transition name="fade">
      <div v-if="showForm" class="bg-white rounded-lg shadow p-6">
        <NotaForm 
          :notaEditada="notaEditada" 
          @guardado="refrescarNotas" 
          @cancelar="cancelar" 
        />
      </div>
    </transition>

    <!-- Listado -->
    <NotaList 
      :key="claveLista" 
      @editar="editarNota" 
    />
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
