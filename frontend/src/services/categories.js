import api from './api';

export default {
  listar() {
    return api.get('/categorias');
  },
  crear(nombre) {
    return api.post('/categorias', { nombre });
  },
  eliminar(id) {
    return api.delete(`/categorias/${id}`);
  }
};
