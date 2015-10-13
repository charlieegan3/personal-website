function displayVisibleEntries() {
  var windowBottom = $(window).scrollTop() + $(window).height();
  var displayed = false;
  $('.entry').each( function(i){
    if(windowBottom > $(this).offset().top){
      displayed = true;
      $(this).animate({'opacity':'1', 'margin': '7px 0px'}, 400);
    }
  });
  return displayed;
}

$(document).ready(function() {
  while(true) {
    if (displayVisibleEntries() === true) { break; }
  }
  $(window).scroll(function(){
    displayVisibleEntries();
  });
});
