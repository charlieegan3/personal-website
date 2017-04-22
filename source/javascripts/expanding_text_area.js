var expandingTextArea = {
  init: function (){
    if (window.location.pathname != "/")
      return;

    var textarea = document.getElementById("message");
    textarea.oninput = function() {
      textarea.setAttribute("style", "height:" + textarea.scrollHeight + "px;overflow-y:hidden;");
      textarea.style.height = "auto";
      textarea.style.height = textarea.scrollHeight + "px";
    };
  }
};

expandingTextArea.init();

document.addEventListener("turbolinks:load", function(event) {
  expandingTextArea.init();
});
