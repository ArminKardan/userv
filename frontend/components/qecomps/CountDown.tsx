import { useEffect } from "react";

export default (props: { ontimeout?: () => void, onexpire?: () => void, expdate: Date | number, }) => {
    var updater = null;
    useEffect(()=>{
        return ()=>{
            clearInterval(updater)
        }
    })
    var exptime = props.expdate as any;
    if (typeof exptime == "object") {
        exptime = exptime.getTime()
    }
    
    var calcnow = () => {
        var timer = Math.max(0, Math.floor((exptime - new Date().getTime()) / 1000));
        var minutes, seconds;
        minutes = parseInt((timer / 60).toString(), 10);
        seconds = parseInt((timer % 60).toString(), 10);
        minutes = minutes < 10 ? "0" + minutes : minutes;
        seconds = seconds < 10 ? "0" + seconds : seconds;
        return minutes + ":" + seconds;
    }

    var countdown = () => {
        var timer = Math.max(0, Math.floor((exptime - new Date().getTime()) / 1000));
        var minutes, seconds;
        let timedout = false;
        setTimeout(() => {
            updater = setInterval(() => {
                minutes = parseInt((timer / 60).toString(), 10);
                seconds = parseInt((timer % 60).toString(), 10);

                minutes = minutes < 10 ? "0" + minutes : minutes;
                seconds = seconds < 10 ? "0" + seconds : seconds;
                // console.log("RUNNING!")
                try {
                    if (document.getElementById("gl_counter") != null)
                        document.getElementById("gl_counter").textContent = minutes + ":" + seconds;
                    else
                        clearInterval(updater)
                } catch { clearInterval(updater) }

                timer = Math.floor((exptime - new Date().getTime()) / 1000);
                if (timer < 0 && !timedout) {
                    timedout = true
                    clearInterval(updater)
                    props.onexpire?.()
                }
            }, 200);
        }, 100);
    }
    countdown()
    return <span id={"gl_counter"}>{calcnow()}</span>
}