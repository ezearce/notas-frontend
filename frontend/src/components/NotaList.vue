<template>
  <div>
    <!-- Filtro por categoría -->
    <div class="mb-4 flex items-center justify-between gap-4">
      <div class="flex items-center gap-2">
        <label class="font-medium">Filtrar por categoría:</label>
        <select v-model="selectedCategoryId" class="border rounded px-2 py-1">
          <option :value="null">Todas</option>
          <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
        </select>
      </div>

    </div>

    <!-- Grid de notas -->
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
            <h3 class="text-xl font-bold text-gray-900 mb-2 break-words">
              {{ nota.titulo }}
            </h3>

            <div
              class="text-gray-700 mb-4 break-words max-h-28 overflow-y-auto pr-2 custom-scrollbar"
            >
              {{ nota.contenido }}
            </div>

            <div class="mt-auto flex flex-wrap justify-center gap-2">
              <button
                @click="$emit('editar', nota)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-base sm:text-sm"
              >
                ✏️ Editar
              </button>

              <button
                @click="eliminarNota(nota.id)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600 text-base sm:text-sm"
              >
                🗑️ Eliminar
              </button>

              <button
                @click="toggleArchivada(nota)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-base sm:text-sm"
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
              class="text-gray-700 mb-4 break-words max-h-28 overflow-y-auto pr-2 custom-scrollbar"
            >
              {{ nota.contenido }}
            </div>

            <div class="mt-auto flex flex-wrap justify-center gap-2">
              <button
                @click="$emit('editar', nota)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600 text-base sm:text-sm"
              >
                ✏️ Editar
              </button>

              <button
                @click="eliminarNota(nota.id)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-red-500 text-white rounded hover:bg-red-600 text-base sm:text-sm"
              >
                🗑️ Eliminar
              </button>

              <button
                @click="toggleArchivada(nota)"
                class="w-[120px] sm:w-[90px] px-4 py-2 sm:px-2 sm:py-1 bg-green-500 text-white rounded hover:bg-green-600 text-base sm:text-sm"
              >
                📤 Desarchivar
              </button>
            </div>
          </li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import categoriesService from '../services/categories';

export default {
  data() {
    return {
      notasActivas: [],
      notasArchivadas: [],
      categorias: [],
      selectedCategoryId: null,
    };
  },
  watch: {
    selectedCategoryId: 'cargarNotas'
  },
  methods: {
    async cargarNotas() {
      try {
        if (this.selectedCategoryId) {
          // trae todas las notas de la categoria y luego las divide por archivada
          const res = await api.get(`/notas/por-categoria/${this.selectedCategoryId}`);
          const notas = res.data || [];
          this.notasActivas = notas.filter(n => !n.archivada);
          this.notasArchivadas = notas.filter(n => n.archivada);
        } else {
          const [act, arch] = await Promise.all([
            api.get('/notas/activas'),
            api.get('/notas/archivadas'),
          ]);
          this.notasActivas = act.data;
          this.notasArchivadas = arch.data;
        }
      } catch (err) {
        console.error('Error cargando notas:', err);
      }
    },
    async eliminarNota(id) {
      try {
        await api.delete(`/notas/${id}`);
        await this.cargarNotas();
      } catch (err) {
        console.error('Error eliminando nota:', err);
      }
    },
    async toggleArchivada(nota) {
      try {
        await api.put(`/notas/${nota.id}`, {
          ...nota,
          archivada: !nota.archivada,
        });
        await this.cargarNotas();
      } catch (err) {
        console.error('Error actualizando nota:', err);
      }
    }
  },
  async mounted() {
    try {
      const res = await categoriesService.listar();
      this.categorias = res.data || [];
    } catch (err) {
      console.error('Error cargando categorias:', err);
    }
    await this.cargarNotas();
  }
};
</script>

<style scoped>
/* Necesitas habilitar line-clamp en tu tailwind.config.js:
   plugins: [require('@tailwindcss/line-clamp')] */
</style>
