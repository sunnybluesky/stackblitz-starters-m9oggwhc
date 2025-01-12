console.log('loaded main.js');
const flg = {
  load:{
    whole:false,
  }
}


function checkLogined() {
  cookie.refreshCookie();
  console.log(cookie.obj);
  if (v == cookie.obj.loggedIn) {
    cookie.setCookie('loggedIn', false, cookie.defaultExpires);
  } else {
    var v = JSON.parse(cookie.obj.loggedIn);
    if (v) {
      cookie.setCookie('loggedIn', false, cookie.defaultExpires);
    } else {
    }
  }
  return cookie.obj.loggedIn
}

socket = io();
const isLoggedIn = checkLogined();