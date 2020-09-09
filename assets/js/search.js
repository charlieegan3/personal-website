var search = {
  loaded: false,
  index: null,
  data: null,
  docs: {},

  run: function() {
    var terms = document.getElementById("search").value.trim().split(" ");

    var results = search.index.query(function(q) {
        if (terms.length == 1) {
          // if there is a single term, find a partial or complete match
          q.term(terms[0] + "*", {
            presence: lunr.Query.presence.OPTIONAL
          })
          q.term(terms[0], {
            presence: lunr.Query.presence.OPTIONAL
          })
        } else {
          // otherwise, only the last term can be partial or complete match
          for (var i = 0; i < terms.length-1; i++) {
            q.term(terms[i], {
              presence: lunr.Query.presence.REQUIRED
            })
          }
          q.term(terms[terms.length-1]+"*", {
            presence: lunr.Query.presence.REQUIRED
          })
        }
    });
    var resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var doc = search.docs[result.ref]
      var item = document.createElement("div");
      var itemMeta = document.createElement("p");
      itemMeta.innerHTML = doc.type;
      if (doc.date != "") {
        var itemMetaDate = document.createElement("span");
        itemMetaDate.innerHTML = doc.date;
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
      itemAnchor.innerHTML = doc.title;
      itemAnchor.href = doc.url;
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
    search.index = lunr(function() {
      // remove stopword filter, so about page shows in results
      this.pipeline.remove(this.pipeline._stack[1])

      this.field('title');
      this.field('body');
      this.field('url');
      this.field('date');
      this.metadataWhitelist = ['position']
      for (var i = 0; i < search.data.length; i++) {
        var doc = search.data[i];
        this.add(doc);
        search.docs[doc.id] = doc;
      }
    });
    search.run();
  }
}

search.init();

document.addEventListener("turbolinks:load", function(event) {
  search.init();
})
