// 1. IMPORTS
import type { CartItem } from "../../types/product";
import "../../styles/cart.css";
import "../../styles/style.css";

// 2. REFERENCIAS AL DOM
const contenedorCarrito = document.getElementById("lista-carrito");
const totalElemento = document.getElementById("total-carrito");
const btnVaciar = document.getElementById("vaciar-carrito");
const formFinalizar = document.getElementById("form-finalizar") as HTMLFormElement;

// 3. FUNCIONES DE LÓGICA
const cargarCarrito = () => {
    const carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const checkoutSection = document.getElementById("checkout-section");

    if (!contenedorCarrito) return;
    contenedorCarrito.innerHTML = "";

    if (carrito.length === 0) {
        contenedorCarrito.innerHTML = `
            <div class="carrito-vacio">
                <p>Tu carrito está vacío</p>
                <a href="../home/home.html" class="btn-volver">Ir a comprar</a>
            </div>
        `;
        if (totalElemento) totalElemento.innerText = "Total: $0";
        
        if (checkoutSection) checkoutSection.style.display = "none";
        if (btnVaciar) btnVaciar.style.display = "none";
        return;
    }

    if (checkoutSection) checkoutSection.style.display = "block";
    if (btnVaciar) btnVaciar.style.display = "inline-block";

    let total = 0;

    carrito.forEach(item => {
        total += item.precio * item.cantidad;

        const div = document.createElement("div");
        div.classList.add("item-carrito");
        div.innerHTML = `
            <img src="${item.imagen}" alt="${item.nombre}" width="100px">
            <div class="item-info">
                <h4>${item.nombre}</h4>
                <p>Precio unitario: $${item.precio}</p>
                <p>Cantidad: <strong>${item.cantidad}</strong></p>
                <p>Subtotal: $${item.precio * item.cantidad}</p>
            </div>
            <div class="item-acciones">
                <button class="btn-restar" data-id="${item.id}">-</button>
                <button class="btn-sumar" data-id="${item.id}">+</button>
                <button class="btn-eliminar-todo" data-id="${item.id}">Eliminar</button>
            </div>
        `;
        contenedorCarrito.appendChild(div);
    });

    if (totalElemento) {
        totalElemento.innerText = `Total: $${total}`;
    }
};

const sumarUno = (id: number) => {
    let carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const producto = carrito.find(item => item.id === id);
    
    if (producto) {
        producto.cantidad += 1;
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
    }
};

const eliminarDelCarrito = (id: number) => {
    let carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const nuevoCarrito = carrito.filter(item => item.id !== id);
    
    localStorage.setItem("carrito", JSON.stringify(nuevoCarrito));
    cargarCarrito();
};

const eliminarUno = (id: number) => {
    let carrito: CartItem[] = JSON.parse(localStorage.getItem("carrito") || "[]");
    const index = carrito.findIndex(item => item.id === id);

    if (index !== -1) {
        if (carrito[index].cantidad > 1) {
            carrito[index].cantidad -= 1;
        } else {
            carrito.splice(index, 1);
        }
        localStorage.setItem("carrito", JSON.stringify(carrito));
        cargarCarrito();
    }
};

// 4. EVENTOS
contenedorCarrito?.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const id = Number(target.getAttribute("data-id"));

    if (target.classList.contains("btn-restar")) {
        eliminarUno(id);
    } else if (target.classList.contains("btn-sumar")) {
        sumarUno(id);
    } else if (target.classList.contains("btn-eliminar-todo")) {
        eliminarDelCarrito(id);
    }
});

formFinalizar?.addEventListener("submit", (e) => {
    e.preventDefault();
    
    const nombre = (document.getElementById("nombre-cliente") as HTMLInputElement).value;
    
    alert(`¡Gracias por tu compra, ${nombre}! Tu pedido está en camino.`);
    
    localStorage.removeItem("carrito");
    window.location.href = "/index.html";
});

btnVaciar?.addEventListener("click", () => {
    localStorage.removeItem("carrito");
    cargarCarrito();
});

// 5. INICIALIZACIÓN
cargarCarrito();