function getElements() {
    user = document.getElementById("txt-user")
    btnNew = document.getElementById("btn-new")
    btnLoad = document.getElementById("btn-load")
    lblErrorNew = document.getElementById("error-new")
    lblErrorLoad = document.getElementById("error-load")
}

window.onload = () => {
    getElements()
    hideLabels()


    //cuando presiono el boton nuevo juego chequeo las partidas guardas y logueo el usuario
    btnNew.onclick = (e) => {
        hideLabels()
        let currentUser = user.value
        if (currentUser) {
            if (localStorage.getItem(`saveGame${currentUser}`) === null) {
                sessionStorage.setItem("user", user.value)
                sessionStorage.setItem("isNew", true)
                location.href = '/html/wordle.html'
            } else {
                lblErrorNew.classList.toggle("hidden", false)
            }
        } else {
            lblErrorEmpty.classList.toggle("hidden", false)
        }
    }

    //cuando presiono el boton cargar partida chequeo las partidas guardas cargo una y logueo el usuario
    btnLoad.onclick = (e) => {
        hideLabels()
        let currentUser = user.value
        if (currentUser) {
            if ((`saveGame${currentUser}` in localStorage)) {
                sessionStorage.setItem("user", user.value)
                sessionStorage.setItem("isNew", "false")
                location.href = 'html/wordle.html'
            } else {
                lblErrorLoad.classList.toggle("hidden", false)
            }
        } else {
            lblErrorEmpty.classList.toggle("hidden", false)
        }
    }


    function hideLabels() {
        user.onfocus = () => {
            lblErrorEmpty.classList.toggle("hidden", true)
        }
    }
}