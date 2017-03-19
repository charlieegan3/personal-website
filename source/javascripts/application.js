//=require "jquery"
//=require "turbolinks"

if (window.location.hostname == "www.charlieegan3.com")
  window.location.hostname = "charlieegan3.com";

function displayVisibleEntries(selector) {
  var windowBottom = $(window).scrollTop() + $(window).height();
  $(selector).each(function(i){
    if(windowBottom > $(this).offset().top){
      $(this).animate({"opacity":"1", "margin-top": "7px"}, 400);
    }
  });
}

function loadLiveContent() {
  $.get("https://storage.googleapis.com/json-charlieegan3/status.json", function(data) {
    setLiveContent(data);
    $(".spinner").remove();
    displayVisibleEntries(".live");
  });
}

function setLiveContent(data) {
  if (data.metadata.most_recent_location != "" && data.metadata.most_recent_location != null) {
    $("#location-name").text(data.metadata.most_recent_location);
  } else {
    $("#location-section").remove();
  }

  $("#twitter-link").attr("href", data.tweet.link);
  $("#twitter-content").html(data.tweet.text);
  if (data.tweet.location != "") {
    $("#twitter-meta").text("posted at " + data.tweet.location + ", " + data.tweet.created_ago);
  } else {
    $("#twitter-meta").text("posted " + data.tweet.created_ago);
  }

  $("#strava-link").attr("href", data.activity.link);
  $("#strava-distance").text(data.activity.distance);
  $("#strava-ytd").text(data.activity.ytd);
  $("#strava-name").text(data.activity.name);
  $("#strava-duration").text(data.activity.moving_time);
  if (data.activity.location != null) {
    $("#strava-meta").text("completed " + data.activity.location + " - " + data.activity.created_ago);
  } else {
    $("#strava-meta").text("completed " + data.activity.created_ago);
  }

  if (data.parkrun != null) {
    $("#parkrun-link").attr("href", data.parkrun.link);
    $("#parkrun-link").text(data.parkrun.location);
    $("#parkrun-time").text(data.parkrun.time);
    $("#parkrun-ago").text("scanned in " + data.parkrun.created_ago);
  } else {
    $(".entry.parkrun").remove();
  }

  $("#hackernews-comments-link").text(data.hacker_news.title);
  $("#hackernews-comments-link").attr("href", data.hacker_news.comments);
  $("#hackernews-external-link").attr("href", data.hacker_news.url);
  $("#hackernews-ago").html("submitted " + data.hacker_news.created_ago);

  for (i = 0; i < data.games.length; i++) {
    var game = data.games[i];
    var icon = $("<img/>").attr({ src: game.network_icon, height: "15px" });
    var link = $("<a></a>").attr({ href: game.action }).html(game.game);
    var time = $("<span></span>");
    if (game.time) {
      time = $("<span></span>").html("played " + game.time);
    }

    var line = $("<p></p>").attr({ class: "game" }).append(icon, " ", link, " ", time);

    $("#games-box").append(line);
  }

  $("#github-link").attr("href", data.commit.link);
  $("#github-message").text("> " + data.commit.message);
  $("#github-meta").text("committed " + data.commit.created_ago);

  $("#lastfm-link").attr("href", data.track.link);
  if (data.track.image == "" || data.track.image == null) {
    $("#lastfm-image").parent().remove();
    $(".artist").parent().css("padding-left", "15px");
  } else {
    if (data.track.image.startsWith("https")) {
      $("#lastfm-image").attr("src", data.track.image);
    }
  }
  $("#lastfm-track").html(data.track.name);
  $("#lastfm-artist").html(data.track.artist);
  $("#lastfm-meta").text("played " + data.track.created_ago);

  $("#film-link").attr("href", data.film.link);
  $("#film-cover").attr("src", data.film.cover);
  $("#film-title").html(data.film.title);
  $("#film-meta").html("watched " + data.film.created_ago);

  $("#instagram-link").attr("href", data.image.link);
  $("#instagram-image").attr("src", data.image.images.standard_resolution);
  if (data.image.location != null) {
    $("#instagram-meta").text(data.image.location + ", " + data.image.created_ago);
  } else {
    $("#instagram-meta").text("taken " + data.image.created_ago);
  }
}

$(document).on("turbolinks:load ready", function() {
  if (window.location.pathname === "/") {
    loadLiveContent();
    displayVisibleEntries(".later");
    $(window).scroll(function(){
      displayVisibleEntries(".later");
      displayVisibleEntries(".live");
    });
  }
});
