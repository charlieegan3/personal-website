var welcomeMessage = {
  display: function() {
    if (window.location.pathname != "/")
      return;

    var hourOfDay = new Date().getHours();
    var greeting = "Hello";

    if (hourOfDay < 12 && hourOfDay > 2) {
      greeting = "Good morning";
    } else if (hourOfDay < 19 && hourOfDay > 2) {
      greeting = "Good afternoon";
    } else {
      greeting = "Good evening";
    }

    document.getElementById("greeting").innerHTML = greeting;
  }
}

welcomeMessage.display();

document.addEventListener("turbolinks:render", function(event) {
  welcomeMessage.display();
})
