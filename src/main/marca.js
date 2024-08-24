const { getConnection } = require("./db");
const { ipcMain, Notification } = require("electron");



// FUNCION VER MARCA
async function getMarca() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT id_marca, nombre_marca FROM marca");
      return rows;
    } catch (error) {
      console.error("Error al obtener Marcas:", error);
      throw error;
    }
  }
  
  // FUNCION CREAR MARCA
  async function createMarca(marca) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        "INSERT INTO marca (nombre_marca) VALUES (?)",
        [marca.nombre_marca]
      );
      marca.id = result.insertId;
      new Notification({
        title: "Marca Creada.",
        body: "La Marca fue creada con exito",
      }).show();
      return marca;
    } catch (error) {
      console.error("Error al crear la Marca: ", error);
      new Notification({
        title: "Marca No Fue Creada.",
        body: "Error al crear la Marca, inténtelo mas tarde",
      }).show();
    }
  }
  
  // FUNCION OBTENER MARCA POR ID
  async function getMarcaById(marcaId) {
    console.log('marcaId de getMarcaById: ', marcaId);
    const conn = await getConnection();
    try {
      const [rows] = await conn.query("SELECT * FROM marca WHERE id_marca = ?", [
        marcaId,
      ]);
      return rows[0];
    } catch (error) {
        console.error("Error al obtener la marca por ID:", error);
      throw error;
    }
  }
  
  // FUNCION ACTUALIZAR MARCA
  async function updateMarca(marca) {

    const conn = await getConnection();
    try {
      await conn.query("UPDATE marca SET nombre_marca = ? WHERE id_marca = ?", [
        marca.nombre_marca,
        marca.id_marca,
      ]);
  
      
      new Notification({
        title: "Marca Actualizada.",
        body: "La Marca fue actualizada con exito",
      }).show();
    } catch (error) {
      console.error("Error al actualizar la Marca:", error);
      new Notification({
        title: "Error al Actualizar Marca.", 
        body: "Error al actualizar la Marca, intentelo mas tarde",
      }).show();
    }
  }
  
  // FUNCION ELIMINAR MARCA
  async function deleteMarca(marcaId) {
    const conn = await getConnection();
    try {
      await conn.query("DELETE FROM marca WHERE id_marca = ?", [marcaId]);
      new Notification({
        title: "Marca Eliminada.",
        body: "La Marca fue eliminada con éxito",
      }).show();
    } catch (error) {
      console.error("Error al eliminar la Marca:", error);
      new Notification({
        title: "Error al Eliminar la Marca.",
        body: "Error al eliminar la Marca, inténtelo más tarde",
      }).show();
    }
  }


  
// IPC HANDLER DE MARCA

ipcMain.handle("get-marca", async (event) => {
    try {
      const marcas = await getMarca();
      return marcas;
    } catch (error) {
      console.error("Error en ipcMain get-marca:", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("create-marca", async (event, marca) => {
    try {
      const newMarca = await createMarca(marca);
      return { success: true, data: newMarca };
    } catch (error) {
      console.error("Error en ipcMain al crear la marca: ", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("get-marca-by-id", async (event, marcaId) => {
    try {
      const marca = await getMarcaById(marcaId);
      return { success: true, data: marca };
    } catch (error) {
      console.error("Error en ipcMain al obtener la marca por ID: ", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("update-marca", async (event, marca) => {
    try {
      await updateMarca(marca);
      return { success: true };
    } catch (error) {
      console.error("Error en ipcMain al actualizar la marca: ", error);
      return { success: false, error: error.message };
    }
  });
  
  ipcMain.handle("delete-marca", async (event, marcaId) => {
    try {
      await deleteMarca(marcaId);
      return { success: true };
    } catch (error) {
      console.error("Error en ipcMain al eliminar la marca: ", error);
      return { success: false, error: error.message };
    }
  });
  

  module.exports={
    getMarca,
    createMarca,
    getMarcaById,
    updateMarca,
    deleteMarca
  }