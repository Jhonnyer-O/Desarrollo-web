import {useState} from 'react'; //importacion del Hook usaState
import HardwareCard from './HardwareCard'; // Importacion del componente

function App() {

  //Difinicion del estado y lista d elos equipos
  const [equipos, setEquipos] = usaState([
    { id: 1, nombre: "Portátil Dell Latitude", marca: "Dell", estado: "Activo" },
    { id: 2, nombre: "Impresora Zebra", marca: "Zebra", estado: "Mantenimiento" },
    { id: 3, nombre: "Tablet Corporativa", marca: "Samsung", estado: "Activo" }
  ]);

  //Funcion para agregar un equipo (Prueba)
  const agregarEquipo = () => {
    const nuevo = {
      id: Date.now(),
      nombre: "Nuevo Dispositivo",
      marca: "Generica",
      estado: "Activo"
    };
    setEquipos([...equipos, nuevo]); //Se agrega el nuevo equipo al final de la lista
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial', color: 'white' }}>
      <h1>Gestión de Inventario IT</h1>
      
      <button 
        onClick={agregarEquipo}
        style={{ padding: '10px', marginBottom: '20px', cursor: 'pointer' }}
      >
        Simular Agregar Equipo
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {/* 4. Usamos .map() para dibujar cada equipo de la lista */}
        {equipos.map((item) => (
          <HardwareCard 
            key={item.id} 
            nombre={item.nombre} 
            marca={item.marca} 
            estado={item.estado} 
          />
        ))}
      </div>
    </div>
  );
  
}

export default App;