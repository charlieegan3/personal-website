var logger = {};
(function(context) {
  context.send = function(endpoint) {
    ajax().post('https://charlieegan3-view-counter.herokuapp.com/' + endpoint,
      {
        domain: window.location.host,
        path: window.location.pathname
      }
    );
  };
})(logger);
