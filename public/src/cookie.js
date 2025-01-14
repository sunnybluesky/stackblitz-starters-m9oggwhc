console.log('loaded cookie.js');

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
