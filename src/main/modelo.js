const { getConnection } = require("./db");
const { ipcMain, Notification } = require("electron");

// FUNCION VER MODELO
async function getModelo() {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT m.id_modelo, m.nombre_modelo, ma.nombre_marca FROM modelo m JOIN marca ma ON m.marca_id_marca = ma.id_marca"
    );
    return rows;
  } catch (error) {
    console.error("Error al obtener Modelos:", error);
    throw error;
  }
}

// FUNCION CREAR MODELO
async function createModelo(modell) {
  const conn = await getConnection();
  try {
    const [result] = await conn.query(
      "INSERT INTO modelo (nombre_modelo, marca_id_marca) VALUES (?,?)",
      [modell.nombre_modelo, modell.marca_id_marca]
    );
    modell.id_modelo = result.insertId;
    new Notification({
      title: "Modelo Creado.",
      body: "El Modelo fue creado con éxito",
    }).show();
    return modell;
  } catch (error) {
    console.error("Error al crear el Modelo: ", error);
    new Notification({
      title: "Modelo No fue Creado.",
      body: "Error al crear el Modelo, intentelo más tarde",
    }).show();
    throw error;
  }
}

// FUNCION OBTENER MODELO POR ID
async function getModeloById(modeloId) {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query(
      "SELECT * FROM modelo WHERE id_modelo = ?",
      [modeloId]
    );
    return rows[0];
  } catch (error) {
    console.error("Error al obtener el id de el modelo:", error);
    throw error;
  }
}

// FUNCION ACTUALIZAR MODELO
async function updateModelo(modelo) {
  const conn = await getConnection();
  try {
    await conn.query(
      "UPDATE modelo SET nombre_modelo = ?, marca_id_marca = ? WHERE id_modelo = ?",
      [modelo.nombre_modelo, modelo.marca_id_marca, modelo.id_modelo]
    );
    new Notification({
      title: "Modelo Actualizado.",
      body: "El modelo fue actualizado con éxito",
    }).show();
  } catch (error) {
    console.error("Error al actualizar el modelo:", error);
    new Notification({
      title: "Error al Actualizar modelo.",
      body: "Error al actualizar modelo, intentelo más tarde",
    }).show();
    throw error;
  }
}

// FUNCION ELIMINAR MODELO
async function deleteModelo(modeloId) {
  const conn = await getConnection();
  try {
    await conn.query("DELETE FROM modelo WHERE id_modelo = ?", [modeloId]);
    new Notification({
      title: "Modelo Eliminado.",
      body: "Modelo fue eliminado con éxito",
    }).show();
  } catch (error) {
    console.error("Error al eliminar el Modelo:", error);
    new Notification({
      title: "Error al Eliminar el Modelo.",
      body: "Error al eliminar el modelo, intentelo más tarde",
    }).show();
    throw error;
  }
}

// IPC HANDLERS
ipcMain.handle("get-all-marcas", async () => {
  const conn = await getConnection();
  try {
    const [rows] = await conn.query("SELECT id_marca, nombre_marca FROM marca");
    return rows;
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    throw error;
  }
});

ipcMain.handle("get-modelo", async (event) => {
  try {
    const modelo = await getModelo();
    return modelo;
  } catch (error) {
    console.error("Error el ipcMain get-modelo : ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("create-modelo", async (event, modelito) => {
  try {
    const newModelo = await createModelo(modelito);
    return { success: true, data: newModelo };
  } catch (error) {
    console.error("Error en ipcMain create-modelo : ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-modelo-by-id", async (event, modeloId) => {
  try {
    const modelo = await getModeloById(modeloId);
    return { success: true, data: modelo };
  } catch (error) {
    console.error("Error el ipcMain get-modelo-by-id : ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("update-modelo", async (event, modeloo) => {
  try {
    await updateModelo(modeloo);
    return { success: true };
  } catch (error) {
    console.error("Error en ipcMain update-modelo : ", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("delete-modelo", async (event, modeloId) => {
  try {
    await deleteModelo(modeloId);
    return { success: true };
  } catch (error) {
    console.error("Error el ipcMain delete-modelo : ", error.message);
    return { success: false, error: error.message };
  }
});

module.exports = {
  getModelo,
  createModelo,
  getModeloById,
  updateModelo,
  deleteModelo,
};
