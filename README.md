# CRM - IndexedDB

Aplicación web tipo CRM para la gestión de clientes, desarrollada con JavaScript Vanilla y Tailwind CSS.  
La información se persiste localmente utilizando IndexedDB.

## 🚀 Demo

Proyecto ejecutado en entorno local (IndexedDB).

## 🛠️ Tecnologías

- JavaScript (ES6+)
- IndexedDB
- Tailwind CSS
- HTML5

## ✨ Funcionalidades

- Crear nuevos clientes
- Listar clientes registrados
- Editar clientes
- Eliminar clientes
- Validación de formularios
- Persistencia de datos con IndexedDB
- Diseño responsive

## 📂 Estructura del proyecto

- `index.html` → Listado de clientes
- `nuevo-cliente.html` → Alta de clientes
- `editar-cliente.html` → Edición de clientes
- `js/funciones.js` → Conexión y utilidades de IndexedDB
- `js/app.js` → Renderizado y eliminación de clientes
- `js/nuevocliente.js` → Creación de clientes
- `js/editarcliente.js` → Actualización de clientes

## 🧠 Aprendizajes

- Uso de IndexedDB para persistencia del lado del cliente
- Manejo de transacciones y objectStores
- Separación de responsabilidades en JavaScript
- Construcción de interfaces responsive con Tailwind CSS

## 📌 Próximas mejoras

- Migración a React
- Uso de ES Modules
- Mejorar manejo de errores
- Confirmaciones visuales con modales

---

## ℹ️ Contexto técnico

Este proyecto fue desarrollado sin frameworks con el objetivo de comprender en profundidad la lógica de frontend, el manejo del DOM y el uso de APIs del navegador antes de escalar la aplicación a React u otros frameworks modernos.

## ▶️ Cómo ejecutar el proyecto

1. Inicia un servidor local en la carpeta del proyecto (por ejemplo con Live Server).
2. Abre `index.html`.
3. Crea un cliente desde "Nuevo Cliente" y vuelve al listado.

## 📝 Notas

- IndexedDB es asincrónico: la aplicación espera a que la conexión esté lista antes de operar.
- Si se modifica la estructura de la base de datos, es necesario incrementar la versión en `indexedDB.open`.
