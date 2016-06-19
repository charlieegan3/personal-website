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
  if (data.tweet.location != "") {
    $('#twitter-meta').text(data.tweet.location + " - " + data.tweet.created_ago);
  } else {
    $('#twitter-meta').text(data.tweet.created_ago);
  }

  $("#strava-link").attr("href", data.activity.link);
  $("#strava-distance").text(data.activity.distance);
  $("#strava-name").text(data.activity.name);
  $("#strava-duration").text(data.activity.moving_time);
  if (data.activity.location != null) {
    $("#strava-meta").text(data.activity.location + " - " + data.activity.created_ago);
  } else {
    $("#strava-meta").text(data.activity.created_ago);
  }

  $("#parkrun-link").attr("href", data.parkrun.link);
  $("#parkrun-link").text(data.parkrun.location);
  $("#parkrun-time").text(data.parkrun.time);
  $("#parkrun-ago").text(data.parkrun.created_ago);

  for (i = 0; i < data.games.length; i++) {
    var game = data.games[i];
    var icon = $('<img/>').attr({ src: game.network_icon, height: "15px" });
    var link = $('<a></a>').attr({ href: game.action }).html(game.game);
    var time = $('<span></span>').html(game.time);

    var line = $('<p></p>').attr({ class: "game" }).append(icon, " ", link, " ", time);

    $("#games-box").append(line);
  }

  $("#github-link").attr("href", data.commit.link);
  $("#github-message").text("> " + data.commit.message);
  $("#github-meta").text(data.commit.created_ago);

  $("#lastfm-link").attr("href", data.track.link);
  $("#lastfm-image").attr("src",
      "https://charlieegan3-image-proxy.herokuapp.com/?url=" + encodeURI(data.track.image));
  if (data.track.image == "" || data.track.image == null) {
    $("#lastfm-image").parent().remove();
    $(".artist").parent().css('padding-left', "15px");
  }
  $("#lastfm-track").html(data.track.name);
  $("#lastfm-artist").html(data.track.artist);
  $("#lastfm-meta").text(data.track.created_ago);

  $("#instagram-link").attr("href", data.image.link);
  $("#instagram-image").attr("src", data.image.images.standard_resolution);
  if (data.image.location != null) {
    $("#instagram-meta").text(data.image.location + " - " + data.image.created_ago);
  } else {
    $("#instagram-meta").text(data.image.created_ago);
  }
}

$(document).ready(function() {
  loadLiveContent();
  displayVisibleEntries('.later');
  $(window).scroll(function(){
    displayVisibleEntries('.later');
    displayVisibleEntries('.live');
  });
});
