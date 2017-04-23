function setTimer() {
  return setInterval(function() {
    logger.send("pagetimes");
  }, 10000);
}

if (document.cookie.indexOf("dnt") === -1) {
  var pagetimer = setTimer();

  document.addEventListener("turbolinks:visit", function(event) {
    if (typeof pagetimer !== "undefined") {
      clearInterval(pagetimer);
      pagetimer = setTimer();
    }
  });
}
