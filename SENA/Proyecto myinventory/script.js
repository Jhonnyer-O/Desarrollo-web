document.addEventListener('DOMContentLoaded', () => {
    
    // --- REFERENCIAS DE TODAS LAS PANTALLAS ---
    const vistas = {
        login: document.getElementById('vista-login'),
        dashboard: document.getElementById('vista-dashboard'),
        registro: document.getElementById('vista-registro'),
        reportes: document.getElementById('vista-reportes'),
        config: document.getElementById('vista-config')
    };

    // --- REFERENCIA DEL FORMULARIO DE ACCESO (CORREGIDO) ---
    const formularioLogin = document.getElementById('formulario-login');

    // --- ENRUTADOR DEL MAPA DE NAVEGACIÓN ---
    function irAPantalla(pantallaDestino) {
        Object.values(vistas).forEach(v => v.classList.remove('active'));
        pantallaDestino.classList.add('active');
        
        // Cada vez que volvemos o entramos al menú o reportes, recalculamos el estado
        verificarAlertasStock();
        if (pantallaDestino === vistas.reportes) {
            renderizarTablaProductos();
        }
    }

    // --- CONFIGURACIÓN DE LOS ACTIVADORES DE TARJETAS ---
    document.getElementById('nav-ir-registro').addEventListener('click', () => irAPantalla(vistas.registro));
    document.getElementById('nav-ir-reportes').addEventListener('click', () => irAPantalla(vistas.reportes));
    document.getElementById('nav-ir-config').addEventListener('click', () => irAPantalla(vistas.config));

    // Botones de retorno al Menú Principal
    document.querySelectorAll('.btn-regresar-dashboard').forEach(btn => {
        btn.addEventListener('click', () => irAPantalla(vistas.dashboard));
    });

    // --- ACCIONES DE AUTENTICACIÓN (LOGIN) ---
    if (formularioLogin) {
        formularioLogin.addEventListener('submit', (e) => {
            e.preventDefault(); // Evita que la página se recargue
            
            // Captura de valores ingresados
            const txtUsuario = document.getElementById('usuario').value.trim();
            const txtContrasena = document.getElementById('contrasena').value.trim();
            const contenedorError = document.getElementById('login-error');

            // Consola de validación interna
            console.log("Intentando ingresar con el usuario:", txtUsuario);

            if (txtUsuario.toLowerCase() === 'admin' && txtContrasena === '12345') {
                if (contenedorError) contenedorError.style.display = 'none';
                formularioLogin.reset();
                irAPantalla(vistas.dashboard); // Cambia al menú principal
            } else {
                if (contenedorError) {
                    contenedorError.textContent = 'Credenciales no autorizadas. Use admin y 12345.';
                    contenedorError.style.display = 'block';
                } else {
                    alert('Credenciales no autorizadas. Use admin y 12345.');
                }
            }
        });
    }

    document.getElementById('btn-cerrar-sesion').addEventListener('click', () => {
        irAPantalla(vistas.login);
    });

    // --- MANEJO DE BASE DE DATOS LOCAL (localStorage) ---
    function obtenerProductos() {
        const localData = localStorage.getItem('inventario_productos');
        return localData ? JSON.parse(localData) : [];
    }

    function guardarProductos(arrayProductos) {
        localStorage.setItem('inventario_productos', JSON.stringify(arrayProductos));
        verificarAlertasStock();
    }

    function obtenerStockMinimoConfigurado() {
        const stockMin = localStorage.getItem('config_stock_minimo');
        return stockMin ? parseInt(stockMin) : 5; // 5 por defecto si no existe
    }

    // Inicializar el input de configuración con el valor guardado
    const inputConfigStock = document.getElementById('config-stock-minimo');
    if (inputConfigStock) {
        inputConfigStock.value = obtenerStockMinimoConfigurado();
    }

    // --- SISTEMA DE CONTROL DE ALERTAS CRÍTICAS ---
    function verificarAlertasStock() {
        const productos = obtenerProductos();
        const umbralMinimo = obtenerStockMinimoConfigurado();
        
        // Filtrar cuántos productos están por debajo del mínimo
        const criticos = productos.filter(p => p.stock <= umbralMinimo);
        const alertaBanner = document.getElementById('alerta-global-stock');
        
        if (alertaBanner) {
            if (criticos.length > 0) {
                const txtCantidad = document.getElementById('cantidad-criticos');
                if (txtCantidad) txtCantidad.textContent = criticos.length;
                alertaBanner.style.display = 'block';
            } else {
                alertaBanner.style.display = 'none';
            }
        }
    }

    // --- REGISTRO DE PRODUCTOS (CON VALIDACIÓN) ---
    const formProd = document.getElementById('formulario-producto');
    if (formProd) {
        formProd.addEventListener('submit', (e) => {
            e.preventDefault();
            limpiarErrores();

            const codigo = document.getElementById('prod-codigo');
            const nombre = document.getElementById('prod-nombre');
            const precio = document.getElementById('prod-precio');
            const stock = document.getElementById('prod-stock');

            let valido = true;
            const productosExistentes = obtenerProductos();

            // Validar código repetido
            if (codigo.value.trim() === '') {
                marcarInvalido(codigo, 'err-codigo', 'El código es obligatorio.');
                valido = false;
            } else if (productosExistentes.some(p => p.codigo.toLowerCase() === codigo.value.trim().toLowerCase())) {
                marcarInvalido(codigo, 'err-codigo', 'Este código de producto ya se encuentra registrado.');
                valido = false;
            }

            if (nombre.value.trim() === '') {
                marcarInvalido(nombre, 'err-nombre', 'El nombre es obligatorio.');
                valido = false;
            }
            if (precio.value === '' || parseFloat(precio.value) <= 0) {
                marcarInvalido(precio, 'err-precio', 'El precio debe ser un número mayor a 0.');
                valido = false;
            }
            if (stock.value === '' || parseInt(stock.value) < 0) {
                marcarInvalido(stock, 'err-stock', 'El stock no puede ser negativo.');
                valido = false;
            }

            if (valido) {
                // Estructura del nuevo producto
                const nuevoProducto = {
                    codigo: codigo.value.trim().toUpperCase(),
                    nombre: nombre.value.trim(),
                    precio: parseFloat(precio.value).toFixed(2),
                    stock: parseInt(stock.value)
                };

                productosExistentes.push(nuevoProducto);
                guardarProductos(productosExistentes);

                alert(`Producto "${nuevoProducto.nombre}" guardado con éxito.`);
                formProd.reset();
                irAPantalla(vistas.dashboard);
            }
        });

        const btnCancelar = document.querySelector('.btn-cancelar-registro');
        if (btnCancelar) {
            btnCancelar.addEventListener('click', () => {
                formProd.reset();
                limpiarErrores();
                irAPantalla(vistas.dashboard);
            });
        }
    }

    // --- RENDERIZADO DINÁMICO DE LA TABLA DE REPORTES ---
    function renderizarTablaProductos() {
        const productos = obtenerProductos();
        const umbralMinimo = obtenerStockMinimoConfigurado();
        const tablaCuerpo = document.getElementById('tabla-productos-cuerpo');
        
        if (!tablaCuerpo) return;
        
        tablaCuerpo.innerHTML = ''; // Limpiar tabla

        if (productos.length === 0) {
            tablaCuerpo.innerHTML = `<tr><td colspan="6" style="text-align:center; color:#777;">No hay productos en el inventario. Registre uno nuevo.</td></tr>`;
            return;
        }

        // Formateador nativo para Pesos Colombianos (COP) sin decimales
        const formateadorCOP = new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });

        productos.forEach((p, indice) => {
            const esCritico = p.stock <= umbralMinimo;
            const fila = document.createElement('tr');
            
            const precioNumerico = parseFloat(p.precio);
            const precioFormateado = formateadorCOP.format(precioNumerico);
            
            fila.innerHTML = `
                <td><strong>${p.codigo}</strong></td>
                <td>${p.nombre}</td>
                <td>${precioFormateado}</td>
                <td>${p.stock} u.</td>
                <td>
                    <span class="badge ${esCritico ? 'badge-critico' : 'badge-normal'}">
                        ${esCritico ? 'Stock Mínimo' : 'Estable'}
                    </span>
                </td>
                <td>
                    <div class="celda-acciones">
                        <button class="btn-accion btn-editar" data-index="${indice}">Editar</button>
                        <button class="btn-accion btn-eliminar-fila" data-index="${indice}">Eliminar</button>
                    </div>
                </td>
            `;
            tablaCuerpo.appendChild(fila);
        });

        // ASIGNACIÓN DINÁMICA DE EVENTOS A LOS BOTONES GENERADOS
        tablaCuerpo.querySelectorAll('.btn-editar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                accionesAccionEditar(index);
            });
        });

        tablaCuerpo.querySelectorAll('.btn-eliminar-fila').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = e.target.getAttribute('data-index');
                accionesAccionEliminar(index);
            });
        });
    }

    // --- FUNCIÓN LOGICA: EDITAR PRODUCTO EN LOCALSTORAGE ---
    function accionesAccionEditar(index) {
        const productos = obtenerProductos();
        const producto = productos[index];

        // Ventanas emergentes de captura rápida (Prompt interactivos)
        const nuevoNombre = prompt(`Editar nombre del producto (${producto.codigo}):`, producto.nombre);
        if (nuevoNombre === null) return; // Cancelado por el usuario
        
        if (nuevoNombre.trim() === '') {
            alert('El nombre del producto no puede estar vacío.');
            return;
        }

        const nuevoPrecio = prompt(`Editar precio COP para "${nuevoNombre.trim()}":`, Math.round(parseFloat(producto.precio)));
        if (nuevoPrecio === null) return;
        if (isNaN(nuevoPrecio) || parseFloat(nuevoPrecio) <= 0) {
            alert('Por favor ingrese un precio numérico válido mayor a 0.');
            return;
        }

        const nuevoStock = prompt(`Editar stock disponible (unidades):`, producto.stock);
        if (nuevoStock === null) return;
        if (isNaN(nuevoStock) || parseInt(nuevoStock) < 0) {
            alert('Por favor ingrese una cantidad de stock válida (no puede ser negativa).');
            return;
        }

        // Actualizamos las propiedades del objeto seleccionado
        productos[index].nombre = nuevoNombre.trim();
        productos[index].precio = Math.round(parseFloat(nuevoPrecio)).toString();
        productos[index].stock = parseInt(nuevoStock);

        // Guardamos los cambios y refrescamos la vista
        guardarProductos(productos);
        renderizarTablaProductos();
        alert('Producto actualizado correctamente con los nuevos parámetros.');
    }

    // --- FUNCIÓN LOGICA: ELIMINAR UN ÚNICO PRODUCTO ---
    function accionesAccionEliminar(index) {
        const productos = obtenerProductos();
        const producto = productos[index];

        if (confirm(`¿Está seguro de que desea eliminar el producto "${producto.nombre}" (${producto.codigo}) del sistema?`)) {
            // Removemos el elemento del arreglo usando splice
            productos.splice(index, 1);
            
            // Guardamos y re-renderizamos la interfaz
            guardarProductos(productos);
            renderizarTablaProductos();
        }
    }

    // Vaciar inventario por completo
    const btnLimpiar = document.getElementById('btn-limpiar-inventario');
    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            if (confirm('¿Está seguro de que desea eliminar todos los productos del inventario? Esta acción no se puede deshacer.')) {
                guardarProductos([]);
                renderizarTablaProductos();
            }
        });
    }

    // --- PANTALLA DE CONFIGURACIÓN ---
    const btnGuardarConfig = document.getElementById('btn-guardar-config');
    if (btnGuardarConfig) {
        btnGuardarConfig.addEventListener('click', () => {
            const inputStockMin = document.getElementById('config-stock-minimo');
            const nuevoValor = parseInt(inputStockMin.value);

            if (nuevoValor && nuevoValor >= 1) {
                localStorage.setItem('config_stock_minimo', nuevoValor);
                alert('Configuración guardada. El umbral de stock mínimo se ha actualizado.');
                irAPantalla(vistas.dashboard);
            } else {
                alert('Por favor ingrese un número válido mayor o igual a 1.');
            }
        });
    }

    // Funciones visuales de asistencia de errores
    function marcarInvalido(elemento, idError, mensaje) {
        elemento.classList.add('input-invalido');
        const txtError = document.getElementById(idError);
        if (txtError) txtError.textContent = mensaje;
    }

    function limpiarErrores() {
        if (formProd) {
            formProd.querySelectorAll('input').forEach(i => i.classList.remove('input-invalido'));
            formProd.querySelectorAll('.ayuda-error').forEach(t => t.textContent = '');
        }
    }

    // Ejecución inicial de alertas al cargar la app
    verificarAlertasStock();
});