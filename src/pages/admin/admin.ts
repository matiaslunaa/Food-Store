import "../../styles/style.css";
import "../../styles/admin.css";
import type { Product } from "../../types/product";

interface Pedido {
    id: number;
    fecha: string;
    estado: "PENDIENTE" | "CONFIRMADO" | "TERMINADO" | "CANCELADO";
    total: number;
    formaPago: string;
    idUsuario: number;
    detalles: { idProducto: number; cantidad: number; subtotal: number }[];
}

let productos: Product[] = [];
let pedidos: Pedido[] = [];

const modalContainer = document.getElementById("modal-container");

const cargarDatos = async () => {
    productos = JSON.parse(localStorage.getItem("productos_catalogo") || "[]");
    if (productos.length === 0) {
        const res = await fetch("/data/productos.json");
        productos = await res.json();
        localStorage.setItem("productos_catalogo", JSON.stringify(productos));
    }

    pedidos = JSON.parse(localStorage.getItem("pedidos_realizados") || "[]");
    if (pedidos.length === 0) {
        const res = await fetch("/data/pedidos.json");
        pedidos = await res.json();
        localStorage.setItem("pedidos_realizados", JSON.stringify(pedidos));
    }

    document.getElementById("dash-prod-count")!.innerText = productos.length.toString();
    document.getElementById("dash-ped-count")!.innerText = pedidos.length.toString();

    renderizarTablas();
};

const renderizarTablas = () => {
    // 1. Tabla Productos
    const tbodyProd = document.getElementById("tabla-productos");
    if (tbodyProd) {
        tbodyProd.innerHTML = productos.map(p => `
            <tr style="${!p.disponible ? 'opacity: 0.5; background: #f1f5f9;' : ''}">
                <td>#${p.id}</td>
                <td><img src="${p.imagen}" width="35" style="border-radius:4px; object-fit: cover;"></td>
                <td><strong>${p.nombre}</strong></td>
                <td>$${p.precio}</td>
                <td>${p.stock} u.</td>
                <td>
                    <button class="btn-admin btn-secondary btn-editar-precio" data-id="${p.id}" style="padding: 4px 8px; font-size:12px;">Editar $</button>
                    <button class="btn-admin ${p.disponible ? 'btn-danger' : 'btn-primary'}" id="btn-toggle-disp-${p.id}" data-id="${p.id}" style="padding: 4px 8px; font-size:12px; background-color: ${p.disponible ? '#ef4444' : '#10b981'}; color: white;">
                        ${p.disponible ? 'Eliminar' : 'Activar'}
                    </button>
                </td>
            </tr>
        `).join("");
    }

    // 2. Tabla Pedidos
    const tbodyPed = document.getElementById("tabla-pedidos");
    if (tbodyPed) {
        tbodyPed.innerHTML = pedidos.map(p => `
            <tr>
                <td>#ORD-${p.id.toString().slice(-5)}</td>
                <td>${p.fecha}</td>
                <td><strong>$${p.total}</strong></td>
                <td><span class="badge-estado estado-${p.estado.toLowerCase()}">${p.estado}</span></td>
                <td><button class="btn-admin btn-secondary btn-gestionar" data-id="${p.id}">Cambiar</button></td>
            </tr>
        `).join("");
    }

    // Escuchas de Eventos de Productos
    document.querySelectorAll(".btn-editar-precio").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute("data-id"));
            const prod = productos.find(p => p.id === id);
            if (prod) {
                const nuevoPrecio = prompt(`Ingresá el nuevo precio para ${prod.nombre}:`, prod.precio.toString());
                if (nuevoPrecio !== null && !isNaN(Number(nuevoPrecio)) && Number(nuevoPrecio) > 0) {
                    prod.precio = Number(nuevoPrecio);
                    localStorage.setItem("productos_catalogo", JSON.stringify(productos));
                    renderizarTablas();
                }
            }
        });
    });

    document.querySelectorAll("[id^='btn-toggle-disp-']").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute("data-id"));
            const prod = productos.find(p => p.id === id);
            if (prod) {
                prod.disponible = !prod.disponible;
                localStorage.setItem("productos_catalogo", JSON.stringify(productos));
                renderizarTablas();
            }
        });
    });

    // Asignar eventos a los pedidos
    document.querySelectorAll(".btn-gestionar").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = Number((e.target as HTMLButtonElement).getAttribute("data-id"));
            abrirModalEstado(id);
        });
    });
};

