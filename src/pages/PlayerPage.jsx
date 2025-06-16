import React, { useState } from "react";
import { addPlayer } from "../services/firebase";
import "../css/PlayerPage.css";

function PlayerPage() {
  const [form, setForm] = useState({
    name: "",
    height: "",
    weight: "",
    foot: "",
    position: [],
    playerType: "",
    photo: "", // nuevo campo
  });

  const [errors, setErrors] = useState({});

  const positions = [
    "DC",
    "EXI",
    "EXD",
    "MCO",
    "MC",
    "MDD",
    "MDI",
    "MCD",
    "DFD",
    "DFI",
    "LI",
    "LD",
    "CARI",
    "CARD",
    "POR",
  ];

  const playerTypes = ["delantero", "mediocampista", "defensa", "portero"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setForm({ ...form, position: [...form.position, value] });
    } else {
      setForm({
        ...form,
        position: form.position.filter((p) => p !== value),
      });
    }
    setErrors({ ...errors, position: "" });
  };

  const handleAdd = async () => {
    const newErrors = {};

    if (!form.name) newErrors.name = "Este campo es obligatorio.";
    if (!form.height) newErrors.height = "Este campo es obligatorio.";
    if (!form.weight) newErrors.weight = "Este campo es obligatorio.";
    if (!form.foot) newErrors.foot = "Este campo es obligatorio.";
    if (form.position.length === 0)
      newErrors.position = "Selecciona al menos una posición.";
    if (!form.playerType) newErrors.playerType = "Selecciona un tipo.";
    if (!form.photo) {
      newErrors.photo = "Ingresa un enlace de imagen.";
    } else if (!form.photo.toLowerCase().endsWith(".jpg")) {
      newErrors.photo = "El enlace debe terminar en .jpg";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await addPlayer(form);

    setForm({
      name: "",
      height: "",
      weight: "",
      foot: "",
      position: [],
      playerType: "",
      photo: "",
    });
    setErrors({});
    alert("Jugador agregado exitosamente.");
  };

  return (
    <div className="player-form">
      <h1>Agregar Jugador</h1>

      <div className="form-group">
        <label>Nombre del Jugador:</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? "input-error" : ""}
        />
        {errors.name && <span className="error-text">{errors.name}</span>}
      </div>

      <div className="form-group">
        <label>Altura (cm):</label>
        <input
          name="height"
          value={form.height}
          onChange={handleChange}
          className={errors.height ? "input-error" : ""}
        />
        {errors.height && <span className="error-text">{errors.height}</span>}
      </div>

      <div className="form-group">
        <label>Peso (kg):</label>
        <input
          name="weight"
          value={form.weight}
          onChange={handleChange}
          className={errors.weight ? "input-error" : ""}
        />
        {errors.weight && <span className="error-text">{errors.weight}</span>}
      </div>

      <div className="form-group">
        <label>Pierna Hábil:</label>
        <input
          name="foot"
          value={form.foot}
          onChange={handleChange}
          className={errors.foot ? "input-error" : ""}
        />
        {errors.foot && <span className="error-text">{errors.foot}</span>}
      </div>

      <div className="form-group">
        <label>Foto del jugador (link):</label>
        <input
          name="photo"
          value={form.photo}
          onChange={handleChange}
          className={errors.photo ? "input-error" : ""}
        />
        {errors.photo && <span className="error-text">{errors.photo}</span>}
      </div>

      <div className="form-group">
        <label>Posiciones:</label>
        <div className="checkbox-grid">
          {positions.map((pos) => (
            <label key={pos} className="checkbox-item">
              <input
                type="checkbox"
                name="position"
                value={pos}
                checked={form.position.includes(pos)}
                onChange={handleCheckboxChange}
              />
              {pos}
            </label>
          ))}
        </div>
        {errors.position && (
          <span className="error-text">{errors.position}</span>
        )}
      </div>

      <div className="form-group">
        <label>Tipo de Jugador:</label>
        <select
          name="playerType"
          value={form.playerType}
          onChange={handleChange}
          className={errors.playerType ? "input-error" : ""}
        >
          <option value="">Selecciona uno</option>
          {playerTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        {errors.playerType && (
          <span className="error-text">{errors.playerType}</span>
        )}
      </div>

      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
}

export default PlayerPage;
