import API_URL from './config.js';
import { CambiarHeader } from "./logicaHeader.js";
//// REGISTRO ////
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.querySelector("#registerForm form");
    if(registerForm){
        registerForm.addEventListener("submit", async (e) => {
            e.preventDefault();

            const nombre = document.getElementById('register_nombre').value;
            const email = document.getElementById('register_email').value;
            const password = document.getElementById('register_password').value;

            if(nombre.length < 3){
                alert("El nombre debe tener al menos 3 caracteres");
                return;
            }
            if(password.length < 6){
                alert("La contraseña debe tener al menos 6 caracteres");
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

                alert("¡Registro exitoso! Bienvenido " + data.usuario.nombre);

                // Redirigir después de mostrar cambios
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 500);

            }catch(err){
                alert("Error: " + err.message);
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
                alert("Por favor completa todos los campos");
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

                alert("¡Bienvenido " + data.usuario.nombre + "!");

                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 500);

            }catch(err){
                alert("Error: " + err.message);
                if(submitBtn){
                    submitBtn.disabled = false;
                    submitBtn.textContent = "Iniciar Sesión";
                }
            }
        });
    }
});
