// http://jsfiddle.net/tcloninger/e5qad/
function displayVisibleEntries() {
  var windowBottom = $(window).scrollTop() + $(window).height();
  $('.entry').each( function(i){
    if(windowBottom > $(this).offset().top){
      $(this).animate({'opacity':'1', 'margin': '7px 0px'}, 400);
    }
  });
}

$(document).ready(function() {
  displayVisibleEntries();
  $(window).scroll(function(){
    displayVisibleEntries();
  });
});
