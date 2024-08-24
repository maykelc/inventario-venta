const { ipcRenderer } = require("electron");

// Función para obtener ventas por vendedor y actualizar la tabla
async function loadVentasByVendedor(vendedorId) {
  try {
    const result = await ipcRenderer.invoke("get-venta", vendedorId);
    if (result.success) {
      const ventas = result.data;
      updateVentasTable(ventas);
    } else {
      console.error("Error al obtener ventas por vendedor:", result.error);
    }
  } catch (error) {
    console.error("Error en la llamada IPC:", error);
  }
}

// Función para actualizar la tabla de ventas
function updateVentasTable(ventas) {
  let tableBody = "";
  let totalVentas = 0;

  ventas.forEach((venta) => {
    // Formatear la fecha a dd/mm/yyyy
    const fecha = new Date(venta.fecha);
    const fechaFormateada = `${fecha.getDate().toString().padStart(2, "0")}/${(
      fecha.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${fecha.getFullYear()}`;

    tableBody += `
      <tr>
        <td>${fechaFormateada}</td>
        <td>${venta.total_valor}</td>
      </tr>
    `;
    totalVentas += venta.total_valor;
  });

  const tableHtml = `
    <h2 class="mb-3 titulo-ventas">Ventas Del Dia</h2>
    <table class="table table-striped">
      <thead>
        <tr>
          <th>Fecha</th>
          <th>Total Valor</th>
        </tr>
      </thead>
      <tbody>
        ${tableBody}
      </tbody>
      <tfoot>
        <tr>
          <td colspan="1"><strong>Total Ventas</strong></td>
          <td colspan="1"><strong>$${totalVentas}</strong></td>
        </tr>
      </tfoot>
    </table>
  `;
  document.getElementById("contenido").innerHTML = tableHtml;
}

