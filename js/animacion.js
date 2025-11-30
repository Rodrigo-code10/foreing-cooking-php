let isRegisterMode = false;
let isAnimating = false;

const container = document.getElementById('authContainer');

document.addEventListener('DOMContentLoaded', function () {
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get('mode');

    if (mode === 'register') {
        isRegisterMode = true;
        container.classList.add('register-mode');
    }
});

function toggleAuth() {
    if (isAnimating) return;
    isAnimating = true;
    isRegisterMode = !isRegisterMode;

    if (isRegisterMode) {
        container.classList.add('register-mode');
        window.history.replaceState({}, '', 'IniciarRegistrarse.php?mode=register');
    } else {
        container.classList.remove('register-mode');
        window.history.replaceState({}, '', 'IniciarRegistrarse.php?mode=login');
    }

    setTimeout(() => {
        isAnimating = false;
    }, 600);
}