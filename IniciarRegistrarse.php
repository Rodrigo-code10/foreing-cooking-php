<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="stylesheet" href="css/estilo.css" />
    <title>Iniciar o Registrarse</title>
</head>

<body class="auth-page">
    <a href="index.php" class="mobile-logo">
        <img src="src/Logo.png" alt="Foreign Cooking Logo" />
    </a>

    <div class="auth-container" id="authContainer">
        <!-- FORMULARIO DE LOGIN -->
        <div class="form-section" id="loginForm">
            <h2>Iniciar Sesión</h2>
            <p class="subtitle">Use su correo y contraseña</p>
            <form method="POST">
                <div class="input-group email">
                    <input type="email" name="email" id="login_email" placeholder="Correo" required />
                </div>
                <div class="input-group password">
                    <input type="password" name="password" id="login_password" placeholder="Contraseña" required />
                </div>
                <button type="submit" class="submit-btn">Iniciar Sesión</button>
            </form>
            <button class="mobile-switch-btn" onclick="toggleAuth()">¿No tienes cuenta? Registrarse</button>
        </div>

        <!-- FORMULARIO DE REGISTRO -->
        <div class="form-section" id="registerForm">
            <h2>Registrarse</h2>
            <p class="subtitle">Use su correo electrónico para registrarse</p>
            <form method="POST">
                <div class="input-group name">
                    <input type="text" name="nombre" id="register_nombre" placeholder="Nombre" required />
                </div>
                <div class="input-group email">
                    <input type="email" name="email" id="register_email" placeholder="Correo" required />
                </div>
                <div class="input-group password">
                    <input type="password" name="password" id="register_password" placeholder="Contraseña" required />
                </div>
                <button type="submit" class="submit-btn">Registrarse</button>
            </form>
            <button class="mobile-switch-btn" onclick="toggleAuth()">¿Ya tienes cuenta? Iniciar Sesión</button>
        </div>

        <!-- SECCIÓN DE BIENVENIDA -->
        <div class="welcome-section" id="welcomeSection">
            <div class="logo-container">
                <a href="index.php">
                    <img src="src/Logo.png" alt="Foreign Cooking Logo" class="logo-image" />
                </a>
            </div>
            <div class="welcome-content login-content" id="loginContent">
                <h1>¡Bienvenido!</h1>
                <p>Ingrese sus datos personales para usar<br />todas las funciones del sitio</p>
                <button class="switch-btn" onclick="toggleAuth()">Registrarse</button>
            </div>
            <div class="welcome-content register-content" id="registerContent">
                <h1>¡Hola!</h1>
                <p>Regístrese con sus datos personales para<br />usar todas las funciones del sitio</p>
                <button class="switch-btn" onclick="toggleAuth()">Iniciar Sesión</button>
            </div>
        </div>
    </div>

    <script src="js/animacion.js"></script>
    <script type="module" src="js/logicaSesion.js"></script>
</body>
</html>