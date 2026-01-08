// Clase Nodo: representa cada partecita (bloque) de la lista
class Nodo {
    constructor(x, y) {
        this.x = x; // posición en X
        this.y = y; // posición en Y
        this.anterior = null; // nodo anterior
        this.siguiente = null; // nodo siguiente
    }
}

// Clase ListaDoblementeEnlazada: maneja toda la lista de nodos
class ListaDoblementeEnlazada {
    constructor() {
        this.cabeza = null; // primer nodo de la lista
        this.cola = null; // último nodo de la lista
        this.tamano = 0; // cuántos nodos tiene la lista
    }

    // Agrega un nodo al final de la lista
    agregarAlFinal(x, y) {
        const nuevoNodo = new Nodo(x, y);

        if (!this.cabeza) {
            // Si la lista está vacía, el nuevo nodo es cabeza y cola
            this.cabeza = nuevoNodo;
            this.cola = nuevoNodo;
        } else {
            // Si ya hay nodos, lo agregamos al final
            nuevoNodo.anterior = this.cola;
            this.cola.siguiente = nuevoNodo;
            this.cola = nuevoNodo;
        }
        this.tamano++; // aumentamos el tamaño
    }

    // Agrega un nodo al principio de la lista
    agregarAlInicio(x, y) {
        const nuevoNodo = new Nodo(x, y);

        if (!this.cabeza) {
            // Si la lista está vacía
            this.cabeza = nuevoNodo;
            this.cola = nuevoNodo;
        } else {
            // Si ya hay nodos, lo ponemos antes de la cabeza
            nuevoNodo.siguiente = this.cabeza;
            this.cabeza.anterior = nuevoNodo;
            this.cabeza = nuevoNodo;
        }
        this.tamano++;
    }

    // Elimina el último nodo de la lista
    eliminarDelFinal() {
        if (!this.cabeza) {
            // Si la lista está vacía, no hacemos nada
            return;
        }

        if (!this.cabeza.siguiente) {
            // Si solo hay un nodo
            this.cabeza = null;
            this.cola = null;
        } else {
            // Si hay más de uno, quitamos la cola
            this.cola = this.cola.anterior;
            this.cola.siguiente = null;
        }
        this.tamano--;
    }

    // Elimina el primer nodo de la lista
    eliminarDelInicio() {
        if (!this.cabeza) {
            return;
        }

        if (!this.cabeza.siguiente) {
            // Si solo hay un nodo
            this.cabeza = null;
            this.cola = null;
        } else {
            // Si hay más, quitamos la cabeza
            this.cabeza = this.cabeza.siguiente;
            this.cabeza.anterior = null;
        }
        this.tamano--;
    }

    // Inserta un nodo en una posición específica de la lista
    insertarEn(index, x, y) {
        if (index < 0 || index > this.tamano) {
            return false; // posición inválida
        }

        if (index === 0) {
            this.agregarAlInicio(x, y);
            return true;
        }

        if (index === this.tamano) {
            this.agregarAlFinal(x, y);
            return true;
        }

        // Insertamos en el medio
        const nuevoNodo = new Nodo(x, y);
        let actual = this.obtener(index);
        
        nuevoNodo.siguiente = actual;
        nuevoNodo.anterior = actual.anterior;
        actual.anterior.siguiente = nuevoNodo;
        actual.anterior = nuevoNodo;
        
        this.tamano++;
        return true;
    }

    // Devuelve el nodo que está en cierta posición (index)
    obtener(index) {
        if (index < 0 || index >= this.tamano) {
            return null; // posición inválida
        }

        let actual;
        let contador;

        // Si está más cerca del principio, empezamos desde la cabeza
        if (index < this.tamano / 2) {
            actual = this.cabeza;
            contador = 0;
            while (contador < index) {
                actual = actual.siguiente;
                contador++;
            }
        } else {
            // Si está más cerca del final, empezamos desde la cola
            actual = this.cola;
            contador = this.tamano - 1;
            while (contador > index) {
                actual = actual.anterior;
                contador--;
            }
        }

        return actual;
    }

    // Recorre toda la lista y aplica una función a cada nodo
    recorrer(callback) {
        let actual = this.cabeza;
        while (actual) {
            callback(actual); // ejecutamos lo que se quiera con ese nodo
            actual = actual.siguiente;
        }
    }

    // Revisa si hay colisión con otro nodo (útil para juegos como Culebrita)
    buscarColision(x, y) {
        // Comenzamos desde el segundo nodo (evitamos comparar con la cabeza)
        let actual = this.cabeza ? this.cabeza.siguiente : null;
        while (actual) {
            if (actual.x === x && actual.y === y) {
                return true; // Sí hay colisión
            }
            actual = actual.siguiente;
        }
        return false; // No hubo colisión
    }

    // Limpia toda la lista (la vacía completamente)
    limpiar() {
        this.cabeza = null;
        this.cola = null;
        this.tamano = 0;
    }
}

// Exportamos la clase para poder usarla en otros archivos
export default ListaDoblementeEnlazada;
