// Importamos las clases necesarias para el juego
import Culebra from './culebra.js';
import Comida from './comida.js';
import Interfaz from './interfaz.js';

// Clase principal que controla la lógica del juego
class Juego {
    constructor(canvas) {
        this.canvas = canvas;                          // Referencia al lienzo (canvas) HTML
        this.ctx = canvas.getContext('2d');            // Contexto de dibujo en 2D
        this.ancho = canvas.width;                     // Ancho del canvas
        this.alto = canvas.height;                     // Alto del canvas
        this.tamanoCuadro = 20;                        // Tamaño de cada cuadro en la cuadrícula

        // Instanciamos la serpiente (culebra) en una posición inicial
        this.culebra = new Culebra(10, 10, this.tamanoCuadro);
        
        // Instanciamos la comida en una posición aleatoria
        this.comida = new Comida(this.ancho, this.alto, this.tamanoCuadro);
        
        // Creamos la interfaz gráfica del juego
        this.interfaz = new Interfaz(this.ctx, this.ancho, this.alto, this.tamanoCuadro);

        this.intervalo = null;                         // Variable para controlar el intervalo de actualización
        this.velocidad = 150;                          // Velocidad del juego (milisegundos)
        this.jugando = false;                          // Bandera para saber si el juego está activo
        this.puntuacion = 0;                           // Puntuación del jugador
        this.pausado = false;                          // Bandera para saber si el juego está en pausa
        this.iniciado = false;                         // Bandera para saber si ya se ha iniciado el juego al menos una vez
    }

    // Método para iniciar o reanudar el juego
    iniciar() {
        if (this.pausado) {
            // Si está en pausa, reanudar sin reiniciar todo
            this.pausado = false;
            this.intervalo = setInterval(() => this.actualizar(), this.velocidad);
            return;
        }

        // Estado inicial del juego
        this.jugando = true;
        this.pausado = false;
        this.iniciado = true;

        // Oculta el mensaje de Game Over si estaba visible
        this.interfaz.ocultarGameOver();

        // Asegura que la comida no aparezca encima de la serpiente
        this.comida.generarSegura(this.culebra.obtenerCuerpo());

        // Inicia el bucle de juego
        this.intervalo = setInterval(() => this.actualizar(), this.velocidad);

        // Dibuja el primer estado del juego
        this.dibujar();
    }

    // Método para detener completamente el juego
    detener() {
        this.jugando = false;
        if (this.intervalo) {
            clearInterval(this.intervalo);
            this.intervalo = null;
        }
    }

    // Método para pausar o reanudar el juego si ya fue iniciado
    pausar() {
        if (this.jugando && this.iniciado) {
            this.pausado = !this.pausado;
            if (this.pausado) {
                this.detener();
                this.interfaz.mostrarPausa();
            } else {
                this.iniciar(); // Reanuda el juego
            }
        }
    }

    // Método para reiniciar completamente el juego
    reiniciar() {
        this.detener(); // Detiene el juego actual
        this.culebra = new Culebra(10, 10, this.tamanoCuadro); // Nueva serpiente
        this.comida = new Comida(this.ancho, this.alto, this.tamanoCuadro); // Nueva comida
        this.puntuacion = 0;
        this.pausado = false;
        this.iniciado = false;
        this.velocidad = 150; // Vuelve a velocidad inicial
        this.iniciar(); // Comienza de nuevo
    }

    // Método que se ejecuta en cada intervalo para actualizar la lógica del juego
    actualizar() {
        if (!this.jugando || this.pausado) return;

        this.culebra.mover(); // Mueve la serpiente en su dirección actual

        // Verifica si la serpiente comió la comida
        if (this.colisionComida()) {
            this.culebra.crecer(); // Aumenta el tamaño de la serpiente
            this.puntuacion += 10;

            // Genera nueva comida en una posición segura
            this.comida.generarSegura(this.culebra.obtenerCuerpo());

            // Aumenta velocidad cada 50 puntos (hasta un mínimo de 80ms)
            if (this.puntuacion % 50 === 0 && this.velocidad > 80) {
                this.velocidad -= 5;
                this.detener(); // Reinicia intervalo con nueva velocidad
                this.iniciar();
            }
        }

        // Verifica colisión contra las paredes o contra sí misma
        if (this.culebra.checkColision(this.ancho, this.alto)) {
            this.detener(); // Finaliza el juego
            this.interfaz.mostrarGameOver(this.puntuacion); // Muestra mensaje final
            this.iniciado = false;
        } else {
            this.dibujar(); // Redibuja todo si no hay colisión
        }
    }

    // Dibuja todo en el canvas (pantalla del juego)
    dibujar() {
        this.interfaz.limpiarPantalla(); // Borra pantalla anterior

        // Puedes activar esta opción para ver la cuadrícula
        // this.interfaz.dibujarGrid();

        this.comida.dibujar(this.ctx); // Dibuja la comida
        this.interfaz.dibujarCulebra(this.culebra.obtenerCuerpo()); // Dibuja la serpiente
        this.interfaz.dibujarPuntuacion(this.puntuacion); // Muestra puntuación
    }

    // Verifica si la cabeza de la serpiente colisiona con la comida
    colisionComida() {
        const cabeza = this.culebra.obtenerCabeza();
        return cabeza.x === this.comida.x && cabeza.y === this.comida.y;
    }

    // Cambia la dirección de la serpiente
    cambiarDireccion(dirX, dirY) {
        if ((this.jugando && !this.pausado) || !this.iniciado) {
            this.culebra.cambiarDireccion(dirX, dirY);
        }
    }

    // Métodos auxiliares para acceder a datos del juego
    obtenerPuntuacion() {
        return this.puntuacion;
    }

    obtenerTamanoSerpiente() {
        return this.culebra.obtenerTamano();
    }

    estaJugando() {
        return this.jugando;
    }

    estaPausado() {
        return this.pausado;
    }
}

// Exportamos la clase para poder usarla en otros archivos
export default Juego;
