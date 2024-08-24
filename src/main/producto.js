const { getConnection } = require("./db");
const { ipcMain, Notification } = require("electron");

// FUNCION VER PRODUCTOS
async function getProductos() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT  p.id_producto, p.descrip_producto, p.code_barra, p.precio, p.stock, cat.nombre_catg, mo.nombre_modelo, m.nombre_marca FROM producto p JOIN categoria cat ON p.categoria_id_categoria = cat.id_categoria JOIN modelo mo ON p.modelo_id_modelo = mo.id_modelo JOIN marca m on m.id_marca = mo.marca_id_marca;"
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener Categorias: ", error);
    throw error;
  }
}

// FUNCION CREAR Producto
async function createProduct(producto) {
  const conn = await getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO producto (descrip_producto, code_barra, precio, stock, categoria_id_categoria, modelo_id_modelo) VALUES (?, ?, ?, ?, ?, ?)",
      [
        producto.descrip_producto,
        producto.code_barra,
        producto.precio,
        producto.stock,
        producto.categoria_id_categoria,
        producto.modelo_id_modelo
      ]
    );
    producto.id_producto = result.insertID;
    new Notification({
      title: "Producto Creado.",
      body: "El Producto fue creado con exito",
    }).show();
    return producto;
  } catch (error) {
    console.error("Error al crear el producto: ", error);
    new Notification({
      title: "Producto No Creado.",
      body: "Error al crear un producto, intentelo mas tarde",
    }).show();
  }
}

// FUNCION OBTENER PRODUCTO POR ID
async function getProductoById(productoId) {

  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM producto WHERE id_producto = ?",
      [productoId]
    );

    return rows[0] || {};
  } catch (error) {
    console.error("Error al obtener el id de producto:", error);
    throw error;
  }
}

// FUNCION ACTUALIZAR PRODUCTO
async function updateProducto(productito) {
  const conn = await getConnection();

  try {
    await conn.query(
      "UPDATE producto SET descrip_producto = ?, code_barra=?,  precio=?, stock=?, categoria_id_categoria = ?, modelo_id_modelo= ? WHERE id_producto = ?",
      [
        productito.descrip_producto,
        productito.code_barra,
        productito.precio,
        productito.stock,
        productito.categoria_id_categoria,
        productito.modelo_id_modelo,
        productito.id_producto
      ]
    );

    new Notification({
      title: "Producto Actualizado.",
      body: "El producto fue actualizado con exito",
    }).show();
  } catch (error) {
    console.error("Error al actualizar el producto:", error);
    new Notification({
      title: "Error al Actualizar producto.",
      body: "Error al actualizar producto, intentelo mas tarde",
    }).show();
  }
}

// FUNCION ELIMINAR PRODUCTO
async function deleteProduct(produtoId) {
  const conn = await getConnection();
  try {
    await conn.query("DELETE FROM producto WHERE id_producto = ?", [produtoId]);
    new Notification({
      title: "Producto Eliminado.",
      body: "El producto fue eliminado con exito",
    }).show();
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    new Notification({
      title: "Error al Eliminar el producto.",
      body: "Error al eliminar el producto, intentelo mas tarde",
    }).show();
  }
}


//IPC HANDLER

ipcMain.handle("getProducts", async()=>{
  try{
    const producto = await getProductos();
    return producto;
  }catch(error){
    console.error("Error al obtener los productos en el ipcMain :", error);
    return { success:false, error:error.message };
  }
});

ipcMain.handle("create-producto", async(event, prod)=>{
  try{
    const producto = await createProduct(prod);
    return { success: true, data:producto };
  }catch(error){
    console.error("Error en el ipcMain de crear el producto:", error);
    return { success:false, error:error.message };
  }
});

ipcMain.handle("get-producto-by-id", async(event, productoId)=>{
  try{
    const producto = await getProductoById(productoId);
    return { success: true, data: producto };
  }catch(error){
    console.error("Error en el ipcMain de el producto get-producto-by-id: ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("update-producto", async(event, productoo)=>{

  try{
    const producto = await updateProducto(productoo);
    return { success: true };
  }catch(error){
    console.error("Error al actualizar el producto en el ipcMain de update-producto: ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-producto", async(event, productoId)=>{
  try{
    const producto = await deleteProduct(productoId);
    return { success:true };
  }catch(error){
    console.error("Error al eliminar el producto en el ipcMain: ", error);
    return { success:false, error:error.message };
  }
});


// Handler para obtener categorías, marcas y modelos
ipcMain.handle("getCategoriesAndBrandsAndModels", async () => {
  const connection = await getConnection();

  const [categorias] = await connection.query("SELECT * FROM categoria");
  const [marcas] = await connection.query("SELECT * FROM marca");
  const [modelos] = await connection.query("SELECT * FROM modelo");

  return { categorias, marcas, modelos };
});

module.exports = {
  getProductos,
  createProduct,
  getProductoById,
  updateProducto,
  deleteProduct,
};
