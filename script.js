console.log("lets write some js")

let currfolder;
let currentsongs = new Audio();
let songs;
async function getsongs(folder) {
    currfolder=folder
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML=response
    let as = div.getElementsByTagName("a")
    songs=[]
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if( element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }
    }



    let songUL  = document.querySelector(".songlists").getElementsByTagName("ul")[0]

    for (const song of songs) {
        let songName = song.split("/").pop();  // Extracts only the filename (e.g., "song1.mp3")
        
        songUL.innerHTML += `<li>
            <img class="invert" width="34" src="images/music.svg" alt="">
            <div class="info">
                <div> ${songName.replaceAll("%20", " ")}</div> 
                <div>Harry</div>
            </div>
            <div class="playnow">
                <span>Play Now</span>
                <img class="invert" src="images/play.svg" alt="">
            </div> 
        </li>`;
    }

    
    

    Array.from(document.querySelector(".songlists").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })
    })
}
function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}



const playMusic = (track,pause = false)=>{

    // let audio =new Audio("/songs/" + track)
    currentsongs.src = `/${currfolder}/` + track

    if(!pause){
        currentsongs.play()
        play.src = "images/pause.svg"
    }
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
    
}




async function main(){
    await getsongs("songs/ncs")
    playMusic(songs[0],true)

    
    play.addEventListener("click", () => {
      if(currentsongs.paused){
        currentsongs.play()
        play.src = "images/pause.svg"
      }
      else{
        currentsongs.pause()
        play.src = "images/play.svg"
      }
    }
    )

    currentsongs.addEventListener("timeupdate",() => {
        console.log(currentsongs.currentTime,currentsongs.duration)
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsongs.currentTime)} / ${secondsToMinutesSeconds(currentsongs.duration)}`
        document.querySelector(".circle").style.left = (currentsongs.currentTime / currentsongs.duration) * 100 + "%";
      
    }
    )

    // seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =(e.offsetX/e.target.getBoundingClientRect().width*100)
        document.querySelector(".circle").style.left = percent + "%";

        currentsongs.currentTime = (currentsongs.duration)*percent /100
    })

    // add an eventlistner on hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    })
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-110%"
    })
    // adding an event listner to previous and next
    previous.addEventListener("click", () => {
        currentsongs.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playMusic(songs[index - 1])
        }
    })

    // Add an event listener to next
    next.addEventListener("click", () => {
        currentsongs.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentsongs.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playMusic(songs[index + 1])
        }
    })

    // add an event for range
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentsongs.volume = parseInt(e.target.value)/100;
    })

    Array.from(document.getElementsByClassName(".card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs= await getsongs(`songs/${item.currentTarget.dataset.folder}`)

        })
    })
    
}

main()


