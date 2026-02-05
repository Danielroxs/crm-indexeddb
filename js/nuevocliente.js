(function () {
  const formulario = document.querySelector("#formulario");

  document.addEventListener("DOMContentLoaded", () => {
    conectarDB(() => {
      console.log("✅ Base de datos lista, ahora puedes agregar clientes.");
      formulario.addEventListener("submit", validarCliente);
    });
  });

  function validarCliente(e) {
    e.preventDefault();
    console.log("🛠 Validando...");

    // Leer los inputs
    const nombre = document.querySelector("#nombre").value;
    const email = document.querySelector("#email").value;
    const telefono = document.querySelector("#telefono").value;
    const empresa = document.querySelector("#empresa").value;

    if (nombre === "" || email === "" || telefono === "" || empresa === "") {
      imprimirAlerta("❌ Todos los campos son obligatorios", "error");
      return;
    }

    const cliente = { nombre, email, telefono, empresa };

    crearNuevoCliente(cliente);
  }

  function crearNuevoCliente(cliente) {
    if (!DB) {
      console.error("❌ Error: Base de datos no inicializada");
      imprimirAlerta("❌ Hubo un error al agregar el cliente", "error");
      return;
    }

    const transaction = DB.transaction(["crm"], "readwrite");
    const objectStore = transaction.objectStore("crm");

    const request = objectStore.add(cliente);

    request.onsuccess = function () {
      console.log("✅ Cliente agregado correctamente:", cliente);
    };

    request.onerror = function (e) {
      console.error("❌ Error al agregar cliente:", e.target.error);
      imprimirAlerta("❌ Hubo un error al agregar el cliente", "error");
    };

    transaction.oncomplete = function () {
      imprimirAlerta("✅ Cliente creado exitosamente", "success");

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    };
  }
})();
