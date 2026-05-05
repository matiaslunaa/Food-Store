// 1. IMPORTS
import { productos, categorias } from "../../data/data";
import type { CartItem } from "../../types/product";
import "../../styles/home.css";
import "../../styles/style.css";

// 2. REFERENCIAS AL DOM
const contenedorProductos = document.getElementById("contenedor-productos");
const listaCategorias = document.getElementById("lista-categorias");
const buscarProducto = document.getElementById("buscarProducto") as HTMLInputElement;
const formBusqueda = document.getElementById("form-busqueda") as HTMLFormElement;

// 3. FUNCIONES DE LÓGICA
const cargarCategorias = () => {
    if (!listaCategorias) return;

    const liTodos = document.createElement("li");
    liTodos.innerHTML = `<a href="#" data-categoria="todos">Todos</a>`;
    listaCategorias.appendChild(liTodos);

    categorias.forEach(cat => {
        const li = document.createElement("li");
        li.innerHTML = `<a href="#" data-categoria="${cat}">${cat}</a>`;
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
                const filtrados = productos.filter(p => p.categoria === categoriaSeleccionada);
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
};

// 4. EVENTOS
// Buscador
buscarProducto?.addEventListener("input", () => {
    const texto = buscarProducto.value.toLowerCase();
    const productosFiltrados = productos.filter(p => 
        p.nombre.toLowerCase().includes(texto)
    );
    cargarProductos(productosFiltrados);
});

// Click en "Agregar"
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

// 5. INICIALIZACIÓN
cargarCategorias();
cargarProductos();
actualizarBadge();