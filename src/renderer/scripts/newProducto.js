// AGREGAR PRODUCTO
document.getElementById("addProduct").addEventListener("click", () => {
  ipcRenderer.invoke("getCategoriesAndBrandsAndModels").then((data) => {
    const categories = data.categorias;
    const brands = data.marcas;
    const models = data.modelos;
    const content = `
      <div></div>
      <div>
        <h2>Agregar Producto</h2>
        <div class="">
          <form id="addProductForm" class="">
            <div class="form-group mb-2">
              <label for="nombre_producto">Nombre del Producto</label>
              <input type="text" class="form-control inputAddpro" id="nombre_producto" placeholder="Ingresa el nombre del producto" required>
            </div>
            <div class="form-group mb-2">
              <label for="categoria_producto">Categoría</label>
              <select class="form-control inputAddpro" id="categoria_producto">
                ${categories.map((category) => `
                  <option value="${category.id_categoria}">
                    ${category.nombre_catg}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="marca_producto">Marca</label>
              <select class="form-control inputAddpro" id="marca_producto">
                ${brands.map((brand) => `
                  <option value="${brand.id_marca}">
                    ${brand.nombre_marca}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="modelo_producto">Modelo</label>
              <select class="form-control inputAddpro" id="modelo_producto">
                ${models.map((model) => `
                  <option value="${model.id_modelo}">
                    ${model.nombre_modelo}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-2">
              <label for="stockprod">Stock</label>
              <input type="number" class="form-control inputAddpro" id="stockprod" required placeholder="Ingresa cantidad del producto">
            </div>
            <div class="form-group mb-2">
              <label for="code_barra">Código de Barra</label>
              <input type="text" class="form-control inputAddpro" id="code_barra" placeholder="Ingresa el código de barra del producto" required>
            </div>
            <div class="form-group mb-2">
              <label for="precio_producto">Precio</label>
              <input type="number" class="form-control mb-3 inputAddpro" id="precio_producto" placeholder="Ingresa el precio del producto" required>
            </div>
            <button type="submit" class="btn btn-success btn-block btnsave">Guardar Producto</button>
          </form>
        </div>
      </div>
      <div></div>
    `;
    dynamicContent.innerHTML = content;
    document.getElementById("addProductForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const productName = document.getElementById("nombre_producto").value;
      const categoryId = document.getElementById("categoria_producto").value;
      const brandId = document.getElementById("marca_producto").value;
      const modelId = document.getElementById("modelo_producto").value;
      const productPrice = document.getElementById("precio_producto").value;
      const stock = document.getElementById("stockprod").value;
      const codeBarra = document.getElementById("code_barra").value;
      
      if (!productName || !categoryId || !brandId || !modelId || !productPrice || !stock || !codeBarra) {
        Swal.fire({
          title: "Error",
          text: "Por favor, complete todos los campos",
          icon: "error",
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        return;
      }ipcRenderer.invoke("create-producto", {
        descrip_producto: productName,
        code_barra: codeBarra,
        precio: productPrice,
        stock: stock,
        categoria_id_categoria: categoryId,
        modelo_id_modelo: modelId,
        marca_id_marca: brandId
      }).then((response) => {
        Swal.fire({
          title: "Producto agregado con éxito",
          text: "El producto ha sido agregado con éxito",
          icon: "success",
          confirmButtonText: 'Aceptar',
          timer: 2000
        });
        document.getElementById("addProductForm").reset();
        viewProducts();
      }).catch((err) => {
        console.error("Error al agregar producto:", err);
      });
    });
  }).catch((err) => {
    Swal.fire({
      title: "Error",
      text: "Ha ocurrido un error al obtener categorías, marcas y modelos",
      icon: "error",
      confirmButtonText: "Aceptar",
      timer: 2000
    });
    console.error("Error al obtener categorías, marcas y modelos:", err);
  });
});

// VER PRODUCTOS
document.getElementById("viewProducts").addEventListener("click", () => {
  ipcRenderer.invoke("getProducts").then((products) => {
    const content = `
        <h2>Lista de Productos</h2>
        <table class="table table-striped tablitaa">
          <thead>
            <tr>
              <th>Descripción del Producto</th>
              <th>Modelo</th>
              <th>Marca</th>
              <th>Categoría</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((product) => `
              <tr>
                <td>${product.descrip_producto}</td>
                <td>${product.nombre_modelo}</td>
                <td>${product.nombre_marca}</td>
                <td>${product.nombre_catg}</td>
                <td>${product.precio}</td>
                <td>
                  <button class="btn btn-primary btn-sm btnmodificar" onclick="modifyProduct(${product.id_producto})">Modificar</button>
                  <button class="btn btn-danger btn-sm btneliminar" onclick="deleteProduct(${product.id_producto})">Eliminar</button>
                </td>
              </tr>
            `).join("")}
          </tbody>
        </table>
      `;
    dynamicContent.innerHTML = content;
  }).catch((err) => {
    console.error("Error al obtener productos:", err);
  });
});

// MODIFICAR PRODUCTO
function modifyProduct(id) {
  ipcRenderer.invoke("get-producto-by-id", id).then((response) => {
    if (response.success) {
      const product = response.data;
      ipcRenderer.invoke("getCategoriesAndBrandsAndModels").then((data) => {
        const categories = data.categorias;
        const brands = data.marcas;
        const models = data.modelos;
        const content = `
        <div></div>
        <div>
          <h2>Modificar Producto</h2>
          <form id="modifyProductForm">
            <div class="form-group mb-3">
              <label for="nombre_producto">Nombre del Producto:</label>
              <input type="text" class="form-control inputAddpro" id="nombre_producto" value="${product.descrip_producto}" required>
            </div>
            <div class="form-group mb-3">
              <label for="stock_producto">Stock</label>
              <input type="number" class="form-control inputAddpro" id="stock_producto" value="${product.stock}" required>
            </div>
            <div class="form-group mb-3">
              <label for="code_barra">Código de Barra</label>
              <input type="text" class="form-control inputAddpro" id="code_barra" value="${product.code_barra}" required>
            </div>
            <div class="form-group mb-3">
              <label for="categoria_producto">Categoría</label>
              <select class="form-control inputAddpro" id="categoria_producto">
                ${categories.map((category) => `
                  <option value="${category.id_categoria}" ${Number(category.id_categoria) === Number(product.categoria_id_categoria) ? "selected" : ""}>
                    ${category.nombre_catg}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="marca_producto">Marca</label>
              <select class="form-control inputAddpro" id="marca_producto">
                ${brands.map((brand) => `
                  <option value="${brand.id_marca}" ${Number(brand.id_marca) === Number(product.marca_id_marca) ? "selected" : ""}>
                    ${brand.nombre_marca}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="modelo_producto">Modelo</label>
              <select class="form-control inputAddpro" id="modelo_producto">
                ${models.map((model) => `
                  <option value="${model.id_modelo}" ${Number(model.id_modelo) === Number(product.modelo_id_modelo) ? "selected" : ""}>
                    ${model.nombre_modelo}
                  </option>`).join("")}
              </select>
            </div>
            <div class="form-group mb-3">
              <label for="precio_producto">Precio</label>
              <input type="number" class="form-control inputAddpro" id="precio_producto" value="${product.precio}" required>
            </div>
            <button type="submit" class="btn btn-success btn-block btnmodsave">Guardar Cambios</button>
          </form>
        </div>
        <div></div>
        `;
        dynamicContent.innerHTML = content;
        document.getElementById("modifyProductForm").addEventListener("submit", (e) => {
          e.preventDefault();
          const productName = document.getElementById("nombre_producto").value;
          const stock = document.getElementById("stock_producto").value;
          const codeBarra = document.getElementById("code_barra").value;
          const categoryId = document.getElementById("categoria_producto").value;
          const brandId = document.getElementById("marca_producto").value;
          const modelId = document.getElementById("modelo_producto").value;
          const productPrice = document.getElementById("precio_producto").value;
          ipcRenderer.invoke("update-producto", {
            id_producto: id,
            descrip_producto: productName,
            code_barra: codeBarra,
            stock: stock,
            precio: productPrice,
            categoria_id_categoria: categoryId,
            marca_id_marca: brandId,
            modelo_id_modelo: modelId
          }).then((response) => {
            if (response.success) {
              Swal.fire({
                title: "Producto modificado con éxito",
                text: "El producto ha sido modificado con éxito",
                icon: "success",
                confirmButtonText: 'Aceptar',
                timer: 2000
              });
              viewProducts();
            } else {
              Swal.fire({
                title: "Error",
                text: "Ha ocurrido un error al modificar el producto",
                icon: "error",
                confirmButtonText: 'Aceptar',
                timer: 2000
              });
            }
          }).catch((err) => {
            Swal.fire({
              title: "Error",
              text: "Ha ocurrido un error al modificar el producto",
              icon: "error",
              confirmButtonText: "Aceptar",
              timer: 2000
            });
            console.error("Error al modificar producto:", err);
          });
        });
      });
    } else {
      Swal.fire({
        title: "Error",
        text: "Producto no encontrado",
        icon: "error",
        confirmButtonText: "Aceptar",
        timer: 2000
      });
    }}).catch((err) => {
      Swal.fire({
        title: "Error",
        text: "Ha ocurrido un error al obtener los datos del producto",
        icon: "error",
        confirmButtonText: "Aceptar",
        timer: 2000
      });
      console.error("Error al obtener producto:", err);
    });
}

// ELIMINAR PRODUCTO
function deleteProduct(id) {
  Swal.fire({
    title: "¿Estás seguro?",
    text: "No podrás revertir esto",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  }).then((result) => {
    if (result.isConfirmed) {
      ipcRenderer.invoke("delete-producto", id).then((response) => {
        if (response.success) {
          Swal.fire({
            title: "Producto eliminado",
            text: "El producto ha sido eliminado con éxito",
            icon: "success",
            confirmButtonText: "Aceptar",
            timer: 2000
          });
          viewProducts();
        } else {
        }}).catch((err) => {
          viewProducts();
          console.error("Error al eliminar producto:", err);
        });
    }
  });
}
