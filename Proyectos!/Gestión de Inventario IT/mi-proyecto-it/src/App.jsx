import HardwareCard from './HardwareCard'; // Importamos tu nuevo componente

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial' }}>
      <h1>Gestión de Inventario IT</h1>
      <p>Panel de control de activos tecnológicos</p>
      
      {/* Usamos el componente varias veces con diferentes "Props" */}
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <HardwareCard nombre="Portátil Dell Latitude" marca="Dell" estado="Activo" />
        <HardwareCard nombre="Impresora Zebra" marca="Zebra" estado="Mantenimiento" />
        <HardwareCard nombre="Tablet Corporativa" marca="Samsung" estado="Activo" />
      </div>
    </div>
  );
}

export default App;