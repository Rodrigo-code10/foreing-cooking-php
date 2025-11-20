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
        if (!img.src) {
            img.src = "src/SinFoto.png";
        }

        // Solo reemplaza si fotoPerfil existe y no está vacío
        if (fotoPerfil) {
            img.src = `${API_URL}${fotoPerfil}`;
        }
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
