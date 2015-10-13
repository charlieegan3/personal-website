function displayVisibleEntries() {
  var windowBottom = $(window).scrollTop() + $(window).height();
  $('.entry').each(function(i){
    if(windowBottom > $(this).offset().top){
      $(this).animate({'opacity':'1', 'margin': '7px 0px'}, 400);
    }
  });
}

$(document).ready(function() {
  var count = 0;
  while(true) {
    count++;
    if ($('.entry').length > 0 || count > 500) {
      displayVisibleEntries();
      break;
    }
  }
  $(window).scroll(function(){
    displayVisibleEntries();
  });
});
