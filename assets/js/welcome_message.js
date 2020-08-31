var welcomeMessage = {
  locked: false,

  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  display: async function() {
	if (welcomeMessage.locked)
		return;
    welcomeMessage.locked = true;
    if (window.location.pathname != "/")
      return;

    var hourOfDay = new Date().getHours();
    var greeting = "Hello";

    if (hourOfDay < 12 && hourOfDay > 2) {
      greeting = "good morning";
    } else if (hourOfDay < 19 && hourOfDay > 2) {
      greeting = "good afternoon";
    } else {
      greeting = "good evening";
    }

    await welcomeMessage.sleep(100);
    var greetingElem = document.getElementById("greeting")

    greetingElem.innerHTML = "";
    for (var i = 0; i < greeting.length; i++) {
        await welcomeMessage.sleep(Math.floor((Math.random() * 120) + 50));
        greetingElem.innerHTML += greeting[i];
    }
  }
}

welcomeMessage.display();

document.addEventListener("turbolinks:load", function(event) {
  welcomeMessage.display();
})
