export function mostrarMensaje(mensaje,color) {
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${color};
        color: white;
        padding: 15px 25px;
        border-radius: 5px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 1000;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.5s;
    `;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

export function mostrarMensajeBloqueo(mensaje, color) {
    // Crear overlay borroso
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        backdrop-filter: blur(5px);
        z-index: 999;
    `;
    
    const div = document.createElement('div');
    div.textContent = mensaje;
    div.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${color};
        color: white;
        padding: 40px 60px;
        border-radius: 15px;
        box-shadow: 0 8px 30px rgba(0,0,0,0.4);
        z-index: 1000;
        font-size: 32px;
        font-weight: bold;
        text-align: center;
        min-width: 400px;
        animation: fadeIn 0.3s, fadeOut 0.3s 2.5s;
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(div);
    
    setTimeout(() => {
        overlay.remove();
        div.remove();
    }, 3000);
}