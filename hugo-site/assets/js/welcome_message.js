var welcomeMessage = {
  sleep: function(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  display: async function() {
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

    document.getElementById("greeting").innerHTML = "";
    await welcomeMessage.sleep(50);
    for (var i = 0; i < greeting.length; i++) {
    	await welcomeMessage.sleep(Math.floor((Math.random() * 100) + 10));
    	document.getElementById("greeting").innerHTML += greeting[i];
	}
  }
}

document.addEventListener("turbolinks:load", function(event) {
  welcomeMessage.display();
})
