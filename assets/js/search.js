var search = {
  loaded: false,
  index: null,
  data: null,
  docs: {},
  highlightClass: "ph1 br1",
  highlightStyle: "background-color: rgba(255, 255, 255, 0.2)",

  run: function() {
    // reset the list of results on the page
    var resultsList = document.getElementById("results");
    resultsList.innerHTML = "";

    // only start search after 3 chars
    if (document.getElementById("search").value.length < 3) { return }
    // get the terms and format them for the search
    var terms = document.getElementById("search").value.toLowerCase().trim().split(" ");

    // get the results from the index for the terms
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

    // render each result
    for (var i = 0; i < results.length; i++) {
      var result = results[i];
      var doc = search.docs[result.ref]

      // find the spans to mark in the title and body of matches
      var titleSpans = [];
      var bodySpans = [];
      for (var key in result.matchData.metadata) {
        var obj = result.matchData.metadata[key];
        if ('title' in obj) {
          for (var j in obj.title.position) {
            var span = obj.title.position[j];
            titleSpans.push(doc.title.substring(span[0], span[0]+span[1]));
          }
        }
        if ('body' in obj) {
          var contextSize = 25;
          for (var j in obj.body.position) {
            var span = obj.body.position[j];
            var start = span[0] - contextSize;
            if (start < 0) { start = 0 };
            var end = span[0] + span[1] + contextSize;
            if (end > doc.body.length - 1) { end = doc.body.length - 1 };
            bodySpans.push([
              // span string
              doc.body.substring(span[0], span[0]+span[1]),
              // span context
              doc.body.substring(start, end),
            ]);
          }
        }
      }

      // generate the highlighted title html
      var title = doc.title;
      for (var j in titleSpans) {
        title = title.replace(titleSpans[j], "<span style=\"" + search.highlightStyle + "\" class=\"" + search.highlightClass + "\">"+titleSpans[j]+"</span>");
      }
      // generate the highlighted title html
      var body = "...";
      for (var j in bodySpans) {
        // only highlight up to five matches
        if (j > 4) { break }
        var span = bodySpans[j][0];
        var context = bodySpans[j][1];
        body += context.replace(span, "<span style=\"" + search.highlightStyle + "\" class=\"" + search.highlightClass + "\">"+span+"</span>") + "...";
      }

      // build the result to add to the list
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
      itemTitle.classList = "mv0";
      if (i != results.length - 1) {
        item.classList = "pb3 bb bw1 b--dark-gray";
      }
      var itemAnchor = document.createElement("a");
      itemAnchor.innerHTML = title;
      itemAnchor.href = doc.url;
      itemTitle.appendChild(itemAnchor);
      item.appendChild(itemTitle);

      if (body != "..." && doc.type != "external blog post") {
        var itemBody = document.createElement("p");
        itemBody.classList = "f7"
        itemBody.innerHTML = body;
        item.appendChild(itemBody);
      }

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
      // remove trimmer, stemmer and stopword filter
      this.pipeline.remove(this.pipeline._stack[0])
      this.pipeline.remove(this.pipeline._stack[0])
      this.pipeline.remove(this.pipeline._stack[0])

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
    // TODO url param?
    // search.run();
  }
}

search.init();

document.addEventListener("turbolinks:load", function(event) {
  search.init();
})
