import { WORDS } from "./palabras.js";//importa las palabras

//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
let currentGuess = []
let nextLetter = 0
let guessesMatrix = [
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""],
    ["", "", "", "", ""]
]
var elemStopwatch = document.getElementById("stopwatch")
var stopwatch
var mins
var secs


window.onload = () => {
    startTimer(0, 0)

    /**
     * inicia el timer
     * @param {int} m minutos
     * @param {int} s segundos
     */

    function startTimer(m, s) {
        stopwatch = setInterval(function () {
            if (s >= 60) {
                s = 0;
                m++;
            }
            elemStopwatch.innerHTML = `Timer: ${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
            mins = m;
            secs = s;
            s++;
        }, 1000)
    }

    /**
     * 
     * listenevent para el teclado
     */
    document.addEventListener("keyup", (e) => {
        if (guessesRemaining === 0) {
            return
        }

        let pressedKey = String(e.key)
        if (pressedKey === "Backspace" && nextLetter !== 0) {
            deleteLetter()
            return
        }

        if (pressedKey === "Enter") {
            checkGuess()
            return
        }

        let found = pressedKey.match(/[a-z]/gi)
        if (!found || found.length > 1) {
            return
        } else {
            insertLetter(pressedKey)
        }
    })

    /**
    * cambia a la celda correcta al presionar una tecla
    * @param {string} pressedKey 
    */
    function insertLetter(pressedKey) {
        if (nextLetter === 5) {
            return
        }
        pressedKey = pressedKey.toLowerCase()

        let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
        let box = row.children[nextLetter]
        box.textContent = pressedKey
        box.classList.add("filled-box")
        currentGuess.push(pressedKey)
        guessesMatrix[6 - guessesRemaining][nextLetter] = pressedKey
        nextLetter += 1
    }
    
    /**
    * borrar las letras
    */
    function deleteLetter() {
        let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
        let box = row.children[nextLetter - 1]
        box.textContent = ""
        box.classList.remove("filled-box")
        currentGuess.pop()
        guessesMatrix[6 - guessesRemaining][nextLetter] = ""
        nextLetter -= 1
    }

    /**
    * chequea las letras al presionar enter
    */
    function checkGuess () {
        let row = document.getElementsByClassName("letter-row")[6 - guessesRemaining]
        let guessString = ''
        let rightGuess = Array.from(rightGuessString)
    
        for (const val of currentGuess) {
            guessString += val
        }
    
        if (guessString.length != 5) {
            showAlert("Cantidad de letras insuficiente")
            return
        }
    
        if (!WORDS.includes(guessString)) {
            showAlert("Esa palabra no esta en la lista")
            return
        }
    
        
        for (let i = 0; i < 5; i++) {
            let letterColor = ''
            let box = row.children[i]
            let letter = currentGuess[i]
            
            let letterPosition = rightGuess.indexOf(currentGuess[i])
            // si la letra no esta en la palabra
            if (letterPosition === -1) {
                letterColor = 'grey'
            } else {
                //lsi la letra esta en la palabra y en la psicion correcta
                if (currentGuess[i] === rightGuess[i]) {
                    letterColor = 'green'
                } else {
                    //si la letra esta en la palabra pero no en la posicion correcta
                    letterColor = 'yellow'
                }
                //cambia la letra en la variable para que no aparezca amarilla si la letra se repite
                rightGuess[letterPosition] = "#"
            }
    
            let delay = 250 * i
            setTimeout(()=> {
                //shade box
                box.style.backgroundColor = letterColor
                shadeKeyBoard(letter, letterColor)
            }, delay)
        }
    
        if (guessString === rightGuessString) {
            showAlert("Acertaste la palabra! Podras ver tu puntaje en la tabla de ganadores", 5000)
            
            //sets variable to be saved on finishedGames
            numberOfAttempts = 6 - (guessesRemaining - 1)
            saveFinishedGame()
            stopTimer()
    
            guessesRemaining = 0
    
            return
        } else {
            guessesRemaining -= 1;
            currentGuess = [];
            nextLetter = 0;
    
            if (guessesRemaining === 0) {
                showAlert(`Te quedaste sin intentos! La palabra era "${rightGuessString}"`, 8000)
                if  (localStorage.getItem(`saveGame${user}`) !== null) {
                    localStorage.removeItem(`saveGame${user}`)
                }
            }
        }
    }


}