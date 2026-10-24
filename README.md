# Práctica de Laboratorio: Optimización de Modelos de Datos con GraphQL y DataLoader

Este repositorio contiene el código base para la práctica de la **Unidad 3: Diseño de APIs** en la Maestría de Ingeniería de Software (Materia: *Patrones de Diseño de Software*).

## 🎯 Objetivo de la Práctica
El propósito de este laboratorio es diseñar e implementar un contrato de API utilizando **GraphQL (Schema-First Design)** e identificar y resolver un problema crítico de rendimiento en sistemas distribuidos: el **Problema de Consulta N+1**.

Al finalizar el laboratorio, habrás aprendido a:
1. Traducir modelos de datos jerárquicos a un esquema de tipos estricto (SDL).
2. Diagnosticar cuellos de botella en la capa de datos analizando los logs de ejecución.
3. Implementar el patrón de diseño **DataLoader** en Node.js para agrupar peticiones por lotes (*batching*) y manejar caché por ciclo de vida de petición (*per-request caching*).

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado en tu entorno local:
* **Node.js** (Versión 18.0.0 o superior)
* Un cliente HTTP para pruebas (como [Postman](https://postman.com) o la misma interfaz integrada de Apollo Sandbox).

---

## 🚀 Instrucciones de Configuración Inicial

Sigue estos pasos para inicializar el proyecto en tu máquina local:

### 1. Inicializar el Proyecto de Node.js
Si deseas construir el entorno desde cero, crea un directorio ejecútalo en tu terminal:
```bash
npm init -y
```

### 2. Configurar Soporte para Módulos de ECMAScript (ES Modules)
Abre el archivo `package.json` generado y asegúrate de añadir la propiedad `"type": "module"` para permitir el uso nativo de `import/export`:
```json
{
  "name": "laboratorio-graphql-dataloader",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "dependencies": {}
}
```

### 3. Instalar las Dependencias Core
Instala las librerías necesarias para levantar el servidor y aplicar la optimización:
```bash
npm install @apollo/server graphql dataloader
```

### 4. Estructura del proyecto
El proyecto separa el esquema, los resolutores y el cargador por lotes:
* `schema.graphql`: contrato SDL de clientes, facturas y la consulta raíz.
* `resolvers-naive.js`: variante ingenua, que consulta las facturas por cada cliente.
* `resolvers.js`: variante optimizada, que obtiene las facturas a través de DataLoader.
* `dataloaders.js`: crea los cargadores usados por una petición.
* `database.js`: persistencia simulada y consultas individuales y por lotes.
* `server.js`: inicializa Apollo Server y lee el esquema SDL desde el archivo.

### 5. Ejecutar el Servidor
Inicia la aplicación ejecutando:
```bash
node server.js
```
Deberías ver en tu consola el siguiente mensaje:
`🚀 Servidor Académico listo en: http://localhost:4000/`

---

## 🔍 Guía de Ejecución y Diagnóstico (El Reto Técnico)

### Fase 1: Reproducir el Problema N+1 (Estado Ingenuo)
Para ejecutar la variante ingenua, cambia en `server.js` el import de `./resolvers.js` por `./resolvers-naive.js` y reinicia el servidor.

1. Abre tu navegador e ingresa a `http://localhost:4000/` para abrir el entorno de pruebas de **Apollo Sandbox**.
2. Ejecuta la siguiente consulta jerárquica para simular los requerimientos de un Dashboard empresarial:
   ```graphql
   query GetDashboardData {
     clientes {
       nombre
       sector
       facturas {
         monto
       }
     }
   }
   ```
3. **Observa la consola de tu terminal.** La base simulada contiene 5 clientes, por lo que el servidor ejecuta **6 consultas simuladas** (`1` para obtener los clientes y `N` individuales para las facturas).
4. El tiempo de respuesta acumulado se degrada drásticamente debido a las llamadas secuenciales redundantes a la capa de datos.

### Fase 2: Implementación de la Solución (Objetivo de Evaluación)
La variante optimizada ya está conectada por defecto en `server.js`. `database.js` agrupa las facturas para todos los `clienteIds` solicitados en una sola operación; `dataloaders.js` adapta ese método al contrato de DataLoader; y `server.js` crea los loaders dentro de `context` para cada petición. El resolver `Cliente.facturas` utiliza `.load()` para obtener sus facturas.

Ejecuta la misma consulta. Debes observar **2 consultas simuladas en total**: una para los clientes y una consulta por lotes para las facturas. Para volver a la variante optimizada después de probar la ingenua, restaura el import de `./resolvers.js` en `server.js`.

---

## 📝 Formato de Entrega

Deberás subir a la plataforma institucional un archivo comprimido (`.zip`) con el nombre `Apellido_Nombre_Practica3_GraphQL` que contenga el servidor funcional y optimizado, el esquema `schema.graphql`, `resolvers.js`, `resolvers-naive.js`, `dataloaders.js` y `database.js`. Indica en un breve archivo de texto (`reporte.txt` o modificado en este documento) que la consulta de dashboard optimizada imprime 2 consultas simuladas en consola.

*Nota: Excluye explícitamente la carpeta `node_modules/` al empaquetar tu entrega.*
