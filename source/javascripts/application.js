//=require "turbolinks"

if (window.location.hostname == "www.charlieegan3.com")
  window.location.hostname = "charlieegan3.com";

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
