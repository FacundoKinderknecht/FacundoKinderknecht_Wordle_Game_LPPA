function getElements() {
    userName = document.getElementById("txt-name")
    email = document.getElementById("txt-email")
    message = document.getElementById("txt-message")
    btnSubmit = document.getElementById("btn-submit")
    lblErrorName = document.getElementById("error-name")
    lblErrorMail = document.getElementById("error-email")
    lblErrorMessage = document.getElementById("error-message")
    lblErrorLogin = document.getElementById("error-login")
}

window.onload = () => {
    getElements()
    hideLabels()

    //cuando se presiona el boton se envia el email con los datos
    btnSubmit.onclick = (e) => {
        e.preventDefault()
        if (validateFields()) {
            let body = message.value
            console.log(message.value)
            window.open(`mailto:facukinder@gmail.com?subject=Wordle feedback from ${userName.value}&body=${message.value}`)
        }
    }
}

//valida los datos y muestra cartel de error de ser necesario
function validateFields() {
    var validate = true
    if (!userName.value || !email.value || !message.value ){
        lblErrorLogin.classList.toggle("hidden",false)
        validate = false
        return validate
    }

    if (!userName.value.match(/^[a-z0-9]+$/i)) {
        lblErrorName.classList.toggle("hidden",false)
        validate = false
    }

    if (!email.value.match(
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
        lblErrorMail.classList.toggle("hidden",false)
        validate = false
    }

    if (message.value.length < 6 ) {
        lblErrorMessage.classList.toggle("hidden",false)
        validate = false
    }
    return validate
}

//labels de error
function hideLabels() {
    userName.onfocus = () => {
        lblErrorName.classList.toggle("hidden",true)
        lblErrorLogin.classList.toggle("hidden",true)
    }
    email.onfocus = () => {
        lblErrorMail.classList.toggle("hidden",true)
        lblErrorLogin.classList.toggle("hidden",true)
    }
    message.onfocus = () => {
        lblErrorMessage.classList.toggle("hidden",true)
        lblErrorLogin.classList.toggle("hidden", true)
    }
}