import { db } from './database.js';

export const resolvers = {
  Query: {
    clientes: () => db.fetchAllClientes()
  },
  Cliente: {
    facturas: (parent, _, { loaders }) =>
      loaders.facturasPorCliente.load(parent.id)
  }
};
