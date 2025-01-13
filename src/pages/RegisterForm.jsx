import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // Necesitamos para redirigir
import "./RegisterForm.css";

const RegisterForm = () => {
  const navigate = useNavigate(); // Para redirigir a otra página
  const [formData, setFormData] = useState({
    codigo: "",
    docIdentidad: "",
    nombres: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    genero: "",
    celular: "",
    distrito: "",
    area: "", // Por defecto vacío
  });

  const [message, setMessage] = useState(""); // Para el mensaje de éxito

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value.toUpperCase(), // Convierte a mayúsculas
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    console.log("Datos que se están enviando:", formData); // Verifica los datos antes de enviarlos

    fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        if (response.ok) {
          return response.text(); // Leer la respuesta como texto plano
        } else {
          throw new Error("Error en la respuesta del servidor");
        }
      })
      .then((data) => {
        if (data === "Registro exitoso") {
          setMessage("Registro exitoso");

          setTimeout(() => {
            setMessage(""); // Borrar el mensaje
            setFormData({
              codigo: "",
              docIdentidad: "",
              nombres: "",
              apellidoPaterno: "",
              apellidoMaterno: "",
              genero: "",
              celular: "",
              distrito: "",
              area: "", // Restablece el área
            });
          }, 3000); // 3 segundos de mensaje
        } else {
          setMessage("Hubo un error en el registro. Intenta nuevamente.");
        }
      })
      .catch((error) => {
        console.error("Error:", error); // Log del error
        setMessage("Hubo un error en el registro. Intenta nuevamente."); // Muestra el mensaje de error
      });
  };

  const handleCancel = () => {
    // Redirige a la página de inicio
    navigate("/");
  };

  return (
    <div className="register-container">
      <div className="register-form">
        <h2>REGISTRO DE PERSONAL</h2>

        {/* Mostrar mensaje de éxito o error */}
        {message && <div className="message">{message}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Código (Máximo 5 dígitos)"
            name="codigo"
            maxLength="5"
            value={formData.codigo}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Doc. de Identidad (8 caracteres)"
            name="docIdentidad"
            maxLength="8"
            value={formData.docIdentidad}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Nombres"
            name="nombres"
            value={formData.nombres}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Apellido Paterno"
            name="apellidoPaterno"
            value={formData.apellidoPaterno}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Apellido Materno"
            name="apellidoMaterno"
            value={formData.apellidoMaterno}
            onChange={handleChange}
            required
          />
          <select
            name="genero"
            value={formData.genero}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona Género
            </option>
            <option value="MASCULINO">MASCULINO</option>
            <option value="FEMENINO">FEMENINO</option>
          </select>
          <input
            type="tel"
            placeholder="N° de Celular"
            name="celular"
            value={formData.celular}
            onChange={handleChange}
            required
          />
          <select
            name="distrito"
            value={formData.distrito}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona Distrito
            </option>
            {[
              "SAN VICENTE", "ASIA", "CALANGO", "CERRO AZUL", "COAYLLO", "CHILCA",
              "IMPERIAL", "LUNAHUANÁ", "MALA", "NUEVO IMPERIAL", "PACARÁN", "QUILMANÁ",
              "SAN ANTONIO", "SAN LUIS", "SANTA CRUZ DE FLORES", "ZUÑIGA"
            ].map((distrito) => (
              <option key={distrito} value={distrito}>
                {distrito}
              </option>
            ))}
          </select>

          <select
            name="area"
            value={formData.area}
            onChange={handleChange}
            required
          >
            <option value="" disabled>
              Selecciona Área Interna
            </option>
            {[
              "SECADO", "LIMPIEZA", "LAVADO", "EXPORTACION"
            ].map((area) => (
              <option key={area} value={area}>
                {area}
              </option>
            ))}
          </select>

          <button type="submit" className="submit-button">
            Registrarse
          </button>
          <button type="button" className="cancel-button" onClick={handleCancel}>
            Cancelar
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
