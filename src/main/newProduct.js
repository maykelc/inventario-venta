const { ipcRenderer } = require("electron");

document.addEventListener("DOMContentLoaded", () => {
  const dynamicContent = document.getElementById("dynamicContent");

  // Función para cargar contenido dinámico
  function loadContent(url) {
    fetch(url)
      .then((response) => response.text())
      .then((data) => {
        dynamicContent.innerHTML = data;
      })
      .catch((error) => console.error("Error al cargar el contenido:", error));
  }

});
