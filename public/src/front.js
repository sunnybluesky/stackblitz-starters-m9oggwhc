console.log('loaded front.js');
let loadMessage = "connecting to server"

function waitLoading(){
const screenElement = document.querySelector(".loading-screen")
const messageElement = document.querySelector("#loading-process")
let beforeMessage = ""
function updateMessage(msg){
    messageElement.textContent = loadMessage
    beforeMessage = loadMessage
}
const wait = setInterval(()=>{
    if(loadMessage != beforeMessage){
        updateMessage(loadMessage)
    }
    if(flg.load.whole){
        clearInterval(wait)
        updateMessage("complete!")
        if(!isLoggedIn){
            document.querySelector(".login-page-screen").style.display = "none"//ログインフォームを非表示
        }
        screenElement.style.animation = `fadeout 0.3s ease 0s `
        setTimeout(()=>{
            screenElement.style.display = "none";


        },270)

    }
},1000/30)

}

waitLoading()
setTimeout(()=>{
    flg.load.whole = true
    },1000)