if (document.cookie.indexOf("dnt") === -1) {
  setInterval(function() {
    logger.send("pagetimes");
  }, 10000);
}
