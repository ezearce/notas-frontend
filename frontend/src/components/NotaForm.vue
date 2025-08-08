<template>
  <form @submit.prevent="guardarNota" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Título</label>
      <input
        v-model="nota.titulo"
        type="text"
        placeholder="Título de la nota"
        required
        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Contenido</label>
      <textarea
        v-model="nota.contenido"
        placeholder="Escribe aquí tu nota..."
        required
        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 h-32"
      ></textarea>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Categorías</label>
      <!-- Checkbox list simple -->
      <div class="grid grid-cols-2 gap-2 max-h-40 overflow-auto pr-2">
        <label v-for="c in categorias" :key="c.id" class="inline-flex items-center gap-2 text-black">
          <input type="checkbox" :value="c.id" v-model="selectedCategoryIds" class="h-4 w-4" />
          <span>{{ c.nombre }}</span>
        </label>
      </div>
    </div>

    <div class="flex items-center gap-2">
      <input id="archivada" type="checkbox" v-model="nota.archivada" class="h-4 w-4" />
      <label for="archivada" class="ml-2 block text-sm text-gray-700">Archivada</label>
    </div>

    <div class="flex justify-end space-x-2">
      <button type="button" @click="$emit('cancelar')" class="px-4 py-2 border rounded">Cancelar</button>
      <button type="submit" class="px-4 py-2 bg-green-600 text-white rounded">Guardar</button>
    </div>
  </form>
</template>

<script>
import api from '../services/api';
import categoriesService from '../services/categories';

export default {
  props: { notaEditada: Object },
  data() {
    return {
      nota: { id: null, titulo: '', contenido: '', archivada: false, categorias: [] },
      categorias: [],
      selectedCategoryIds: []
    };
  },
  watch: {
    notaEditada: {
      immediate: true,
      handler(n) {
        if (n) {
          this.nota = { ...n };
          // si el objeto nota trae categorias, mapear ids
          this.selectedCategoryIds = (n.categorias || []).map(c => c.id);
        } else {
          this.nota = { id: null, titulo: '', contenido: '', archivada: false, categorias: [] };
          this.selectedCategoryIds = [];
        }
      }
    }
  },
  async mounted() {
    const res = await categoriesService.listar();
    this.categorias = res.data || [];
  },
  methods: {
    async guardarNota() {
      // 1) crear o actualizar nota (sin sincronizar categorias aún)
      let saved;
      if (this.nota.id) {
        const resp = await api.put(`/notas/${this.nota.id}`, {
          titulo: this.nota.titulo,
          contenido: this.nota.contenido,
          archivada: this.nota.archivada
        });
        saved = resp.data;
      } else {
        const resp = await api.post('/notas', {
          titulo: this.nota.titulo,
          contenido: this.nota.contenido,
          archivada: this.nota.archivada
        });
        saved = resp.data;
      }

      const notaId = saved.id;

      // 2) sincronizar categorías: comparar lo seleccionado con lo actual del servidor (si existe)
      // Obtener categorías actuales desde el servidor para esta nota (si endpoint devuelve categorias en nota, podríamos usar saved.categorias)
      // Para ser robustos, hacemos una llamada GET /notas/{id}
      const currentRes = await api.get(`/notas/${notaId}`);
      const currentCatIds = (currentRes.data.categorias || []).map(c => c.id);

      // categorias a agregar
      const toAdd = this.selectedCategoryIds.filter(id => !currentCatIds.includes(id));
      // categorias a eliminar
      const toRemove = currentCatIds.filter(id => !this.selectedCategoryIds.includes(id));

      await Promise.all([
        ...toAdd.map(id => api.post(`/notas/${notaId}/categorias/${id}`)),
        ...toRemove.map(id => api.delete(`/notas/${notaId}/categorias/${id}`))
      ]);

      this.$emit('guardado');
    }
  }
};
</script>
