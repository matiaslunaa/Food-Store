// 1. IMPORTS
import type { Product } from "../../types/product";
import type { Categoria } from "../../types/categoria";
import type { CartItem } from "../../types/product";
import "../../styles/home.css";
import "../../styles/style.css";

// Estado de la aplicación
let productos: Product[] = [];
let categorias: Categoria[] = [];

// 2. REFERENCIAS AL DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const listaCategorias = document.getElementById("lista-categorias");
const buscarProducto = document.getElementById("buscarProducto") as HTMLInputElement;
const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;

const inicializarDatos = async () => {
    try {
        const resCat = await fetch("/data/categorias.json");
        categorias = await resCat.json();

        const productosStorage = localStorage.getItem("productos_catalogo");
        
        if (productosStorage) {
            
            const todosLosProductos: Product[] = JSON.parse(productosStorage);
            // Filtramos para mostrar solo los que NO fueron eliminados
            productos = todosLosProductos.filter(p => p.disponible !== false);
        } else {
            // Si no hay cambios guardados en LocalStorage, leemos el JSON original
            const resProd = await fetch("/data/productos.json");
            const todosLosProductos: Product[] = await resProd.json();
            
            // Lo guardamos en LocalStorage para sincronizar la clave por primera vez
            localStorage.setItem("productos_catalogo", JSON.stringify(todosLosProductos));
            
            productos = todosLosProductos.filter(p => p.disponible !== false);
        }

        cargarCategorias();
        cargarProductos();
        actualizarBadge();
    } catch (error) {
        console.error("Error al cargar la base de datos simulada:", error);
    }
};

// 3. FUNCIONES DE LÓGICA
const cargarCategorias = () => {
    if (!listaCategorias) return;

    const liTodos = document.createElement("li");
    liTodos.innerHTML = `<a href="#" data-categoria="todos">Todos</a>`;
    listaCategorias.appendChild(liTodos);

    categorias.forEach(cat => {
        const li = document.createElement("li");
        // Guardamos el id numérico
        li.innerHTML = `<a href="#" data-categoria="${cat.id}">${cat.nombre}</a>`;
        listaCategorias.appendChild(li);
    });

    listaCategorias.addEventListener("click", (e) => {
        e.preventDefault();
        const target = e.target as HTMLElement;
        const categoriaSeleccionada = target.getAttribute("data-categoria");

        if (categoriaSeleccionada) {
            if (categoriaSeleccionada === "todos") {
                cargarProductos(productos);
            } else {
                
                const filtrados = productos.filter(p => p.categoria.id === Number(categoriaSeleccionada));
                cargarProductos(filtrados);
            }
        }
    });
};

const cargarProductos = (productosParaMostrar = productos) => {
    if (!contenedorProductos) return;
    contenedorProductos.innerHTML = "";

    productosParaMostrar.forEach(prod => {
        const article = document.createElement("article");
        article.innerHTML = `
            <img src="${prod.imagen}" alt="${prod.nombre}" width="250px">
            <h3>${prod.nombre}</h3>
            <p>Precio: <strong>$${prod.precio}</strong></p>
            <button class="btn-agregar" data-id="${prod.id}">Agregar</button>
        `;
        contenedorProductos.appendChild(article);
    });
};

const agregarAlCarrito = (id: number) => {
    const carritoActual: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const productoParaAgregar = productos.find(p => p.id === id);

    if (productoParaAgregar) {
        const existe = carritoActual.find(item => item.id === id);
        if (existe) {
            existe.cantidad += 1;
        } else {
            carritoActual.push({ ...productoParaAgregar, cantidad: 1 });
        }
        
        localStorage.setItem("carrito", JSON.stringify(carritoActual));
        actualizarBadge();

        const boton = document.querySelector(`button[data-id="${id}"]`) as HTMLButtonElement;

        if (boton) {
            const textoOriginal = boton.innerText;
            
            boton.innerText = "¡Agregado!";
            boton.classList.add("btn-exito");
            boton.disabled = true;

            setTimeout(() => {
                boton.innerText = textoOriginal;
                boton.classList.remove("btn-exito");
                boton.disabled = false;
            }, 1000);
        }
    }
};

const actualizarBadge = () => {
    const carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const badge = document.getElementById("cart-count");
    
    if (badge) {
        const totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
        badge.innerText = totalItems.toString();
    }

    // CONTROL DE SESIÓN 
    const usuarioLogueado = localStorage.getItem("usuarioLogueado");
    const navLista = document.querySelector("header nav ul");

    if (usuarioLogueado && navLista) {
        const usuario = JSON.parse(usuarioLogueado);

        const linkLoginExistente = navLista.querySelector('a[href*="login.html"]')?.parentElement;
        if (linkLoginExistente) {
            linkLoginExistente.remove();
        }

        if (!document.getElementById("user-menu-item")) {
            const liUsuario = document.createElement("li");
            liUsuario.id = "user-menu-item";
            
            // Evaluamos si el rol es ADMIN para agregarle el botón directo a su panel
            const esAdmin = usuario.rol === "ADMIN";
            
            const botonAdminHtml = esAdmin 
                ? `<li><a href="../admin/admin.html" class="text-amber-400 font-bold mr-3 hover:text-amber-500 transition-colors">Panel Admin</a></li>` 
                : '';

            // Si es admin, metemos el botón de admin primero en la barra
            if (esAdmin) {
                navLista.insertAdjacentHTML('beforeend', botonAdminHtml);
            }

            liUsuario.innerHTML = `
                <span class="font-bold mr-3 text-gray-800">${usuario.nombre}</span>
                <a href="#" id="logout-home" class="text-red-500 font-semibold no-underline hover:underline transition-all">Cerrar Sesión</a>
            `;
            liUsuario.classList.add("flex", "items-center");
            navLista.appendChild(liUsuario);

            // Evento del botón de Cerrar Sesión
            document.getElementById("logout-home")?.addEventListener("click", (e) => {
                e.preventDefault();
                localStorage.removeItem("usuarioLogueado");
                alert("Sesión cerrada.");
                window.location.reload();
            });
        }
    }
};

// 4. EVENTOS (Tus escuchadores originales intactos)
buscarProducto?.addEventListener("input", () => {
    const texto = buscarProducto.value.toLowerCase();
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(texto)
    );
    cargarProductos(productosFiltrados);
});

contenedorProductos?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (target.classList.contains("btn-agregar")) {
        const id = Number(target.getAttribute("data-id"));
        agregarAlCarrito(id);
    }
});

formBusqueda?.addEventListener("submit", (e) => {
    e.preventDefault();
});

// 5. INICIALIZACIÓN ASÍNCRONA
inicializarDatos();