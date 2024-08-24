const { getConnection } = require("./db");
const { ipcMain, Notification } = require("electron");

// FUNCION CREAR CATEGORIA
async function createCategoria(catego) {
  const conn = await getConnection();
  try {
    const result = await conn.query(
      "INSERT INTO categoria (nombre_catg) VALUES (?)",
      [catego.nombre_catg]
    );
    catego.id = result.insertId;
    new Notification({
      title: "Categoria Creada.",
      body: "La Categoria fue creada con éxito",
    }).show();
    return catego;
  } catch (error) {
    console.error("Error al crear la Categoria: ", error);
    new Notification({
      title: "Categoria No Creada.",
      body: "Error al crear la categoria, intente más tarde",
    }).show();
    throw error;
  }
}

// FUNCION OBTENER CATEGORIA POR ID
async function getCategoriaById(categoriaId) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM categoria WHERE id_categoria = ?",
      [categoriaId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error al obtener la categoria por ID:", error);
    throw error;
  }
}

// FUNCION OBTENER TODAS LAS CATEGORIAS
async function getCategoria() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT id_categoria, nombre_catg FROM categoria"
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener Categorias:", error);
    throw error;
  }
}

// FUNCION ACTUALIZAR CATEGORIA
async function updateCategoria(catego) {
  const conn = await getConnection();
  try {
    await conn.query(
      "UPDATE categoria SET nombre_catg = ? WHERE id_categoria = ?",
      [catego.nombre_catg, catego.id_categoria]
    );
    new Notification({
      title: "Categoria Actualizada.",
      body: "La categoria fue actualizado con exito",
    }).show();

  } catch (error) {
    console.error("Error al actualizar la categoria:", error);
    new Notification({
      title: "Error al Actualizar categoria.",
      body: "Error al actualizar categoria, intentelo mas tarde",
    }).show();
  }
}

// FUNCION ELIMINAR CATEGORIA
async function deleteCategoria(categoriaId) {

  const conn = await getConnection();
  try {
    await conn.query("DELETE FROM categoria WHERE id_categoria = ?", [
      categoriaId,
    ]);

    new Notification({
      title: "Categoria Eliminado.",
      body: "Categoria fue eliminado con éxito",
    }).show();
  } catch (error) {
    console.error("Error al eliminar la Categoria:", error);
    new Notification({
      title: "Error al Eliminar la Categoria.",
      body: "Error al eliminar la categoria, intentelo más tarde",
    }).show();
  }
}

// IPC HANDLERS
ipcMain.handle("get-categoria", async () => {
  try {
    const categorias = await getCategoria();
    return categorias;
  } catch (error) {
    console.error("Error en ipcMain get-categoria:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("create-categoria", async (event, catego) => {
  try {
    const newCategoria = await createCategoria(catego);
    return { success: true, data: newCategoria };
  } catch (error) {
    console.error("Error en ipcMain al crear la categoria: ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-categoria-by-id", async (event, categoriaId) => {
  try {
    const categoria = await getCategoriaById(categoriaId);
    return { success: true, data: categoria };
  } catch (error) {
    console.error("Error en ipcMain al obtener la categoria por ID: ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("update-categoria", async (event, catego) => {
  try {
    await updateCategoria(catego);
    return { success: true };
  } catch (error) {
    console.error("Error en ipcMain al actualizar la categoria: ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-categoria", async (event, categoriaId) => {
  try {
    await deleteCategoria(categoriaId);
    return { success: true };
  } catch (error) {
    console.error("Error en ipcMain al eliminar la categoria: ", error);
    return { success: false, error: error.message };
  }
});

module.exports = {
  createCategoria,
  getCategoriaById,
  updateCategoria,
  deleteCategoria,
};
