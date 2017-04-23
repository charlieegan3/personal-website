var pagetimes = {};
(function(context) {
  context.send = function() {
    setInterval(function() {
      ajax().post('https://charlieegan3-view-counter.herokuapp.com/pagetimes',
        {
          domain: window.location.host,
          path: window.location.pathname
        }
      );
    }, 5000);
  };
})(pagetimes);

pagetimes.send();

document.addEventListener("turbolinks:load", function(event) {
  pagetimes.send();
});
