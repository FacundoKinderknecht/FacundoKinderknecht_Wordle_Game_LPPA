//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}


var stopwatch
var mins
var secs


window.onload = () =>{
    startTimer(0,0)
    
/**
 * inicia el timer
 * @param {int} m minutos
 * @param {int} s segundos
 */

function startTimer(m,s){
    stopwatch = setInterval(function(){
        if (s >= 60) {
            s = 0;
            m++;
        }        
        elemStopwatch.innerHTML = `Timer: ${m.toString().padStart(2,"0")}:${s.toString().padStart(2,"0")}`;
        mins = m;
        secs = s;
        s++;
    },1000)
}

}