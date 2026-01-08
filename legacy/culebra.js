// Importamos la clase de lista doblemente enlazada (donde se guarda el cuerpo de la serpiente)
import ListaDoblementeEnlazada from './listaDoblementeEnlazada.js';

// Clase que representa a la culebra (la serpiente del juego)
class Culebra {
    constructor(x, y, tamanoCuadro) {
        // Creamos el cuerpo de la serpiente usando la lista doblemente enlazada
        this.cuerpo = new ListaDoblementeEnlazada();
        
        // Agregamos la cabeza de la serpiente en la posición inicial
        this.cuerpo.agregarAlInicio(x, y);

        // Dirección inicial: la serpiente va hacia la derecha
        this.direccion = { x: 1, y: 0 };

        // Tamaño de cada cuadro o celda del juego
        this.tamanoCuadro = tamanoCuadro;

        // Guardamos la última dirección usada para evitar errores de movimiento
        this.ultimaDireccion = { x: 1, y: 0 };
    }

    // Método para mover la serpiente una posición
    mover() {
        // Actualizamos la última dirección usada
        this.ultimaDireccion = { ...this.direccion };

        // Obtenemos la cabeza actual de la serpiente
        const cabeza = this.obtenerCabeza();

        // Calculamos la nueva posición hacia donde se moverá
        let nuevaX = cabeza.x + this.direccion.x;
        let nuevaY = cabeza.y + this.direccion.y;

        // Agregamos una nueva cabeza en la nueva posición
        this.cuerpo.agregarAlInicio(nuevaX, nuevaY);

        // Eliminamos la última parte del cuerpo (la cola) para mantener el tamaño
        this.cuerpo.eliminarDelFinal();
    }

    // Método para hacer crecer la serpiente (no eliminamos la cola)
    crecer() {
        const cabeza = this.obtenerCabeza();

        // Calculamos la nueva posición
        let nuevaX = cabeza.x + this.direccion.x;
        let nuevaY = cabeza.y + this.direccion.y;

        // Solo agregamos una nueva cabeza, así la serpiente crece
        this.cuerpo.agregarAlInicio(nuevaX, nuevaY);
    }

    // Método para obtener la cabeza de la serpiente
    obtenerCabeza() {
        return this.cuerpo.obtener(0); // posición 0 = cabeza
    }

    // Obtener todo el cuerpo como un array con coordenadas
    obtenerCuerpo() {
        let listaCuerpo = [];

        // Recorremos el cuerpo y agregamos cada parte al array
        this.cuerpo.recorrer(nodo => {
            listaCuerpo.push({
                x: nodo.x,
                y: nodo.y
            });
        });

        return listaCuerpo;
    }

    // Cambiar dirección de movimiento (evita que se vaya al lado contrario)
    cambiarDireccion(dirX, dirY) {
        // Si la nueva dirección no es contraria a la actual
        if (this.ultimaDireccion.x !== -dirX || this.ultimaDireccion.y !== -dirY) {
            this.direccion.x = dirX;
            this.direccion.y = dirY;
        }
    }

    // Revisar si la serpiente se chocó
    checkColision(ancho, alto) {
        const cabeza = this.obtenerCabeza();

        // Verificamos si la cabeza se sale del tablero
        if (cabeza.x < 0 || 
            cabeza.x >= ancho / this.tamanoCuadro || 
            cabeza.y < 0 || 
            cabeza.y >= alto / this.tamanoCuadro) {
            return true; // chocó con una pared
        }

        // Verificamos si se chocó consigo misma
        return this.colisionConCuerpo();
    }

    // Ver si la cabeza toca alguna parte del cuerpo
    colisionConCuerpo() {
        const cabeza = this.obtenerCabeza();
        return this.cuerpo.buscarColision(cabeza.x, cabeza.y);
    }

    // Obtener el tamaño actual de la serpiente
    obtenerTamano() {
        return this.cuerpo.tamano;
    }

    // Reiniciar la serpiente (por ejemplo, cuando pierdes)
    reiniciar(x, y) {
        // Limpiamos todo el cuerpo
        this.cuerpo.limpiar();

        // Creamos la nueva cabeza en una posición inicial
        this.cuerpo.agregarAlInicio(x, y);

        // Volvemos a poner la dirección hacia la derecha
        this.direccion = { x: 1, y: 0 };
        this.ultimaDireccion = { x: 1, y: 0 };
    }
}

// Exportamos la clase para usarla en otras partes del juego
export default Culebra;
