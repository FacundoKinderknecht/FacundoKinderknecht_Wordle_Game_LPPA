//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

const NUMBER_OF_GUESSES = 6
let guessesRemaining = NUMBER_OF_GUESSES
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
     * listener event for key press
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
    * inserts letter on correct cell after key press
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

    /**
 * checkGuess checks after Enter is pressed
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
            // is letter in the correct guess
            if (letterPosition === -1) {
                //shade box grey
                letterColor = 'grey'
            } else {
                //letter is in word
                //if letter index and right guess index are the same
                //letter is in the right position 
                if (currentGuess[i] === rightGuess[i]) {
                    //shade green 
                    letterColor = 'green'
                } else {
                    //shade box yellow
                    letterColor = 'yellow'
                }
                //change that letter in the variable so that other letters in the word and in the wrong position dont get shaded yellow
                rightGuess[letterPosition] = "#"
            }

            let delay = 250 * i
            setTimeout(() => {
                //shade box
                box.style.backgroundColor = letterColor
                shadeKeyBoard(letter, letterColor)
            }, delay)
        }

    }
}