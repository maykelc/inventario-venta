const { ipcMain } = require('electron');
const { getConnection } = require('./db');

async function getVenta(vendedorId) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT v.id_venta, v.fecha, v.total_valor, ve.nombre_user FROM venta v JOIN vendedor ve ON ve.id_vendedor = v.vendedor_id_vendedor WHERE ve.id_vendedor = ? AND DATE(v.fecha) = CURDATE();",
      [vendedorId]
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener ventas:", error);
    throw error;
  }
}



// Consulta de ventas por producto
async function getVentasPorProducto() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT p.id_producto, p.descrip_producto, SUM(vp.cantidad) AS total_cantidad_vendida, 
      SUM(vp.cantidad * vp.precio) AS total_recaudado 
      FROM venta_prod vp 
      JOIN producto p ON vp.producto_id_producto = p.id_producto 
      GROUP BY p.id_producto, p.descrip_producto;
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener ventas por producto:", error);
    throw error;
  }
}

// Consulta de ventas por marca
async function getVentasPorMarca() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT m.id_marca, m.nombre_marca, SUM(vp.cantidad) AS total_cantidad_vendida, 
      SUM(vp.cantidad * vp.precio) AS total_recaudado 
      FROM venta_prod vp 
      JOIN producto p ON vp.producto_id_producto = p.id_producto 
      JOIN modelo mo ON p.modelo_id_modelo = mo.id_modelo 
      JOIN marca m ON mo.marca_id_marca = m.id_marca 
      GROUP BY m.id_marca, m.nombre_marca;
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener ventas por marca:", error);
    throw error;
  }
}

// Consulta de ventas por categoría
async function getVentasPorCategoria() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT c.id_categoria, c.nombre_catg, SUM(vp.cantidad) AS total_cantidad_vendida, 
      SUM(vp.cantidad * vp.precio) AS total_recaudado 
      FROM venta_prod vp 
      JOIN producto p ON vp.producto_id_producto = p.id_producto 
      JOIN categoria c ON p.categoria_id_categoria = c.id_categoria 
      GROUP BY c.id_categoria, c.nombre_catg;
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener ventas por categoría:", error);
    throw error;
  }
}

// Consulta de ventas por modelo
async function getVentasPorModelo() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT mo.id_modelo, mo.nombre_modelo, SUM(vp.cantidad) AS total_cantidad_vendida, 
      SUM(vp.cantidad * vp.precio) AS total_recaudado 
      FROM venta_prod vp 
      JOIN producto p ON vp.producto_id_producto = p.id_producto 
      JOIN modelo mo ON p.modelo_id_modelo = mo.id_modelo 
      GROUP BY mo.id_modelo, mo.nombre_modelo;
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener ventas por modelo:", error);
    throw error;
  }
}

// Consulta de cantidad de productos vendidos
async function getCantidadProductosVendidos() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT SUM(vp.cantidad) AS total_cantidad_vendida, 
      SUM(vp.cantidad * vp.precio) AS total_recaudado 
      FROM venta_prod vp;
    `);
    return rows[0];
  } catch (error) {
    console.error("Error al obtener cantidad de productos vendidos:", error);
    throw error;
  }
}

// Consulta de los productos más vendidos
async function getProductosMasVendidos() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(`
      SELECT p.id_producto, p.descrip_producto, SUM(vp.cantidad) AS total_cantidad_vendida 
      FROM venta_prod vp 
      JOIN producto p ON vp.producto_id_producto = p.id_producto 
      GROUP BY p.id_producto, p.descrip_producto 
      ORDER BY total_cantidad_vendida DESC 
      LIMIT 3;
    `);
    return rows;
  } catch (error) {
    console.error("Error al obtener productos más vendidos:", error);
    throw error;
  }
}


// Handler IPC para obtener ventas por vendedor
ipcMain.handle('get-venta', async (event, vendedorId) => {
  try {
    const ventas = await getVenta(vendedorId);
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    return { success: false, error: error.message };
  }
});




// Nuevas funciones IPC
ipcMain.handle('get-ventas-por-producto', async () => {
  try {
    const ventas = await getVentasPorProducto();
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener ventas por producto:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-ventas-por-marca', async () => {
  try {
    const ventas = await getVentasPorMarca();
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener ventas por marca:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-ventas-por-categoria', async () => {
  try {
    const ventas = await getVentasPorCategoria();
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener ventas por categoría:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-ventas-por-modelo', async () => {
  try {
    const ventas = await getVentasPorModelo();
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener ventas por modelo:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-cantidad-productos-vendidos', async () => {
  try {
    const ventas = await getCantidadProductosVendidos();
    return { success: true, data: ventas };
  } catch (error) {
    console.error('Error al obtener cantidad de productos vendidos:', error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('get-productos-mas-vendidos', async () => {
  try {
    const productos = await getProductosMasVendidos();
    return { success: true, data: productos };
  } catch (error) {
    console.error('Error al obtener productos más vendidos:', error);
    return { success: false, error: error.message };
  }
});
