// Clase que representa la comida del juego
class Comida {
    constructor(ancho, alto, tamanoCuadro) {
        // Guardamos el tamaño del área de juego (ancho y alto)
        this.ancho = ancho;
        this.alto = alto;

        // Tamaño de cada cuadrito donde puede estar la comida
        this.tamanoCuadro = tamanoCuadro;

        // Posición de la comida (inicialmente en 0,0)
        this.x = 0;
        this.y = 0;

        // Generamos una posición aleatoria inicial para la comida
        this.generar();
    }

    // Método para ubicar la comida en una posición aleatoria
    generar() {
        // Generamos una posición X e Y aleatoria dentro del área del juego
        this.x = Math.floor(Math.random() * (this.ancho / this.tamanoCuadro));
        this.y = Math.floor(Math.random() * (this.alto / this.tamanoCuadro));
    }

    // Método que genera comida en una posición segura (que no choque con la serpiente)
    generarSegura(serpienteCuerpo) {
        let intentos = 0;            // Contador de intentos
        const maxIntentos = 100;    // Límite para evitar un bucle infinito

        do {
            this.generar();         // Generamos una nueva posición aleatoria
            intentos++;
        } while (
            this.colisionConSerpiente(serpienteCuerpo) && // Si choca con la serpiente
            intentos < maxIntentos                        // Y no se han pasado los intentos
        );
    }

    // Verifica si la comida está encima de alguna parte del cuerpo de la serpiente
    colisionConSerpiente(serpienteCuerpo) {
        // Revisamos si alguna parte del cuerpo tiene la misma posición que la comida
        return serpienteCuerpo.some(segmento => 
            segmento.x === this.x && segmento.y === this.y
        );
    }

    // Dibuja la comida en pantalla
    dibujar(ctx) {
        // Color principal de la comida
        ctx.fillStyle = '#ff6f61';

        // Dibujamos un cuadrito en la posición de la comida
        ctx.fillRect(
            this.x * this.tamanoCuadro, 
            this.y * this.tamanoCuadro, 
            this.tamanoCuadro, 
            this.tamanoCuadro
        );
        
        // Dibujamos un borde para que se vea más bonito
        ctx.strokeStyle = '#ff8a80'; // color del borde
        ctx.lineWidth = 2;           // grosor del borde
        ctx.strokeRect(
            this.x * this.tamanoCuadro, 
            this.y * this.tamanoCuadro, 
            this.tamanoCuadro, 
            this.tamanoCuadro
        );
    }

    // Devuelve la posición actual de la comida (para comparar con la cabeza de la serpiente, por ejemplo)
    obtenerPosicion() {
        return { x: this.x, y: this.y };
    }
}

// Exportamos esta clase para poder usarla en otros archivos
export default Comida;
