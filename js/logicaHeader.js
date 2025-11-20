import API_URL from './config.js';

//// FUNCIÓN PARA CAMBIAR HEADER ////

export function CambiarHeader(fotoPerfil){
    const btnLogin = document.getElementById("btn-login");
    const btnRegister = document.getElementById("btn-register");
    const perfil = document.getElementById("perfil-container");
    const img = document.getElementById("perfil-foto");

    const receta = document.getElementById("CreaReceta");

    if(btnLogin) btnLogin.style.display = "none";
    if(btnRegister) btnRegister.style.display = "none";

    if(perfil && img){        
        const fallbackURL = "https://raw.githubusercontent.com/Rodrigo-code10/foreing-cooking-api/refs/heads/main/api/public/default/SinFoto.png"; 

        img.src = `${API_URL}${fotoPerfil}`;
        img.onerror = () => {
            console.warn("No se pudo cargar la imagen, usando fallback");
            img.src = fallbackURL;
        };

        perfil.style.display = "block";
        receta.style.display = "block";
    }
}

// ACTUALIZAR HEADER AL CARGAR CUALQUIER PÁGINA
document.addEventListener("DOMContentLoaded", () => {
    const usuario = JSON.parse(localStorage.getItem("usuario"));
    if(usuario && usuario.foto){
        CambiarHeader(usuario.foto);
    }
});
