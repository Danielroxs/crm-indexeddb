(function () {
  let idCliente;

  const nombreInput = document.querySelector("#nombre");
  const emailInput = document.querySelector("#email");
  const telefonoInput = document.querySelector("#telefono");
  const empresaInput = document.querySelector("#empresa");

  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB(() => {
      obtenerCliente();
      formulario.addEventListener("submit", actualizarCliente);
    });
  });

  function obtenerCliente() {
    const parametroURL = new URLSearchParams(window.location.search);
    idCliente = parametroURL.get("id");

    if (!DB) {
      console.error("❌ Error: Base de datos no inicializada");
      return;
    }

    const transaction = DB.transaction(["crm"], "readonly");
    const objectStore = transaction.objectStore("crm");
    const request = objectStore.get(Number(idCliente));

    request.onsuccess = function (e) {
      if (request.result) {
        llenarFormulario(request.result);
      } else {
        console.log("❌ Cliente no encontrado");
      }
    };
  }

  function llenarFormulario(cliente) {
    const { nombre, email, telefono, empresa } = cliente;

    nombreInput.value = nombre;
    emailInput.value = email;
    telefonoInput.value = telefono;
    empresaInput.value = empresa;
  }

  function actualizarCliente(e) {
    e.preventDefault();

    if (!DB) {
      console.error("❌ Error: Base de datos no inicializada");
      return;
    }

    const clienteActualizado = {
      nombre: nombreInput.value,
      email: emailInput.value,
      empresa: empresaInput.value,
      telefono: telefonoInput.value,
      id: Number(idCliente),
    };

    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");
    objectStore.put(clienteActualizado);

    transaction.oncomplete = function () {
      imprimirAlerta("✅ Cliente actualizado correctamente");
      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };
  }
})();
