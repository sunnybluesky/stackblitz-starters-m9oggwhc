console.log('loaded oparate.js');
const fps = 60


const cookie = {
  defaultExpires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), //1週間
  obj: {},

  // Cookieの読み込み
  getCookie: (name) => {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      let cookie = cookies[i].trim();
      if (cookie.indexOf(name + '=') === 0) {
        return cookie.substring(name.length + 1);
      }
    }
    return null;
  },

  // 全てのCookieをオブジェクトとして取得
  getAllCookies: () => {
    const cookies = {};
    document.cookie.split(';').forEach((cookie) => {
      const parts = cookie.split('=');
      cookies[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
    return cookies;
  },
  refreshCookie: function () {
    this.obj = this.getAllCookies();
  },
  // Cookieの書き出し
  setCookie: function (name, value, expires = this.defaultExpires, path, domain, secure) {
    let cookieString = `${name}=${value}`;
    if (expires instanceof Date) {
      cookieString += `; expires=${expires.toUTCString()}`;
    }
    if (path) {
      cookieString += `; path=${path}`;
    }
    if (domain) {
      cookieString += `; domain=${domain}`;
    }
    if (secure) {
      cookieString += `; secure`;
    }
    document.cookie = cookieString;
    cookie.refreshCookie();
  },
  // Cookieの削除
  deleteCookie: function (name) {
    this.setCookie(name, "", new Date(0));
    this.refreshCookie();
  },

};

const key = {
    w:false,
    a:false,
    s:false,
    d:false
}

document.body.addEventListener("keydown",(e)=>{
    if(e.key == "w"){key.w = true;}
    if(e.key == "a"){key.a = true;}
    if(e.key == "s"){key.s = true;}
    if(e.key == "d"){key.d = true;}
})
document.body.addEventListener("keyup",(e)=>{
    if(e.key == "w"){key.w = false;}
    if(e.key == "a"){key.a = false;}
    if(e.key == "s"){key.s = false;}
    if(e.key == "d"){key.d = false;}
})

const fpsState = {
    value:0,
    time:new Date(),
    averageList:[],
    average:0,
    maxNumAverage:30,
    update:function(){
        var newTime = new Date()
        var diff = newTime.getTime() - this.time.getTime()
        this.time = newTime
        this.value = 1000 / diff

        this.averageList.push(this.value);
        if(this.averageList.length > this.maxNumAverage){this.averageList.shift()}
        this.average = this.getAverage()
    },
    getAverage:function(){
        var total = 0
        for(var i=0;i<=this.averageList.length-1;i++){
            total += this.averageList[i]
        }
        return total / this.averageList.length
    },
}