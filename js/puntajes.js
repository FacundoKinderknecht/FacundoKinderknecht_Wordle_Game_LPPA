function getElements() {
    lblLoading = document.getElementById("loading-text")
    title = document.getElementById("title")
    if (localStorage.finishedGames == null) {
        finishedGames = null
    } else {
        finishedGames = JSON.parse(localStorage.finishedGames)
    }
}

window.onload = () => {
    getElements()

    setTimeout(fillTable, 500)
}

//crea la tabla y la llena con la informacion del local storage
function fillTable() {
    if (finishedGames == null) {
        title.classList.toggle("hidden",false)
        title.innerHTML = "Aun no se han registrado partidas"
    } else {
    lblLoading.classList.toggle("hidden",true)
    title.classList.toggle("hidden",true)
    let head = `
    <tr><th>Nombre</th>
    <th>Palabra</th>
    <th>Fecha</th>
    <th>Tiempo</th>
    <th>Cantidad de intentos</th></tr>`;
    let body = "";
    for (let i = 0; i < finishedGames.length; i++) {
        body += `
        <tr><td>${finishedGames[i].user}</td>
        <td>${finishedGames[i].rightGuessString.toUpperCase()}</td>
        <td>${finishedGames[i].hour}</td>
        <td>${finishedGames[i].mins.toString().padStart(2,"0")}:${finishedGames[i].secs.toString().padStart(2,"0")}</td>
        <td>${finishedGames[i].numberOfAttempts}</td></tr>`;
    }
    document.getElementById("encabezado").innerHTML = head;
    document.getElementById("contenido").innerHTML = body;
    }
}