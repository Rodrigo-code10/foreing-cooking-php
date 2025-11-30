import API_URL from './config.js';
import { CambiarHeader } from "./logicaHeader.js";
import { mostrarMensaje, mostrarMensajeBloqueo } from './mensajes.js';

//// REGISTRO ////
const dominiosPermitidos = ["gmail.com", "hotmail.com", "outlook.com"];
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm form");
    if(registerForm){
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('register_nombre').value;
            const email = document.getElementById('register_email').value;
            const password = document.getElementById('register_password').value;

            if(nombre.length < 3){
                mostrarMensaje("El nombre debe tener al menos 3 caracteres",'#C7A414');
                return;
            }

            const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if(!regex.test(email)){
                mostrarMensaje("Formato de correo inválido",'#E01616');
                return;
            }

            const dominio = email.split("@")[1].toLowerCase();
            if(!dominiosPermitidos.includes(dominio)){
                mostrarMensaje(`Solo se permiten correos de: ${dominiosPermitidos.join(", ")}`,'#E01616');
                return;
            }

            if(password.length < 6){
                mostrarMensaje("La contraseña debe tener al menos 6 caracteres",'#C7A414');
                return;
            }

            const submitBtn = registerForm.querySelector('.submit-btn');
            if(submitBtn){
                submitBtn.disabled = true;
                submitBtn.textContent = "Registrando...";
            }

            try{
                const res = await fetch(`${API_URL}/registrar`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ nombre, email, password })
                });
                const data = await res.json();

                if(!res.ok) throw new Error(data.error || "Error al registrar");

                // Guardar usuario completo y token
                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                // Actualizar header
                CambiarHeader(data.usuario.foto);

                mostrarMensaje(`¡Registro exitoso! Bienvenido ${data.usuario.nombre}!`,'#4CAF50');

                // Redirigir después de mostrar cambios
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 1000);

            }catch(err){
                mostrarMensaje(`Error: ${err.message}`,'#E01616');
                if(submitBtn){
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Registrarse";
                }
            }
        });
    }
});

//// LOGIN ////
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.querySelector("#loginForm form");
    if(loginForm){
        loginForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const email = document.getElementById('login_email')?.value;
            const password = document.getElementById('login_password')?.value;

            if(!email || !password){
                mostrarMensaje("Por favor completa todos los campos",'#C7A414');
                return;
            }

            const submitBtn = loginForm.querySelector('.submit-btn');
            if(submitBtn){
                submitBtn.disabled = true;
                submitBtn.textContent = "Iniciando sesión...";
            }

            try{
                const res = await fetch(`${API_URL}/login`, {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email, password })
                });
                const data = await res.json();
                if(!res.ok) throw new Error(data.error || "Error al iniciar sesión");

                localStorage.setItem('token', data.token);
                localStorage.setItem('usuario', JSON.stringify(data.usuario));

                CambiarHeader(data.usuario.foto);

                mostrarMensaje(`¡Bienvenido ${data.usuario.nombre} !`,'#4CAF50');

                if (data.usuario.rol == 'admin'){
                    setTimeout(() => {
                        window.location.href = 'PanelAdministrativo.php';
                    }, 1000);
    
                }else {
                    setTimeout(() => {
                        window.location.href = 'index.php';
                    }, 1000);
                }

            }catch(err){
                if (err.message.includes("desactivada")) {
                    mostrarMensajeBloqueo(err.message, '#E8534F');
                    setTimeout(() => {
                        window.location.href = "index.php";
                    }, 1000); 
                } else {
                    mostrarMensaje(`Error: ${err.message}`, '#E01616'); 
                }
            }
        });
    }
});
