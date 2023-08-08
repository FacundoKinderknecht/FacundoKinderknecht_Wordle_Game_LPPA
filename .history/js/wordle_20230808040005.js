//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}

window.onload = () =>{

    startTimer(0,0)
}