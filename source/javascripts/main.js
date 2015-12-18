function displayVisibleEntries(selector) {
  var windowBottom = $(window).scrollTop() + $(window).height();
  $(selector).each(function(i){
    if(windowBottom > $(this).offset().top){
      $(this).animate({'opacity':'1', 'margin-top': '7px'}, 400);
    }
  });
}

function loadLiveContent() {
  $.get("https://s3.amazonaws.com/charlieegan3/status.json", function(data) {
    setLiveContent(JSON.parse(data));
    $('.spinner').remove();
    displayVisibleEntries('.live');
  });
}

function setLiveContent(data) {
  $('#location-guess').text(data.metadata.most_recent_location);

  $('#twitter-link').attr("href", data.tweet.link);
  $('#twitter-content').text(data.tweet.text);
  $('#twitter-meta').text(data.tweet.location + " - " + data.tweet.created_ago);

  $("#strava-link").attr("href", data.activity.link);
  $("#strava-distance").text(data.activity.distance);
  $("#strava-name").text(data.activity.name);
  $("#strava-duration").text(data.activity.moving_time);
  $("#strava-meta").text(data.activity.location + " - " + data.activity.created_ago);

  $("#github-link").attr("href", data.commit.link);
  $("#github-message").text("> " + data.commit.message);
  $("#github-meta").text(data.commit.created_ago);

  $("#lastfm-link").attr("href", data.track.link);
  $("#lastfm-image").attr("src", data.track.images.large);
  if (data.track.images.large == "") {
    $("#lastfm-image").parent().remove();
    $(".artist").parent().css('padding-left', "15px");
  }
  $("#lastfm-track").html(data.track.name);
  $("#lastfm-artist").text(data.track.artist);
  $("#lastfm-meta").text(data.track.created_ago);

  $("#instagram-link").attr("href", data.image.link);
  $("#instagram-image").attr("src", data.image.images.standard_resolution);
  $("#instagram-meta").text(data.image.location + " - " + data.image.created_ago);
}

$(document).ready(function() {
  loadLiveContent();
  displayVisibleEntries('.later');
  $(window).scroll(function(){
    displayVisibleEntries('.later');
    displayVisibleEntries('.live');
  });
});
