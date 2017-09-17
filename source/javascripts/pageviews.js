(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');
ga('create', 'UA-46126659-1', 'auto');
ga("send", "pageview");

var tracking = {
  log: function(thing, action, label) {
    ga("send", "event", thing, action, label, null);
  },

  logOutboundLinkClick: function(url) {
    console.log(url);
    if (ga.loaded) {
      tracking.log("outbound", "click", url);
    }
    var win = window.open(url, '_blank');
    win.focus();
  },

  attachToLinks: function() {
    var array = [];
    var links = document.getElementsByTagName("a");
    for(var i=0; i<links.length; i++) {
      if (links[i].getAttribute("href").includes("http")) {
        links[i].setAttribute("onclick", "tracking.logOutboundLinkClick('" + links[i].href + "'); return false;");
      }
    }
  }
}

document.addEventListener("turbolinks:load", function(event) {
  ga("set", "location", location.pathname);
  ga("send", "pageview");
  tracking.attachToLinks();
});
