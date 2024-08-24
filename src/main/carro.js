const { getConnection } = require('./db');
const { ipcMain, Notification } = require('electron');

//const escpos = require('escpos');
//const USB = require('escpos-usb'); // Correcta importación
//const device = new USB();
//const printer = new escpos.Printer(device);

// FUNCION OBTENER PRODUCTO POR CÓDIGO DE BARRA
async function getProductoByCodigo(codigoBarra) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT code_barra, id_producto, descrip_producto, precio FROM producto WHERE code_barra = ?",
      [codigoBarra]
    );
    return rows[0]; // Retornamos el primer resultado, o undefined si no se encuentra
  } catch (error) {
    console.error("Error al obtener el producto por código de barra:", error);
    throw error;
  }
}

// FUNCION PARA GUARDAR UNA VENTA
async function saveVenta(totalValor, vendedorId) {
  const conn = await getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO venta (fecha, total_valor, vendedor_id_vendedor) VALUES (CURDATE(), ?, ?)",
      [totalValor, vendedorId]
    );
    new Notification({
      title: "Venta Realizada.",
      body: "La venta fue realizada con éxito",
    }).show();
    
    // Obtener los detalles de la venta para imprimir la boleta
    //const idVenta = result.insertId;
    //const productosVenta = await obtenerProductosVenta(idVenta);
    
    // Imprimir la boleta
    //imprimirBoleta(idVenta, productosVenta, totalValor);
    
    
    return result.insertId; // Retorna el ID de la nueva venta
  } catch (error) {
    new Notification({
      title: "No se realizo la venta.",
      body: "La venta no pudo realizarse, intente mas tarde.",
    }).show();
    console.error("Error al guardar la venta:", error);
    throw error;
  }
}

// FUNCION PARA GUARDAR LOS PRODUCTOS DE UNA VENTA
async function saveVentaProd(idVenta, productos) {
  const conn = await getConnection();
  try {
    if (!Array.isArray(productos) || productos.length === 0) {
      throw new Error("No se proporcionaron productos válidos para guardar.");
    }

    const queries = productos.map(producto => [
      producto.cantidad, 
      producto.precio, 
      producto.producto_id_producto, 
      idVenta
    ]);

    const query = "INSERT INTO venta_prod (cantidad, precio, producto_id_producto, venta_id_venta) VALUES ?";
    await conn.query(query, [queries]); // Ejecuta todas las inserciones en una sola consulta
  } catch (error) {
    console.error("Error al guardar los productos de la venta:", error);
    throw error;
  }
}

// FUNCION PARA OBTENER LOS PRODUCTOS DE UNA VENTA
async function obtenerProductosVenta(idVenta) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      `SELECT v.id_venta, p.descrip_producto, vp.cantidad, vp.precio 
      FROM venta_prod vp 
      JOIN producto p ON producto_id_producto = p.id_producto 
      JOIN venta v ON v.id_venta = vp.venta_id_venta 
      WHERE v.id_venta = ?`, 
      [idVenta]
    );
    return rows; // Retorna los productos de la venta
  } catch (error) {
    console.error("Error al obtener los productos de la venta:", error);
    throw error;
  }
}

/*
device.open(err => {
  if (err) {
    console.error('Error al abrir el dispositivo:', err);
    return;
  }
  console.log('Dispositivo abierto con éxito.');
});


// FUNCION PARA IMPRIMIR LA BOLETA
function imprimirBoleta(idVenta, productos, totalValor) {
  device.open(() => {
    printer
      .align('CT')
      .style('B')
      .size(1, 1)
      .text('Botilleria ....... ')
      .text('Telefono:  +569 XXXX - XXXX ')
      .text('Direccion: Av. Esperanza Nro XXXX ')
      .text('*** Boleta de Venta ***')
      .text(`Nro Venta: ${idVenta}`)
      .text(`Fecha: ${new Date().toLocaleDateString()}`)
      .text('--------------------------------')
      .align('LT')
      .size(0, 0)
      .table(['Producto', 'Cant', 'Total']);

    productos.forEach(producto => {
      printer.table([producto.descrip_producto, producto.cantidad.toString(), `$${(producto.precio * producto.cantidad)}`]);
    });

    printer
      .align('RT')
      .text('--------------------------------')
      .text(`Total: $${totalValor}`)
      .align('CT')
      .text('Gracias por su compra!')
      .cut()
      .close();
  });
}

*/

// IPC HANDLERS

ipcMain.handle('get-producto-by-codigo', async (event, codigoBarra) => {
  try {
    const producto = await getProductoByCodigo(codigoBarra);
    return { success: true, data: producto };
  } catch (error) {
    console.error("Error en el ipcMain de obtener producto por código de barra:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle('save-venta', async (event, totalValor, vendedorId, productos) => {
  try {
    const idVenta = await saveVenta(totalValor, vendedorId);
    await saveVentaProd(idVenta, productos); // Guarda los productos de la venta
    return { success: true, idVenta };
  } catch (error) {
    console.error("Error en el ipcMain de guardar venta:", error);
    return { success: false, error: error.message };
  }
});

module.exports = {
  getProductoByCodigo,
  saveVenta,
  saveVentaProd,
  obtenerProductosVenta,
};
