const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');

// Evento para agregar categoría
document.getElementById("addCategory").addEventListener("click", () => {
  const content = `
    <div></div>
    <div>
      <h2>Agregar Categoría</h2>
      <form id="addCategoryForm">
        <div class="form-group mb-3">
          <label for="nombre_catg" class="mb-2">Nombre de la Categoría</label>
          <input type="text" class="form-control inputcat" id="nombre_catg" placeholder="Ingresa el nombre de la categoría">
        </div>
        <button type="submit" class="btn btn-success btn-block btnaddcat">Guardar Categoría</button>
        </form>
    </div>
    <div></div>
  `;
  dynamicContent.innerHTML = content;
  document.getElementById("addCategoryForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const categoryName = document.getElementById("nombre_catg").value;
    if(!categoryName){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un nombre de categoría',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    };

    ipcRenderer.invoke("create-categoria", { nombre_catg: categoryName }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Categoría agregada',
          text: 'La categoría ha sido agregada con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("addCategoryForm").reset();
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo agregar la categoría',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("addCategoryForm").reset();
      }
    }).catch((err) => {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al agregar la categoría, intentelo mas tarde.',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      console.error("Error al agregar categoría:", err);
    });
  });
});

// Evento para mostrar categorías
document.getElementById("viewCategories").addEventListener("click", () => {
  ipcRenderer.invoke("get-categoria").then((categories) => {
    const content = `
        <div class="table-container">
          <h2 class=titlecat>Categorías </h2>
          <table class="table table-striped tablita">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              ${categories
                .map(
                  (category) => `
                <tr>
                  <td>${category.nombre_catg}</td>
                  <td >
                    <button class="btn btn-primary btn-sm btnmodificar" onclick="modifyCategory(${category.id_categoria}, '${category.nombre_catg}')">Modificar</button>
                    <button class="btn btn-danger btn-sm btneliminar" onclick="deleteCategory(${category.id_categoria})">Eliminar</button>
                  </td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
    `;
    dynamicContent.innerHTML = content;
  }).catch((err) => {
    console.error("Error al obtener categorías:", err);
  });
});

// Función para modificar categoría
function modifyCategory(id, currentName) {
  const content = `
    <div></div>
    <div>
      <h2>Modificar Categoría</h2>
      <form id="modifyCategoryForm">
        <div class="form-group mb-3">
          <label for="nombre_catg" class="mb-1">Nombre de la Categoría</label>
          <input type="text" class="form-control inputcat " id="nombre_catg" value="${currentName}">
        </div>
        <button type="submit" class="btn btn-warning btn-block btnModCat">Guardar Cambios</button>
      </form>
    </div>
    <div></div>
  `;
  dynamicContent.innerHTML = content;
  document.getElementById("modifyCategoryForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newCategoryName = document.getElementById("nombre_catg").value;
    if(!newCategoryName){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un nombre para la categoría',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    };
    ipcRenderer.invoke("update-categoria", {
      nombre_catg: newCategoryName,
      id_categoria: id,
    }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Categoría modificada con éxito',
          text: 'La categoría ha sido modificada con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("viewCategories").click(); // Refrescar la lista
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'La categoría no ha sido modificada',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          document.getElementById("modifyCategoryForm").reset();
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ha ocurrido un error al modificar la categoría, intentelo mas tarde.',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        console.error("Error al modificar categoría:", err);
      });
    });
}

// Función para eliminar categoría
function deleteCategory(id) {
  Swal.fire({
    icon: 'warning',
    title: 'Eliminar Categoría',
    text: '¿Estás seguro de que deseas eliminar esta categoría?',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.invoke("delete-categoria", id).then((response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Categoría eliminada con éxito',
            text: 'La categoría ha sido eliminada con éxito',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          document.getElementById("viewCategories").click(); // Refrescar la lista
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'La categoría no ha sido eliminada',
              confirmButtonText: 'Aceptar',
              timer: 2000
            });
          }
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ha ocurrido un error al eliminar la categoría, intentelo mas tarde.',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          console.error("Error al eliminar categoría:", err);
        });
      }
    });
}
