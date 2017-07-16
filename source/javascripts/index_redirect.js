var path = window.location.pathname;

if (path === "/index.html") {
  window.location = "/"
} else if (path.length > 1 && path.slice(-1) === "/") {
  window.location = path.substring(0, path.length - 1);
}
