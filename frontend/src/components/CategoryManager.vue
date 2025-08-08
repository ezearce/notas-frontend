<template>
  <div class="fixed inset-0 z-40 flex items-center justify-center">
    <!-- backdrop -->
    <div class="absolute inset-0 bg-black/50" @click="close"></div>

    <!-- modal -->
    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-2xl p-6 z-50">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-semibold text-black">
          {{ mode === 'create' ? 'Crear categoría' : 'Categorías' }}
        </h3>
      </div>

      <!-- Crear -->
      <div v-if="mode === 'create'">
        <form @submit.prevent="crearCategoria" class="flex gap-3">
          <input v-model="nombre" placeholder="Nombre de la categoría"
                 class="flex-1 border rounded px-3 py-2" />
          <button type="submit" class="bg-indigo-600 text-white px-4 py-2 rounded">Crear</button>
        </form>

        <p v-if="mensaje" class="mt-3 text-sm text-green-600">{{ mensaje }}</p>
      </div>

      <!-- Listado -->
      <div v-else>
        <div class="mb-4">
          <input v-model="filtro" placeholder="Buscar..." class="w-full border rounded px-3 py-2" />
        </div>
        <ul class="space-y-2 max-h-64 overflow-auto pr-2">
          <li v-for="c in categoriasFiltradas" :key="c.id"
              class="flex items-center justify-between border rounded px-3 py-2 text-black">
            <span>{{ c.nombre }}</span>
            <div class="flex items-center gap-2">
              <button @click="borrar(c.id)" class="text-sm text-red-600">Eliminar</button>
            </div>
          </li>
        </ul>
      </div>

      <!-- footer: cambiar vista -->
      <div class="mt-4 flex justify-between items-center">
        <div>
          <button v-if="mode === 'list'" @click="mode = 'create'" class="px-3 py-1 bg-indigo-600 text-white rounded">
            Nueva categoría
          </button>
          <button v-else @click="mode = 'list'" class="px-3 py-1 border rounded">
            Ver listado
          </button>
        </div>
        <div>
          <button @click="close" class="px-3 py-1 rounded border">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import categoriesService from '../services/categories';

export default {
  props: {
    initialMode: { type: String, default: 'list' } // 'create' | 'list'
  },
  data() {
    return {
      mode: this.initialMode,
      nombre: '',
      mensaje: '',
      categorias: [],
      filtro: ''
    };
  },
  computed: {
    categoriasFiltradas() {
      const q = this.filtro.trim().toLowerCase();
      if (!q) return this.categorias;
      return this.categorias.filter(c => c.nombre.toLowerCase().includes(q));
    }
  },
  async mounted() {
    await this.cargar();
  },
  methods: {
    async cargar() {
      try {
        const res = await categoriesService.listar();
        this.categorias = res.data || [];
      } catch (err) {
        console.error('Error cargando categorias', err);
      }
    },
    async crearCategoria() {
      if (!this.nombre.trim()) return;
      try {
        await categoriesService.crear(this.nombre.trim());
        this.nombre = '';
        this.mensaje = 'Categoría creada';
        await this.cargar();
        this.$emit('categorias-actualizadas');
      } catch (err) {
        console.error(err);
        this.mensaje = 'Error al crear';
      }
    },
    async borrar(id) {
      if (!confirm('Eliminar categoría?')) return;
      try {
        await categoriesService.eliminar(id);
        await this.cargar();
        this.$emit('categorias-actualizadas');
      } catch (err) {
        console.error(err);
      }
    },
    close() {
      this.$emit('close');
    }
  }
};
</script>

<style scoped>
/* modal sencillo, ya usa utilidades de Tailwind */
</style>
