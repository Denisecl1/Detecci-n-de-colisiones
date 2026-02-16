/**
 * Proyecto: Laboratorio de Colisiones (Casos A, B y C)
 * Autora: Diana Denise Campos Lozano
 * Ingeniería en TIC - 9° Semestre
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusBadge = document.getElementById("status");

// Configuración de dimensiones
canvas.width = 800;
canvas.height = 500;

let listaCirculos = [];
let casoActual = 'A';

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.defaultColor = color;
        this.text = text;
        this.speed = speed;

        // Dirección aleatoria
        this.dx = (Math.random() - 0.5) * this.speed * 2;
        this.dy = (Math.random() - 0.5) * this.speed * 2;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "bold 18px Arial";
        context.fillStyle = "white"; 
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 3;
        context.arc(this.posX, this.posY, this.radius, 0, Math.PI * 2, false);
        context.stroke();
        context.closePath();
    }

    update(context) {
        this.draw(context);

        // Rebote en paredes
        if ((this.posX + this.radius) > canvas.width || (this.posX - this.radius) < 0) {
            this.dx = -this.dx;
        }
        if ((this.posY + this.radius) > canvas.height || (this.posY - this.radius) < 0) {
            this.dy = -this.dy;
        }

        this.posX += this.dx;
        this.posY += this.dy;
    }
}

// Función de distancia (Fórmula de tu actividad)
function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// --- LÓGICA DE REBOTE FÍSICO (Caso C) ---
function resolverColision(c1, c2) {
    // 1. Invertimos direcciones
    c1.dx = -c1.dx;
    c1.dy = -c1.dy;
    c2.dx = -c2.dx;
    c2.dy = -c2.dy;

    // 2. Separación manual para evitar que se queden pegados (solución al círculo 4 y 2)
    const distancia = getDistance(c1.posX, c1.posY, c2.posX, c2.posY);
    const superposicion = (c1.radius + c2.radius) - distancia;
    
    // Empujamos ligeramente hacia afuera
    const ajuste = (superposicion / 2) + 1; 
    c1.posX += c1.dx > 0 ? ajuste : -ajuste;
    c1.posY += c1.dy > 0 ? ajuste : -ajuste;
    c2.posX += c2.dx > 0 ? ajuste : -ajuste;
    c2.posY += c2.dy > 0 ? ajuste : -ajuste;
}

// --- CONTROLADOR DE CASOS ---
function cambiarCaso(nuevoCaso) {
    casoActual = nuevoCaso;

    // UI Headers
    document.getElementById('header-caso-A').classList.add('d-none');
    document.getElementById('header-caso-B').classList.add('d-none');
    document.getElementById('header-caso-C').classList.add('d-none');
    document.getElementById('header-caso-' + nuevoCaso).classList.remove('d-none');

    // UI Navbar
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');

    iniciarLogicaCaso(nuevoCaso);
}

function iniciarLogicaCaso(caso) {
    listaCirculos = [];
    if (caso === 'A') {
        listaCirculos.push(new Circle(150, 200, 60, "#818cf8", "1", 3));
        listaCirculos.push(new Circle(500, 350, 90, "#f472b6", "2", 2));
    } else {
        let cantidad = (caso === 'B') ? 10 : 15;
        for (let i = 0; i < cantidad; i++) {
            let r = Math.random() * 20 + 20;
            listaCirculos.push(new Circle(
                Math.random() * (canvas.width - r * 2) + r,
                Math.random() * (canvas.height - r * 2) + r,
                r, "#818cf8", (i + 1).toString(), 2
            ));
        }
    }
}

// --- ANIMACIÓN ---
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let colisionGlobal = false;
    listaCirculos.forEach(c => c.color = c.defaultColor);

    for (let i = 0; i < listaCirculos.length; i++) {
        for (let j = i + 1; j < listaCirculos.length; j++) {
            let c1 = listaCirculos[i];
            let c2 = listaCirculos[j];

            if (getDistance(c1.posX, c1.posY, c2.posX, c2.posY) <= (c1.radius + c2.radius)) {
                colisionGlobal = true;
                c1.color = "#ef4444";
                c2.color = "#ef4444";

                if (casoActual === 'C') {
                    resolverColision(c1, c2);
                }
            }
        }
    }

    // Actualizar Badge de Bootstrap
    if (colisionGlobal) {
        statusBadge.innerText = "¡COLISIÓN!";
        statusBadge.className = "badge rounded-pill bg-danger px-4 py-2 shadow-sm";
    } else {
        statusBadge.innerText = "Sistema Estable";
        statusBadge.className = "badge rounded-pill bg-success px-4 py-2 shadow-sm";
    }

    listaCirculos.forEach(c => c.update(ctx));
}

// Inicio
iniciarLogicaCaso('A');
animate();