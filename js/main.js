const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const statusBadge = document.getElementById("status");

// Ajustamos el canvas al tamaño de su contenedor, no de la ventana completa
canvas.width = 800;
canvas.height = 500;

class Circle {
    constructor(x, y, radius, color, text, speed) {
        this.posX = x;
        this.posY = y;
        this.radius = radius;
        this.color = color;
        this.text = text;
        this.speed = speed;
        this.dx = 1 * this.speed;
        this.dy = 1 * this.speed;
    }

    draw(context) {
        context.beginPath();
        context.strokeStyle = this.color;
        context.fillStyle = this.color;
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.font = "20px Arial";
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

// Función para calcular distancia entre dos puntos (Fórmula de la imagen)
function getDistance(x1, y1, x2, y2) {
    let xDistance = x2 - x1;
    let yDistance = y2 - y1;
    // Teorema de Pitágoras
    return Math.sqrt(Math.pow(xDistance, 2) + Math.pow(yDistance, 2));
}

let c1 = new Circle(100, 100, 50, "#818cf8", "1", 3);
let c2 = new Circle(400, 300, 80, "#f472b6", "2", 2);

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    c1.update(ctx);
    c2.update(ctx);

    // Detección de Colisión
    let distancia = getDistance(c1.posX, c1.posY, c2.posX, c2.posY);
    
    if (distancia <= (c1.radius + c2.radius)) {
        // COLISIÓN DETECTADA
        statusBadge.innerText = "¡COLISIÓN!";
        statusBadge.className = "badge rounded-pill bg-danger px-4 py-2";
        c1.color = "red";
        c2.color = "red";
    } else {
        statusBadge.innerText = "Sin Colisión";
        statusBadge.className = "badge rounded-pill bg-success px-4 py-2";
        c1.color = "#818cf8";
        c2.color = "#f472b6";
    }
}

animate();
