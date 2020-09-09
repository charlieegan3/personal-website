var search = {
  loaded: false,
  index: null,
  data: null,

  run: function() {
    var term = document.getElementById("search").value;
    var results = search.index.search(term, {
      bool: "AND"
    });
    var resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var item = document.createElement("div");
      var itemMeta = document.createElement("p");
      itemMeta.innerHTML = result.doc.type;
      if (result.doc.date != "") {
        var itemMetaDate = document.createElement("span");
        itemMetaDate.innerHTML = result.doc.date;
        itemMetaDate.classList = "fr silver";
        itemMeta.appendChild(itemMetaDate);
      }
      itemMeta.classList = "f7 gray mb1";
      item.appendChild(itemMeta);
      var itemTitle = document.createElement("p");
      if (i != results.length - 1) {
        item.classList = "pb3 bb bw1 b--dark-gray";
      }
      var itemAnchor = document.createElement("a");
      itemAnchor.innerHTML = result.doc.title;
      itemAnchor.href = result.doc.uri;
      item.appendChild(itemAnchor);
      resultsList.appendChild(item);
    }
  },

  init: function() {
    if (window.location.pathname.match(/\/search\/?/) == null)
      return
    if (search.loaded == true)
      return
    search.downloadIndex();
    search.loaded = true
  },

  downloadIndex: function() {
    var request = new XMLHttpRequest();
    request.open('GET', '/searchindex.json', true);

    request.onload = function() {
      if (request.status >= 200 && request.status < 400) {
        search.data = JSON.parse(request.responseText);
        search.createIndex();
      } else {
        console.log(request);
      }
    };

    request.onerror = function() {
      console.log(request);
    };
    request.send();
  },

  createIndex: function() {
    search.index = elasticlunr(function() {
      this.addField('title');
      this.addField('url');
      this.addField('body');
      this.addField('type');
      this.addField('date');
      this.setRef('id');
    });
    for (var i = 0; i < search.data.length; i++) {
      search.index.addDoc(search.data[i]);
    }
    search.run();
  }
}

search.init();

document.addEventListener("turbolinks:load", function(event) {
  search.init();
})
