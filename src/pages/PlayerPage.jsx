import React, { useState } from "react";
import { addPlayer } from "../services/firebase";
import "../css/PlayerPage.css";

function PlayerPage() {
  const [form, setForm] = useState({
    name: "",
    height: "",
    weight: "",
    foot: "",
    position: [], // ahora es array
    playerType: "", // nuevo campo
  });

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

    // Para campos multiselección
    if (name === "position") {
      const options = Array.from(
        e.target.selectedOptions,
        (option) => option.value
      );
      setForm({ ...form, position: options });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleAdd = async () => {
    if (
      !form.name ||
      !form.height ||
      !form.weight ||
      !form.foot ||
      form.position.length === 0 ||
      !form.playerType
    ) {
      alert("Por favor completa todos los campos.");
      return;
    }

    await addPlayer(form);

    // Reiniciar formulario tras agregar
    setForm({
      name: "",
      height: "",
      weight: "",
      foot: "",
      position: [],
      playerType: "",
    });

    alert("Jugador agregado exitosamente.");
  };

  return (
    <div>
      <h1>Agregar Jugador</h1>
      <input
        name="name"
        onChange={handleChange}
        value={form.name}
        placeholder="Nombre"
      />
      <input
        name="height"
        onChange={handleChange}
        value={form.height}
        placeholder="Altura (cm)"
      />
      <input
        name="weight"
        onChange={handleChange}
        value={form.weight}
        placeholder="Peso (kg)"
      />
      <input
        name="foot"
        onChange={handleChange}
        value={form.foot}
        placeholder="Pierna Hábil (Izq/Der)"
      />

      <label>Posición (puedes seleccionar varias)</label>

      <div>
        {positions.map((pos) => (
          <label key={pos} style={{ display: "block" }}>
            <input
              type="checkbox"
              name="position"
              value={pos}
              checked={form.position.includes(pos)}
              onChange={(e) => {
                const { value, checked } = e.target;
                if (checked) {
                  setForm({ ...form, position: [...form.position, value] });
                } else {
                  setForm({
                    ...form,
                    position: form.position.filter((p) => p !== value),
                  });
                }
              }}
            />
            {pos}
          </label>
        ))}
      </div>

      <label>Tipo de Jugador</label>
      <select name="playerType" onChange={handleChange} value={form.playerType}>
        <option value="">Selecciona uno</option>
        {playerTypes.map((type) => (
          <option key={type} value={type}>
            {type}
          </option>
        ))}
      </select>

      <button onClick={handleAdd}>Agregar</button>
    </div>
  );
}

export default PlayerPage;
