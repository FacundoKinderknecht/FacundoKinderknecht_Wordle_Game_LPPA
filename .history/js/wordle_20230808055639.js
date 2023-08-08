//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

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
     * listenevent para las teclas del teclado
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
    * deletes letter after back space is pressed
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


}