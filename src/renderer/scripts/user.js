const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');

// Obtener elementos
const formUser = document.getElementById('formUser');
const formEditUser = document.getElementById('formEditUser');
const name = document.getElementById('name');
const apPaterno = document.getElementById('ap_paterno');
const apMaterno = document.getElementById('ap_materno');
const userName = document.getElementById('nameUser');
const password = document.getElementById('password');
const editUserId = document.getElementById('editUserId');
const editName = document.getElementById('editName');
const editApPaterno = document.getElementById('editApPaterno');
const editApMaterno = document.getElementById('editApMaterno');
const editUserName = document.getElementById('editUserName');
const editPassword = document.getElementById('editPassword');

// Función para mostrar u ocultar secciones
function showView(view) {
    if (view === 'list') {
        document.getElementById('userList').style.display = 'block';
        document.getElementById('addUserModal').style.display = 'none';
        document.getElementById('editUserModal').style.display = 'none';
    } else if (view === 'add') {
        document.getElementById('userList').style.display = 'none';
        new bootstrap.Modal(document.getElementById('addUserModal')).show();
    } else if (view === 'edit') {
        document.getElementById('userList').style.display = 'none';
        new bootstrap.Modal(document.getElementById('editUserModal')).show();
    }
}

// Evento para el formulario de agregar usuario
formUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Verificar si algún campo está vacío
    if (!name.value || !apPaterno.value || !apMaterno.value || !userName.value || !password.value) {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios',
            icon: 'error',
            timer: 2000,
            confirmButtonText: 'Aceptar'
        });
        return; // Detener el proceso si hay campos vacíos
    }
    
    const newUser = {
        name: name.value,
        ap_paterno: apPaterno.value,
        ap_materno: apMaterno.value,
        user_name: userName.value,
        user_pass: password.value
    };
    
    ipcRenderer.send('newusuario', newUser);
    new bootstrap.Modal(document.getElementById('addUserModal')).hide(); // Ocultar modal
    formUser.reset();
    verUsuarios(); // Cargar los usuarios después de agregar uno nuevo
});

// Evento para el formulario de editar usuario
formEditUser.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Verificar si algún campo está vacío
    if (!editName.value || !editApPaterno.value || !editApMaterno.value || !editUserName.value || !editPassword.value) {
        Swal.fire({
            title: 'Error',
            text: 'Todos los campos son obligatorios',
            icon: 'error',
            timer: 2000,
            confirmButtonText: 'Aceptar'
        });
        return; // Detener el proceso si hay campos vacíos
    }
    
    const updatedUser = {
        id: editUserId.value,
        name: editName.value,
        ap_paterno: editApPaterno.value,
        ap_materno: editApMaterno.value,
        user_name: editUserName.value,
        user_pass: editPassword.value
    };
    
    ipcRenderer.send('updateUser', updatedUser);
    new bootstrap.Modal(document.getElementById('editUserModal')).hide(); // Ocultar modal
    Swal.fire({
        title: 'Usuario actualizado',
        text: 'Los cambios se han guardado con éxito',
        icon: 'success',
        timer: 2000,
        confirmButtonText: 'Aceptar'
    });
    formEditUser.reset();
    verUsuarios(); // Cargar los usuarios después de actualizar uno
});

// Función para mostrar usuarios
async function verUsuarios() {
    try {
        const users = await ipcRenderer.invoke('verUser');
        const usersTableBody = document.querySelector('#tableUser tbody');
        usersTableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${user.nombre}</td>
                <td>${user.ap_paterno}</td>
                <td>${user.ap_materno}</td>
                <td>${user.nombre_user}</td>
                <td>
                    <button class="btn btn-warning btn-sm btnmodificar" onclick="editUser(${user.id_vendedor})">Modificar</button>
                    <button class="btn btn-danger btn-sm btneliminar" onclick="deleteUser(${user.id_vendedor})">Eliminar</button>
                </td>
            `;
            usersTableBody.appendChild(row);
        });
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
    }
}

// Función para eliminar un usuario
async function deleteUser(userId) {
    Swal.fire({
        title: '¿Estás seguro?',
        text: "No podrás revertir esto",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
    }).then(async (result) => {
        if (result.isConfirmed) {
            try {
                await ipcRenderer.send('deleteUser', userId);
                Swal.fire({
                    title: 'Usuario eliminado',
                    text: 'El usuario ha sido eliminado con éxito',
                    icon: 'success',
                    timer: 2000,
                    confirmButtonText: 'Aceptar'
                });
                verUsuarios(); // Recargar la lista de usuarios después de eliminar uno
            } catch (err) {
                Swal.fire({
                    title: 'Error al eliminar usuario',
                    text: 'Ha ocurrido un error al eliminar el usuario',
                    icon: 'error',
                    timer: 2000,
                    confirmButtonText: 'Aceptar'
                });
                console.error('Error al eliminar el usuario:', err);
            }
        }
    });
}

// Función para editar un usuario
function editUser(userId) {
    ipcRenderer.invoke('getUserById', userId).then(user => {
        editUserId.value = user.id_vendedor;
        editName.value = user.nombre;
        editApPaterno.value = user.ap_paterno;
        editApMaterno.value = user.ap_materno;
        editUserName.value = user.nombre_user;
        editPassword.value = ''; // No mostramos la contraseña por seguridad
        showView('edit'); // Mostrar modal de edición
    }).catch(err => {
        console.error('Error al obtener el usuario:', err);
    });
}

// Manejo de eventos para el sidebar
document.getElementById('viewUsers').addEventListener('click', () => {
    showView('list');
    verUsuarios();
});

document.getElementById('addUser').addEventListener('click', () => {
    showView('add');
});

// Cargar usuarios al iniciar
document.addEventListener('DOMContentLoaded', () => {
    verUsuarios();
});
