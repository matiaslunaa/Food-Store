import "../../../styles/style.css";
import "../../../styles/login.css";

const formRegistro = document.getElementById("form-registro") as HTMLFormElement;
const nombreInput = document.getElementById("nombre") as HTMLInputElement;
const apellidoInput = document.getElementById("apellido") as HTMLInputElement;
const emailInput = document.getElementById("email") as HTMLInputElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const errorMessage = document.getElementById("error-message") as HTMLParagraphElement;

formRegistro?.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = nombreInput.value.trim();
    const apellido = apellidoInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();

    if (!errorMessage) return;
    errorMessage.style.display = "none";

    // Validación básica
    if (password.length < 6) {
        errorMessage.innerText = "La contraseña debe tener al menos 6 caracteres.";
        errorMessage.style.display = "block";
        return;
    }

    try {
        // 1. Traemos los usuarios
        const response = await fetch("/data/usuarios.json");
        const usuariosBase = await response.json();

        // 2. Traemos los usuarios que ya se hayan registrado
        const usuariosLocales = JSON.parse(localStorage.getItem("usuarios_registrados") || "[]");

        // Combinamos ambas listas para verificar duplicados
        const todosLosUsuarios = [...usuariosBase, ...usuariosLocales];

        // 3. Verificamos si el email ya existe
        const existeEmail = todosLosUsuarios.some((u: any) => u.mail === email);

        if (existeEmail) {
            errorMessage.innerText = "El correo electrónico ya está registrado.";
            errorMessage.style.display = "block";
            return;
        }

        // 4. Creamos el nuevo objeto usuario
        const nuevoUsuario = {
            id: Date.now(),
            nombre,
            apellido,
            mail: email,
            celular: "",
            rol: "USUARIO",
            password
        };

        // 5. Guardamos array local LocalStorage
        usuariosLocales.push(nuevoUsuario);
        localStorage.setItem("usuarios_registrados", JSON.stringify(usuariosLocales));

        alert("¡Cuenta creada con éxito! Ahora podés iniciar sesión.");
        
        // Redireccionamos al login para que ingrese
        window.location.href = "../login/login.html";

    } catch (error) {
        console.error("Error en el proceso de registro:", error);
        errorMessage.innerText = "Hubo un problema al procesar el registro.";
        errorMessage.style.display = "block";
    }
});