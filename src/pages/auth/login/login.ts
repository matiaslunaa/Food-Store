import "../../../styles/login.css";
import "../../../styles/style.css";

const formLogin = document.getElementById("form-login") as HTMLFormElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;

formLogin?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!errorMessage) return;
    errorMessage.style.display = "none";

    try {
        // Traemos los usuarios
        const response = await fetch("/data/usuarios.json");
        const usuariosBase = await response.json();

        // Traemos los usuarios creados desde el Registro
        const usuariosLocales = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");

        // Combinamos las dos listas en un solo array
        const todosLosUsuarios = [...usuariosBase, ...usuariosLocales];

        // Buscamos si existe en la lista unificada
        const usuarioEncontrado = todosLosUsuarios.find(
            (u: any) => u.mail === email && u.password === password
        );

        if (usuarioEncontrado) {
            const { password, ...usuarioSesion } = usuarioEncontrado;
            localStorage.setItem("usuarioLogueado", JSON.stringify(usuarioSesion));

            alert(`¡Bienvenido/a ${usuarioEncontrado.nombre}!`);

            // Redirección por rol
            if (usuarioEncontrado.rol === "ADMIN") {
                // Si es admin, lo mandamos derecho al panel de control
                window.location.href = "../../admin/admin.html";
            } else {
                // Si es un cliente común, va al catálogo a comprar
                window.location.href = "../../home/home.html";
            }
        } else {
            errorMessage.innerText = "Correo o contraseña incorrectos.";
            errorMessage.style.display = "block";
        }

    } catch (error) {
        console.error("Error al intentar iniciar sesión:", error);
        errorMessage.innerText = "Hubo un error en el servidor. Intentá más tarde.";
        errorMessage.style.display = "block";
    }
});