// MODAL: Cambiar Estado
const abrirModalEstado = (id: number) => {
    if (!modalContainer) return;
    const ped = pedidos.find(p => p.id === id);
    if (!ped) return;

    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" id="close-modal">×</button>
                <h3 style="margin-bottom:15px;">Gestionar Estado - Orden #${ped.id.toString().slice(-5)}</h3>
                <div class="form-group">
                    <label>Seleccionar Estado:</label>
                    <select id="select-estado">
                        <option value="PENDIENTE" ${ped.estado === "PENDIENTE" ? "selected" : ""}>PENDIENTE</option>
                        <option value="CONFIRMADO" ${ped.estado === "CONFIRMADO" ? "selected" : ""}>CONFIRMADO</option>
                        <option value="TERMINADO" ${ped.estado === "TERMINADO" ? "selected" : ""}>TERMINADO</option>
                        <option value="CANCELADO" ${ped.estado === "CANCELADO" ? "selected" : ""}>CANCELADO</option>
                    </select>
                </div>
                <button class="btn-admin btn-primary" id="btn-save-estado" style="width:100%; margin-top:10px;">Actualizar</button>
            </div>
        </div>
    `;

    document.getElementById("close-modal")?.addEventListener("click", () => modalContainer.innerHTML = "");
    document.getElementById("btn-save-estado")?.addEventListener("click", () => {
        ped.estado = (document.getElementById("select-estado") as HTMLSelectElement).value as any;
        localStorage.setItem("pedidos_realizados", JSON.stringify(pedidos));
        modalContainer.innerHTML = "";
        cargarDatos();
    });
};

// MODAL: Alta de Productos
document.getElementById("btn-abrir-alta")?.addEventListener("click", () => {
    if (!modalContainer) return;

    modalContainer.innerHTML = `
        <div class="modal-overlay">
            <div class="modal-content">
                <button class="modal-close" id="close-modal">×</button>
                <h3 style="margin-bottom:15px;">Nuevo Producto</h3>
                <form id="form-alta">
                    <div class="form-group"><label>Nombre:</label><input type="text" id="add-nombre" required></div>
                    <div class="form-group"><label>Precio:</label><input type="number" id="add-precio" required></div>
                    <div class="form-group"><label>Stock Inicial:</label><input type="number" id="add-stock" required></div>
                    <div class="form-group"><label>URL Imagen:</label><input type="text" id="add-img" value="/img/burguer-default.jpg"></div>
                    <button type="submit" class="btn-admin btn-primary" style="width:100%; margin-top:10px;">Guardar en Catálogo</button>
                </form>
            </div>
        </div>
    `;

    document.getElementById("close-modal")?.addEventListener("click", () => modalContainer.innerHTML = "");
    document.getElementById("form-alta")?.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nuevo: Product = {
            id: Date.now(),
            nombre: (document.getElementById("add-nombre") as HTMLInputElement).value,
            descripcion: "Agregado desde el panel de administración.",
            precio: Number((document.getElementById("add-precio") as HTMLInputElement).value),
            stock: Number((document.getElementById("add-stock") as HTMLInputElement).value),
            imagen: (document.getElementById("add-img") as HTMLInputElement).value,
            disponible: true,
            categoria: { id: 1, nombre: "General", descripcion: "Categoría general" }
        };

        productos.push(nuevo);
        localStorage.setItem("productos_catalogo", JSON.stringify(productos));
        modalContainer.innerHTML = "";
        cargarDatos();
    });
});

// Logout
document.getElementById("btn-cerrar-sesion")?.addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("usuarioLogueado");
    window.location.href = "../auth/login/login.html";
});

// Arrancar módulo
cargarDatos();