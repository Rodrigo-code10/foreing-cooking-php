let isRegisterMode = false;
let isAnimating = false;

const container = document.getElementById('authContainer');
const welcomeSection = document.querySelector('.welcome-section');
const loginContent = document.getElementById('loginContent');
const registerContent = document.getElementById('registerContent');
const logoContainer = document.querySelector('.logo-container');

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
    logoContainer.classList.remove('fade-in');
    logoContainer.classList.add('fade-out');
    loginContent.classList.add('fade-out');
    registerContent.classList.add('fade-out');

    welcomeSection.classList.add('expanding');
    welcomeSection.style.clipPath = 'circle(150% at 50% 50%)';

    setTimeout(() => {
        isRegisterMode = !isRegisterMode;

        if (isRegisterMode) {
            container.classList.add('register-mode');
            window.history.replaceState({}, '', 'IniciarRegistrarse.php?mode=register');
        } else {
            container.classList.remove('register-mode');
            window.history.replaceState({}, '', 'IniciarRegistrarse.php?mode=login');
        }
        setTimeout(() => {
            welcomeSection.style.clipPath = '';
            logoContainer.classList.remove('fade-out');
            logoContainer.classList.add('fade-in');
            loginContent.classList.remove('fade-out');
            registerContent.classList.remove('fade-out');
            setTimeout(() => {
                welcomeSection.classList.remove('expanding');
                isAnimating = false;
            }, 800);
        }, 200);
    }, 400);
}




