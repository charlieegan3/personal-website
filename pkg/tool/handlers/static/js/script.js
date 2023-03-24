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
})