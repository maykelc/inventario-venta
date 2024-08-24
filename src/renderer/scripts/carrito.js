const { ipcRenderer } = require('electron');
const Swal = require('sweetalert2');

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('productoForm');
  const carritoTable = document.getElementById('carrito');
  const totalElement = document.getElementById('total');
  const carrito = [];

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    
    const codigoBarra = document.getElementById('code_barra').value;
    const result = await ipcRenderer.invoke('get-producto-by-codigo', codigoBarra);
    
    if (result.success) {
      const producto = result.data;
      if (producto) {
        agregarProductoAlCarrito(producto);
      } else {
        Swal.fire({
          title: 'Error',
          text: 'No se encontró el producto',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener el producto',
        confirmButtonText: 'Aceptar'
      });
    }
    form.reset();
  });

  document.querySelector('.btn-success').addEventListener('click', async () => {
    if (carrito.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'No hay productos en el carrito',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      return; // Salir de la función si el carrito está vacío
    }
    const totalValor = calcularTotalCarrito();
    const vendedorId = obtenerVendedorId(); // Deberías obtener el ID del vendedor actual
    const productos = carrito.map(p => ({
      producto_id_producto: p.id_producto,
      precio: p.precio,
      cantidad: p.cantidad
    }));

    try {
      const result = await ipcRenderer.invoke('save-venta', totalValor, vendedorId, productos);
      if (result.success) {
        Swal.fire({
          title: 'Venta realizada',
          text: 'La venta se ha realizado con éxito',
          icon: 'success',
          confirmButtonText: 'Aceptar',
          timer: 1000
        });
        carrito.length = 0;
        actualizarTablaCarrito();
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Ocurrió un error al realizar la venta',
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
        console.log('Error al generar la venta: ' + result.error);
      }
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al obtener el producto, intentelo mas tarde',
        confirmButtonText: 'Aceptar',
        timer: 2000
      });
      console.error('Error al guardar la venta:', error);
    }
  });

  function agregarProductoAlCarrito(producto) {
    const existingProduct = carrito.find(p => p.id_producto === producto.id_producto);

    if (existingProduct) {
      existingProduct.cantidad++;
    } else {
      carrito.push({ ...producto, cantidad: 1 });
    }

    actualizarTablaCarrito();
  }

  function actualizarTablaCarrito() {
    carritoTable.innerHTML = '';
    let total = 0;

    carrito.forEach(p => {
      total += p.precio * p.cantidad;
      carritoTable.innerHTML += `
        <tr>
          <td>${p.descrip_producto}</td>
          <td>${p.precio}</td>
          <td>${p.cantidad}</td>
          <td>${(p.precio * p.cantidad).toFixed(2)}</td>
        </tr>
      `;
    });

    totalElement.textContent = total.toFixed(2);
  }

  function calcularTotalCarrito() {
    return carrito.reduce((total, producto) => total + (producto.precio * producto.cantidad), 0);
  }

  function obtenerVendedorId() {
    // Aquí deberías obtener el ID del vendedor, por ejemplo, desde el estado de la aplicación o un campo oculto
    return 1; // Reemplaza esto con la lógica adecuada
  }
});
