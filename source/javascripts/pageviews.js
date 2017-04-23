logger.send("pageviews");
document.addEventListener("turbolinks:visit", function(event) {
  logger.send("pageviews");
});
