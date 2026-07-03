import "../../styles/style.css";
import "../../styles/order.css";
import type { CartItem } from "../../types/product";


interface Pedido {
    id: number;
    idUsuario: number;
    cliente: string;
    direccion: string;
    fecha: string;
    items: CartItem[];
    total: number;
    estado: string;
}

const contenedorPedidos = document.getElementById("contenedor-pedidos");
const mensajePedidos = document.getElementById("mensaje-pedidos");

const renderizarPedidos = () => {
    if (!contenedorPedidos || !mensajePedidos) return;

    const usuarioLogueadoStr = localStorage.getItem("usuarioLogueado");
    if (!usuarioLogueadoStr) {
        mensajePedidos.innerHTML = `
            <div class="carrito-vacio">
                <p>Debés iniciar sesión para ver tu historial de pedidos.</p>
                <a href="../auth/login/login.html" class="btn-volver">Iniciar Sesión</a>
            </div>
        `;
        return;
    }

    const usuarioLogueado = JSON.parse(usuarioLogueadoStr);
    const todosLosPedidos: Pedido[] = JSON.parse(localStorage.getItem("pedidos_realizados") || "[]");
    
    // Filtramos para que el cliente vea solo lo suyo
    const misPedidos = todosLosPedidos.filter(pedido => pedido.idUsuario === usuarioLogueado.id);

    if (misPedidos.length === 0) {
        mensajePedidos.innerHTML = `
            <div class="carrito-vacio">
                <p>Todavía no realizaste ningún pedido.</p>
                <a href="../home/home.html" class="btn-volver">Ir a la tienda</a>
            </div>
        `;
        return;
    }

    mensajePedidos.innerHTML = "";
    contenedorPedidos.innerHTML = "";

    misPedidos.forEach(pedido => {
        const tarjeta = document.createElement("article");
        tarjeta.className = "card-pedido";
        
        // Clase del badge según el estado
        let estadoClass = "estado-pendiente";
        if (pedido.estado === "CONFIRMADO") estadoClass = "estado-confirmado";
        if (pedido.estado === "TERMINADO") estadoClass = "estado-terminado";
        if (pedido.estado === "CANCELADO") estadoClass = "estado-cancelado";

        // Mapeo de productos
        const itemsHtml = pedido.items.map(item => `
            <div class="pedido-item-linea">
                <span><span class="item-cantidad">${item.cantidad}x</span> ${item.nombre}</span>
                <span>$${item.precio * item.cantidad}</span>
            </div>
        `).join("");

        tarjeta.innerHTML = `
            <div class="pedido-header">
                <div>
                    <h3 class="pedido-id">Pedido #:${pedido.id.toString().slice(-6)}</h3>
                    <div class="pedido-fecha">Fecha: ${pedido.fecha}</div>
                </div>
                <span class="badge-estado ${estadoClass}">
                    ${pedido.estado}
                </span>
            </div>
            
            <div>
                <p class="pedido-info-entrega"><strong>Dirección de entrega:</strong> ${pedido.direccion}</p>
                <div class="pedido-items-box">
                    ${itemsHtml}
                </div>
            </div>

            <div class="pedido-footer">
                <span class="total-label">Total Pagado:</span>
                <span class="total-precio">$${pedido.total}</span>
            </div>
        `;

        contenedorPedidos.appendChild(tarjeta);
    });
};

renderizarPedidos();