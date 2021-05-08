(function(){(function(){(function(){this.Turbolinks={supported:function(){return null!=window.history.pushState&&null!=window.requestAnimationFrame}(),visit:function(e,r){return t.controller.visit(e,r)},clearCache:function(){return t.controller.clearCache()}}}).call(this)}).call(this);var t=this.Turbolinks;(function(){(function(){var e,r;t.copyObject=function(t){var e,r,n;r={};for(e in t)n=t[e],r[e]=n;return r},t.closest=function(t,r){return e.call(t,r)},e=function(){var t,e;return t=document.documentElement,null!=(e=t.closest)?e:function(t){var e;for(e=this;e;){if(e.nodeType===Node.ELEMENT_NODE&&r.call(e,t))return e;e=e.parentNode}}}(),t.defer=function(t){return setTimeout(t,1)},t.dispatch=function(t,e){var r,n,o,i,s;return i=null!=e?e:{},s=i.target,r=i.cancelable,n=i.data,o=document.createEvent("Events"),o.initEvent(t,!0,r===!0),o.data=null!=n?n:{},(null!=s?s:document).dispatchEvent(o),o},t.match=function(t,e){return r.call(t,e)},r=function(){var t,e,r,n;return t=document.documentElement,null!=(e=null!=(r=null!=(n=t.matchesSelector)?n:t.webkitMatchesSelector)?r:t.msMatchesSelector)?e:t.mozMatchesSelector}(),t.uuid=function(){var t,e,r;for(r="",t=e=1;36>=e;t=++e)r+=9===t||14===t||19===t||24===t?"-":15===t?"4":20===t?(Math.floor(4*Math.random())+8).toString(16):Math.floor(15*Math.random()).toString(16);return r}}).call(this),function(){t.Location=function(){function t(t){var e,r;null==t&&(t=""),r=document.createElement("a"),r.href=t.toString(),this.absoluteURL=r.href,e=r.hash.length,2>e?this.requestURL=this.absoluteURL:(this.requestURL=this.absoluteURL.slice(0,-e),this.anchor=r.hash.slice(1))}var e,r,n,o;return t.wrap=function(t){return t instanceof this?t:new this(t)},t.prototype.getOrigin=function(){return this.absoluteURL.split("/",3).join("/")},t.prototype.getPath=function(){var t,e;return null!=(t=null!=(e=this.absoluteURL.match(/\/\/[^\/]*(\/[^?;]*)/))?e[1]:void 0)?t:"/"},t.prototype.getPathComponents=function(){return this.getPath().split("/").slice(1)},t.prototype.getLastPathComponent=function(){return this.getPathComponents().slice(-1)[0]},t.prototype.getExtension=function(){var t,e;return null!=(t=null!=(e=this.getLastPathComponent().match(/\.[^.]*$/))?e[0]:void 0)?t:""},t.prototype.isHTML=function(){return this.getExtension().match(/^(?:|\.(?:htm|html|xhtml))$/)},t.prototype.isPrefixedBy=function(t){var e;return e=r(t),this.isEqualTo(t)||o(this.absoluteURL,e)},t.prototype.isEqualTo=function(t){return this.absoluteURL===(null!=t?t.absoluteURL:void 0)},t.prototype.toCacheKey=function(){return this.requestURL},t.prototype.toJSON=function(){return this.absoluteURL},t.prototype.toString=function(){return this.absoluteURL},t.prototype.valueOf=function(){return this.absoluteURL},r=function(t){return e(t.getOrigin()+t.getPath())},e=function(t){return n(t,"/")?t:t+"/"},o=function(t,e){return t.slice(0,e.length)===e},n=function(t,e){return t.slice(-e.length)===e},t}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.HttpRequest=function(){function r(r,n,o){this.delegate=r,this.requestCanceled=e(this.requestCanceled,this),this.requestTimedOut=e(this.requestTimedOut,this),this.requestFailed=e(this.requestFailed,this),this.requestLoaded=e(this.requestLoaded,this),this.requestProgressed=e(this.requestProgressed,this),this.url=t.Location.wrap(n).requestURL,this.referrer=t.Location.wrap(o).absoluteURL,this.createXHR()}return r.NETWORK_FAILURE=0,r.TIMEOUT_FAILURE=-1,r.timeout=60,r.prototype.send=function(){var t;return this.xhr&&!this.sent?(this.notifyApplicationBeforeRequestStart(),this.setProgress(0),this.xhr.send(),this.sent=!0,"function"==typeof(t=this.delegate).requestStarted?t.requestStarted():void 0):void 0},r.prototype.cancel=function(){return this.xhr&&this.sent?this.xhr.abort():void 0},r.prototype.requestProgressed=function(t){return t.lengthComputable?this.setProgress(t.loaded/t.total):void 0},r.prototype.requestLoaded=function(){return this.endRequest(function(t){return function(){var e;return 200<=(e=t.xhr.status)&&300>e?t.delegate.requestCompletedWithResponse(t.xhr.responseText,t.xhr.getResponseHeader("Turbolinks-Location")):(t.failed=!0,t.delegate.requestFailedWithStatusCode(t.xhr.status,t.xhr.responseText))}}(this))},r.prototype.requestFailed=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.NETWORK_FAILURE)}}(this))},r.prototype.requestTimedOut=function(){return this.endRequest(function(t){return function(){return t.failed=!0,t.delegate.requestFailedWithStatusCode(t.constructor.TIMEOUT_FAILURE)}}(this))},r.prototype.requestCanceled=function(){return this.endRequest()},r.prototype.notifyApplicationBeforeRequestStart=function(){return t.dispatch("turbolinks:request-start",{data:{url:this.url,xhr:this.xhr}})},r.prototype.notifyApplicationAfterRequestEnd=function(){return t.dispatch("turbolinks:request-end",{data:{url:this.url,xhr:this.xhr}})},r.prototype.createXHR=function(){return this.xhr=new XMLHttpRequest,this.xhr.open("GET",this.url,!0),this.xhr.timeout=1e3*this.constructor.timeout,this.xhr.setRequestHeader("Accept","text/html, application/xhtml+xml"),this.xhr.setRequestHeader("Turbolinks-Referrer",this.referrer),this.xhr.onprogress=this.requestProgressed,this.xhr.onload=this.requestLoaded,this.xhr.onerror=this.requestFailed,this.xhr.ontimeout=this.requestTimedOut,this.xhr.onabort=this.requestCanceled},r.prototype.endRequest=function(t){return this.xhr?(this.notifyApplicationAfterRequestEnd(),null!=t&&t.call(this),this.destroy()):void 0},r.prototype.setProgress=function(t){var e;return this.progress=t,"function"==typeof(e=this.delegate).requestProgressed?e.requestProgressed(this.progress):void 0},r.prototype.destroy=function(){var t;return this.setProgress(1),"function"==typeof(t=this.delegate).requestFinished&&t.requestFinished(),this.delegate=null,this.xhr=null},r}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.ProgressBar=function(){function t(){this.trickle=e(this.trickle,this),this.stylesheetElement=this.createStylesheetElement(),this.progressElement=this.createProgressElement()}var r;return r=300,t.defaultCSS=".turbolinks-progress-bar {\n  position: fixed;\n  display: block;\n  top: 0;\n  left: 0;\n  height: 3px;\n  background: #0076ff;\n  z-index: 9999;\n  transition: width "+r+"ms ease-out, opacity "+r/2+"ms "+r/2+"ms ease-in;\n  transform: translate3d(0, 0, 0);\n}",t.prototype.show=function(){return this.visible?void 0:(this.visible=!0,this.installStylesheetElement(),this.installProgressElement(),this.startTrickling())},t.prototype.hide=function(){return this.visible&&!this.hiding?(this.hiding=!0,this.fadeProgressElement(function(t){return function(){return t.uninstallProgressElement(),t.stopTrickling(),t.visible=!1,t.hiding=!1}}(this))):void 0},t.prototype.setValue=function(t){return this.value=t,this.refresh()},t.prototype.installStylesheetElement=function(){return document.head.insertBefore(this.stylesheetElement,document.head.firstChild)},t.prototype.installProgressElement=function(){return this.progressElement.style.width=0,this.progressElement.style.opacity=1,document.documentElement.insertBefore(this.progressElement,document.body),this.refresh()},t.prototype.fadeProgressElement=function(t){return this.progressElement.style.opacity=0,setTimeout(t,1.5*r)},t.prototype.uninstallProgressElement=function(){return this.progressElement.parentNode?document.documentElement.removeChild(this.progressElement):void 0},t.prototype.startTrickling=function(){return null!=this.trickleInterval?this.trickleInterval:this.trickleInterval=setInterval(this.trickle,r)},t.prototype.stopTrickling=function(){return clearInterval(this.trickleInterval),this.trickleInterval=null},t.prototype.trickle=function(){return this.setValue(this.value+Math.random()/100)},t.prototype.refresh=function(){return requestAnimationFrame(function(t){return function(){return t.progressElement.style.width=10+90*t.value+"%"}}(this))},t.prototype.createStylesheetElement=function(){var t;return t=document.createElement("style"),t.type="text/css",t.textContent=this.constructor.defaultCSS,t},t.prototype.createProgressElement=function(){var t;return t=document.createElement("div"),t.className="turbolinks-progress-bar",t},t}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.BrowserAdapter=function(){function r(r){this.controller=r,this.showProgressBar=e(this.showProgressBar,this),this.progressBar=new t.ProgressBar}var n,o,i,s;return s=t.HttpRequest,n=s.NETWORK_FAILURE,i=s.TIMEOUT_FAILURE,o=500,r.prototype.visitProposedToLocationWithAction=function(t,e){return this.controller.startVisitToLocationWithAction(t,e)},r.prototype.visitStarted=function(t){return t.issueRequest(),t.changeHistory(),t.loadCachedSnapshot()},r.prototype.visitRequestStarted=function(t){return this.progressBar.setValue(0),t.hasCachedSnapshot()||"restore"!==t.action?this.showProgressBarAfterDelay():this.showProgressBar()},r.prototype.visitRequestProgressed=function(t){return this.progressBar.setValue(t.progress)},r.prototype.visitRequestCompleted=function(t){return t.loadResponse()},r.prototype.visitRequestFailedWithStatusCode=function(t,e){switch(e){case n:case i:return this.reload();default:return t.loadResponse()}},r.prototype.visitRequestFinished=function(t){return this.hideProgressBar()},r.prototype.visitCompleted=function(t){return t.followRedirect()},r.prototype.pageInvalidated=function(){return this.reload()},r.prototype.showProgressBarAfterDelay=function(){return this.progressBarTimeout=setTimeout(this.showProgressBar,o)},r.prototype.showProgressBar=function(){return this.progressBar.show()},r.prototype.hideProgressBar=function(){return this.progressBar.hide(),clearTimeout(this.progressBarTimeout)},r.prototype.reload=function(){return window.location.reload()},r}()}.call(this),function(){var e,r=function(t,e){return function(){return t.apply(e,arguments)}};e=!1,addEventListener("load",function(){return t.defer(function(){return e=!0})},!1),t.History=function(){function n(t){this.delegate=t,this.onPopState=r(this.onPopState,this)}return n.prototype.start=function(){return this.started?void 0:(addEventListener("popstate",this.onPopState,!1),this.started=!0)},n.prototype.stop=function(){return this.started?(removeEventListener("popstate",this.onPopState,!1),this.started=!1):void 0},n.prototype.push=function(e,r){return e=t.Location.wrap(e),this.update("push",e,r)},n.prototype.replace=function(e,r){return e=t.Location.wrap(e),this.update("replace",e,r)},n.prototype.onPopState=function(e){var r,n,o,i;return this.shouldHandlePopState()&&(i=null!=(n=e.state)?n.turbolinks:void 0)?(r=t.Location.wrap(window.location),o=i.restorationIdentifier,this.delegate.historyPoppedToLocationWithRestorationIdentifier(r,o)):void 0},n.prototype.shouldHandlePopState=function(){return e===!0},n.prototype.update=function(t,e,r){var n;return n={turbolinks:{restorationIdentifier:r}},history[t+"State"](n,null,e)},n}()}.call(this),function(){t.Snapshot=function(){function e(t){var e,r;r=t.head,e=t.body,this.head=null!=r?r:document.createElement("head"),this.body=null!=e?e:document.createElement("body")}return e.wrap=function(t){return t instanceof this?t:this.fromHTML(t)},e.fromHTML=function(t){var e;return e=document.createElement("html"),e.innerHTML=t,this.fromElement(e)},e.fromElement=function(t){return new this({head:t.querySelector("head"),body:t.querySelector("body")})},e.prototype.clone=function(){return new e({head:this.head.cloneNode(!0),body:this.body.cloneNode(!0)})},e.prototype.getRootLocation=function(){var e,r;return r=null!=(e=this.getSetting("root"))?e:"/",new t.Location(r)},e.prototype.getCacheControlValue=function(){return this.getSetting("cache-control")},e.prototype.hasAnchor=function(t){try{return null!=this.body.querySelector("[id='"+t+"']")}catch(e){}},e.prototype.isPreviewable=function(){return"no-preview"!==this.getCacheControlValue()},e.prototype.isCacheable=function(){return"no-cache"!==this.getCacheControlValue()},e.prototype.getSetting=function(t){var e,r;return r=this.head.querySelectorAll("meta[name='turbolinks-"+t+"']"),e=r[r.length-1],null!=e?e.getAttribute("content"):void 0},e}()}.call(this),function(){var e=[].slice;t.Renderer=function(){function t(){}var r;return t.render=function(){var t,r,n,o;return n=arguments[0],r=arguments[1],t=3<=arguments.length?e.call(arguments,2):[],o=function(t,e,r){r.prototype=t.prototype;var n=new r,o=t.apply(n,e);return Object(o)===o?o:n}(this,t,function(){}),o.delegate=n,o.render(r),o},t.prototype.renderView=function(t){return this.delegate.viewWillRender(this.newBody),t(),this.delegate.viewRendered(this.newBody)},t.prototype.invalidateView=function(){return this.delegate.viewInvalidated()},t.prototype.createScriptElement=function(t){var e;return"false"===t.getAttribute("data-turbolinks-eval")?t:(e=document.createElement("script"),e.textContent=t.textContent,r(e,t),e)},r=function(t,e){var r,n,o,i,s,a,u;for(i=e.attributes,a=[],r=0,n=i.length;n>r;r++)s=i[r],o=s.name,u=s.value,a.push(t.setAttribute(o,u));return a},t}()}.call(this),function(){t.HeadDetails=function(){function t(t){var e,r,i,s,a,u,c;for(this.element=t,this.elements={},c=this.element.childNodes,s=0,u=c.length;u>s;s++)i=c[s],i.nodeType===Node.ELEMENT_NODE&&(a=i.outerHTML,r=null!=(e=this.elements)[a]?e[a]:e[a]={type:o(i),tracked:n(i),elements:[]},r.elements.push(i))}var e,r,n,o;return t.prototype.hasElementWithKey=function(t){return t in this.elements},t.prototype.getTrackedElementSignature=function(){var t,e;return function(){var r,n;r=this.elements,n=[];for(t in r)e=r[t].tracked,e&&n.push(t);return n}.call(this).join("")},t.prototype.getScriptElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("script",t)},t.prototype.getStylesheetElementsNotInDetails=function(t){return this.getElementsMatchingTypeNotInDetails("stylesheet",t)},t.prototype.getElementsMatchingTypeNotInDetails=function(t,e){var r,n,o,i,s,a;o=this.elements,s=[];for(n in o)i=o[n],a=i.type,r=i.elements,a!==t||e.hasElementWithKey(n)||s.push(r[0]);return s},t.prototype.getProvisionalElements=function(){var t,e,r,n,o,i,s;r=[],n=this.elements;for(e in n)o=n[e],s=o.type,i=o.tracked,t=o.elements,null!=s||i?t.length>1&&r.push.apply(r,t.slice(1)):r.push.apply(r,t);return r},o=function(t){return e(t)?"script":r(t)?"stylesheet":void 0},n=function(t){return"reload"===t.getAttribute("data-turbolinks-track")},e=function(t){var e;return e=t.tagName.toLowerCase(),"script"===e},r=function(t){var e;return e=t.tagName.toLowerCase(),"style"===e||"link"===e&&"stylesheet"===t.getAttribute("rel")},t}()}.call(this),function(){var e=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;t.SnapshotRenderer=function(r){function n(e,r){this.currentSnapshot=e,this.newSnapshot=r,this.currentHeadDetails=new t.HeadDetails(this.currentSnapshot.head),this.newHeadDetails=new t.HeadDetails(this.newSnapshot.head),this.newBody=this.newSnapshot.body}return e(n,r),n.prototype.render=function(t){return this.trackedElementsAreIdentical()?(this.mergeHead(),this.renderView(function(e){return function(){return e.replaceBody(),e.focusFirstAutofocusableElement(),t()}}(this))):this.invalidateView()},n.prototype.mergeHead=function(){return this.copyNewHeadStylesheetElements(),this.copyNewHeadScriptElements(),this.removeCurrentHeadProvisionalElements(),this.copyNewHeadProvisionalElements()},n.prototype.replaceBody=function(){return this.activateBodyScriptElements(),this.importBodyPermanentElements(),this.assignNewBody()},n.prototype.trackedElementsAreIdentical=function(){return this.currentHeadDetails.getTrackedElementSignature()===this.newHeadDetails.getTrackedElementSignature()},n.prototype.copyNewHeadStylesheetElements=function(){var t,e,r,n,o;for(n=this.getNewHeadStylesheetElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},n.prototype.copyNewHeadScriptElements=function(){var t,e,r,n,o;for(n=this.getNewHeadScriptElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(this.createScriptElement(t)));return o},n.prototype.removeCurrentHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getCurrentHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.removeChild(t));return o},n.prototype.copyNewHeadProvisionalElements=function(){var t,e,r,n,o;for(n=this.getNewHeadProvisionalElements(),o=[],e=0,r=n.length;r>e;e++)t=n[e],o.push(document.head.appendChild(t));return o},n.prototype.importBodyPermanentElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyPermanentElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],(t=this.findCurrentBodyPermanentElement(o))?i.push(o.parentNode.replaceChild(t,o)):i.push(void 0);return i},n.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getNewBodyScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},n.prototype.assignNewBody=function(){return document.body=this.newBody},n.prototype.focusFirstAutofocusableElement=function(){var t;return null!=(t=this.findFirstAutofocusableElement())?t.focus():void 0},n.prototype.getNewHeadStylesheetElements=function(){return this.newHeadDetails.getStylesheetElementsNotInDetails(this.currentHeadDetails)},n.prototype.getNewHeadScriptElements=function(){return this.newHeadDetails.getScriptElementsNotInDetails(this.currentHeadDetails)},n.prototype.getCurrentHeadProvisionalElements=function(){return this.currentHeadDetails.getProvisionalElements()},n.prototype.getNewHeadProvisionalElements=function(){return this.newHeadDetails.getProvisionalElements()},n.prototype.getNewBodyPermanentElements=function(){return this.newBody.querySelectorAll("[id][data-turbolinks-permanent]")},n.prototype.findCurrentBodyPermanentElement=function(t){return document.body.querySelector("#"+t.id+"[data-turbolinks-permanent]")},n.prototype.getNewBodyScriptElements=function(){return this.newBody.querySelectorAll("script")},n.prototype.findFirstAutofocusableElement=function(){return document.body.querySelector("[autofocus]")},n}(t.Renderer)}.call(this),function(){var e=function(t,e){function n(){this.constructor=t}for(var o in e)r.call(e,o)&&(t[o]=e[o]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t},r={}.hasOwnProperty;t.ErrorRenderer=function(t){function r(t){this.html=t}return e(r,t),r.prototype.render=function(t){return this.renderView(function(e){return function(){return e.replaceDocumentHTML(),e.activateBodyScriptElements(),t()}}(this))},r.prototype.replaceDocumentHTML=function(){return document.documentElement.innerHTML=this.html},r.prototype.activateBodyScriptElements=function(){var t,e,r,n,o,i;for(n=this.getScriptElements(),i=[],e=0,r=n.length;r>e;e++)o=n[e],t=this.createScriptElement(o),i.push(o.parentNode.replaceChild(t,o));return i},r.prototype.getScriptElements=function(){return document.documentElement.querySelectorAll("script")},r}(t.Renderer)}.call(this),function(){t.View=function(){function e(t){this.delegate=t,this.element=document.documentElement}return e.prototype.getRootLocation=function(){return this.getSnapshot().getRootLocation()},e.prototype.getSnapshot=function(){return t.Snapshot.fromElement(this.element)},e.prototype.render=function(t,e){var r,n,o;return o=t.snapshot,r=t.error,n=t.isPreview,this.markAsPreview(n),null!=o?this.renderSnapshot(o,e):this.renderError(r,e)},e.prototype.markAsPreview=function(t){return t?this.element.setAttribute("data-turbolinks-preview",""):this.element.removeAttribute("data-turbolinks-preview")},e.prototype.renderSnapshot=function(e,r){return t.SnapshotRenderer.render(this.delegate,r,this.getSnapshot(),t.Snapshot.wrap(e))},e.prototype.renderError=function(e,r){return t.ErrorRenderer.render(this.delegate,r,e)},e}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.ScrollManager=function(){function t(t){this.delegate=t,this.onScroll=e(this.onScroll,this)}return t.prototype.start=function(){return this.started?void 0:(addEventListener("scroll",this.onScroll,!1),this.onScroll(),this.started=!0)},t.prototype.stop=function(){return this.started?(removeEventListener("scroll",this.onScroll,!1),this.started=!1):void 0},t.prototype.scrollToElement=function(t){return t.scrollIntoView()},t.prototype.scrollToPosition=function(t){var e,r;return e=t.x,r=t.y,window.scrollTo(e,r)},t.prototype.onScroll=function(t){return this.updatePosition({x:window.pageXOffset,y:window.pageYOffset})},t.prototype.updatePosition=function(t){var e;return this.position=t,null!=(e=this.delegate)?e.scrollPositionChanged(this.position):void 0},t}()}.call(this),function(){t.SnapshotCache=function(){function e(t){this.size=t,this.keys=[],this.snapshots={}}var r;return e.prototype.has=function(t){var e;return e=r(t),e in this.snapshots},e.prototype.get=function(t){var e;if(this.has(t))return e=this.read(t),this.touch(t),e},e.prototype.put=function(t,e){return this.write(t,e),this.touch(t),e},e.prototype.read=function(t){var e;return e=r(t),this.snapshots[e]},e.prototype.write=function(t,e){var n;return n=r(t),this.snapshots[n]=e},e.prototype.touch=function(t){var e,n;return n=r(t),e=this.keys.indexOf(n),e>-1&&this.keys.splice(e,1),this.keys.unshift(n),this.trim()},e.prototype.trim=function(){var t,e,r,n,o;for(n=this.keys.splice(this.size),o=[],t=0,r=n.length;r>t;t++)e=n[t],o.push(delete this.snapshots[e]);return o},r=function(e){return t.Location.wrap(e).toCacheKey()},e}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.Visit=function(){function r(r,n,o){this.controller=r,this.action=o,this.performScroll=e(this.performScroll,this),this.identifier=t.uuid(),this.location=t.Location.wrap(n),this.adapter=this.controller.adapter,this.state="initialized",this.timingMetrics={}}var n;return r.prototype.start=function(){return"initialized"===this.state?(this.recordTimingMetric("visitStart"),this.state="started",this.adapter.visitStarted(this)):void 0},r.prototype.cancel=function(){var t;return"started"===this.state?(null!=(t=this.request)&&t.cancel(),this.cancelRender(),this.state="canceled"):void 0},r.prototype.complete=function(){var t;return"started"===this.state?(this.recordTimingMetric("visitEnd"),this.state="completed","function"==typeof(t=this.adapter).visitCompleted&&t.visitCompleted(this),this.controller.visitCompleted(this)):void 0},r.prototype.fail=function(){var t;return"started"===this.state?(this.state="failed","function"==typeof(t=this.adapter).visitFailed?t.visitFailed(this):void 0):void 0},r.prototype.changeHistory=function(){var t,e;return this.historyChanged?void 0:(t=this.location.isEqualTo(this.referrer)?"replace":this.action,e=n(t),this.controller[e](this.location,this.restorationIdentifier),this.historyChanged=!0)},r.prototype.issueRequest=function(){return this.shouldIssueRequest()&&null==this.request?(this.progress=0,this.request=new t.HttpRequest(this,this.location,this.referrer),this.request.send()):void 0},r.prototype.getCachedSnapshot=function(){var t;return!(t=this.controller.getCachedSnapshotForLocation(this.location))||null!=this.location.anchor&&!t.hasAnchor(this.location.anchor)||"restore"!==this.action&&!t.isPreviewable()?void 0:t},r.prototype.hasCachedSnapshot=function(){return null!=this.getCachedSnapshot()},r.prototype.loadCachedSnapshot=function(){var t,e;return(e=this.getCachedSnapshot())?(t=this.shouldIssueRequest(),this.render(function(){var r;return this.cacheSnapshot(),this.controller.render({snapshot:e,isPreview:t},this.performScroll),"function"==typeof(r=this.adapter).visitRendered&&r.visitRendered(this),t?void 0:this.complete()})):void 0},r.prototype.loadResponse=function(){return null!=this.response?this.render(function(){var t,e;return this.cacheSnapshot(),this.request.failed?(this.controller.render({error:this.response},this.performScroll),"function"==typeof(t=this.adapter).visitRendered&&t.visitRendered(this),this.fail()):(this.controller.render({snapshot:this.response},this.performScroll),"function"==typeof(e=this.adapter).visitRendered&&e.visitRendered(this),this.complete())}):void 0},r.prototype.followRedirect=function(){return this.redirectedToLocation&&!this.followedRedirect?(this.location=this.redirectedToLocation,this.controller.replaceHistoryWithLocationAndRestorationIdentifier(this.redirectedToLocation,this.restorationIdentifier),this.followedRedirect=!0):void 0},r.prototype.requestStarted=function(){var t;return this.recordTimingMetric("requestStart"),"function"==typeof(t=this.adapter).visitRequestStarted?t.visitRequestStarted(this):void 0},r.prototype.requestProgressed=function(t){var e;return this.progress=t,"function"==typeof(e=this.adapter).visitRequestProgressed?e.visitRequestProgressed(this):void 0},r.prototype.requestCompletedWithResponse=function(e,r){return this.response=e,null!=r&&(this.redirectedToLocation=t.Location.wrap(r)),this.adapter.visitRequestCompleted(this)},r.prototype.requestFailedWithStatusCode=function(t,e){return this.response=e,this.adapter.visitRequestFailedWithStatusCode(this,t)},r.prototype.requestFinished=function(){var t;return this.recordTimingMetric("requestEnd"),"function"==typeof(t=this.adapter).visitRequestFinished?t.visitRequestFinished(this):void 0},r.prototype.performScroll=function(){return this.scrolled?void 0:("restore"===this.action?this.scrollToRestoredPosition()||this.scrollToTop():this.scrollToAnchor()||this.scrollToTop(),this.scrolled=!0)},r.prototype.scrollToRestoredPosition=function(){var t,e;return t=null!=(e=this.restorationData)?e.scrollPosition:void 0,null!=t?(this.controller.scrollToPosition(t),!0):void 0},r.prototype.scrollToAnchor=function(){return null!=this.location.anchor?(this.controller.scrollToAnchor(this.location.anchor),!0):void 0},r.prototype.scrollToTop=function(){return this.controller.scrollToPosition({x:0,y:0})},r.prototype.recordTimingMetric=function(t){var e;return null!=(e=this.timingMetrics)[t]?e[t]:e[t]=(new Date).getTime()},r.prototype.getTimingMetrics=function(){return t.copyObject(this.timingMetrics)},n=function(t){switch(t){case"replace":return"replaceHistoryWithLocationAndRestorationIdentifier";case"advance":case"restore":return"pushHistoryWithLocationAndRestorationIdentifier"}},r.prototype.shouldIssueRequest=function(){return"restore"===this.action?!this.hasCachedSnapshot():!0},r.prototype.cacheSnapshot=function(){return this.snapshotCached?void 0:(this.controller.cacheSnapshot(),this.snapshotCached=!0)},r.prototype.render=function(t){return this.cancelRender(),this.frame=requestAnimationFrame(function(e){return function(){return e.frame=null,t.call(e)}}(this))},r.prototype.cancelRender=function(){return this.frame?cancelAnimationFrame(this.frame):void 0},r}()}.call(this),function(){var e=function(t,e){return function(){return t.apply(e,arguments)}};t.Controller=function(){function r(){this.clickBubbled=e(this.clickBubbled,this),this.clickCaptured=e(this.clickCaptured,this),this.pageLoaded=e(this.pageLoaded,this),this.history=new t.History(this),this.view=new t.View(this),this.scrollManager=new t.ScrollManager(this),this.restorationData={},this.clearCache()}return r.prototype.start=function(){return t.supported&&!this.started?(addEventListener("click",this.clickCaptured,!0),addEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.start(),this.startHistory(),this.started=!0,this.enabled=!0):void 0},r.prototype.disable=function(){return this.enabled=!1},r.prototype.stop=function(){return this.started?(removeEventListener("click",this.clickCaptured,!0),removeEventListener("DOMContentLoaded",this.pageLoaded,!1),this.scrollManager.stop(),this.stopHistory(),this.started=!1):void 0},r.prototype.clearCache=function(){return this.cache=new t.SnapshotCache(10)},r.prototype.visit=function(e,r){var n,o;return null==r&&(r={}),e=t.Location.wrap(e),this.applicationAllowsVisitingLocation(e)?this.locationIsVisitable(e)?(n=null!=(o=r.action)?o:"advance",this.adapter.visitProposedToLocationWithAction(e,n)):window.location=e:void 0},r.prototype.startVisitToLocationWithAction=function(e,r,n){var o;return t.supported?(o=this.getRestorationDataForIdentifier(n),this.startVisit(e,r,{restorationData:o})):window.location=e},r.prototype.startHistory=function(){return this.location=t.Location.wrap(window.location),this.restorationIdentifier=t.uuid(),this.history.start(),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.stopHistory=function(){return this.history.stop()},r.prototype.pushHistoryWithLocationAndRestorationIdentifier=function(e,r){return this.restorationIdentifier=r,this.location=t.Location.wrap(e),this.history.push(this.location,this.restorationIdentifier)},r.prototype.replaceHistoryWithLocationAndRestorationIdentifier=function(e,r){return this.restorationIdentifier=r,this.location=t.Location.wrap(e),this.history.replace(this.location,this.restorationIdentifier)},r.prototype.historyPoppedToLocationWithRestorationIdentifier=function(e,r){var n;return this.restorationIdentifier=r,this.enabled?(n=this.getRestorationDataForIdentifier(this.restorationIdentifier),this.startVisit(e,"restore",{restorationIdentifier:this.restorationIdentifier,restorationData:n,historyChanged:!0}),this.location=t.Location.wrap(e)):this.adapter.pageInvalidated()},r.prototype.getCachedSnapshotForLocation=function(t){var e;return e=this.cache.get(t),e?e.clone():void 0},r.prototype.shouldCacheSnapshot=function(){return this.view.getSnapshot().isCacheable()},r.prototype.cacheSnapshot=function(){var t;return this.shouldCacheSnapshot()?(this.notifyApplicationBeforeCachingSnapshot(),t=this.view.getSnapshot(),this.cache.put(this.lastRenderedLocation,t.clone())):void 0},r.prototype.scrollToAnchor=function(t){var e;return(e=document.getElementById(t))?this.scrollToElement(e):this.scrollToPosition({x:0,y:0})},r.prototype.scrollToElement=function(t){return this.scrollManager.scrollToElement(t)},r.prototype.scrollToPosition=function(t){return this.scrollManager.scrollToPosition(t)},r.prototype.scrollPositionChanged=function(t){var e;return e=this.getCurrentRestorationData(),e.scrollPosition=t},r.prototype.render=function(t,e){return this.view.render(t,e)},r.prototype.viewInvalidated=function(){return this.adapter.pageInvalidated()},r.prototype.viewWillRender=function(t){return this.notifyApplicationBeforeRender(t)},r.prototype.viewRendered=function(){return this.lastRenderedLocation=this.currentVisit.location,this.notifyApplicationAfterRender()},r.prototype.pageLoaded=function(){return this.lastRenderedLocation=this.location,this.notifyApplicationAfterPageLoad()},r.prototype.clickCaptured=function(){return removeEventListener("click",this.clickBubbled,!1),addEventListener("click",this.clickBubbled,!1)},r.prototype.clickBubbled=function(t){var e,r,n;return this.enabled&&this.clickEventIsSignificant(t)&&(r=this.getVisitableLinkForNode(t.target))&&(n=this.getVisitableLocationForLink(r))&&this.applicationAllowsFollowingLinkToLocation(r,n)?(t.preventDefault(),e=this.getActionForLink(r),this.visit(n,{action:e})):void 0},r.prototype.applicationAllowsFollowingLinkToLocation=function(t,e){var r;return r=this.notifyApplicationAfterClickingLinkToLocation(t,e),!r.defaultPrevented},r.prototype.applicationAllowsVisitingLocation=function(t){var e;return e=this.notifyApplicationBeforeVisitingLocation(t),!e.defaultPrevented},r.prototype.notifyApplicationAfterClickingLinkToLocation=function(e,r){return t.dispatch("turbolinks:click",{target:e,data:{url:r.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationBeforeVisitingLocation=function(e){return t.dispatch("turbolinks:before-visit",{data:{url:e.absoluteURL},cancelable:!0})},r.prototype.notifyApplicationAfterVisitingLocation=function(e){return t.dispatch("turbolinks:visit",{data:{url:e.absoluteURL}})},r.prototype.notifyApplicationBeforeCachingSnapshot=function(){return t.dispatch("turbolinks:before-cache")},r.prototype.notifyApplicationBeforeRender=function(e){return t.dispatch("turbolinks:before-render",{data:{newBody:e}})},r.prototype.notifyApplicationAfterRender=function(){return t.dispatch("turbolinks:render")},r.prototype.notifyApplicationAfterPageLoad=function(e){return null==e&&(e={}),t.dispatch("turbolinks:load",{data:{url:this.location.absoluteURL,timing:e}})},r.prototype.startVisit=function(t,e,r){var n;return null!=(n=this.currentVisit)&&n.cancel(),this.currentVisit=this.createVisit(t,e,r),this.currentVisit.start(),this.notifyApplicationAfterVisitingLocation(t)},r.prototype.createVisit=function(e,r,n){var o,i,s,a,u;return i=null!=n?n:{},a=i.restorationIdentifier,s=i.restorationData,o=i.historyChanged,u=new t.Visit(this,e,r),u.restorationIdentifier=null!=a?a:t.uuid(),u.restorationData=t.copyObject(s),u.historyChanged=o,u.referrer=this.location,u},r.prototype.visitCompleted=function(t){return this.notifyApplicationAfterPageLoad(t.getTimingMetrics())},r.prototype.clickEventIsSignificant=function(t){return!(t.defaultPrevented||t.target.isContentEditable||t.which>1||t.altKey||t.ctrlKey||t.metaKey||t.shiftKey)},r.prototype.getVisitableLinkForNode=function(e){return this.nodeIsVisitable(e)?t.closest(e,"a[href]:not([target])"):void 0},r.prototype.getVisitableLocationForLink=function(e){var r;return r=new t.Location(e.getAttribute("href")),this.locationIsVisitable(r)?r:void 0},r.prototype.getActionForLink=function(t){var e;return null!=(e=t.getAttribute("data-turbolinks-action"))?e:"advance"},r.prototype.nodeIsVisitable=function(e){var r;return(r=t.closest(e,"[data-turbolinks]"))?"false"!==r.getAttribute("data-turbolinks"):!0},r.prototype.locationIsVisitable=function(t){return t.isPrefixedBy(this.view.getRootLocation())&&t.isHTML()},r.prototype.getCurrentRestorationData=function(){return this.getRestorationDataForIdentifier(this.restorationIdentifier)},r.prototype.getRestorationDataForIdentifier=function(t){var e;return null!=(e=this.restorationData)[t]?e[t]:e[t]={}},r}()}.call(this),function(){var e,r,n;t.start=function(){return r()?(null==t.controller&&(t.controller=e()),t.controller.start()):void 0},r=function(){return null==window.Turbolinks&&(window.Turbolinks=t),n()},e=function(){var e;return e=new t.Controller,e.adapter=new t.BrowserAdapter(e),e},n=function(){return window.Turbolinks===t},n()&&t.start()}.call(this)}).call(this),"object"==typeof module&&module.exports?module.exports=t:"function"==typeof define&&define.amd&&define(t)}).call(this);;(function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)})(window,document,'script','https://www.google-analytics.com/analytics.js','ga');ga('create','UA-46126659-1','auto');ga("send","pageview");var tracking={log:function(thing,action,label){ga("send","event",thing,action,label,null);},logOutboundLinkClick:function(url){console.log(url);if(ga.loaded){tracking.log("outbound","click",url);}
var win=window.open(url,'_blank');win.focus();},attachToLinks:function(){var array=[];var links=document.getElementsByTagName("a");for(var i=0;i<links.length;i++){if(links[i].getAttribute("href").includes("http")){links[i].setAttribute("onclick","tracking.logOutboundLinkClick('"+links[i].href+"'); return false;");}}}}
document.addEventListener("turbolinks:load",function(event){ga("set","location",location.pathname);ga("send","pageview");tracking.attachToLinks();});;var welcomeMessage={locked:false,sleep:function(ms){return new Promise(resolve=>setTimeout(resolve,ms));},display:async function(){if(welcomeMessage.locked)
return;welcomeMessage.locked=true;if(window.location.pathname!="/")
return;var hourOfDay=new Date().getHours();var greeting="Hello";if(hourOfDay<12&&hourOfDay>2){greeting="good morning";}else if(hourOfDay<19&&hourOfDay>2){greeting="good afternoon";}else{greeting="good evening";}
await welcomeMessage.sleep(100);var greetingElem=document.getElementById("greeting")
greetingElem.innerHTML="";for(var i=0;i<greeting.length;i++){await welcomeMessage.sleep(Math.floor((Math.random()*120)+50));greetingElem.innerHTML+=greeting[i];}}}
welcomeMessage.display();document.addEventListener("turbolinks:load",function(event){welcomeMessage.display();});var liveFeed={};(function(context){context.extractItems=function(data){var items=[{type:"commit",data:data.commit},{type:"tweet",data:data.tweet},{type:"play",data:data.play},{type:"post",data:data.post},{type:"film",data:data.film},{type:"activity",data:data.activity}];return items.sort(function(a,b){return new Date(Date.parse(b.data.created_at))-
new Date(Date.parse(a.data.created_at));});};context.renderTemplate=function(time,message){var template='<tr class="bb b--light-silver">\
        <td class="nowrap tr pv2 pr1 br b--mid-gray">TIME</td>\
        <td class="pl1">MESSAGE</td>\
      </tr>';return template.replace("TIME",time).replace("MESSAGE",message);};context.linkedText=function(text,link,classes){return "<a class=\"lh-copy "+classes+"\" href=\""+link+"\">"+text+"</a>"};context.cleanLongWords=function(string){return string.replace(/\S{15,}/,"...").replace(/http\S+/,"...");}
context.generateMessage=function(item){var data=item.data;switch(item.type){case "commit":var segments=data.url.split("/");var sha=segments[segments.length-1];return "Committed \""+context.linkedText(context.cleanLongWords(data.message),"https://github.com/"+data.repo.name+"/commit/"+sha,"")+"\"";case "tweet":if(data.location!=null&&data.location!=""){return context.linkedText("Tweeted from "+data.location,data.link,"");}else{return "Posted a "+context.linkedText("tweet",data.link,"");}
case "play":return context.linkedText("Listened","https://music.charlieegan3.com/recent","")+" to "+data.track+" by "+data.artist;case "post":if(data.location!=null&&data.location!=""){return "Posted a "+context.linkedText("picture from \""+data.location+"\"",data.url,"");}else{return "Posted a "+context.linkedText("picture",data.url);}
case "film":return "Watched a film called "+context.linkedText(data.title,data.link,"");case "activity":return "Completed a "+context.linkedText((Math.round(data.distance/100)/10)+"km "+data.type.toLowerCase()+" - \""+data.name+"\"",data.url,"");}
return ""};context.display=function(data){var items=context.extractItems(data);var feed=document.getElementById("feed");var rows="";for(var i=0;i<items.length;i++){var row=context.renderTemplate(items[i].data.created_at_string,context.generateMessage(items[i]));if(row==""){continue;}
if(i===items.length-1){row=row.replace("bb b--light-silver","")}
rows+=row;}
feed.innerHTML=rows;feed.classList.remove("hidden");};context.init=function(){if(window.location.pathname!="/")
return;var request=new XMLHttpRequest();request.open("GET","https://charlieegan3.github.io/json-charlieegan3/build/status.json",true);request.onload=function(){if(request.status>=200&&request.status<400){var data=JSON.parse(request.responseText);context.display(data);}else{setTimeout(request.send(),1000);}};request.onerror=function(){setTimeout(request.send(),1000);};request.send();};})(liveFeed);liveFeed.init();document.addEventListener("turbolinks:load",function(event){liveFeed.init();});;;(function(){var lunr=function(config){var builder=new lunr.Builder
builder.pipeline.add(lunr.trimmer,lunr.stopWordFilter,lunr.stemmer)
builder.searchPipeline.add(lunr.stemmer)
config.call(builder,builder)
return builder.build()}
lunr.version="2.3.9"/*!
* lunr.utils
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.utils={}
lunr.utils.warn=(function(global){return function(message){if(global.console&&console.warn){console.warn(message)}}})(this)
lunr.utils.asString=function(obj){if(obj===void 0||obj===null){return ""}else{return obj.toString()}}
lunr.utils.clone=function(obj){if(obj===null||obj===undefined){return obj}
var clone=Object.create(null),keys=Object.keys(obj)
for(var i=0;i<keys.length;i++){var key=keys[i],val=obj[key]
if(Array.isArray(val)){clone[key]=val.slice()
continue}
if(typeof val==='string'||typeof val==='number'||typeof val==='boolean'){clone[key]=val
continue}
throw new TypeError("clone is not deep and does not support nested objects")}
return clone}
lunr.FieldRef=function(docRef,fieldName,stringValue){this.docRef=docRef
this.fieldName=fieldName
this._stringValue=stringValue}
lunr.FieldRef.joiner="/"
lunr.FieldRef.fromString=function(s){var n=s.indexOf(lunr.FieldRef.joiner)
if(n===-1){throw "malformed field ref string"}
var fieldRef=s.slice(0,n),docRef=s.slice(n+1)
return new lunr.FieldRef(docRef,fieldRef,s)}
lunr.FieldRef.prototype.toString=function(){if(this._stringValue==undefined){this._stringValue=this.fieldName+lunr.FieldRef.joiner+this.docRef}
return this._stringValue}/*!
* lunr.Set
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.Set=function(elements){this.elements=Object.create(null)
if(elements){this.length=elements.length
for(var i=0;i<this.length;i++){this.elements[elements[i]]=true}}else{this.length=0}}
lunr.Set.complete={intersect:function(other){return other},union:function(){return this},contains:function(){return true}}
lunr.Set.empty={intersect:function(){return this},union:function(other){return other},contains:function(){return false}}
lunr.Set.prototype.contains=function(object){return!!this.elements[object]}
lunr.Set.prototype.intersect=function(other){var a,b,elements,intersection=[]
if(other===lunr.Set.complete){return this}
if(other===lunr.Set.empty){return other}
if(this.length<other.length){a=this
b=other}else{a=other
b=this}
elements=Object.keys(a.elements)
for(var i=0;i<elements.length;i++){var element=elements[i]
if(element in b.elements){intersection.push(element)}}
return new lunr.Set(intersection)}
lunr.Set.prototype.union=function(other){if(other===lunr.Set.complete){return lunr.Set.complete}
if(other===lunr.Set.empty){return this}
return new lunr.Set(Object.keys(this.elements).concat(Object.keys(other.elements)))}
lunr.idf=function(posting,documentCount){var documentsWithTerm=0
for(var fieldName in posting){if(fieldName=='_index')continue
documentsWithTerm+=Object.keys(posting[fieldName]).length}
var x=(documentCount-documentsWithTerm+0.5)/(documentsWithTerm+0.5)
return Math.log(1+Math.abs(x))}
lunr.Token=function(str,metadata){this.str=str||""
this.metadata=metadata||{}}
lunr.Token.prototype.toString=function(){return this.str}
lunr.Token.prototype.update=function(fn){this.str=fn(this.str,this.metadata)
return this}
lunr.Token.prototype.clone=function(fn){fn=fn||function(s){return s}
return new lunr.Token(fn(this.str,this.metadata),this.metadata)}/*!
* lunr.tokenizer
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.tokenizer=function(obj,metadata){if(obj==null||obj==undefined){return[]}
if(Array.isArray(obj)){return obj.map(function(t){return new lunr.Token(lunr.utils.asString(t).toLowerCase(),lunr.utils.clone(metadata))})}
var str=obj.toString().toLowerCase(),len=str.length,tokens=[]
for(var sliceEnd=0,sliceStart=0;sliceEnd<=len;sliceEnd++){var char=str.charAt(sliceEnd),sliceLength=sliceEnd-sliceStart
if((char.match(lunr.tokenizer.separator)||sliceEnd==len)){if(sliceLength>0){var tokenMetadata=lunr.utils.clone(metadata)||{}
tokenMetadata["position"]=[sliceStart,sliceLength]
tokenMetadata["index"]=tokens.length
tokens.push(new lunr.Token(str.slice(sliceStart,sliceEnd),tokenMetadata))}
sliceStart=sliceEnd+1}}
return tokens}
lunr.tokenizer.separator=/[\s\-]+//*!
* lunr.Pipeline
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.Pipeline=function(){this._stack=[]}
lunr.Pipeline.registeredFunctions=Object.create(null)
lunr.Pipeline.registerFunction=function(fn,label){if(label in this.registeredFunctions){lunr.utils.warn('Overwriting existing registered function: '+label)}
fn.label=label
lunr.Pipeline.registeredFunctions[fn.label]=fn}
lunr.Pipeline.warnIfFunctionNotRegistered=function(fn){var isRegistered=fn.label&&(fn.label in this.registeredFunctions)
if(!isRegistered){lunr.utils.warn('Function is not registered with pipeline. This may cause problems when serialising the index.\n',fn)}}
lunr.Pipeline.load=function(serialised){var pipeline=new lunr.Pipeline
serialised.forEach(function(fnName){var fn=lunr.Pipeline.registeredFunctions[fnName]
if(fn){pipeline.add(fn)}else{throw new Error('Cannot load unregistered function: '+fnName)}})
return pipeline}
lunr.Pipeline.prototype.add=function(){var fns=Array.prototype.slice.call(arguments)
fns.forEach(function(fn){lunr.Pipeline.warnIfFunctionNotRegistered(fn)
this._stack.push(fn)},this)}
lunr.Pipeline.prototype.after=function(existingFn,newFn){lunr.Pipeline.warnIfFunctionNotRegistered(newFn)
var pos=this._stack.indexOf(existingFn)
if(pos==-1){throw new Error('Cannot find existingFn')}
pos=pos+1
this._stack.splice(pos,0,newFn)}
lunr.Pipeline.prototype.before=function(existingFn,newFn){lunr.Pipeline.warnIfFunctionNotRegistered(newFn)
var pos=this._stack.indexOf(existingFn)
if(pos==-1){throw new Error('Cannot find existingFn')}
this._stack.splice(pos,0,newFn)}
lunr.Pipeline.prototype.remove=function(fn){var pos=this._stack.indexOf(fn)
if(pos==-1){return}
this._stack.splice(pos,1)}
lunr.Pipeline.prototype.run=function(tokens){var stackLength=this._stack.length
for(var i=0;i<stackLength;i++){var fn=this._stack[i]
var memo=[]
for(var j=0;j<tokens.length;j++){var result=fn(tokens[j],j,tokens)
if(result===null||result===void 0||result==='')continue
if(Array.isArray(result)){for(var k=0;k<result.length;k++){memo.push(result[k])}}else{memo.push(result)}}
tokens=memo}
return tokens}
lunr.Pipeline.prototype.runString=function(str,metadata){var token=new lunr.Token(str,metadata)
return this.run([token]).map(function(t){return t.toString()})}
lunr.Pipeline.prototype.reset=function(){this._stack=[]}
lunr.Pipeline.prototype.toJSON=function(){return this._stack.map(function(fn){lunr.Pipeline.warnIfFunctionNotRegistered(fn)
return fn.label})}/*!
* lunr.Vector
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.Vector=function(elements){this._magnitude=0
this.elements=elements||[]}
lunr.Vector.prototype.positionForIndex=function(index){if(this.elements.length==0){return 0}
var start=0,end=this.elements.length/2,sliceLength=end-start,pivotPoint=Math.floor(sliceLength/2),pivotIndex=this.elements[pivotPoint*2]
while(sliceLength>1){if(pivotIndex<index){start=pivotPoint}
if(pivotIndex>index){end=pivotPoint}
if(pivotIndex==index){break}
sliceLength=end-start
pivotPoint=start+Math.floor(sliceLength/2)
pivotIndex=this.elements[pivotPoint*2]}
if(pivotIndex==index){return pivotPoint*2}
if(pivotIndex>index){return pivotPoint*2}
if(pivotIndex<index){return(pivotPoint+1)*2}}
lunr.Vector.prototype.insert=function(insertIdx,val){this.upsert(insertIdx,val,function(){throw "duplicate index"})}
lunr.Vector.prototype.upsert=function(insertIdx,val,fn){this._magnitude=0
var position=this.positionForIndex(insertIdx)
if(this.elements[position]==insertIdx){this.elements[position+1]=fn(this.elements[position+1],val)}else{this.elements.splice(position,0,insertIdx,val)}}
lunr.Vector.prototype.magnitude=function(){if(this._magnitude)return this._magnitude
var sumOfSquares=0,elementsLength=this.elements.length
for(var i=1;i<elementsLength;i+=2){var val=this.elements[i]
sumOfSquares+=val*val}
return this._magnitude=Math.sqrt(sumOfSquares)}
lunr.Vector.prototype.dot=function(otherVector){var dotProduct=0,a=this.elements,b=otherVector.elements,aLen=a.length,bLen=b.length,aVal=0,bVal=0,i=0,j=0
while(i<aLen&&j<bLen){aVal=a[i],bVal=b[j]
if(aVal<bVal){i+=2}else if(aVal>bVal){j+=2}else if(aVal==bVal){dotProduct+=a[i+1]*b[j+1]
i+=2
j+=2}}
return dotProduct}
lunr.Vector.prototype.similarity=function(otherVector){return this.dot(otherVector)/this.magnitude()||0}
lunr.Vector.prototype.toArray=function(){var output=new Array(this.elements.length/2)
for(var i=1,j=0;i<this.elements.length;i+=2,j++){output[j]=this.elements[i]}
return output}
lunr.Vector.prototype.toJSON=function(){return this.elements}/*!
* lunr.stemmer
* Copyright (C) 2020 Oliver Nightingale
* Includes code from - http://tartarus.org/~martin/PorterStemmer/js.txt
*/
lunr.stemmer=(function(){var step2list={"ational":"ate","tional":"tion","enci":"ence","anci":"ance","izer":"ize","bli":"ble","alli":"al","entli":"ent","eli":"e","ousli":"ous","ization":"ize","ation":"ate","ator":"ate","alism":"al","iveness":"ive","fulness":"ful","ousness":"ous","aliti":"al","iviti":"ive","biliti":"ble","logi":"log"},step3list={"icate":"ic","ative":"","alize":"al","iciti":"ic","ical":"ic","ful":"","ness":""},c="[^aeiou]",v="[aeiouy]",C=c+"[^aeiouy]*",V=v+"[aeiou]*",mgr0="^("+C+")?"+V+C,meq1="^("+C+")?"+V+C+"("+V+")?$",mgr1="^("+C+")?"+V+C+V+C,s_v="^("+C+")?"+v;var re_mgr0=new RegExp(mgr0);var re_mgr1=new RegExp(mgr1);var re_meq1=new RegExp(meq1);var re_s_v=new RegExp(s_v);var re_1a=/^(.+?)(ss|i)es$/;var re2_1a=/^(.+?)([^s])s$/;var re_1b=/^(.+?)eed$/;var re2_1b=/^(.+?)(ed|ing)$/;var re_1b_2=/.$/;var re2_1b_2=/(at|bl|iz)$/;var re3_1b_2=new RegExp("([^aeiouylsz])\\1$");var re4_1b_2=new RegExp("^"+C+v+"[^aeiouwxy]$");var re_1c=/^(.+?[^aeiou])y$/;var re_2=/^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;var re_3=/^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;var re_4=/^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;var re2_4=/^(.+?)(s|t)(ion)$/;var re_5=/^(.+?)e$/;var re_5_1=/ll$/;var re3_5=new RegExp("^"+C+v+"[^aeiouwxy]$");var porterStemmer=function porterStemmer(w){var stem,suffix,firstch,re,re2,re3,re4;if(w.length<3){return w;}
firstch=w.substr(0,1);if(firstch=="y"){w=firstch.toUpperCase()+w.substr(1);}
re=re_1a
re2=re2_1a;if(re.test(w)){w=w.replace(re,"$1$2");}
else if(re2.test(w)){w=w.replace(re2,"$1$2");}
re=re_1b;re2=re2_1b;if(re.test(w)){var fp=re.exec(w);re=re_mgr0;if(re.test(fp[1])){re=re_1b_2;w=w.replace(re,"");}}else if(re2.test(w)){var fp=re2.exec(w);stem=fp[1];re2=re_s_v;if(re2.test(stem)){w=stem;re2=re2_1b_2;re3=re3_1b_2;re4=re4_1b_2;if(re2.test(w)){w=w+"e";}
else if(re3.test(w)){re=re_1b_2;w=w.replace(re,"");}
else if(re4.test(w)){w=w+"e";}}}
re=re_1c;if(re.test(w)){var fp=re.exec(w);stem=fp[1];w=stem+"i";}
re=re_2;if(re.test(w)){var fp=re.exec(w);stem=fp[1];suffix=fp[2];re=re_mgr0;if(re.test(stem)){w=stem+step2list[suffix];}}
re=re_3;if(re.test(w)){var fp=re.exec(w);stem=fp[1];suffix=fp[2];re=re_mgr0;if(re.test(stem)){w=stem+step3list[suffix];}}
re=re_4;re2=re2_4;if(re.test(w)){var fp=re.exec(w);stem=fp[1];re=re_mgr1;if(re.test(stem)){w=stem;}}else if(re2.test(w)){var fp=re2.exec(w);stem=fp[1]+fp[2];re2=re_mgr1;if(re2.test(stem)){w=stem;}}
re=re_5;if(re.test(w)){var fp=re.exec(w);stem=fp[1];re=re_mgr1;re2=re_meq1;re3=re3_5;if(re.test(stem)||(re2.test(stem)&&!(re3.test(stem)))){w=stem;}}
re=re_5_1;re2=re_mgr1;if(re.test(w)&&re2.test(w)){re=re_1b_2;w=w.replace(re,"");}
if(firstch=="y"){w=firstch.toLowerCase()+w.substr(1);}
return w;};return function(token){return token.update(porterStemmer);}})();lunr.Pipeline.registerFunction(lunr.stemmer,'stemmer')/*!
* lunr.stopWordFilter
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.generateStopWordFilter=function(stopWords){var words=stopWords.reduce(function(memo,stopWord){memo[stopWord]=stopWord
return memo},{})
return function(token){if(token&&words[token.toString()]!==token.toString())return token}}
lunr.stopWordFilter=lunr.generateStopWordFilter(['a','able','about','across','after','all','almost','also','am','among','an','and','any','are','as','at','be','because','been','but','by','can','cannot','could','dear','did','do','does','either','else','ever','every','for','from','get','got','had','has','have','he','her','hers','him','his','how','however','i','if','in','into','is','it','its','just','least','let','like','likely','may','me','might','most','must','my','neither','no','nor','not','of','off','often','on','only','or','other','our','own','rather','said','say','says','she','should','since','so','some','than','that','the','their','them','then','there','these','they','this','tis','to','too','twas','us','wants','was','we','were','what','when','where','which','while','who','whom','why','will','with','would','yet','you','your'])
lunr.Pipeline.registerFunction(lunr.stopWordFilter,'stopWordFilter')/*!
* lunr.trimmer
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.trimmer=function(token){return token.update(function(s){return s.replace(/^\W+/,'').replace(/\W+$/,'')})}
lunr.Pipeline.registerFunction(lunr.trimmer,'trimmer')/*!
* lunr.TokenSet
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.TokenSet=function(){this.final=false
this.edges={}
this.id=lunr.TokenSet._nextId
lunr.TokenSet._nextId+=1}
lunr.TokenSet._nextId=1
lunr.TokenSet.fromArray=function(arr){var builder=new lunr.TokenSet.Builder
for(var i=0,len=arr.length;i<len;i++){builder.insert(arr[i])}
builder.finish()
return builder.root}
lunr.TokenSet.fromClause=function(clause){if('editDistance'in clause){return lunr.TokenSet.fromFuzzyString(clause.term,clause.editDistance)}else{return lunr.TokenSet.fromString(clause.term)}}
lunr.TokenSet.fromFuzzyString=function(str,editDistance){var root=new lunr.TokenSet
var stack=[{node:root,editsRemaining:editDistance,str:str}]
while(stack.length){var frame=stack.pop()
if(frame.str.length>0){var char=frame.str.charAt(0),noEditNode
if(char in frame.node.edges){noEditNode=frame.node.edges[char]}else{noEditNode=new lunr.TokenSet
frame.node.edges[char]=noEditNode}
if(frame.str.length==1){noEditNode.final=true}
stack.push({node:noEditNode,editsRemaining:frame.editsRemaining,str:frame.str.slice(1)})}
if(frame.editsRemaining==0){continue}
if("*"in frame.node.edges){var insertionNode=frame.node.edges["*"]}else{var insertionNode=new lunr.TokenSet
frame.node.edges["*"]=insertionNode}
if(frame.str.length==0){insertionNode.final=true}
stack.push({node:insertionNode,editsRemaining:frame.editsRemaining-1,str:frame.str})
if(frame.str.length>1){stack.push({node:frame.node,editsRemaining:frame.editsRemaining-1,str:frame.str.slice(1)})}
if(frame.str.length==1){frame.node.final=true}
if(frame.str.length>=1){if("*"in frame.node.edges){var substitutionNode=frame.node.edges["*"]}else{var substitutionNode=new lunr.TokenSet
frame.node.edges["*"]=substitutionNode}
if(frame.str.length==1){substitutionNode.final=true}
stack.push({node:substitutionNode,editsRemaining:frame.editsRemaining-1,str:frame.str.slice(1)})}
if(frame.str.length>1){var charA=frame.str.charAt(0),charB=frame.str.charAt(1),transposeNode
if(charB in frame.node.edges){transposeNode=frame.node.edges[charB]}else{transposeNode=new lunr.TokenSet
frame.node.edges[charB]=transposeNode}
if(frame.str.length==1){transposeNode.final=true}
stack.push({node:transposeNode,editsRemaining:frame.editsRemaining-1,str:charA+frame.str.slice(2)})}}
return root}
lunr.TokenSet.fromString=function(str){var node=new lunr.TokenSet,root=node
for(var i=0,len=str.length;i<len;i++){var char=str[i],final=(i==len-1)
if(char=="*"){node.edges[char]=node
node.final=final}else{var next=new lunr.TokenSet
next.final=final
node.edges[char]=next
node=next}}
return root}
lunr.TokenSet.prototype.toArray=function(){var words=[]
var stack=[{prefix:"",node:this}]
while(stack.length){var frame=stack.pop(),edges=Object.keys(frame.node.edges),len=edges.length
if(frame.node.final){frame.prefix.charAt(0)
words.push(frame.prefix)}
for(var i=0;i<len;i++){var edge=edges[i]
stack.push({prefix:frame.prefix.concat(edge),node:frame.node.edges[edge]})}}
return words}
lunr.TokenSet.prototype.toString=function(){if(this._str){return this._str}
var str=this.final?'1':'0',labels=Object.keys(this.edges).sort(),len=labels.length
for(var i=0;i<len;i++){var label=labels[i],node=this.edges[label]
str=str+label+node.id}
return str}
lunr.TokenSet.prototype.intersect=function(b){var output=new lunr.TokenSet,frame=undefined
var stack=[{qNode:b,output:output,node:this}]
while(stack.length){frame=stack.pop()
var qEdges=Object.keys(frame.qNode.edges),qLen=qEdges.length,nEdges=Object.keys(frame.node.edges),nLen=nEdges.length
for(var q=0;q<qLen;q++){var qEdge=qEdges[q]
for(var n=0;n<nLen;n++){var nEdge=nEdges[n]
if(nEdge==qEdge||qEdge=='*'){var node=frame.node.edges[nEdge],qNode=frame.qNode.edges[qEdge],final=node.final&&qNode.final,next=undefined
if(nEdge in frame.output.edges){next=frame.output.edges[nEdge]
next.final=next.final||final}else{next=new lunr.TokenSet
next.final=final
frame.output.edges[nEdge]=next}
stack.push({qNode:qNode,output:next,node:node})}}}}
return output}
lunr.TokenSet.Builder=function(){this.previousWord=""
this.root=new lunr.TokenSet
this.uncheckedNodes=[]
this.minimizedNodes={}}
lunr.TokenSet.Builder.prototype.insert=function(word){var node,commonPrefix=0
if(word<this.previousWord){throw new Error("Out of order word insertion")}
for(var i=0;i<word.length&&i<this.previousWord.length;i++){if(word[i]!=this.previousWord[i])break
commonPrefix++}
this.minimize(commonPrefix)
if(this.uncheckedNodes.length==0){node=this.root}else{node=this.uncheckedNodes[this.uncheckedNodes.length-1].child}
for(var i=commonPrefix;i<word.length;i++){var nextNode=new lunr.TokenSet,char=word[i]
node.edges[char]=nextNode
this.uncheckedNodes.push({parent:node,char:char,child:nextNode})
node=nextNode}
node.final=true
this.previousWord=word}
lunr.TokenSet.Builder.prototype.finish=function(){this.minimize(0)}
lunr.TokenSet.Builder.prototype.minimize=function(downTo){for(var i=this.uncheckedNodes.length-1;i>=downTo;i--){var node=this.uncheckedNodes[i],childKey=node.child.toString()
if(childKey in this.minimizedNodes){node.parent.edges[node.char]=this.minimizedNodes[childKey]}else{node.child._str=childKey
this.minimizedNodes[childKey]=node.child}
this.uncheckedNodes.pop()}}/*!
* lunr.Index
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.Index=function(attrs){this.invertedIndex=attrs.invertedIndex
this.fieldVectors=attrs.fieldVectors
this.tokenSet=attrs.tokenSet
this.fields=attrs.fields
this.pipeline=attrs.pipeline}
lunr.Index.prototype.search=function(queryString){return this.query(function(query){var parser=new lunr.QueryParser(queryString,query)
parser.parse()})}
lunr.Index.prototype.query=function(fn){var query=new lunr.Query(this.fields),matchingFields=Object.create(null),queryVectors=Object.create(null),termFieldCache=Object.create(null),requiredMatches=Object.create(null),prohibitedMatches=Object.create(null)
for(var i=0;i<this.fields.length;i++){queryVectors[this.fields[i]]=new lunr.Vector}
fn.call(query,query)
for(var i=0;i<query.clauses.length;i++){var clause=query.clauses[i],terms=null,clauseMatches=lunr.Set.empty
if(clause.usePipeline){terms=this.pipeline.runString(clause.term,{fields:clause.fields})}else{terms=[clause.term]}
for(var m=0;m<terms.length;m++){var term=terms[m]
clause.term=term
var termTokenSet=lunr.TokenSet.fromClause(clause),expandedTerms=this.tokenSet.intersect(termTokenSet).toArray()
if(expandedTerms.length===0&&clause.presence===lunr.Query.presence.REQUIRED){for(var k=0;k<clause.fields.length;k++){var field=clause.fields[k]
requiredMatches[field]=lunr.Set.empty}
break}
for(var j=0;j<expandedTerms.length;j++){var expandedTerm=expandedTerms[j],posting=this.invertedIndex[expandedTerm],termIndex=posting._index
for(var k=0;k<clause.fields.length;k++){var field=clause.fields[k],fieldPosting=posting[field],matchingDocumentRefs=Object.keys(fieldPosting),termField=expandedTerm+"/"+field,matchingDocumentsSet=new lunr.Set(matchingDocumentRefs)
if(clause.presence==lunr.Query.presence.REQUIRED){clauseMatches=clauseMatches.union(matchingDocumentsSet)
if(requiredMatches[field]===undefined){requiredMatches[field]=lunr.Set.complete}}
if(clause.presence==lunr.Query.presence.PROHIBITED){if(prohibitedMatches[field]===undefined){prohibitedMatches[field]=lunr.Set.empty}
prohibitedMatches[field]=prohibitedMatches[field].union(matchingDocumentsSet)
continue}
queryVectors[field].upsert(termIndex,clause.boost,function(a,b){return a+b})
if(termFieldCache[termField]){continue}
for(var l=0;l<matchingDocumentRefs.length;l++){var matchingDocumentRef=matchingDocumentRefs[l],matchingFieldRef=new lunr.FieldRef(matchingDocumentRef,field),metadata=fieldPosting[matchingDocumentRef],fieldMatch
if((fieldMatch=matchingFields[matchingFieldRef])===undefined){matchingFields[matchingFieldRef]=new lunr.MatchData(expandedTerm,field,metadata)}else{fieldMatch.add(expandedTerm,field,metadata)}}
termFieldCache[termField]=true}}}
if(clause.presence===lunr.Query.presence.REQUIRED){for(var k=0;k<clause.fields.length;k++){var field=clause.fields[k]
requiredMatches[field]=requiredMatches[field].intersect(clauseMatches)}}}
var allRequiredMatches=lunr.Set.complete,allProhibitedMatches=lunr.Set.empty
for(var i=0;i<this.fields.length;i++){var field=this.fields[i]
if(requiredMatches[field]){allRequiredMatches=allRequiredMatches.intersect(requiredMatches[field])}
if(prohibitedMatches[field]){allProhibitedMatches=allProhibitedMatches.union(prohibitedMatches[field])}}
var matchingFieldRefs=Object.keys(matchingFields),results=[],matches=Object.create(null)
if(query.isNegated()){matchingFieldRefs=Object.keys(this.fieldVectors)
for(var i=0;i<matchingFieldRefs.length;i++){var matchingFieldRef=matchingFieldRefs[i]
var fieldRef=lunr.FieldRef.fromString(matchingFieldRef)
matchingFields[matchingFieldRef]=new lunr.MatchData}}
for(var i=0;i<matchingFieldRefs.length;i++){var fieldRef=lunr.FieldRef.fromString(matchingFieldRefs[i]),docRef=fieldRef.docRef
if(!allRequiredMatches.contains(docRef)){continue}
if(allProhibitedMatches.contains(docRef)){continue}
var fieldVector=this.fieldVectors[fieldRef],score=queryVectors[fieldRef.fieldName].similarity(fieldVector),docMatch
if((docMatch=matches[docRef])!==undefined){docMatch.score+=score
docMatch.matchData.combine(matchingFields[fieldRef])}else{var match={ref:docRef,score:score,matchData:matchingFields[fieldRef]}
matches[docRef]=match
results.push(match)}}
return results.sort(function(a,b){return b.score-a.score})}
lunr.Index.prototype.toJSON=function(){var invertedIndex=Object.keys(this.invertedIndex).sort().map(function(term){return[term,this.invertedIndex[term]]},this)
var fieldVectors=Object.keys(this.fieldVectors).map(function(ref){return[ref,this.fieldVectors[ref].toJSON()]},this)
return{version:lunr.version,fields:this.fields,fieldVectors:fieldVectors,invertedIndex:invertedIndex,pipeline:this.pipeline.toJSON()}}
lunr.Index.load=function(serializedIndex){var attrs={},fieldVectors={},serializedVectors=serializedIndex.fieldVectors,invertedIndex=Object.create(null),serializedInvertedIndex=serializedIndex.invertedIndex,tokenSetBuilder=new lunr.TokenSet.Builder,pipeline=lunr.Pipeline.load(serializedIndex.pipeline)
if(serializedIndex.version!=lunr.version){lunr.utils.warn("Version mismatch when loading serialised index. Current version of lunr '"+lunr.version+"' does not match serialized index '"+serializedIndex.version+"'")}
for(var i=0;i<serializedVectors.length;i++){var tuple=serializedVectors[i],ref=tuple[0],elements=tuple[1]
fieldVectors[ref]=new lunr.Vector(elements)}
for(var i=0;i<serializedInvertedIndex.length;i++){var tuple=serializedInvertedIndex[i],term=tuple[0],posting=tuple[1]
tokenSetBuilder.insert(term)
invertedIndex[term]=posting}
tokenSetBuilder.finish()
attrs.fields=serializedIndex.fields
attrs.fieldVectors=fieldVectors
attrs.invertedIndex=invertedIndex
attrs.tokenSet=tokenSetBuilder.root
attrs.pipeline=pipeline
return new lunr.Index(attrs)}/*!
* lunr.Builder
* Copyright (C) 2020 Oliver Nightingale
*/
lunr.Builder=function(){this._ref="id"
this._fields=Object.create(null)
this._documents=Object.create(null)
this.invertedIndex=Object.create(null)
this.fieldTermFrequencies={}
this.fieldLengths={}
this.tokenizer=lunr.tokenizer
this.pipeline=new lunr.Pipeline
this.searchPipeline=new lunr.Pipeline
this.documentCount=0
this._b=0.75
this._k1=1.2
this.termIndex=0
this.metadataWhitelist=[]}
lunr.Builder.prototype.ref=function(ref){this._ref=ref}
lunr.Builder.prototype.field=function(fieldName,attributes){if(/\//.test(fieldName)){throw new RangeError("Field '"+fieldName+"' contains illegal character '/'")}
this._fields[fieldName]=attributes||{}}
lunr.Builder.prototype.b=function(number){if(number<0){this._b=0}else if(number>1){this._b=1}else{this._b=number}}
lunr.Builder.prototype.k1=function(number){this._k1=number}
lunr.Builder.prototype.add=function(doc,attributes){var docRef=doc[this._ref],fields=Object.keys(this._fields)
this._documents[docRef]=attributes||{}
this.documentCount+=1
for(var i=0;i<fields.length;i++){var fieldName=fields[i],extractor=this._fields[fieldName].extractor,field=extractor?extractor(doc):doc[fieldName],tokens=this.tokenizer(field,{fields:[fieldName]}),terms=this.pipeline.run(tokens),fieldRef=new lunr.FieldRef(docRef,fieldName),fieldTerms=Object.create(null)
this.fieldTermFrequencies[fieldRef]=fieldTerms
this.fieldLengths[fieldRef]=0
this.fieldLengths[fieldRef]+=terms.length
for(var j=0;j<terms.length;j++){var term=terms[j]
if(fieldTerms[term]==undefined){fieldTerms[term]=0}
fieldTerms[term]+=1
if(this.invertedIndex[term]==undefined){var posting=Object.create(null)
posting["_index"]=this.termIndex
this.termIndex+=1
for(var k=0;k<fields.length;k++){posting[fields[k]]=Object.create(null)}
this.invertedIndex[term]=posting}
if(this.invertedIndex[term][fieldName][docRef]==undefined){this.invertedIndex[term][fieldName][docRef]=Object.create(null)}
for(var l=0;l<this.metadataWhitelist.length;l++){var metadataKey=this.metadataWhitelist[l],metadata=term.metadata[metadataKey]
if(this.invertedIndex[term][fieldName][docRef][metadataKey]==undefined){this.invertedIndex[term][fieldName][docRef][metadataKey]=[]}
this.invertedIndex[term][fieldName][docRef][metadataKey].push(metadata)}}}}
lunr.Builder.prototype.calculateAverageFieldLengths=function(){var fieldRefs=Object.keys(this.fieldLengths),numberOfFields=fieldRefs.length,accumulator={},documentsWithField={}
for(var i=0;i<numberOfFields;i++){var fieldRef=lunr.FieldRef.fromString(fieldRefs[i]),field=fieldRef.fieldName
documentsWithField[field]||(documentsWithField[field]=0)
documentsWithField[field]+=1
accumulator[field]||(accumulator[field]=0)
accumulator[field]+=this.fieldLengths[fieldRef]}
var fields=Object.keys(this._fields)
for(var i=0;i<fields.length;i++){var fieldName=fields[i]
accumulator[fieldName]=accumulator[fieldName]/documentsWithField[fieldName]}
this.averageFieldLength=accumulator}
lunr.Builder.prototype.createFieldVectors=function(){var fieldVectors={},fieldRefs=Object.keys(this.fieldTermFrequencies),fieldRefsLength=fieldRefs.length,termIdfCache=Object.create(null)
for(var i=0;i<fieldRefsLength;i++){var fieldRef=lunr.FieldRef.fromString(fieldRefs[i]),fieldName=fieldRef.fieldName,fieldLength=this.fieldLengths[fieldRef],fieldVector=new lunr.Vector,termFrequencies=this.fieldTermFrequencies[fieldRef],terms=Object.keys(termFrequencies),termsLength=terms.length
var fieldBoost=this._fields[fieldName].boost||1,docBoost=this._documents[fieldRef.docRef].boost||1
for(var j=0;j<termsLength;j++){var term=terms[j],tf=termFrequencies[term],termIndex=this.invertedIndex[term]._index,idf,score,scoreWithPrecision
if(termIdfCache[term]===undefined){idf=lunr.idf(this.invertedIndex[term],this.documentCount)
termIdfCache[term]=idf}else{idf=termIdfCache[term]}
score=idf*((this._k1+1)*tf)/(this._k1*(1-this._b+this._b*(fieldLength/this.averageFieldLength[fieldName]))+tf)
score*=fieldBoost
score*=docBoost
scoreWithPrecision=Math.round(score*1000)/1000
fieldVector.insert(termIndex,scoreWithPrecision)}
fieldVectors[fieldRef]=fieldVector}
this.fieldVectors=fieldVectors}
lunr.Builder.prototype.createTokenSet=function(){this.tokenSet=lunr.TokenSet.fromArray(Object.keys(this.invertedIndex).sort())}
lunr.Builder.prototype.build=function(){this.calculateAverageFieldLengths()
this.createFieldVectors()
this.createTokenSet()
return new lunr.Index({invertedIndex:this.invertedIndex,fieldVectors:this.fieldVectors,tokenSet:this.tokenSet,fields:Object.keys(this._fields),pipeline:this.searchPipeline})}
lunr.Builder.prototype.use=function(fn){var args=Array.prototype.slice.call(arguments,1)
args.unshift(this)
fn.apply(this,args)}
lunr.MatchData=function(term,field,metadata){var clonedMetadata=Object.create(null),metadataKeys=Object.keys(metadata||{})
for(var i=0;i<metadataKeys.length;i++){var key=metadataKeys[i]
clonedMetadata[key]=metadata[key].slice()}
this.metadata=Object.create(null)
if(term!==undefined){this.metadata[term]=Object.create(null)
this.metadata[term][field]=clonedMetadata}}
lunr.MatchData.prototype.combine=function(otherMatchData){var terms=Object.keys(otherMatchData.metadata)
for(var i=0;i<terms.length;i++){var term=terms[i],fields=Object.keys(otherMatchData.metadata[term])
if(this.metadata[term]==undefined){this.metadata[term]=Object.create(null)}
for(var j=0;j<fields.length;j++){var field=fields[j],keys=Object.keys(otherMatchData.metadata[term][field])
if(this.metadata[term][field]==undefined){this.metadata[term][field]=Object.create(null)}
for(var k=0;k<keys.length;k++){var key=keys[k]
if(this.metadata[term][field][key]==undefined){this.metadata[term][field][key]=otherMatchData.metadata[term][field][key]}else{this.metadata[term][field][key]=this.metadata[term][field][key].concat(otherMatchData.metadata[term][field][key])}}}}}
lunr.MatchData.prototype.add=function(term,field,metadata){if(!(term in this.metadata)){this.metadata[term]=Object.create(null)
this.metadata[term][field]=metadata
return}
if(!(field in this.metadata[term])){this.metadata[term][field]=metadata
return}
var metadataKeys=Object.keys(metadata)
for(var i=0;i<metadataKeys.length;i++){var key=metadataKeys[i]
if(key in this.metadata[term][field]){this.metadata[term][field][key]=this.metadata[term][field][key].concat(metadata[key])}else{this.metadata[term][field][key]=metadata[key]}}}
lunr.Query=function(allFields){this.clauses=[]
this.allFields=allFields}
lunr.Query.wildcard=new String("*")
lunr.Query.wildcard.NONE=0
lunr.Query.wildcard.LEADING=1
lunr.Query.wildcard.TRAILING=2
lunr.Query.presence={OPTIONAL:1,REQUIRED:2,PROHIBITED:3}
lunr.Query.prototype.clause=function(clause){if(!('fields'in clause)){clause.fields=this.allFields}
if(!('boost'in clause)){clause.boost=1}
if(!('usePipeline'in clause)){clause.usePipeline=true}
if(!('wildcard'in clause)){clause.wildcard=lunr.Query.wildcard.NONE}
if((clause.wildcard&lunr.Query.wildcard.LEADING)&&(clause.term.charAt(0)!=lunr.Query.wildcard)){clause.term="*"+clause.term}
if((clause.wildcard&lunr.Query.wildcard.TRAILING)&&(clause.term.slice(-1)!=lunr.Query.wildcard)){clause.term=""+clause.term+"*"}
if(!('presence'in clause)){clause.presence=lunr.Query.presence.OPTIONAL}
this.clauses.push(clause)
return this}
lunr.Query.prototype.isNegated=function(){for(var i=0;i<this.clauses.length;i++){if(this.clauses[i].presence!=lunr.Query.presence.PROHIBITED){return false}}
return true}
lunr.Query.prototype.term=function(term,options){if(Array.isArray(term)){term.forEach(function(t){this.term(t,lunr.utils.clone(options))},this)
return this}
var clause=options||{}
clause.term=term.toString()
this.clause(clause)
return this}
lunr.QueryParseError=function(message,start,end){this.name="QueryParseError"
this.message=message
this.start=start
this.end=end}
lunr.QueryParseError.prototype=new Error
lunr.QueryLexer=function(str){this.lexemes=[]
this.str=str
this.length=str.length
this.pos=0
this.start=0
this.escapeCharPositions=[]}
lunr.QueryLexer.prototype.run=function(){var state=lunr.QueryLexer.lexText
while(state){state=state(this)}}
lunr.QueryLexer.prototype.sliceString=function(){var subSlices=[],sliceStart=this.start,sliceEnd=this.pos
for(var i=0;i<this.escapeCharPositions.length;i++){sliceEnd=this.escapeCharPositions[i]
subSlices.push(this.str.slice(sliceStart,sliceEnd))
sliceStart=sliceEnd+1}
subSlices.push(this.str.slice(sliceStart,this.pos))
this.escapeCharPositions.length=0
return subSlices.join('')}
lunr.QueryLexer.prototype.emit=function(type){this.lexemes.push({type:type,str:this.sliceString(),start:this.start,end:this.pos})
this.start=this.pos}
lunr.QueryLexer.prototype.escapeCharacter=function(){this.escapeCharPositions.push(this.pos-1)
this.pos+=1}
lunr.QueryLexer.prototype.next=function(){if(this.pos>=this.length){return lunr.QueryLexer.EOS}
var char=this.str.charAt(this.pos)
this.pos+=1
return char}
lunr.QueryLexer.prototype.width=function(){return this.pos-this.start}
lunr.QueryLexer.prototype.ignore=function(){if(this.start==this.pos){this.pos+=1}
this.start=this.pos}
lunr.QueryLexer.prototype.backup=function(){this.pos-=1}
lunr.QueryLexer.prototype.acceptDigitRun=function(){var char,charCode
do{char=this.next()
charCode=char.charCodeAt(0)}while(charCode>47&&charCode<58)
if(char!=lunr.QueryLexer.EOS){this.backup()}}
lunr.QueryLexer.prototype.more=function(){return this.pos<this.length}
lunr.QueryLexer.EOS='EOS'
lunr.QueryLexer.FIELD='FIELD'
lunr.QueryLexer.TERM='TERM'
lunr.QueryLexer.EDIT_DISTANCE='EDIT_DISTANCE'
lunr.QueryLexer.BOOST='BOOST'
lunr.QueryLexer.PRESENCE='PRESENCE'
lunr.QueryLexer.lexField=function(lexer){lexer.backup()
lexer.emit(lunr.QueryLexer.FIELD)
lexer.ignore()
return lunr.QueryLexer.lexText}
lunr.QueryLexer.lexTerm=function(lexer){if(lexer.width()>1){lexer.backup()
lexer.emit(lunr.QueryLexer.TERM)}
lexer.ignore()
if(lexer.more()){return lunr.QueryLexer.lexText}}
lunr.QueryLexer.lexEditDistance=function(lexer){lexer.ignore()
lexer.acceptDigitRun()
lexer.emit(lunr.QueryLexer.EDIT_DISTANCE)
return lunr.QueryLexer.lexText}
lunr.QueryLexer.lexBoost=function(lexer){lexer.ignore()
lexer.acceptDigitRun()
lexer.emit(lunr.QueryLexer.BOOST)
return lunr.QueryLexer.lexText}
lunr.QueryLexer.lexEOS=function(lexer){if(lexer.width()>0){lexer.emit(lunr.QueryLexer.TERM)}}
lunr.QueryLexer.termSeparator=lunr.tokenizer.separator
lunr.QueryLexer.lexText=function(lexer){while(true){var char=lexer.next()
if(char==lunr.QueryLexer.EOS){return lunr.QueryLexer.lexEOS}
if(char.charCodeAt(0)==92){lexer.escapeCharacter()
continue}
if(char==":"){return lunr.QueryLexer.lexField}
if(char=="~"){lexer.backup()
if(lexer.width()>0){lexer.emit(lunr.QueryLexer.TERM)}
return lunr.QueryLexer.lexEditDistance}
if(char=="^"){lexer.backup()
if(lexer.width()>0){lexer.emit(lunr.QueryLexer.TERM)}
return lunr.QueryLexer.lexBoost}
if(char=="+"&&lexer.width()===1){lexer.emit(lunr.QueryLexer.PRESENCE)
return lunr.QueryLexer.lexText}
if(char=="-"&&lexer.width()===1){lexer.emit(lunr.QueryLexer.PRESENCE)
return lunr.QueryLexer.lexText}
if(char.match(lunr.QueryLexer.termSeparator)){return lunr.QueryLexer.lexTerm}}}
lunr.QueryParser=function(str,query){this.lexer=new lunr.QueryLexer(str)
this.query=query
this.currentClause={}
this.lexemeIdx=0}
lunr.QueryParser.prototype.parse=function(){this.lexer.run()
this.lexemes=this.lexer.lexemes
var state=lunr.QueryParser.parseClause
while(state){state=state(this)}
return this.query}
lunr.QueryParser.prototype.peekLexeme=function(){return this.lexemes[this.lexemeIdx]}
lunr.QueryParser.prototype.consumeLexeme=function(){var lexeme=this.peekLexeme()
this.lexemeIdx+=1
return lexeme}
lunr.QueryParser.prototype.nextClause=function(){var completedClause=this.currentClause
this.query.clause(completedClause)
this.currentClause={}}
lunr.QueryParser.parseClause=function(parser){var lexeme=parser.peekLexeme()
if(lexeme==undefined){return}
switch(lexeme.type){case lunr.QueryLexer.PRESENCE:return lunr.QueryParser.parsePresence
case lunr.QueryLexer.FIELD:return lunr.QueryParser.parseField
case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm
default:var errorMessage="expected either a field or a term, found "+lexeme.type
if(lexeme.str.length>=1){errorMessage+=" with value '"+lexeme.str+"'"}
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}}
lunr.QueryParser.parsePresence=function(parser){var lexeme=parser.consumeLexeme()
if(lexeme==undefined){return}
switch(lexeme.str){case "-":parser.currentClause.presence=lunr.Query.presence.PROHIBITED
break
case "+":parser.currentClause.presence=lunr.Query.presence.REQUIRED
break
default:var errorMessage="unrecognised presence operator'"+lexeme.str+"'"
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
var nextLexeme=parser.peekLexeme()
if(nextLexeme==undefined){var errorMessage="expecting term or field, found nothing"
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
switch(nextLexeme.type){case lunr.QueryLexer.FIELD:return lunr.QueryParser.parseField
case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm
default:var errorMessage="expecting term or field, found '"+nextLexeme.type+"'"
throw new lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end)}}
lunr.QueryParser.parseField=function(parser){var lexeme=parser.consumeLexeme()
if(lexeme==undefined){return}
if(parser.query.allFields.indexOf(lexeme.str)==-1){var possibleFields=parser.query.allFields.map(function(f){return "'"+f+"'"}).join(', '),errorMessage="unrecognised field '"+lexeme.str+"', possible fields: "+possibleFields
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
parser.currentClause.fields=[lexeme.str]
var nextLexeme=parser.peekLexeme()
if(nextLexeme==undefined){var errorMessage="expecting term, found nothing"
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
switch(nextLexeme.type){case lunr.QueryLexer.TERM:return lunr.QueryParser.parseTerm
default:var errorMessage="expecting term, found '"+nextLexeme.type+"'"
throw new lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end)}}
lunr.QueryParser.parseTerm=function(parser){var lexeme=parser.consumeLexeme()
if(lexeme==undefined){return}
parser.currentClause.term=lexeme.str.toLowerCase()
if(lexeme.str.indexOf("*")!=-1){parser.currentClause.usePipeline=false}
var nextLexeme=parser.peekLexeme()
if(nextLexeme==undefined){parser.nextClause()
return}
switch(nextLexeme.type){case lunr.QueryLexer.TERM:parser.nextClause()
return lunr.QueryParser.parseTerm
case lunr.QueryLexer.FIELD:parser.nextClause()
return lunr.QueryParser.parseField
case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance
case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost
case lunr.QueryLexer.PRESENCE:parser.nextClause()
return lunr.QueryParser.parsePresence
default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'"
throw new lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end)}}
lunr.QueryParser.parseEditDistance=function(parser){var lexeme=parser.consumeLexeme()
if(lexeme==undefined){return}
var editDistance=parseInt(lexeme.str,10)
if(isNaN(editDistance)){var errorMessage="edit distance must be numeric"
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
parser.currentClause.editDistance=editDistance
var nextLexeme=parser.peekLexeme()
if(nextLexeme==undefined){parser.nextClause()
return}
switch(nextLexeme.type){case lunr.QueryLexer.TERM:parser.nextClause()
return lunr.QueryParser.parseTerm
case lunr.QueryLexer.FIELD:parser.nextClause()
return lunr.QueryParser.parseField
case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance
case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost
case lunr.QueryLexer.PRESENCE:parser.nextClause()
return lunr.QueryParser.parsePresence
default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'"
throw new lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end)}}
lunr.QueryParser.parseBoost=function(parser){var lexeme=parser.consumeLexeme()
if(lexeme==undefined){return}
var boost=parseInt(lexeme.str,10)
if(isNaN(boost)){var errorMessage="boost must be numeric"
throw new lunr.QueryParseError(errorMessage,lexeme.start,lexeme.end)}
parser.currentClause.boost=boost
var nextLexeme=parser.peekLexeme()
if(nextLexeme==undefined){parser.nextClause()
return}
switch(nextLexeme.type){case lunr.QueryLexer.TERM:parser.nextClause()
return lunr.QueryParser.parseTerm
case lunr.QueryLexer.FIELD:parser.nextClause()
return lunr.QueryParser.parseField
case lunr.QueryLexer.EDIT_DISTANCE:return lunr.QueryParser.parseEditDistance
case lunr.QueryLexer.BOOST:return lunr.QueryParser.parseBoost
case lunr.QueryLexer.PRESENCE:parser.nextClause()
return lunr.QueryParser.parsePresence
default:var errorMessage="Unexpected lexeme type '"+nextLexeme.type+"'"
throw new lunr.QueryParseError(errorMessage,nextLexeme.start,nextLexeme.end)}};(function(root,factory){if(typeof define==='function'&&define.amd){define(factory)}else if(typeof exports==='object'){module.exports=factory()}else{root.lunr=factory()}}(this,function(){return lunr}))})();;var search={loaded:false,index:null,data:null,docs:{},highlightClass:"ph1 br1",highlightStyle:"background-color: #3a3a3a",run:function(){var resultsList=document.getElementById("results");resultsList.innerHTML="";if(document.getElementById("search").value.length<3){return}
var terms=document.getElementById("search").value.toLowerCase().trim().split(" ");var results=search.index.query(function(q){if(terms.length==1){q.term(terms[0]+"*",{presence:lunr.Query.presence.OPTIONAL})
q.term(terms[0],{presence:lunr.Query.presence.OPTIONAL})}else{for(var i=0;i<terms.length-1;i++){q.term(terms[i],{presence:lunr.Query.presence.REQUIRED})}
q.term(terms[terms.length-1]+"*",{presence:lunr.Query.presence.REQUIRED})}});for(var i=0;i<results.length;i++){var result=results[i];var doc=search.docs[result.ref]
var titleSpans=[];var bodySpans=[];for(var key in result.matchData.metadata){var obj=result.matchData.metadata[key];if('title'in obj){for(var j in obj.title.position){var span=obj.title.position[j];titleSpans.push(doc.title.substring(span[0],span[0]+span[1]));}}
if('body'in obj){var contextSize=25;for(var j in obj.body.position){var span=obj.body.position[j];var start=span[0]-contextSize;if(start<0){start=0};var end=span[0]+span[1]+contextSize;if(end>doc.body.length-1){end=doc.body.length-1};bodySpans.push([doc.body.substring(span[0],span[0]+span[1]),doc.body.substring(start,end),]);}}}
var title=doc.title;for(var j in titleSpans){title=title.replace(titleSpans[j],"<span style=\""+search.highlightStyle+"\" class=\""+search.highlightClass+"\">"+titleSpans[j]+"</span>");}
var body="...";for(var j in bodySpans){if(j>4){break}
var span=bodySpans[j][0];var context=bodySpans[j][1];body+=context.replace(span,"<span style=\""+search.highlightStyle+"\" class=\""+search.highlightClass+"\">"+span+"</span>")+"...";}
var item=document.createElement("div");var itemMeta=document.createElement("p");itemMeta.innerHTML=doc.type+" ";if(doc.type=="external blog post"){var url=new URL(doc.url);var hostNameSpan=document.createElement("span")
hostNameSpan.innerHTML=url.hostname;hostNameSpan.classList="mid-gray"
itemMeta.appendChild(hostNameSpan)}
if(doc.date!=""){var itemMetaDate=document.createElement("span");itemMetaDate.innerHTML=doc.date;itemMetaDate.classList="fr silver";itemMeta.appendChild(itemMetaDate);}
itemMeta.classList="f7 gray mb1";item.appendChild(itemMeta);var itemTitle=document.createElement("p");itemTitle.classList="mv0";if(i!=results.length-1){item.classList="pb3 bb bw1 b--dark-gray";}
var itemAnchor=document.createElement("a");itemAnchor.innerHTML=title;itemAnchor.href=doc.url;itemTitle.appendChild(itemAnchor);item.appendChild(itemTitle);var pagesPostTypes=["page","blog post"];if(body!="..."&&pagesPostTypes.includes(doc.type)){var itemBody=document.createElement("p");itemBody.classList="f7"
itemBody.innerHTML=body;item.appendChild(itemBody);}else if(doc.type!="external blog post"&&doc.body!=""){var itemBody=document.createElement("p");itemBody.classList="f7"
itemBody.innerHTML=doc.body;item.appendChild(itemBody);}
resultsList.appendChild(item);}},init:function(){if(window.location.pathname.match(/\/search\/?/)==null)
return
if(search.loaded==true)
return
search.downloadIndex();search.loaded=true},downloadIndex:function(){var request=new XMLHttpRequest();request.open('GET','/searchindex.json',true);request.onload=function(){if(request.status>=200&&request.status<400){search.data=JSON.parse(request.responseText);search.createIndex();}else{console.log(request);}};request.onerror=function(){console.log(request);};request.send();},createIndex:function(){search.index=lunr(function(){this.pipeline.remove(this.pipeline._stack[0])
this.pipeline.remove(this.pipeline._stack[0])
this.pipeline.remove(this.pipeline._stack[0])
this.field('title');this.field('body');this.field('url');this.field('date');this.metadataWhitelist=['position']
for(var i=0;i<search.data.length;i++){var doc=search.data[i];this.add(doc);search.docs[doc.id]=doc;}});}}
search.init();document.addEventListener("turbolinks:load",function(event){search.init();})