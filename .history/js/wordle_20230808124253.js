import { WORDS } from "./palabras.js";//importa las palabras

//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

var user = sessionStorage.user
var alertContainer = document.querySelector("[data-alert-container]")
var rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]
var NUMBER_OF_GUESSES = 6
var guessesRemaining = NUMBER_OF_GUESSES
var numberOfAttempts
var currentGuess = []
var nextvarter = 0
var guessesMatrix = [
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
        var savedGuessesRemaining = loadFile.guessesRemaining
        rightGuessString = loadFile.rightGuessString
        guessesMatrix = loadFile.guessesMatrix
        mins = loadFile.mins
        secs = loadFile.secs
        startTimer(mins, secs)

        for (var row = 0; row < 6 - savedGuessesRemaining; row++) {
            for (var box = 0; box < 5; box++) {
                insertvarter(guessesMatrix[row][box])
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

    var pressedKey = String(e.key)
    if (pressedKey === "Backspace" && nextvarter !== 0) {
        devarevarter()
        return
    }

    if (pressedKey === "Enter") {
        checkGuess()
        return
    }

    var found = pressedKey.match(/[a-z]/gi)
    if (!found || found.length > 1) {
        return
    } else {
        insertvarter(pressedKey)
    }
})

/**
* cambia a la celda correcta al presionar una tecla
* @param {string} pressedKey 
*/
function insertvarter(pressedKey) {
    if (nextvarter === 5) {
        return
    }
    pressedKey = pressedKey.toLowerCase()

    var row = document.getElementsByClassName("varter-row")[6 - guessesRemaining]
    var box = row.children[nextvarter]
    box.textContent = pressedKey
    box.classList.add("filled-box")
    currentGuess.push(pressedKey)
    guessesMatrix[6 - guessesRemaining][nextvarter] = pressedKey
    nextvarter += 1
}

/**
* borrar las varras
*/
function devarevarter() {
    var row = document.getElementsByClassName("varter-row")[6 - guessesRemaining]
    var box = row.children[nextvarter - 1]
    box.textContent = ""
    box.classList.remove("filled-box")
    currentGuess.pop()
    guessesMatrix[6 - guessesRemaining][nextvarter] = ""
    nextvarter -= 1
}

/**
* chequea las varras al presionar enter
*/
function checkGuess() {
    var row = document.getElementsByClassName("varter-row")[6 - guessesRemaining]
    var guessString = ''
    var rightGuess = Array.from(rightGuessString)

    for (var val of currentGuess) {
        guessString += val
    }

    if (guessString.length != 5) {
        showAlert("Cantidad de varras insuficiente")
        return
    }

    if (!WORDS.includes(guessString)) {
        showAlert("Esa palabra no esta en la lista")
        return
    }


    for (var i = 0; i < 5; i++) {
        var varterColor = ''
        var box = row.children[i]
        var varter = currentGuess[i]

        var varterPosition = rightGuess.indexOf(currentGuess[i])
        // si la varra no esta en la palabra
        if (varterPosition === -1) {
            varterColor = 'grey'
        } else {
            //si la varra esta en la palabra y en la psicion correcta
            if (currentGuess[i] === rightGuess[i]) {
                varterColor = 'green'
            } else {
                //si la varra esta en la palabra pero no en la posicion correcta
                varterColor = 'yellow'
            }
            //cambia la varra en la variable para que no aparezca amarilla si la varra se repite
            rightGuess[varterPosition] = "#"
        }

        var delay = 250 * i
        setTimeout(() => {
            box.style.backgroundColor = varterColor
            shadeKeyBoard(varter, varterColor)
        }, delay)
    }

    if (guessString === rightGuessString) {
        showAlert("Felicidades has ganado!!", 4000)

        numberOfAttempts = 6 - (guessesRemaining - 1)

        saveFinishedGame()
        stopTimer()

        guessesRemaining = 0

        return
    } else {
        guessesRemaining -= 1;
        currentGuess = [];
        nextvarter = 0;

        if (guessesRemaining === 0) {
            showAlert(`Te quedaste sin intentos! La palabra era "${rightGuessString}"`, 8000)
            if (localStorage.getItem(`saveGame${user}`) !== null) {
                localStorage.removeItem(`saveGame${user}`)
            }
            stopTimer()
        }
    }

    /**
     * 
     * @param {string} message 
     * @param {int} duration 
     * @returns mensaje de alerta
     */
    function showAlert(message, duration = 500) {
        var alert = document.createElement("div");
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
        var currentDate = new Date()
        var finished = {
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
        var target = e.target

        if (!target.classList.contains("keyboard-button")) {
            return
        }
        var key = target.textContent

        if (key === "Del") {
            key = "Backspace"
        }

        document.dispatchEvent(new KeyboardEvent("keyup", { 'key': key }))
    })



    /**
    * 
    * @param {*} varter 
    * @param {*} color 
    * Cambia los colores en el teclado de la pantalla
    */
    function shadeKeyBoard(varter, color) {
        for (var elem of document.getElementsByClassName("keyboard-button")) {
            if (elem.textContent === varter) {
                var oldColor = elem.style.backgroundColor
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

/**
* guarda el juego
*/
function saveGameState() {
    var file = {
        user: user,
        guessesRemaining: guessesRemaining,
        rightGuessString: rightGuessString,
        guessesMatrix: guessesMatrix,
        mins: mins,
        secs: secs
    }
    var saveStateString = JSON.stringify(file)
    localStorage.setItem(`saveGame${user}`, saveStateString)
}