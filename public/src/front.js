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
    let isRequestedLogin = false
    const wait = setInterval(() => {
        if (loadMessage != beforeMessage) {
            updateMessage(loadMessage)
        }
        if(flg.load.connection){
            if(!isRequestedLogin){
                if(eval(cookie.obj.loggedIn)){
                requestLogin(cookie.obj.username,cookie.obj.password)
                isShowLoginForm = false
                isRequestedLogin = true
                }else{
                flg.load.login = true //ログインは完了してない。
                flg.load.count++
                }
            }
        }
        if (flg.load.whole) {
            clearInterval(wait)
            updateMessage("complete!")
            cookie.refreshCookie()
            if (eval(cookie.obj.loggedIn)) {
                document.querySelector(".login-page-screen").style.display = "none"//ログインフォームを非表示
                isShowLoginForm = false
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
        message: document.querySelector("#login-message-warning"),
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
    key:{
        w:false,
        a:false,
        s:false,
        d:false
    },
    el:document.querySelector("#canvas-place"),
    ctx:null,
    myCharacter:{
        type:"Tofu",
        position:[640,360],
        //ここまで必須
        attr:{},
        color:"#fff",
        size:30,
        speed:3,
    },
    roomsList:[
        new placeRoom("lobby","color",[640,360],[],{color:"#224"}),
    ],
    roomNumber:0,
    init:function(){
        this.ctx = this.el.getContext('2d');
        document.body.addEventListener("keydown",(e)=>{
            if(e.key == "w"){this.key.w = true;}
            if(e.key == "a"){this.key.a = true;}
            if(e.key == "s"){this.key.s = true;}
            if(e.key == "d"){this.key.d = true;}
        })
        document.body.addEventListener("keyup",(e)=>{
            if(e.key == "w"){this.key.w = false;}
            if(e.key == "a"){this.key.a = false;}
            if(e.key == "s"){this.key.s = false;}
            if(e.key == "d"){this.key.d = false;}
        })
    },
    updatePosition:function(){
        if(this.key.w){this.roomsList[this.roomNumber].position[1] -= this.myCharacter.speed}
        if(this.key.s){this.roomsList[this.roomNumber].position[1] += this.myCharacter.speed}
        if(this.key.d){this.roomsList[this.roomNumber].position[0] += this.myCharacter.speed}
        if(this.key.a){this.roomsList[this.roomNumber].position[0] -= this.myCharacter.speed}

        var x = this.roomsList[this.roomNumber].position[0] 
        var y = this.roomsList[this.roomNumber].position[1]
        if(x < 0){ this.roomsList[this.roomNumber].position[0] = 0;}
        if(x > 1280){ this.roomsList[this.roomNumber].position[0] =1280;}
        if(y < 0){ this.roomsList[this.roomNumber].position[1] = 0; }
        if(y > 720){ this.roomsList[this.roomNumber].position[1] = 720;}
    },
    update:function(){
        const ctx = this.ctx
        this.el.style.height = (innerHeight-40)+"px" //canvasのサイズを変更
        ctx.clearRect(0,0,this.el.innerWidth,this.el.innerHeight)
        this.roomsList[this.roomNumber].drawBackGround()//背景を描画

        this.updatePosition()

        this.myCharacter.position = this.roomsList[this.roomNumber].position
        this.drawCharacter(this.myCharacter)
        for(var i=0;i<=placeList.length-1;i++){
            if(placeList[i] == undefined || placeList[i] == null){
                ;
            }else{
                this.drawCharacter(placeList[i])
            }
        }
    },

    drawCharacter:function(chara){
        const x = chara.position[0];
        const y = chara.position[1];
        const ctx = this.ctx
        switch(chara.type){
            case "Tofu":
                ctx.fillStyle = chara.color
                ctx.fillRect(x - (chara.size/2),y - (chara.size/2),chara.size,chara.size)
            break;
            default:
                console.error("意図しない型です。")
            break;
        }

        // 描画する文字
        const text = user.name
        // フォントの設定
        ctx.font = '13px keifont-lighter';
        // 文字の幅を取得
        const textMetrics = ctx.measureText(text);
        const textWidth = textMetrics.width;

        // 文字の高さを推定（フォントサイズを基準に）
        const textHeight = 20; // フォントサイズを仮定

        ctx.fillText(text, (x) - textWidth / 2, (y) + textHeight / 2 + (chara.size/2 + 5));
    },
}

place.init()
setInterval(()=>{
    if(flg.load.whole && eval(cookie.obj.loggedIn)){
    place.update()
    socket.emit("send-place-chara",place.myCharacter)
    }
    
})
