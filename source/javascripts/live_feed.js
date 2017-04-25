var liveFeed = {};
(function(context) {
  context.extractItems = function(data) {
    var items = [
      { type: "commit", data: data.commit },
      { type: "tweet",  data: data.tweet },
      { type: "track",  data: data.track },
      { type: "image",  data: data.image },
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
    return "<a class=\"lh-copy bb bg-animate b--light-silver " + classes + "\" href=\"" + link + "\">" + text + "</a>"
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
        return "Committed \"" + context.linkedText(context.cleanLongWords(data.message), data.link, "code hover-bg-light-green") + "\"";
      case "tweet":
        if (data.location != null && data.location != "") {
          return "Tweeted from \"" + data.location + ": " + context.linkedText(data.text, data.link, "hover-bg-light-blue") + "\"";
        } else {
          return "Tweeted \"" + context.linkedText(context.cleanLongWords(data.text), data.link, "hover-bg-light-blue") + "\"";
        }
      case "track":
        return "Listened to " + context.linkedText(data.name, data.link, "i hover-bg-light-red") + " by " + context.linkedText(data.artist, data.link, "hover-bg-light-red");
      case "image":
        if (data.location != null && data.location != "") {
          return "Posted a " + context.linkedText("picture from " + data.location, data.link, "hover-bg-light-pink");
        } else {
          return "Posted a " + context.linkedText("picture", data.link);
        }
      case "film":
        return "Watched a film called " + context.linkedText(data.title, data.link, "b serif hover-bg-moon-gray");
      case "activity":
        return "Ran " + context.linkedText(data.distance + "km in " + data.moving_time, data.link, "hover-bg-light-red") + " <span class=\"mid-gray\">(YTD: " + data.ytd +"km)</span>";
    }
  };

  context.display = function(data) {
    var items = context.extractItems(data);
    var feed = document.getElementById("feed");

    var rows = "";
    for (var i = 0; i < items.length; i++) {
      var row = context.renderTemplate(items[i].data.created_ago, context.generateMessage(items[i]));
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
    request.open("GET", "https://storage.googleapis.com/json-charlieegan3/status.json", true);

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
