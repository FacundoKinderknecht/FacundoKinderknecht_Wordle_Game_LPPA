import { WORDS } from "./palabras.js";//importa las palabras

//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

let user = sessionStorage.user
const alertContainer = document.querySelector("[data-alert-container]")
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
var numberOfAttempts
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

    if (sessionStorage.getItem("isNew") === "false") {
        var loadFile = JSON.parse(localStorage.getItem(`saveGame${user}`))
        let savedGuessesRemaining = loadFile.guessesRemaining
        rightGuessString = loadFile.rightGuessString
        guessesMatrix = loadFile.guessesMatrix
        mins = loadFile.mins
        secs = loadFile.secs
        startTimer(mins, secs)

        for (let row = 0; row < 6 - savedGuessesRemaining; row++) {
            for (let box = 0; box < 5; box++) {
                insertLetter(guessesMatrix[row][box])
            }
            checkGuess()
        }
    }
    console.log(rightGuessString)

    var btnSave = document.getElementById("btn-save")
    btnSave.onclick = (e) => {
        saveGameState()
        sessionStorage.isNew = "false"
    }


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
    function checkGuess() {
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
                //si la letra esta en la palabra y en la psicion correcta
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
            setTimeout(() => {
                box.style.backgroundColor = letterColor
                shadeKeyBoard(letter, letterColor)
            }, delay)
        }

        if (guessString === rightGuessString) {
            showAlert("Felicidades has ganado!!", 4000)

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
                stopTimer()
                if (localStorage.getItem(`saveGame${user}`) !== null) {
                    localStorage.removeItem(`saveGame${user}`)
                }
            }
        }

        /**
         * 
         * @param {string} message 
         * @param {int} duration 
         * @returns mensaje de alerta
         */
        function showAlert(message, duration = 500) {
            const alert = document.createElement("div");
            alert.textContent = message;
            alert.classList.add("alert");
            alertContainer.prepend(alert);
            if (!duration) return;
            setTimeout(() => {
                alert.classList.add("hide");
                alert.addEventListener("transitionend", () => {
                    alert.remove();
                });
            }, duration);
        }


        /**
        * guarda el juego que termino y limpia los parametros
        */
        function saveFinishedGame() {
            let currentDate = new Date()
            let finished = {
                user: user,
                rightGuessString: rightGuessString,
                date: currentDate.toLocaleDateString(),
                hour: currentDate.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' }),
                guessesMatrix: guessesMatrix,
                numberOfAttempts: numberOfAttempts,
                mins: mins,
                secs: secs
            }
            if (localStorage.finishedGames == null) {
                var finishedGames = []
            } else {
                var finishedGames = JSON.parse(localStorage.finishedGames)
            }

            finishedGames.push(finished)
            localStorage.finishedGames = JSON.stringify(finishedGames)

            localStorage.removeItem(`saveGame${user}`)
        }


        /** 
        * funcion para el teclado de pantalla
        */
        document.getElementById("keyboard-cont").addEventListener("click", (e) => {
            const target = e.target

            if (!target.classList.contains("keyboard-button")) {
                return
            }
            let key = target.textContent

            if (key === "Del") {
                key = "Backspace"
            }

            document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
        })



        /**
        * 
        * @param {*} letter 
        * @param {*} color 
        * Cambia los colores en el teclado de la pantalla
        */
        function shadeKeyBoard(letter, color) {
            for (const elem of document.getElementsByClassName("keyboard-button")) {
                if (elem.textContent === letter) {
                    let oldColor = elem.style.backgroundColor
                    if (oldColor === 'green') {
                        return
                    }

                    if (oldColor === 'yellow' && color !== 'green') {
                        return
                    }

                    elem.style.backgroundColor = color
                    break
                }
            }
        }

        //para el cronometro
        function stopTimer() {
            clearInterval(stopwatch)
        }
    }
}

/**
        * guarda el juego
        */
function saveGameState() {
    let file = {
        user: user,
        guessesRemaining: guessesRemaining,
        rightGuessString: rightGuessString,
        guessesMatrix: guessesMatrix,
        mins: mins,
        secs: secs
    }
    let saveStateString = JSON.stringify(file)
    localStorage.setItem(`saveGame${user}`, saveStateString)
}