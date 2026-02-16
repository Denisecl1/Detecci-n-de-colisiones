const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusBadge = document.getElementById("status");

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
        // Velocidad aleatoria para los casos B y C
        this.dx = (Math.random() - 0.5) * this.speed * 2;
        this.dy = (Math.random() - 0.5) * this.speed * 2;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
        context.fillStyle = "white"; 
        context.fillText(this.text, this.posX, this.posY);
        context.lineWidth = 2;
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

function getDistance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// --- FUNCIONES DE CREACIÓN POR CASO ---

function crearDosCirculos() {
    listaCirculos = [];
    listaCirculos.push(new Circle(100, 100, 50, "#818cf8", "1", 3));
    listaCirculos.push(new Circle(400, 300, 80, "#f472b6", "2", 2));
}

function crearMuchosCirculos(cantidad) {
    listaCirculos = [];
    for (let i = 0; i < cantidad; i++) {
        let r = Math.random() * 20 + 20;
        listaCirculos.push(new Circle(
            Math.random() * (canvas.width - r * 2) + r,
            Math.random() * (canvas.height - r * 2) + r,
            r, "#818cf8", (i + 1).toString(), 2
        ));
    }
}

// --- CONTROLADOR DE NAVEGACIÓN ---

function cambiarCaso(nuevoCaso) {
    casoActual = nuevoCaso;

    // Actualizar UI
    document.getElementById('header-caso-A').classList.add('d-none');
    document.getElementById('header-caso-B').classList.add('d-none');
    document.getElementById('header-caso-C').classList.add('d-none');
    document.getElementById('header-caso-' + nuevoCaso).classList.remove('d-none');

    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => link.classList.remove('active'));
    event.target.classList.add('active');

    iniciarLogicaCaso(nuevoCaso);
}

function iniciarLogicaCaso(caso) {
    if (caso === 'A') crearDosCirculos();
    else if (caso === 'B') crearMuchosCirculos(10);
    else if (caso === 'C') crearMuchosCirculos(15);
}

// --- ANIMACIÓN ÚNICA ---

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let colisionGlobal = false;
    
    // Resetear colores
    listaCirculos.forEach(c => c.color = c.defaultColor);

    // Detección de Colisiones Colectiva
    for (let i = 0; i < listaCirculos.length; i++) {
        for (let j = i + 1; j < listaCirculos.length; j++) {
            if (getDistance(listaCirculos[i].posX, listaCirculos[i].posY, 
                            listaCirculos[j].posX, listaCirculos[j].posY) 
                <= (listaCirculos[i].radius + listaCirculos[j].radius)) {
                
                listaCirculos[i].color = "red";
                listaCirculos[j].color = "red";
                colisionGlobal = true;
                
                // Si es el Caso C, podrías añadir aquí lógica de rebote físico
            }
        }
    }

    // Actualizar Badge
    statusBadge.innerText = colisionGlobal ? "¡COLISIÓN!" : "Sin Colisión";
    statusBadge.className = colisionGlobal ? "badge rounded-pill bg-danger px-4 py-2" : "badge rounded-pill bg-success px-4 py-2";

    listaCirculos.forEach(c => c.update(ctx));
}

// Inicialización
iniciarLogicaCaso('A');
animate();