function ready(fn) {
    if (document.readyState !== 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}


ready(function() {
    const errorDivId = "error";
    document.body.addEventListener("htmx:responseError", function(e) {
        document.getElementById(errorDivId).innerHTML = e.detail.xhr.response;
        document.getElementById(errorDivId).classList.remove("dn");
    });
    document.body.addEventListener("htmx:afterOnLoad", function(e) {
        if (e.detail.successful) {
            document.getElementById(errorDivId).innerHTML = "";
            document.getElementById(errorDivId).classList.add("dn");
        }
    });
    document.body.addEventListener("htmx:sendError", function(e) {
        window.location = window.location.protocol + "//" + window.location.host + e.detail.pathInfo.requestPath;
    });
    document.body.addEventListener("htmx:beforeRequest", function(e) {
        document.getElementById("loader").classList.remove("dn");
    });
    document.body.addEventListener("htmx:afterRequest", function(e) {
        document.getElementById("loader").classList.add("dn");
    });
    document.body.addEventListener("htmx:historyRestore", function(e) {
        document.getElementById("loader").classList.add("dn");
    });
})