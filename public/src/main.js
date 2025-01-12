console.log('loaded');

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
}

socket = io();
checkLogined();
