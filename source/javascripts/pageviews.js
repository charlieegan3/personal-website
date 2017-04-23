var pageviews = {};
(function(context) {
  context.send = function() {
    ajax().post('https://charlieegan3-view-counter.herokuapp.com/pageviews',
      {
        domain: window.location.host,
        path: window.location.pathname
      }
    ).always(function(a,b) {console.log(a)});
  };
})(pageviews);

pageviews.send();

document.addEventListener("turbolinks:load", function(event) {
  pageviews.send();
});
