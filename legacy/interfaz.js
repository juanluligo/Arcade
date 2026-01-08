// Clase encargada de todo lo visual del juego (la interfaz)
class Interfaz {
    constructor(ctx, ancho, alto, tamanoCuadro) {
        // El contexto del canvas para dibujar
        this.ctx = ctx;
        // Ancho y alto del canvas
        this.ancho = ancho;
        this.alto = alto;
        // Tamaño de cada cuadro o celda de la cuadrícula
        this.tamanoCuadro = tamanoCuadro;
    }

    // Método para limpiar toda la pantalla con un fondo negro
    limpiarPantalla() {
        this.ctx.fillStyle = '#000'; // color negro
        this.ctx.fillRect(0, 0, this.ancho, this.alto);
    }

    // Método para dibujar la culebra completa (cabeza + cuerpo)
    dibujarCulebra(cuerpo) {
        cuerpo.forEach((segmento, index) => {
            if (index === 0) {
                // Cabeza de la culebra (verde oscuro)
                this.ctx.fillStyle = '#4CAF50';
                this.ctx.fillRect(
                    segmento.x * this.tamanoCuadro,
                    segmento.y * this.tamanoCuadro,
                    this.tamanoCuadro,
                    this.tamanoCuadro
                );

                // Ojos en la cabeza (negros)
                this.ctx.fillStyle = '#000';
                const ojoDiam = 3;
                const centroX = segmento.x * this.tamanoCuadro + this.tamanoCuadro / 2;
                const centroY = segmento.y * this.tamanoCuadro + this.tamanoCuadro / 2;

                // Dos ojos tipo pixel
                this.ctx.fillRect(centroX - 6, centroY - 3, ojoDiam, ojoDiam);
                this.ctx.fillRect(centroX + 3, centroY - 3, ojoDiam, ojoDiam);
            } else {
                // Cuerpo de la culebra (verde claro)
                this.ctx.fillStyle = '#8BC34A';
                this.ctx.fillRect(
                    segmento.x * this.tamanoCuadro,
                    segmento.y * this.tamanoCuadro,
                    this.tamanoCuadro,
                    this.tamanoCuadro
                );
            }

            // Borde oscuro en cada segmento de la culebra
            this.ctx.strokeStyle = '#2E7D32';
            this.ctx.lineWidth = 1;
            this.ctx.strokeRect(
                segmento.x * this.tamanoCuadro,
                segmento.y * this.tamanoCuadro,
                this.tamanoCuadro,
                this.tamanoCuadro
            );
        });
    }

    // Método para actualizar el puntaje en pantalla
    dibujarPuntuacion(puntuacion) {
        const elementoPuntuacion = document.getElementById('puntuacion');
        if (elementoPuntuacion) {
            elementoPuntuacion.textContent = `Puntuación: ${puntuacion}`;
        }
    }

    // Método que muestra el mensaje de Game Over
    mostrarGameOver(puntuacion) {
        const elementoGameOver = document.getElementById('game-over');
        if (elementoGameOver) {
            elementoGameOver.style.display = 'block';
            elementoGameOver.textContent = `¡Game Over! Puntuación: ${puntuacion} - Presiona R para reiniciar`;
        }
    }

    // Oculta el mensaje de Game Over
    ocultarGameOver() {
        const elementoGameOver = document.getElementById('game-over');
        if (elementoGameOver) {
            elementoGameOver.style.display = 'none';
        }
    }

    // Método para mostrar la cuadrícula del juego (opcional, solo decorativo)
    dibujarGrid() {
        this.ctx.strokeStyle = '#222'; // color gris oscuro para la malla
        this.ctx.lineWidth = 0.5;

        // Líneas verticales
        for (let x = 0; x <= this.ancho; x += this.tamanoCuadro) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.alto);
            this.ctx.stroke();
        }

        // Líneas horizontales
        for (let y = 0; y <= this.alto; y += this.tamanoCuadro) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.ancho, y);
            this.ctx.stroke();
        }
    }

    // Muestra un mensaje de pausa en pantalla
    mostrarPausa() {
        // Fondo semitransparente
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(0, 0, this.ancho, this.alto);

        // Texto en blanco
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '24px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('PAUSADO', this.ancho / 2, this.alto / 2);
        this.ctx.fillText('Presiona P para continuar', this.ancho / 2, this.alto / 2 + 40);
    }

    // Muestra un mensaje inicial para que el jugador sepa cómo comenzar
    mostrarInicio() {
        this.limpiarPantalla(); // limpia antes de mostrar el texto
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '20px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText('Presiona cualquier flecha para comenzar', this.ancho / 2, this.alto / 2);
    }
}

// Exportamos la clase para usarla en otros archivos
export default Interfaz;
