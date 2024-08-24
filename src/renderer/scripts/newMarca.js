
// Evento para manejar la creación de marcas
document.getElementById("addBrand").addEventListener("click", () => {
  const content = `
    <div></div>
    <div>
      <h2>Agregar Marca</h2>
      <form id="addBrandForm">
        <div class="form-group mb-3">
          <label for="nombre_marca" class="mb-1">Nombre de la Marca</label>
          <input type="text" class="form-control inputMarca" id="nombre_marca" placeholder="Ingresa el nombre de la marca" required>
        </div>
        <button type="submit" class="btn btn-success btn-block btnsave">Guardar Marca</button>
      </form>
    </div>
    <div></div>
  `;
  dynamicContent.innerHTML = content;
  document.getElementById("addBrandForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const brandName = document.getElementById("nombre_marca").value;
    if (!brandName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un nombre de marca',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    }
    ipcRenderer.invoke("create-marca", { nombre_marca: brandName }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Marca agregada',
          text: 'La marca ha sido agregada con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("addBrandForm").reset();
        document.getElementById("viewBrands").click(); // Refrescar la lista
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar la marca',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al agregar la marca, intentelo más tarde',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        console.error("Error al agregar marca:", err);
      });
    });
});

// Evento para mostrar la lista de marcas
document.getElementById("viewBrands").addEventListener("click", () => {
  ipcRenderer.invoke("get-marca").then((brands) => {
    const content = `
        <h2>Lista de Marcas</h2>
        <table class="table table-striped tablita">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${brands
              .map(
                (brand) => `
              <tr>
                <td>${brand.nombre_marca}</td>
                <td>
                  <button class="btn btn-primary btn-sm btnmodificar" onclick="modifyBrand(${brand.id_marca}, '${brand.nombre_marca}')">Modificar</button>
                  <button class="btn btn-danger btn-sm btneliminar" onclick="deleteBrand(${brand.id_marca})">Eliminar</button>
                </td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
    `;
    dynamicContent.innerHTML = content;
  }).catch((err) => {
    console.error("Error al obtener marcas:", err);
  });
});

function modifyBrand(id, currentName) {
  const content = `
    <div></div>
    <div>
      <h2>Modificar Marca</h2>
      <form id="modifyBrandForm">
        <div class="form-group mb-2">
          <label for="nombre_marca">Nombre de la Marca</label>
          <input type="text" class="form-control mt-1 inputMarca" id="nombre_marca" value="${currentName}" required>
        </div>
        <button type="submit" class="btn btn-warning btn-block mt-2 btnmodsave">Guardar Cambios</button>
      </form>
    </div>
    <div></div>
  `;
  dynamicContent.innerHTML = content;
  document.getElementById("modifyBrandForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newBrandName = document.getElementById("nombre_marca").value;
    if (!newBrandName) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar un nombre para la marca',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    }ipcRenderer.invoke("update-marca", { id_marca: id, nombre_marca: newBrandName }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Exito',
          text: 'La marca ha sido modificada con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("viewBrands").click(); // Refrescar la lista
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo modificar la marca',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo modificar la marca, intentelo más tarde',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        console.error("Error al modificar marca:", err);
      });
    });
}

function deleteBrand(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esto",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarla',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.invoke("delete-marca", id).then((response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Exito',
            text: 'La marca ha sido eliminada con éxito',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          document.getElementById("viewBrands").click(); // Refrescar la lista
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar la marca',
              confirmButtonText: 'Aceptar',
              timer: 2000
            });
          }
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar la marca, intentelo más tarde',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          console.error("Error al eliminar marca:", err);
        });
      }
    });
}
