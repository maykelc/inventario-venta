// Manejar la creación de modelos
document.getElementById("addModel").addEventListener("click", () => {
  // Cargar el formulario para agregar un nuevo modelo
  const content = `
  <div></div>
  <div>  
    <h2>Agregar Modelo</h2>
    <form id="addModelForm">
      <div class="form-group mb-3">
        <label for="nombre_modelo" class="mb-1">Nombre del Modelo</label>
        <input type="text" class="form-control inputModelo" id="nombre_modelo" placeholder="Ingresa el nombre del modelo" required>
      </div>
      <div class="form-group mb-3">
        <label for="marca_modelo" class="mb-1">Marca del Modelo</label>
        <select class="form-control inputModelo" id="marca_modelo" required></select>
      </div>
      <button type="submit" class="btn btn-success btn-block btnsave">Guardar Modelo</button>
    </form>
  </div>
  <div></div>
  `;
  dynamicContent.innerHTML = content;

  // Cargar las marcas en el select
  ipcRenderer.invoke("get-marca").then((brands) => {
    const marcaSelect = document.getElementById("marca_modelo");
    marcaSelect.innerHTML = brands.map((brand) => `<option value="${brand.id_marca}">${brand.nombre_marca}</option>`).join("");
  });

  // Manejar el envío del formulario para agregar un modelo
  document.getElementById("addModelForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const modelName = document.getElementById("nombre_modelo").value;
    const marcaId = document.getElementById("marca_modelo").value;
    if (!modelName || !marcaId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el nombre del modelo y seleccionar una marca',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    }
    ipcRenderer.invoke("create-modelo", { nombre_modelo: modelName, marca_id_marca: marcaId }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Modelo agregado',
          text: 'El modelo ha sido agregado con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("addModelForm").reset();
        document.getElementById("viewModels").click(); // Refrescar la lista
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo agregar el modelo',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al agregar el modelo, inténtelo más tarde',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        console.error("Error al agregar modelo:", err);
      });
    });
  }
);

// Mostrar la lista de modelos
document.getElementById("viewModels").addEventListener("click", () => {
  ipcRenderer.invoke("get-modelo").then((models) => {
    const content = `
      <h2>Lista de Modelos</h2>
      <table class="table table-striped tablita">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Marca</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${models
            .map((model) => `
              <tr>
                <td>${model.nombre_modelo}</td>
                <td>${model.nombre_marca}</td>
                <td>
                  <button class="btn btn-primary btn-sm btnmodificar" onclick="modifyModel(${model.id_modelo}, '${model.nombre_modelo}', ${model.id_marca})">Modificar</button>
                  <button class="btn btn-danger btn-sm btneliminar" onclick="deleteModel(${model.id_modelo})">Eliminar</button>
                </td>
              </tr>
            `)
            .join("")}
        </tbody>
      </table>
    `;
    dynamicContent.innerHTML = content;
  }).catch((err) => {
    console.error("Error al obtener modelos:", err);
  });
});

// Manejar la modificación de modelos
function modifyModel(id, currentName, marcaId) {
  // Cargar el formulario para modificar el modelo
  const content = `
    <div></div>
    <div>
      <h2>Modificar Modelo</h2>
      <form id="modifyModelForm">
        <div class="form-group mb-2">
          <label for="nombre_modelo">Nombre del Modelo</label>
          <input type="text" class="form-control mt-1 inputModelo" id="nombre_modelo" value="${currentName}" required>
        </div>
        <div class="form-group mb-2">
          <label for="marca_modelo">Marca del Modelo</label>
          <select class="form-control mt-1 inputModelo" id="marca_modelo" required></select>
        </div>
        <button type="submit" class="btn btn-warning btn-block mt-2 .btnmodsave">Guardar Cambios</button>
      </form>
    </div>  
    <div></div>
  `;
  dynamicContent.innerHTML = content;

  // Cargar las marcas en el select
  ipcRenderer.invoke("get-marca").then((brands) => {
    const marcaSelect = document.getElementById("marca_modelo");
    marcaSelect.innerHTML = brands.map((brand) => `<option value="${brand.id_marca}" ${brand.id_marca === marcaId ? 'selected' : ''}>${brand.nombre_marca}</option>`).join("");
  });

  // Manejar el envío del formulario para modificar un modelo
  document.getElementById("modifyModelForm").addEventListener("submit", (e) => {
    e.preventDefault();
    const newModelName = document.getElementById("nombre_modelo").value;
    const newMarcaId = document.getElementById("marca_modelo").value;
    if (!newModelName || !newMarcaId) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debes ingresar el nombre del modelo y seleccionar una marca',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      return;
    }
    ipcRenderer.invoke("update-modelo", { id_modelo: id, nombre_modelo: newModelName, marca_id_marca: newMarcaId }).then((response) => {
      if (response.success) {
        Swal.fire({
          icon: 'success',
          title: 'Modelo actualizado',
          text: 'El modelo ha sido actualizado con éxito',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("viewModels").click(); // Refrescar la lista
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo actualizar el modelo',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
        }
      }).catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Ocurrió un error al actualizar el modelo, inténtelo más tarde',
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        console.error("Error al actualizar modelo:", err);
      });
    });
}

// Manejar la eliminación de modelos
function deleteModel(id) {
  Swal.fire({
    title: '¿Estás seguro?',
    text: "No podrás revertir esto",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Sí, eliminarlo',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.invoke("delete-modelo", id).then((response) => {
        if (response.success) {
          Swal.fire({
            icon: 'success',
            title: 'Eliminado',
            text: 'El modelo ha sido eliminado con éxito',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          document.getElementById("viewModels").click(); // Refrescar la lista
          } else {
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'No se pudo eliminar el modelo',
              confirmButtonText: 'Aceptar',
              timer: 2000
            });
          }
        }).catch((err) => {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudo eliminar el modelo, inténtelo más tarde',
            confirmButtonText: 'Aceptar',
            timer: 2000
          });
          console.error("Error al eliminar modelo:", err);
        });
      }
    });
}
