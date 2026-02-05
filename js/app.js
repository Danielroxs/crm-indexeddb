(function () {
  const listadoClientes = document.querySelector("#listado-clientes");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB(() => {
      obtenerClientes();
    });

    listadoClientes.addEventListener("click", eliminarRegistro);
  });

  function eliminarRegistro(e) {
    if (e.target.classList.contains("eliminar")) {
      const idEliminar = Number(e.target.dataset.cliente);

      const confirmar = confirm("¿Deseas eliminar este cliente?");

      if (confirmar) {
        const transaction = DB.transaction(["crm"], "readwrite");
        const objectStore = transaction.objectStore("crm");

        objectStore.delete(idEliminar);

        transaction.oncomplete = function () {
          console.log("✅ Cliente eliminado correctamente");
          e.target.parentElement.parentElement.remove();
        };

        transaction.onerror = function () {
          console.log("❌ Hubo un error al eliminar el cliente");
        };
      }
    }
  }

  function obtenerClientes() {
    if (!DB) {
      console.error("❌ Base de datos no inicializada");
      return;
    }

    const objectStore = DB.transaction("crm").objectStore("crm");

    objectStore.openCursor().onsuccess = function (e) {
      const cursor = e.target.result;

      if (cursor) {
        const { nombre, empresa, email, telefono, id } = cursor.value;

        listadoClientes.innerHTML += ` 
                    <tr>
                        <td class="px-6 py-4 border-b border-gray-200">
                            <p class="text-lg font-bold text-gray-700">${nombre}</p>
                            <p class="text-sm text-gray-700">${email}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-200">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-200">
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 border-b border-gray-200 text-sm">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900 eliminar">Eliminar</a>
                        </td>
                    </tr>
                `;

        cursor.continue();
      } else {
        console.log("✅ No hay más registros");
      }
    };
  }
})();
