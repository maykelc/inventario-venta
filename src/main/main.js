const { BrowserWindow } = require("electron");
const { getConnection } = require("./db");

const { loginUser, deleteUser, updateUser, getUserById, verUser, newusuario } = require("./usuario")
const { createCategoria, deleteCategoria, updateCategoria, getCategoriaById } = require("./categoria")
const { createMarca, deleteMarca, getMarca, getMarcaById, updateMarca } = require("./marca")
const { createModelo, deleteModelo, getModelo, getModeloById, updateModelo } = require("./modelo")
const { createProduct, deleteProduct, getProductoById, getProductos, updateProducto } = require("./producto")
const { getProductoByCodigo } = require("./carro")
require('./venta'); 

// CREAR VENTANA PRINCIPAL
let window;
function createWindow() {
  window = new BrowserWindow({
    width: 800,
    height: 550,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  window.loadFile("src/renderer/pages/login.html");
}

module.exports = {
  createWindow,
};
