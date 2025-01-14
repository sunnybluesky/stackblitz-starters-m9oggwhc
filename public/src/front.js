console.log('loaded front.js');
const fps = 24
//ロード関連

let loadMessage = "connecting to server"
function waitLoading() {
    const screenElement = document.querySelector(".loading-screen")
    const messageElement = document.querySelector("#loading-process")
    let beforeMessage = ""
    function updateMessage(msg) {
        messageElement.textContent = loadMessage
        beforeMessage = loadMessage
    }
    const wait = setInterval(() => {
        if (loadMessage != beforeMessage) {
            updateMessage(loadMessage)
        }
        if (flg.load.whole) {
            clearInterval(wait)
            updateMessage("complete!")
            cookie.refreshCookie()
            if (eval(cookie.obj.loggedIn)) {
                document.querySelector(".login-page-screen").style.display = "none"//ログインフォームを非表示
            } else {
                console.log("login/signup")

            }
            screenElement.style.animation = `fadeout 0.3s ease 0s `
            setTimeout(() => {
                screenElement.style.display = "none";


            }, 270)

        }
    }, 1000 / fps)

}

//ログイン関連

let isAbleLogin = false
function matchPttern(str) {
    const cleanedStr = str.replace(/[^0-9a-zA-Zぁ-んァ-ヶ一-龠々ー]/g, '');
    return [str == cleanedStr, cleanedStr]
}
const elements = {
    login: {
        loginBtn: document.querySelector(".login-signup-button"),
        changeFormType: document.querySelector("#change-login-form-type"),
        message: document.querySelector("#login-message"),
        userName: document.querySelector("#login-user-name"),
        password: document.querySelector("#login-password"),
        loginSuccessMessage: document.querySelector(".success-login-message"),
        loginFailedMessage: document.querySelector(".failed-login-message")
    }
}

let loginFormMode = "login"
function changeLoginFormType() {
    var msg = []
    if (loginFormMode == "login") {
        loginFormMode = "signup"
        msg = ["サインアップ", "アカウントをすでにお持ちの場合", "ログイン"]
    } else {
        loginFormMode = "login"
        msg = ["ログイン", "アカウントをすでにお持ちの場合", "サインアップ"]
    }
    document.querySelector(".login-signup-form > .title").textContent = `ProChatに${msg[0]}`
    elements.login.loginBtn.textContent = msg[0]
    document.querySelector(".change-type-label").textContent = msg[1]
    elements.login.changeFormType.textContent = msg[2]
}

elements.login.changeFormType.addEventListener("click", () => {
    changeLoginFormType()
})
elements.login.loginBtn.addEventListener("click", () => {
    if (!isAbleLogin) { return null; }
    const username = elements.login.userName.value
    const password = elements.login.password.value
    if (password.length < 1) {
        alert("パスワードが入力されていません。")
    }
    if (loginFormMode == "login") {
        requestLogin(username, password)
    } else {
        var v = prompt("パスワードを再度入力してください。")
        if (v == password) {
            console.log("matched")
            requestSignUp(username, password)
        } else {
            updateLoginFailedMessage("パスワードが一致しませんでした。")
        }
    }
})

var checkForm = setInterval(() => {
    if (eval(cookie.obj.loggedIn)) {
        clearInterval(checkForm)
        return 0;
    }
    isAbleLogin = true
    var v = elements.login.userName.value
    elements.login.message.textContent = ""
    if (/\s/.test(v)/*空白文字*/) {
        isAbleLogin = false
        elements.login.message.innerHTML += "空白を含むユーザー名は利用できません。<br>"
    }
    if (matchPttern(v)[0]) { } else {
        isAbleLogin = false
        elements.login.message.innerHTML += "使用できない文字が含まれています。<br>"
    }
    if (v.length > 30) {
        isAbleLogin = false
        elements.login.message.innerHTML += "ユーザー名は30文字以内にしてください。<br>"
    }

    if (isAbleLogin && v.length > 0) {
        document.querySelector(".login-signup-button").style.opacity = 1
    } else {
        isAbleLogin = false
        document.querySelector(".login-signup-button").style.opacity = 0.5
    }

}, 1000 / fps)

waitLoading()
var wait = setInterval(() => {
    if (flg.load.count == flg.load.needed) {
        flg.load.whole = true
        clearInterval(wait)
    }
}, 1000 / fps)
function updateLoginFailedMessage(str) {
    elements.login.loginFailedMessage.innerHTML = str
}   


//はれちゃっと広場関連

class placeRoom {
    name = "";
    color = "#000"
    objectData = []
    type = "none"
    position = [0,0]
    constructor(name="",type="color",position=[0,0],objectData=[],attr={color:"#000"}){
        this.name = name;
        this.attr = attr
        this.objectData = objectData;
        this.type =type
        this.position = position
    }
    drawBackGround(){
        switch(this.type){
            case "color":
        const ctx = place.ctx
        ctx.fillStyle = this.attr.color
        ctx.fillRect(0,0,place.el.width,place.el.height)
        break;
        default:

        break;
        }
    }
}

const place = {
    el:document.querySelector("#canvas-place"),
    ctx:null,
    myCharacter:{
        type:"Tofu",
        position:[640,360],
        //ここまで必須
        attr:{},
        color:"#fff",
        size:30,
    },
    roomsList:[
        new placeRoom("lobby","color",[640,360],[],{color:"#224"}),
    ],
    room:"",
    init:function(){
        this.ctx = this.el.getContext('2d')
    },
    update:function(){
        const ctx = this.ctx
        this.el.style.height = (innerHeight-40)+"px"
        ctx.clearRect(0,0,this.el.innerWidth,this.el.innerHeight)
        this.roomsList[0].drawBackGround()

        this.drawCharacter(this.myCharacter)
    },
    drawCharacter:function(chara){
        const ctx = this.ctx
        switch(chara.type){
            case "Tofu":
                ctx.fillStyle = chara.color
                ctx.fillRect(chara.position[0] - (chara.size/2),chara.position[1] - (chara.size/2),chara.size,chara.size)
            break;
            default:
                console.error("意図しない型です。")
            break;
        }
    },
}

place.init()
setInterval(()=>{
    place.update()
    
})
