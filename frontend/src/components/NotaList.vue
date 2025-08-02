<template>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <!-- Columna Notas Activas -->
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Notas activas</h2>
      <ul class="space-y-4">
        <li 
          v-for="nota in notasActivas" 
          :key="nota.id"
          class="bg-white rounded-lg shadow p-6 flex flex-col"
        >
          <!-- Cabecera de la tarjeta -->
          <h3 class="text-xl font-bold text-gray-900 mb-2 break-words">
            {{ nota.titulo }}
          </h3>
          
          <!-- Contenido -->
          <div 
            class="text-gray-700 mb-4 break-words max-h-24 overflow-y-auto pr-2 custom-scrollbar"
          >
            {{ nota.contenido }}
          </div>

          <!-- Botones -->
          <div class="mt-3 md:mt-0 flex flex-wrap justify-center gap-2">
            <button 
              @click="$emit('editar', nota)"
              class="w-[100px] px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              ✏️ Editar
            </button>
            <button 
              @click="eliminarNota(nota.id)"
              class="w-[100px] px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Eliminar
            </button>
            <button 
              @click="toggleArchivada(nota)"
              class="w-[100px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              📥 Archivar
            </button>
          </div>
        </li>
      </ul>
    </section>

    <!-- Columna Notas Archivadas -->
    <section>
      <h2 class="text-2xl font-semibold mb-4 text-gray-800">Notas archivadas</h2>
      <ul class="space-y-4">
        <li 
          v-for="nota in notasArchivadas" 
          :key="nota.id"
          class="bg-white rounded-lg shadow p-6 flex flex-col"
        >
          <h3 class="text-xl font-bold text-gray-900 mb-2 break-words">
            {{ nota.titulo }}
          </h3>
          <div 
            class="text-gray-700 mb-4 break-words max-h-24 overflow-y-auto pr-2 custom-scrollbar"
          >
            {{ nota.contenido }}
          </div>
          <div class="mt-3 md:mt-0 flex flex-wrap justify-center gap-2">
            <button 
              @click="$emit('editar', nota)"
              class="w-[100px] px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              ✏️ Editar
            </button>
            <button 
              @click="eliminarNota(nota.id)"
              class="w-[100px] px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              🗑️ Eliminar
            </button>
            <button 
              @click="toggleArchivada(nota)"
              class="w-[100px] px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              📤 Desarchivar
            </button>
          </div>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  data() {
    return {
      notasActivas: [],
      notasArchivadas: [],
    };
  },
  methods: {
    async cargarNotas() {
      const [act, arch] = await Promise.all([
        api.get('/notas/activas'),
        api.get('/notas/archivadas'),
      ]);
      this.notasActivas = act.data;
      this.notasArchivadas = arch.data;
    },
    async eliminarNota(id) {
      await api.delete(`/notas/${id}`);
      this.cargarNotas();
    },
    async toggleArchivada(nota) {
      await api.put(`/notas/${nota.id}`, {
        ...nota,
        archivada: !nota.archivada,
      });
      this.cargarNotas();
    },
  },
  mounted() {
    this.cargarNotas();
  },
};
</script>

<style scoped>
/* Necesitas habilitar line-clamp en tu tailwind.config.js:
   plugins: [require('@tailwindcss/line-clamp')] */
</style>
