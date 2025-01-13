console.log('loaded front.js');

//ロード関連

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

//ログイン関連

let isAbleLogin = false
function matchPttern(str){
const cleanedStr = str.replace(/[^0-9a-zA-Zぁ-んァ-ヶ一-龠々ー]/g, '');
return [str == cleanedStr,cleanedStr]
}
const elements = {
    login:{
        loginBtn:document.querySelector(".login-signup-button"),
        changeFormType:document.querySelector("#change-login-form-type"),
        message:document.querySelector("#login-message"),
        userName:document.querySelector("#login-user-name"),
        password:document.querySelector("#login-password"),
    }
}

let loginFormMode = "login"
function changeLoginFormType(){
    var msg = []
    if(loginFormMode == "login"){
        loginFormMode = "signup"
        msg = ["サインアップ","アカウントをすでにお持ちの場合","ログイン"]
    }else{
        loginFormMode = "login"
        msg = ["ログイン","アカウントをすでにお持ちの場合","サインアップ"]
    }
    document.querySelector(".login-signup-form > .title").textContent = `ProChatに${msg[0]}`
    elements.login.loginBtn.textContent = msg[0]
    document.querySelector(".change-type-label").textContent = msg[1]
    elements.login.changeFormType.textContent = msg[2]
}

elements.login.changeFormType.addEventListener("click",()=>{
    changeLoginFormType()
})
elements.login.loginBtn.addEventListener("click",()=>{
    if(!isAbleLogin){return null;}
    if(elements.login.password.value.length < 1){
        alert("パスワードが入力されていません。")
    }
    if(loginFormMode == "login"){
    }else{
        alert("")
    }
})

var checkForm = setInterval(()=>{
        isAbleLogin = true
        var v = elements.login.userName.value
    elements.login.message.textContent = ""
    if(/\s/.test(v)/*空白文字*/){
        isAbleLogin = false
        elements.login.message.innerHTML += "空白を含むユーザー名は利用できません。<br>"
    }
    if(matchPttern(v)[0]){}else{
        isAbleLogin = false
        elements.login.message.innerHTML += "使用できない文字が含まれています。<br>"
    }
    if(v.length > 30){
        isAbleLogin = false
        elements.login.message.innerHTML += "ユーザー名は30文字以内にしてください。<br>"
    }

    if(isAbleLogin && v.length > 0){
        document.querySelector(".login-signup-button").style.opacity = 1
    }else{
        isAbleLogin = false
        document.querySelector(".login-signup-button").style.opacity = 0.5
    }
},1000/24)

waitLoading()
setTimeout(()=>{
    flg.load.whole = true
},500)