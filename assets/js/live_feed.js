var liveFeed = {};
(function(context) {
  context.extractItems = function(data) {
    var items = [
      { type: "commit", data: data.commit },
      { type: "play",  data: data.play },
      { type: "post",  data: data.post },
      { type: "film",   data: data.film },
      { type: "activity", data: data.activity }
    ];

    return items.sort(function(a,b){
      return new Date(Date.parse(b.data.created_at)) -
        new Date(Date.parse(a.data.created_at));
    });
  };

  context.renderTemplate = function(time, message) {
    var template = '<tr class="bb b--light-silver">\
        <td class="nowrap tr pv2 pr1 br b--mid-gray">TIME</td>\
        <td class="pl1">MESSAGE</td>\
      </tr>';
    return template.replace("TIME", time).replace("MESSAGE", message);
  };

  context.linkedText = function(text, link, classes) {
    return "<a class=\"lh-copy " + classes + "\" href=\"" + link + "\">" + text + "</a>"
  };

  context.cleanLongWords = function(string) {
    return string
      .replace(/\S{15,}/, "...")
      .replace(/http\S+/, "...");
  }

  context.generateMessage = function(item) {
    var data = item.data;
    switch(item.type) {
      case "commit":
        var segments = data.url.split("/");
        var sha = segments[segments.length - 1];
        return "Committed \"" + context.linkedText(context.cleanLongWords(data.message), "https://github.com/" + data.repo.name + "/commit/" + sha, "") + "\"";
      case "play":
        return context.linkedText("Listened", "https://music.charlieegan3.com/recent", "") + " to " + data.track + " by " + data.artist;
      case "post":
        if (data.location != null && data.location != "") {
          return "Posted a " + context.linkedText("picture from \"" + data.location + "\"", data.url, "");
        } else {
          return "Posted a " + context.linkedText("picture", data.url);
        }
      case "film":
        return "Watched a film called " + context.linkedText(data.title, data.link, "");
      case "activity":
        return "Completed a " + context.linkedText((Math.round(data.distance / 100) / 10) + "km " + data.type.toLowerCase() + " - \"" + data.name + "\"", data.url, "");
    }

    return ""
  };

  context.display = function(data) {
    var items = context.extractItems(data);
    var feed = document.getElementById("feed");

    var rows = "";
    for (var i = 0; i < items.length; i++) {
      var row = context.renderTemplate(items[i].data.created_at_string, context.generateMessage(items[i]));
      if (row == "") {
        continue;
      }
      if (i === items.length - 1) {
        row = row.replace("bb b--light-silver", "")
      }
      rows += row;
    }

    feed.innerHTML = rows;

    feed.classList.remove("hidden");
  };

  context.init = function() {
    if (window.location.pathname != "/")
      return;

    var request = new XMLHttpRequest();
    request.open("GET", "https://stanley.charlieegan3.com/json-status/latest.json", true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        var data = JSON.parse(request.responseText);
        context.display(data);
      } else {
        setTimeout(request.send(), 1000);
      }
    };

    request.onerror = function() {
      setTimeout(request.send(), 1000);
    };

    request.send();
  };
})(liveFeed);

liveFeed.init();

document.addEventListener("turbolinks:load", function(event) {
  liveFeed.init();
});
