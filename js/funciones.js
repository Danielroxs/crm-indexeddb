let DB;

function conectarDB(callback) {
  const abrirConexion = window.indexedDB.open("crm", 1);

  abrirConexion.onupgradeneeded = function (e) {
    const db = e.target.result;

    if (!db.objectStoreNames.contains("crm")) {
      const objectStore = db.createObjectStore("crm", {
        keyPath: "id",
        autoIncrement: true,
      });

      objectStore.createIndex("nombre", "nombre", { unique: false });
      objectStore.createIndex("email", "email", { unique: true });
      objectStore.createIndex("telefono", "telefono", { unique: false });
      objectStore.createIndex("empresa", "empresa", { unique: false });
    }
  };

  abrirConexion.onerror = function () {
    console.log("❌ Hubo un error al abrir la base de datos");
  };

  abrirConexion.onsuccess = function () {
    DB = abrirConexion.result;
    console.log("✅ Base de datos conectada:", DB);

    if (callback) callback(); // Llamar al callback cuando DB esté lista
  };
}

function imprimirAlerta(mensaje, tipo) {
  const alerta = document.querySelector(".alerta");

  if (!alerta) {
    // Crear la alerta
    const divMensaje = document.createElement("div");
    divMensaje.classList.add(
      "px-4",
      "py-3",
      "rounded",
      "max-w-lg",
      "mx-auto",
      "mt-6",
      "text-center",
      "border",
      "alerta",
    );

    if (tipo === "error") {
      divMensaje.classList.add("bg-red-100", "border-red-400", "text-red-700");
    } else {
      divMensaje.classList.add(
        "bg-green-100",
        "border-green-400",
        "text-green-700",
      );
    }

    divMensaje.textContent = mensaje;

    formulario.appendChild(divMensaje);

    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
}
