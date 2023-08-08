//si el usuario no esta logeado lo redirecciona a index
if (sessionStorage.user == null) {
    location.href = "/index.html"
}



window.onload = () =>{
    startTimer(0,0)
    
/**
 * sets and starts the timer
 * @param {int} m minutes
 * @param {int} s seconds
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

//stops the timer
function stopTimer() {
    clearInterval(stopwatch)
}
}