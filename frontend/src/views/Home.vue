<template>
  <div class="max-w-5xl mx-auto p-6 space-y-6">
    <!-- Título centrado -->
    <h1 class="text-5xl font-extrabold text-center text-white">🗒️ Mis Notas</h1>

    <div class="flex justify-end gap-3">
      <button @click="abrirForm" class="bg-blue-600 text-white px-4 py-2 rounded shadow">
        + Agregar nota
      </button>

      <button @click="abrirCrearCategoria" class="bg-indigo-600 text-white px-4 py-2 rounded shadow">
        + Agregar categoría
      </button>

      <button @click="abrirListadoCategorias" class="bg-slate-700 text-white px-4 py-2 rounded shadow">
        Ver categorías
      </button>
    </div>

    <div>
      <!-- Formulario de nota -->
      <transition name="fade">
        <div v-if="showForm" class="bg-white rounded-lg shadow p-6 mb-6">
          <NotaForm :notaEditada="notaEditada" @guardado="refrescarNotas" @cancelar="cancelar" />
        </div>
      </transition>

      <!-- Listado -->
      <NotaList :key="claveLista" @editar="editarNota" />
    </div>

    <!-- Modal: Category Manager (creación/listado) -->
    <CategoryManager
      v-if="showCategoryManager"
      :initial-mode="categoryManagerMode"
      @close="closeCategoryManager"
      @categorias-actualizadas="onCategoriasActualizadas"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import NotaForm from '../components/NotaForm.vue';
import NotaList from '../components/NotaList.vue';
import CategoryManager from '../components/CategoryManager.vue';
import api from '../services/api';

const notaEditada = ref(null);
const showForm = ref(false);
const claveLista = ref(0);
const showCategoryManager = ref(false);
const categoryManagerMode = ref('list'); // 'list' o 'create'

function refrescarNotas() {
  claveLista.value++;
  notaEditada.value = null;
  showForm.value = false;
}

async function editarNota(nota) {
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

function abrirCrearCategoria() {
  categoryManagerMode.value = 'create';
  showCategoryManager.value = true;
}

function abrirListadoCategorias() {
  categoryManagerMode.value = 'list';
  showCategoryManager.value = true;
}

function closeCategoryManager() {
  showCategoryManager.value = false;
}

function onCategoriasActualizadas() {
  // por si querés refrescar algo al actualizar categorias
  refrescarNotas();
}

refrescarNotas();
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity .3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
