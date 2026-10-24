import DataLoader from 'dataloader';

export function createDataLoaders(db) {
  return {
    facturasPorCliente: new DataLoader(clienteIds =>
      db.fetchFacturasByClienteIdsBatch(clienteIds)
    )
  };
}
