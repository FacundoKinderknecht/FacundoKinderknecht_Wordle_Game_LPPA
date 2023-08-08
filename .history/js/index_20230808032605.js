function getElements(){
    user = document.getElementById("txt-user")
    btnNew = document.getElementById("btn-new")
    btnLoad = document.getElementById("btn-load")
}

window.onload = () => {
    getElements()
    hideLabels()

    //when "new" button is clicked, check for saved games with that name, and set user in sessionS
    btnNew.onclick = (e) => {
        hideLabels()
        let currentUser = user.value
        if (!currentUser) {
            lblErrorEmpty.classList.toggle("hidden", false)
        }else{
            location.href = '/html/game.html'
        }
    }

    function hideLabels () {
        user.onfocus = () => {
            lblErrorEmpty.classList.toggle("hidden", true)
        }
    }
}