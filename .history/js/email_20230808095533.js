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

    //when button is clicked, new tab is opened to send email with fields already completed
    btnSubmit.onclick = (e) => {
        e.preventDefault()
        if (validateFields()) {
            let body = message.value
            console.log(message.value)
            window.open(`mailto:francopaladini@wordle.com?subject=Wordle feedback from ${userName.value}&body=${message.value}`)
        }
    }
}

//validate fields before going to send email, and show errors when necessary
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

//hide labels when focus is put on that specific field
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