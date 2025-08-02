<template>
  <form @submit.prevent="guardarNota" class="space-y-4">
    <div>
      <label class="block text-sm font-medium text-gray-700">Título</label>
      <input
        v-model="nota.titulo"
        type="text"
        placeholder="Título de la nota"
        required
        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700">Contenido</label>
      <textarea
        v-model="nota.contenido"
        placeholder="Escribe aquí tu nota..."
        required
        class="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 h-32 resize-y focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      ></textarea>
    </div>

    <div class="flex items-center">
      <input 
        id="archivada" 
        type="checkbox" 
        v-model="nota.archivada"
        class="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
      />
      <label for="archivada" class="ml-2 block text-sm text-gray-700">Archivada</label>
    </div>

    <div class="flex justify-end space-x-2">
      <button
        type="button"
        @click="$emit('cancelar')"
        class="px-4 py-2 border border-gray-300 rounded hover:bg-gray-500"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
      >
        Guardar
      </button>
    </div>
  </form>
</template>

<script>
import api from '../services/api';

export default {
  props: {
    notaEditada: Object,
  },
  data() {
    return {
      nota: {
        id: null,
        titulo: '',
        contenido: '',
        archivada: false,
      },
    };
  },
  watch: {
    notaEditada: {
      immediate: true,
      handler(nuevaNota) {
        this.nota = nuevaNota
          ? { ...nuevaNota }
          : { id: null, titulo: '', contenido: '', archivada: false };
      },
    },
  },
  methods: {
    async guardarNota() {
      if (this.nota.id) {
        await api.put(`/notas/${this.nota.id}`, this.nota);
      } else {
        await api.post('/notas', this.nota);
      }
      this.$emit('guardado');
    },
  },
};
</script>