// Función para mostrar ventas por producto
async function mostrarVentasPorProducto() {
  try {
    const result = await ipcRenderer.invoke("get-ventas-por-producto");
    if (result.success) {
      const ventas = result.data;
      updateVentasPorProductoTable(ventas);
    } else {
      console.error("Error al obtener ventas por producto:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarVentasPorProducto:", error);
  }
}

// Función para actualizar la tabla de ventas por producto
function updateVentasPorProductoTable(ventas) {
  let tableBody = "";
  ventas.forEach((venta) => {
    tableBody += `
          <tr>
              <td>${venta.descrip_producto}</td>
              <td>${venta.total_cantidad_vendida}</td>
              <td>${venta.total_recaudado}</td>
          </tr>
      `;
  });

  const tableHtml = `
      <h2 class="mb-3 titulo-ventas">Ventas Por Producto</h2>
      <table class="table table-striped">
          <thead>
              <tr>
                  <th>Producto</th>
                  <th>Cantidad Vendida</th>
                  <th>Total Valor</th>
              </tr>
          </thead>
          <tbody>
              ${tableBody}
          </tbody>
      </table>
  `;
  document.getElementById("contenido").innerHTML = tableHtml;
}

// Función para mostrar ventas por marca
async function mostrarVentasPorMarca() {
  try {
    const result = await ipcRenderer.invoke("get-ventas-por-marca");
    if (result.success) {
      const ventas = result.data;
      updateVentasPorMarcaTable(ventas);
    } else {
      console.error("Error al obtener ventas por marca:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarVentasPorMarca:", error);
  }
}

// Función para actualizar la tabla de ventas por marca
function updateVentasPorMarcaTable(ventas) {
  let tableBody = "";

  ventas.forEach((venta) => {
    tableBody += `
          <tr>
              <td>${venta.nombre_marca}</td>
              <td>${venta.total_cantidad_vendida}</td>
              <td>${venta.total_recaudado}</td>
          </tr>
      `;
  });

  const tableHtml = `
      <h2 class="mb-3 titulo-ventas">Ventas Por Marca</h2>
      <table class="table table-striped">
          <thead>
              <tr>
                  <th>Marca</th>
                  <th>Cantidad Vendida</th>
                  <th>Total Valor</th>
              </tr>
          </thead>
          <tbody>
              ${tableBody}
          </tbody>
      </table>
  `;
  document.getElementById("contenido").innerHTML = tableHtml;
}

// Función para mostrar ventas por categoría
async function mostrarVentasPorCategoria() {
  try {
    const result = await ipcRenderer.invoke("get-ventas-por-categoria");
    if (result.success) {
      const ventas = result.data;
      updateVentasPorCategoriaTable(ventas);
    } else {
      console.error("Error al obtener ventas por categoría:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarVentasPorCategoria:", error);
  }
}

// Función para actualizar la tabla de ventas por categoría
function updateVentasPorCategoriaTable(ventas) {
  let tableBody = "";

  ventas.forEach((venta) => {
    tableBody += `
          <tr>
              <td>${venta.nombre_catg}</td>
              <td>${venta.total_cantidad_vendida}</td>
              <td>${venta.total_recaudado}</td>
          </tr>
      `;
  });

  const tableHtml = `
      <h2 class="mb-3 titulo-ventas">Ventas Por Categoría</h2>
      <table class="table table-striped">
          <thead>
              <tr>
                  <th>Categoría</th>
                  <th>Cantidad Vendida</th>
                  <th>Total Valor</th>
              </tr>
          </thead>
          <tbody>
              ${tableBody}
          </tbody>
      </table>
  `;
  document.getElementById("contenido").innerHTML = tableHtml;
}

// Función para mostrar ventas por modelo
async function mostrarVentasPorModelo() {
  try {
    const result = await ipcRenderer.invoke("get-ventas-por-modelo");
    if (result.success) {
      const ventas = result.data;
      updateVentasPorModeloTable(ventas);
    } else {
      console.error("Error al obtener ventas por modelo:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarVentasPorModelo:", error);
  }
}

// Función para actualizar la tabla de ventas por modelo
function updateVentasPorModeloTable(ventas) {
  let tableBody = "";

  ventas.forEach((venta) => {
    tableBody += `
          <tr>
              <td>${venta.nombre_modelo}</td>
              <td>${venta.total_cantidad_vendida}</td>
              <td>${venta.total_recaudado}</td>
          </tr>
      `;
  });

  const tableHtml = `
      <h2 class="mb-3 titulo-ventas">Ventas Por Modelo</h2>
      <table class="table table-striped">
          <thead>
              <tr>
                  <th>Modelo</th>
                  <th>Cantidad Vendida</th>
                  <th>Total Valor</th>
              </tr>
          </thead>
          <tbody>
              ${tableBody}
          </tbody>
      </table>
  `;
  document.getElementById("contenido").innerHTML = tableHtml;
}
// Función para mostrar la cantidad total de productos vendidos
async function mostrarCantidadProductosVendidos() {
  try {
    const result = await ipcRenderer.invoke("get-cantidad-productos-vendidos");
    if (result.success) {
      const cantidad = result.data.total_cantidad_vendida;
      const totalRecaudado = result.data.total_recaudado;

      const tableHtml = `
        <h2 class="mb-3 titulo-ventas">Cantidad Total de Productos Vendidos</h2>
        <table class="table table-striped">
          <thead>
            <tr>
              <th>Total de Productos Vendidos</th>
              <th>Total Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${cantidad}</td>
              <td>$${totalRecaudado}</td>
            </tr>
          </tbody>
        </table>
      `;
      document.getElementById("contenido").innerHTML = tableHtml;
    } else {
      console.error("Error al obtener cantidad de productos vendidos:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarCantidadProductosVendidos:", error);
  }
}


// Función para mostrar los productos más vendidos
async function mostrarProductosMasVendidos() {
  try {
    const result = await ipcRenderer.invoke("get-productos-mas-vendidos");
    if (result.success) {
      const productos = result.data;
      let tableBody = "";

      productos.forEach((producto) => {
        tableBody += `
                  <tr>
                      <td>${producto.descrip_producto}</td>
                      <td>${producto.total_cantidad_vendida}</td>
                  </tr>
              `;
      });

      const tableHtml = `
              <h2 class="mb-3 titulo-ventas">Productos Más Vendidos</h2>
              <table class="table table-striped">
                  <thead>
                      <tr>
                          <th>Producto</th>
                          <th>Cantidad Vendida</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${tableBody}
                  </tbody>
              </table>
          `;
      document.getElementById("contenido").innerHTML = tableHtml;
    } else {
      console.error("Error al obtener productos más vendidos:", result.error);
    }
  } catch (error) {
    console.error("Error en mostrarProductosMasVendidos:", error);
  }
}

// Función para manejar la visualización según el tipo de contenido
function showContent(contentType) {
  const vendedorId = 1; // Cambia por el ID del vendedor que desees

  switch (contentType) {
    case "verVentas":
      loadVentasByVendedor(vendedorId);
      break;
    case "mostrarVentasPorProducto":
      mostrarVentasPorProducto();
      break;
    case "mostrarVentasPorMarca":
      mostrarVentasPorMarca();
      break;
    case "mostrarVentasPorCategoria":
      mostrarVentasPorCategoria();
      break;
    case "mostrarVentasPorModelo":
      mostrarVentasPorModelo();
      break;
    case "mostrarCantidadProductosVendidos":
      mostrarCantidadProductosVendidos();
      break;
    case "mostrarProductosMasVendidos":
      mostrarProductosMasVendidos();
      break;
    default:
      console.error("Tipo de contenido no válido:", contentType);
  }
}

// Inicializar la vista por defecto
showContent("verVentas");
