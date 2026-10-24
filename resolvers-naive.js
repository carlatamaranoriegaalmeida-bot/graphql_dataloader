import { db } from './database.js';

export const resolvers = {
  Query: {
    clientes: () => db.fetchAllClientes()
  },
  Cliente: {
    facturas: parent => db.fetchFacturasByClienteId(parent.id)
  }
};
