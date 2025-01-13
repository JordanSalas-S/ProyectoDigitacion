const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexión a la base de datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '70449913',
    database: 'DigitalizationProject',
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
    } else {
        console.log('Conexión exitosa a MariaDB');
    }
});

// Ruta para registrar datos
app.post('/register', (req, res) => {
    const { codigo, docIdentidad, nombres, apellidoPaterno, apellidoMaterno, genero, celular, distrito, area } = req.body;

    const query = 'INSERT INTO registro (codigo, docIdentidad, nombres, apellidoPaterno, apellidoMaterno, genero, celular, distrito, area) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [codigo, docIdentidad, nombres, apellidoPaterno, apellidoMaterno, genero, celular, distrito, area], (err, result) => {
        if (err) {
            console.error(err);
            res.status(500).send('Error al registrar los datos');
        } else {
            res.send('Registro exitoso');
        }
    });
});

// Ruta para obtener los datos asociados a un centro de costo
app.get('/centroCostoData/:id', (req, res) => {
    const centroCostoId = req.params.id;
    const query = 'SELECT figura, variedad, especie FROM fbase WHERE centro_costo = ?'; // Cambio aquí: búsqueda por centro_costo en vez de id
    db.query(query, [centroCostoId], (err, result) => {
        if (err) {
            console.error('Error al obtener datos del centro de costo:', err);
            res.status(500).send('Error al obtener datos del centro de costo');
        } else {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Centro de costo no encontrado');
            }
        }
    });
});


// Ruta para obtener los datos asociados a un centro de costo (figura, variedad, especie)
app.get('/centroCostoData/:id', (req, res) => {
    const centroCostoId = req.params.id;
    const query = 'SELECT figura, variedad, especie FROM fbase WHERE id = ?'; // Ajusta el nombre de la columna 'id' si es necesario
    db.query(query, [centroCostoId], (err, result) => {
        if (err) {
            console.error('Error al obtener datos del centro de costo:', err);
            res.status(500).send('Error al obtener datos del centro de costo');
        } else {
            if (result.length > 0) {
                res.json(result[0]);
            } else {
                res.status(404).send('Centro de costo no encontrado');
            }
        }
    });
});

// Ruta para obtener el nombre por código
app.get('/registro/:codigo', (req, res) => {
    const { codigo } = req.params;
    console.log("Código recibido:", codigo);  // Verificar el valor recibido en el servidor
    const query = 'SELECT nombres FROM registro WHERE codigo = ?';  // Consulta SQL
    db.query(query, [codigo], (err, result) => {
        if (err) {
            console.error('Error al obtener el nombre por código:', err);
            return res.status(500).send('Error al obtener el nombre');
        }

        // Si no se encuentra el código en la base de datos
        if (result.length === 0) {
            return res.status(404).send('Código no encontrado');
        }

        console.log("Resultado de la consulta:", result);  // Verificar el resultado de la consulta
        res.json(result[0]);  // Devolver el primer resultado
    });
});

// Ruta para registrar la recepción
app.post('/recepcion', (req, res) => {
    const {
        centroCosto, figura, variedad, especie, fecha, hora, tipo, codigo, nombres, cantidad, comentario
    } = req.body;

    // Asegúrate de que el nombre esté disponible, si no lo enviamos de la base de datos
    const nombreFinal = nombres || ""; // Si el nombre está vacío, lo dejaremos vacío por ahora

    // Insertar los datos en la tabla 'recepcion'
    const query = `
        INSERT INTO recepcion (centro_costo, figura, variedad, especie, fecha, hora, tipo, codigo, nombres, cantidad, comentario)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [
        centroCosto, figura, variedad, especie, fecha, hora, tipo, codigo, nombreFinal, cantidad, comentario
    ];

    db.query(query, values, (err, result) => {
        if (err) {
            console.error('Error al insertar recepción:', err);
            res.status(500).json({ message: 'Error al insertar recepción', error: err });
        } else {
            res.json({ message: 'Recepción registrada exitosamente', id: result.insertId });
        }
    });
});



// Inicia el servidor
app.listen(5000, () => {
    console.log('Servidor ejecutándose en http://localhost:5000');
});

