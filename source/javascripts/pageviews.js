if (document.cookie.indexOf("dnt") === -1) {
  logger.send("pageviews");
  document.addEventListener("turbolinks:visit", function(event) {
    logger.send("pageviews");
  });
}
