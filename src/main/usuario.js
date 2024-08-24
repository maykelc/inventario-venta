const { getConnection } = require("./db");
const { ipcMain, Notification } = require("electron");

//     USUARIOS
// FUNCION CREAR USUARIO
async function createUser(user) {
    const conn = await getConnection();
    try {
      const result = await conn.query(
        "INSERT INTO vendedor (nombre, ap_paterno, ap_materno, nombre_user, clave) VALUES (?, ?, ?, ?, ?)",
        [
          user.name,
          user.ap_paterno,
          user.ap_materno,
          user.user_name,
          user.user_pass,
        ]
      );

      user.id = result.insertID;
      new Notification({
        title: "Usuario Creado.",
        body: "El usuario fue creado con éxito",
      }).show();
      return user;
    } catch (error) {
      console.error("Error al crear el usuario: ", error);
      new Notification({
        title: "Usuario No Creado.",
        body: "Error al crear un usuario, intentelo más tarde",
      }).show();
    }
  }
  
  // FUNCION VER USUARIOS
  async function getUsers() {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT id_vendedor, nombre, ap_paterno, ap_materno, nombre_user FROM vendedor"
      );
      return rows;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      throw error;
    }
  }
  
  // FUNCION OBTENER USUARIO POR ID
  async function getUserById(userId) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT * FROM vendedor WHERE id_vendedor = ?",
        [userId]
      );
      return rows[0];
    } catch (error) {
      console.error("Error al obtener el usuario:", error);
      throw error;
    }
  }
  
  // FUNCION ACTUALIZAR USUARIO
  async function updateUser(user) {
    const conn = await getConnection();
    try {
      await conn.query(
        "UPDATE vendedor SET nombre = ?, ap_paterno = ?, ap_materno = ?, nombre_user = ?, clave = ? WHERE id_vendedor = ?",
        [
          user.name,
          user.ap_paterno,
          user.ap_materno,
          user.user_name,
          user.user_pass,
          user.id,
        ]
      );
      new Notification({
        title: "Usuario Actualizado.",
        body: "El usuario fue actualizado con éxito",
      }).show();
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
      new Notification({
        title: "Error al Actualizar Usuario.",
        body: "Error al actualizar el usuario, intentelo más tarde",
      }).show();
    }
  }
  
  // FUNCION ELIMINAR USUARIO
  async function deleteUser(userId) {
    const conn = await getConnection();
    try {
      await conn.query("DELETE FROM vendedor WHERE id_vendedor = ?", [userId]);

      new Notification({
        title: "Usuario Eliminado.",
        body: "El usuario fue eliminado con éxito",
      }).show();
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      new Notification({
        title: "Error al Eliminar Usuario.",
        body: "Error al eliminar el usuario, intentelo más tarde",
      }).show();
    }
  }
  
  // Función para validar credenciales
  async function loginUser(newLogin) {
    const conn = await getConnection();
    try {
      const [rows] = await conn.query(
        "SELECT nombre_user, clave FROM vendedor WHERE nombre_user = ? AND clave = ?",
        [newLogin.user, newLogin.clave]
      );
      if (rows.length > 0) {
        new Notification({
          title: "Bienvenido",
          body: "Se ha iniciado sesión con éxito",
        }).show();
        return { success: true, user: rows[0] };
      } else {
        new Notification({
          title: "Error de Inicio de Sesión",
          body: "Credenciales incorrectas, intentelo de nuevo",
        }).show();
        return { success: false };
      }
    } catch (error) {
      new Notification({
        title: "Error de Inicio de Sesión",
        body: "Error al iniciar sesión, intentelo más tarde",
      }).show();
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  }

  
//    VENTAS

// IPC HANDLERS
// IPC HANDLERS USER
ipcMain.on("newusuario", async (event, newUser) => {
    await createUser(newUser);
  });
  
  ipcMain.handle("verUser", async () => {
    return getUsers();
  });
  
  ipcMain.handle("getUserById", async (event, userId) => {
    return getUserById(userId);
  });
  
  ipcMain.on("updateUser", async (event, updatedUser) => {
    await updateUser(updatedUser);
  });
  
  ipcMain.on("deleteUser", async (event, userId) => {
    await deleteUser(userId);
  });
  
  // Manejar el evento de login
  ipcMain.handle("loginUser", async (event, credentials) => {
    return loginUser(credentials);
  });


  module.exports= {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    loginUser
  };