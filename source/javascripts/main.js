function displayVisibleEntries() {
  var windowBottom = $(window).scrollTop() + $(window).height();
  $('.later').each(function(i){
    if(windowBottom > $(this).offset().top){
      $(this).animate({'opacity':'1', 'margin-top': '7px'}, 400);
    }
  });
}

$(document).ready(function() {
  displayVisibleEntries();
  $(window).scroll(function(){
    displayVisibleEntries();
  });
});
