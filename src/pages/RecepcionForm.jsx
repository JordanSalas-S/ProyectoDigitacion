import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RecepcionForm.css";

const RecepcionForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    centroCosto: "",
    figura: "",
    variedad: "",
    especie: "",
    fecha: new Date().toISOString().split('T')[0],
    hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    tipo: "JABA",
    codigo: "",
    nombre: "",
    cantidad: "",
    comentario: "",
  });

  const [message, setMessage] = useState("");
  const [centroCostoData, setCentroCostoData] = useState([]);

  // Cargar las opciones de Centro de Costo
  useEffect(() => {
    fetch("http://localhost:5000/centrosCosto")
      .then((response) => response.json())
      .then((data) => setCentroCostoData(data))
      .catch((error) => console.error("Error al cargar centros de costo:", error));
  }, []);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // Si se introduce un centro de costo, obtener los datos asociados
    if (name === "centroCosto" && value.trim() !== "") {
      fetch(`http://localhost:5000/centroCostoData/${value}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Centro de costo no encontrado");
          }
          return response.json();
        })
        .then((data) => {
          setFormData((prevData) => ({
            ...prevData,
            figura: data.figura,
            variedad: data.variedad,
            especie: data.especie,
          }));
        })
        .catch((error) => {
          console.error("Error al cargar datos del centro de costo:", error);
          setFormData((prevData) => ({
            ...prevData,
            figura: "",
            variedad: "",
            especie: "",
          }));
        });
    }

    // Si se introduce un código, buscar el nombre asociado
    if (name === "codigo" && value.trim() !== "") {
      console.log("Código ingresado:", value);  // Verificar el valor del código
      fetch(`http://localhost:5000/registro/${value}`)
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error("Código no encontrado o error en la solicitud");
          }
        })
        .then((data) => {
          console.log("Nombres recibido:", data);  // Verificar la respuesta del servidor
          setFormData((prevData) => ({
            ...prevData,
            nombres: data.nombres || "",
          }));
        })
        .catch((error) => {
          console.error("Error al cargar el nombre por código:", error);
          setFormData((prevData) => ({
            ...prevData,
            nombres: "",  // Limpiar el campo nombres si ocurre un error
          }));
        });
    }

  };


  // Enviar datos al servidor
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Datos enviados:", formData);

    fetch("http://localhost:5000/recepcion", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      })
      .then(() => {
        setMessage("Recepción registrada exitosamente.");
        setTimeout(() => {
          setMessage("");
          setFormData({
            centroCosto: "",
            figura: "",
            variedad: "",
            especie: "",
            fecha: new Date().toISOString().split('T')[0],
            hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            tipo: "JABA",
            codigo: "",
            nombres: "",
            cantidad: "",
            comentario: "",
          });
        }, 3000);
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage("Hubo un error al registrar la recepción.");
      });
  };

  // Manejar cancelación
  const handleCancel = () => {
    navigate("/"); // Redirigir a la página principal
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>RECEPCIÓN DE PROCESO DE SEMILLA</h2>

        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Centro de Costo"
            name="centroCosto"
            value={formData.centroCosto}
            onChange={handleChange}
            required
          />


          <input
            type="text"
            placeholder="Figura"
            name="figura"
            value={formData.figura}
            readOnly
          />
          <input
            type="text"
            placeholder="Variedad"
            name="variedad"
            value={formData.variedad}
            readOnly
          />
          <input
            type="text"
            placeholder="Especie"
            name="especie"
            value={formData.especie}
            readOnly
          />
          <input
            type="date"
            name="fecha"
            value={formData.fecha}
            readOnly
          />
          <input
            type="time"
            name="hora"
            value={formData.hora}
            onChange={handleChange}
          />
          <select
            name="tipo"
            value={formData.tipo}
            onChange={handleChange}
            required
          >
            <option value="JABA">JABA</option>
            <option value="SACOS">SACOS</option>
          </select>

          <input
            type="text"
            placeholder="Código"
            name="codigo"
            value={formData.codigo}
            onChange={handleChange}
            required
          />

          <input
            type="text"
            placeholder="Nombres"
            name="nombres"
            value={formData.nombres}
            readOnly
          />

          <input
            type="number"
            placeholder="Cantidad"
            name="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            required
          />

          <textarea
            placeholder="Comentario"
            name="comentario"
            value={formData.comentario}
            onChange={handleChange}
          ></textarea>

          <button type="submit" className="submit-button">
            Aceptar
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RecepcionForm;
