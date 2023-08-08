function getElements(){
    user = document.getElementById("txt-user")
    btnNew = document.getElementById("btn-new")
    btnLoad = document.getElementById("btn-load")
}

window.onload = () => {
    getElements()
    hidelables()

    //when "new" button is clicked, check for saved games with that name, and set user in sessionS
    btnNew.onclick = (e) => {
        hideLabels()
        let currentUser = user.value
        if (currentUser) {
            if (localStorage.getItem(`saveGame${currentUser}`) === null) {
                sessionStorage.setItem("user", user.value)
                sessionStorage.setItem("isNew", true)
                location.href = 'html/game.html'
            } else {
                lblErrorNew.classList.toggle("hidden",false)
            }
        } else {
            lblErrorEmpty.classList.toggle("hidden",false)
        }
    }

    function hideLabels () {
        user.onfocus = () => {
            lblErrorEmpty.classList.toggle("hidden", true)
        }
    }
}