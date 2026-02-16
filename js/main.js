/**
 * Proyecto: Laboratorio de Colisiones Interactivo
 * Autora: Diana Denise Campos Lozano
 * Ingeniería en TIC - 9° Semestre
 */

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusBadge = document.getElementById("status");
const sliderVel = document.getElementById("sliderVelocidad");
const valorVelLabel = document.getElementById("valorVelocidad");
const contadorLabel = document.getElementById("contadorImpactos");

canvas.width = 800;
canvas.height = 500;

let listaCirculos = [];
let casoActual = 'A';
let framesColision = 0; 
let contadorColisiones = 0;

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.defaultColor = color;
        this.text = text;
        this.speed = speed;

        let randomAngle = Math.random() * Math.PI * 2;
        this.dx = Math.cos(randomAngle) * this.speed;
        this.dy = Math.sin(randomAngle) * this.speed;
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
        if ((this.posX + this.radius) > canvas.width || (this.posX - this.radius) < 0) this.dx = -this.dx;
        if ((this.posY + this.radius) > canvas.height || (this.posY - this.radius) < 0) this.dy = -this.dy;
        this.posX += this.dx;
        this.posY += this.dy;
    }
}

// --- FUNCIONES DE APOYO ---

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function resolverColision(c1, c2) {
    c1.dx = -c1.dx;
    c1.dy = -c1.dy;
    c2.dx = -c2.dx;
    c2.dy = -c2.dy;

    const distancia = getDistance(c1.posX, c1.posY, c2.posX, c2.posY);
    const superposicion = (c1.radius + c2.radius) - distancia;
    const ajuste = (superposicion / 2) + 1; 
    
    c1.posX += c1.dx > 0 ? ajuste : -ajuste;
    c1.posY += c1.dy > 0 ? ajuste : -ajuste;
    c2.posX += c2.dx > 0 ? ajuste : -ajuste;
    c2.posY += c2.dy > 0 ? ajuste : -ajuste;
}

// --- LÓGICA DE INTERFAZ Y BOTONES ---

function cambiarCaso(nuevoCaso) {
    casoActual = nuevoCaso;
    reiniciarSimulacion(); // Al cambiar caso, reseteamos todo automáticamente
    
    document.getElementById('header-caso-A').classList.add('d-none');
    document.getElementById('header-caso-B').classList.add('d-none');
    document.getElementById('header-caso-C').classList.add('d-none');
    document.getElementById('header-caso-' + nuevoCaso).classList.remove('d-none');

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    if(event) event.target.classList.add('active');
}

function iniciarLogicaCaso(caso) {
    listaCirculos = [];
    const velActual = parseFloat(sliderVel.value);
    let cantidad = (caso === 'A') ? 2 : (caso === 'B' ? 10 : 15);
    
    for (let i = 0; i < cantidad; i++) {
        let r = Math.random() * 20 + 20;
        listaCirculos.push(new Circle(
            Math.random() * (canvas.width - r * 2) + r,
            Math.random() * (canvas.height - r * 2) + r,
            r, "#818cf8", (i + 1).toString(), velActual
        ));
    }
}

// NUEVA FUNCIÓN: Cambiar colores aleatorios
function cambiarColoresAleatorios() {
    listaCirculos.forEach(c => {
        // Generamos un tono aleatorio (0-360) con saturación y brillo fijos para que se vea bien
        const nuevoColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
        c.defaultColor = nuevoColor;
        c.color = nuevoColor;
    });
}

// NUEVA FUNCIÓN: Reiniciar (F5 Local)
function reiniciarSimulacion() {
    contadorColisiones = 0;
    contadorLabel.innerText = contadorColisiones;
    framesColision = 0;
    iniciarLogicaCaso(casoActual);
}

// --- EVENTOS Y ANIMACIÓN ---

sliderVel.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    valorVelLabel.innerText = v;
    listaCirculos.forEach(c => {
        let angulo = Math.atan2(c.dy, c.dx);
        c.dx = Math.cos(angulo) * v;
        c.dy = Math.sin(angulo) * v;
    });
});

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < listaCirculos.length; i++) {
        for (let j = i + 1; j < listaCirculos.length; j++) {
            let c1 = listaCirculos[i];
            let c2 = listaCirculos[j];

            if (getDistance(c1.posX, c1.posY, c2.posX, c2.posY) <= (c1.radius + c2.radius)) {
                if (framesColision === 0) {
                    contadorColisiones++;
                    contadorLabel.innerText = contadorColisiones;
                }
                framesColision = 10;
                c1.color = "#ef4444";
                c2.color = "#ef4444";
                if (casoActual === 'C') resolverColision(c1, c2);
            }
        }
    }

    if (framesColision > 0) {
        statusBadge.innerText = "¡COLISIÓN!";
        statusBadge.className = "badge rounded-pill bg-danger px-4 py-2 shadow-sm";
        framesColision--;
    } else {
        statusBadge.innerText = "Sistema Estable";
        statusBadge.className = "badge rounded-pill bg-success px-4 py-2 shadow-sm";
        listaCirculos.forEach(c => c.color = c.defaultColor);
    }

    listaCirculos.forEach(c => c.update(ctx));
}

iniciarLogicaCaso('A');
animate();