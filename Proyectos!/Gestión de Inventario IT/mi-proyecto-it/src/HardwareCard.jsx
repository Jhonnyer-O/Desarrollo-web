function HardwareCard({ nombre, estado, marca }) {
  return (
    <div
      style={{
        border: "1px solid #ffffff",
        padding: "10px",
        borderRadius: "8px",
        margin: "10px",
      }}
    >
      <h3>{nombre}</h3>
      <p>Marca: {marca}</p>
      <span style={{ color: estado === "Activo" ? "green" : "red" }}>
        Estado: {estado}
      </span>
    </div>
  );
}

export default HardwareCard;