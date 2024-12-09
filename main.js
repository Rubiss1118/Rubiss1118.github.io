document.getElementById("login-btn").addEventListener("click", function () {
    // Redirige al usuario a la página de inicio de sesión
    window.location.href = "login.html";
  });
  
  const express = require('express');
const fs = require('fs');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

const app = express();
app.use(express.json()); // Para procesar datos JSON enviados en el cuerpo de la solicitud

// Define el nombre del archivo CSV donde se guardarán los pedidos
const filePath = 'pedidos.csv';

// Verifica si el archivo CSV existe. Si no, lo crea con los encabezados correspondientes.
const csvWriter = createCsvWriter({
    path: filePath,
    header: [
        { id: 'ticketId', title: 'Ticket ID' },
        { id: 'cliente', title: 'Cliente' },
        { id: 'producto', title: 'Producto' },
        { id: 'cantidad', title: 'Cantidad' },
        { id: 'precio', title: 'Precio' },
        { id: 'total', title: 'Total' },
        { id: 'fecha', title: 'Fecha' }
    ],
    append: true // Indica que si el archivo existe, se agregarán nuevos datos al final
});

// Ruta para realizar un pedido y agregarlo al archivo CSV
app.post('/hacer-pedido', (req, res) => {
    const { ticketId, cliente, productos } = req.body;

    // Calcular el total del pedido
    let total = 0;
    productos.forEach(producto => {
        total += producto.cantidad * producto.precio;
    });

    // Formatear la fecha del pedido
    const fecha = new Date().toISOString();

    // Escribir cada producto en el archivo CSV
    productos.forEach(producto => {
        csvWriter.writeRecords([{
            ticketId: ticketId,
            cliente: cliente,
            producto: producto.nombre,
            cantidad: producto.cantidad,
            precio: producto.precio,
            total: total,
            fecha: fecha
        }])
        .then(() => {
            console.log('Pedido guardado en CSV');
        })
        .catch(err => {
            console.error('Error al guardar el pedido en el archivo CSV:', err);
        });
    });

    // Responder al cliente
    res.json({
        mensaje: 'Pedido realizado exitosamente',
        total: total
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en http://localhost:3000');
});
