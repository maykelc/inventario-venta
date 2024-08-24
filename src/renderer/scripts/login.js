const { ipcRenderer } = require("electron");
const Swal = require('sweetalert2');

const login = document.getElementById("formLogin");
const loginuser = document.getElementById("userName");
const loginpass = document.getElementById("password");

login.addEventListener("submit", async (e) => {
  e.preventDefault();
  // Validar campos vacíos
  if (!loginuser.value || !loginpass.value) {
    await Swal.fire({
      icon: "warning",
      title: "Campos Vacíos",
      text: "Por favor, ingrese su nombre de usuario y contraseña",
      confirmButtonText: "Aceptar",
      timer: 2000,
    });
    return;
  }
  const newLogin = {
    user: loginuser.value,
    clave: loginpass.value,
  };

  try {
    const response = await ipcRenderer.invoke("loginUser", newLogin);
    if (response.success) {
      await Swal.fire({
        icon: "success",
        title: "Exito",
        text: "Inicio de sesion exitoso.",
        confirmButtonText: "Aceptar",
        timer: 2000,
      });
      window.location.href = "index.html";
    } else {
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Usuario o contraseña incorrectos",
        confirmButtonText: "Aceptar",
        timer: 2000,
      });
      document.getElementById("formLogin").reset();
    }
  } catch (err) {
    console.log("error al intentar iniciar sesion: ", err);
    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "Hubo un problema al intentar iniciar sesión. Inténtelo de nuevo más tarde.",
      confirmButtonText: "Aceptar",
      timer: 2000,
    });
  }
});
