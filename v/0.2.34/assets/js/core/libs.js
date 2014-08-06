/**
* JS Dependencies Lib for web-skin.js v0.2.34
* Include this script in your app alongside web-skin.js
*/
/* Modernizr (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-hsla-rgba-textshadow-applicationcache-canvas-canvastext-csstransforms3d-flexbox-flexbox-legacy-cssgradients-opacity-indexeddb-backgroundsize-borderimage-borderradius-boxshadow-cssanimations-csscolumns-cssreflections-csstransitions-testallprops-prefixed-csstransforms-mq-hashchange-history-draganddrop-audio-video-multiplebgs-localstorage-postmessage-sessionstorage-geolocation-webgl-generatedcontent-svg-inlinesvg-smil-svgclippaths-input-inputtypes-touch-fontface-testbundle-respond-websockets-websqldatabase-webworkers-contextmenu-cookies-css_boxsizing-css-calc-css_remunit-css_userselect-css-vhunit-css-vmaxunit-css-vminunit-css-vwunit-file_api-forms-fileinput-forms_placeholder-forms_validation-shiv-mq-cssclasses-addtest-prefixed-teststyles-testprops-testallprops-hasevents-prefixes-domprefixes
 * Custom Tests: webskin-modernizr-tests.js
 */
;window.Modernizr=function(e,t,n){function A(e){f.cssText=e}function O(e,t){return A(p.join(e+";")+(t||""))}function M(e,t){return typeof e===t}function _(e,t){return!!~(""+e).indexOf(t)}function D(e,t){for(var r in e){var i=e[r];if(!_(i,"-")&&f[i]!==n)return t=="pfx"?i:!0}return!1}function P(e,t,r){for(var i in e){var s=t[e[i]];if(s!==n)return r===!1?e[i]:M(s,"function")?s.bind(r||t):s}return!1}function H(e,t,n){var r=e.charAt(0).toUpperCase()+e.slice(1),i=(e+" "+v.join(r+" ")+r).split(" ");return M(t,"string")||M(t,"undefined")?D(i,t):(i=(e+" "+m.join(r+" ")+r).split(" "),P(i,t,n))}function B(){i.input=function(n){for(var r=0,i=n.length;r<i;r++)w[n[r]]=n[r]in l;return w.list&&(w.list=!!t.createElement("datalist")&&!!e.HTMLDataListElement),w}("autocomplete autofocus list placeholder max min multiple pattern required step".split(" ")),i.inputtypes=function(e){for(var r=0,i,s,u,a=e.length;r<a;r++)l.setAttribute("type",s=e[r]),i=l.type!=="text",i&&(l.value=c,l.style.cssText="position:absolute;visibility:hidden;",/^range$/.test(s)&&l.style.WebkitAppearance!==n?(o.appendChild(l),u=t.defaultView,i=u.getComputedStyle&&u.getComputedStyle(l,null).WebkitAppearance!=="textfield"&&l.offsetHeight!==0,o.removeChild(l)):/^(search|tel)$/.test(s)||(/^(url|email)$/.test(s)?i=l.checkValidity&&l.checkValidity()===!1:i=l.value!=c)),b[e[r]]=!!i;return b}("search tel url email datetime date month week time datetime-local number range color".split(" "))}var r="2.8.3",i={},s=!0,o=t.documentElement,u="modernizr",a=t.createElement(u),f=a.style,l=t.createElement("input"),c=":)",h={}.toString,p=" -webkit- -moz- -o- -ms- ".split(" "),d="Webkit Moz O ms",v=d.split(" "),m=d.toLowerCase().split(" "),g={svg:"http://www.w3.org/2000/svg"},y={},b={},w={},E=[],S=E.slice,x,T=function(e,n,r,i){var s,a,f,l,c=t.createElement("div"),h=t.body,p=h||t.createElement("body");if(parseInt(r,10))while(r--)f=t.createElement("div"),f.id=i?i[r]:u+(r+1),c.appendChild(f);return s=["&#173;",'<style id="s',u,'">',e,"</style>"].join(""),c.id=u,(h?c:p).innerHTML+=s,p.appendChild(c),h||(p.style.background="",p.style.overflow="hidden",l=o.style.overflow,o.style.overflow="hidden",o.appendChild(p)),a=n(c,e),h?c.parentNode.removeChild(c):(p.parentNode.removeChild(p),o.style.overflow=l),!!a},N=function(t){var n=e.matchMedia||e.msMatchMedia;if(n)return n(t)&&n(t).matches||!1;var r;return T("@media "+t+" { #"+u+" { position: absolute; } }",function(t){r=(e.getComputedStyle?getComputedStyle(t,null):t.currentStyle)["position"]=="absolute"}),r},C=function(){function r(r,i){i=i||t.createElement(e[r]||"div"),r="on"+r;var s=r in i;return s||(i.setAttribute||(i=t.createElement("div")),i.setAttribute&&i.removeAttribute&&(i.setAttribute(r,""),s=M(i[r],"function"),M(i[r],"undefined")||(i[r]=n),i.removeAttribute(r))),i=null,s}var e={select:"input",change:"input",submit:"form",reset:"form",error:"img",load:"img",abort:"img"};return r}(),k={}.hasOwnProperty,L;!M(k,"undefined")&&!M(k.call,"undefined")?L=function(e,t){return k.call(e,t)}:L=function(e,t){return t in e&&M(e.constructor.prototype[t],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(t){var n=this;if(typeof n!="function")throw new TypeError;var r=S.call(arguments,1),i=function(){if(this instanceof i){var e=function(){};e.prototype=n.prototype;var s=new e,o=n.apply(s,r.concat(S.call(arguments)));return Object(o)===o?o:s}return n.apply(t,r.concat(S.call(arguments)))};return i}),y.flexbox=function(){return H("flexWrap")},y.canvas=function(){var e=t.createElement("canvas");return!!e.getContext&&!!e.getContext("2d")},y.canvastext=function(){return!!i.canvas&&!!M(t.createElement("canvas").getContext("2d").fillText,"function")},y.webgl=function(){return!!e.WebGLRenderingContext},y.touch=function(){var n;return"ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch?n=!0:T(["@media (",p.join("touch-enabled),("),u,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(e){n=e.offsetTop===9}),n},y.geolocation=function(){return"geolocation"in navigator},y.postmessage=function(){return!!e.postMessage},y.websqldatabase=function(){return!!e.openDatabase},y.indexedDB=function(){return!!H("indexedDB",e)},y.hashchange=function(){return C("hashchange",e)&&(t.documentMode===n||t.documentMode>7)},y.history=function(){return!!e.history&&!!history.pushState},y.draganddrop=function(){var e=t.createElement("div");return"draggable"in e||"ondragstart"in e&&"ondrop"in e},y.websockets=function(){return"WebSocket"in e||"MozWebSocket"in e},y.rgba=function(){return A("background-color:rgba(150,255,150,.5)"),_(f.backgroundColor,"rgba")},y.hsla=function(){return A("background-color:hsla(120,40%,100%,.5)"),_(f.backgroundColor,"rgba")||_(f.backgroundColor,"hsla")},y.multiplebgs=function(){return A("background:url(https://),url(https://),red url(https://)"),/(url\s*\(.*?){3}/.test(f.background)},y.backgroundsize=function(){return H("backgroundSize")},y.borderimage=function(){return H("borderImage")},y.borderradius=function(){return H("borderRadius")},y.boxshadow=function(){return H("boxShadow")},y.textshadow=function(){return t.createElement("div").style.textShadow===""},y.opacity=function(){return O("opacity:.55"),/^0.55$/.test(f.opacity)},y.cssanimations=function(){return H("animationName")},y.csscolumns=function(){return H("columnCount")},y.cssgradients=function(){var e="background-image:",t="gradient(linear,left top,right bottom,from(#9f9),to(white));",n="linear-gradient(left top,#9f9, white);";return A((e+"-webkit- ".split(" ").join(t+e)+p.join(n+e)).slice(0,-e.length)),_(f.backgroundImage,"gradient")},y.cssreflections=function(){return H("boxReflect")},y.csstransforms=function(){return!!H("transform")},y.csstransforms3d=function(){var e=!!H("perspective");return e&&"webkitPerspective"in o.style&&T("@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}",function(t,n){e=t.offsetLeft===9&&t.offsetHeight===3}),e},y.csstransitions=function(){return H("transition")},y.fontface=function(){var e;return T('@font-face {font-family:"font";src:url("https://")}',function(n,r){var i=t.getElementById("smodernizr"),s=i.sheet||i.styleSheet,o=s?s.cssRules&&s.cssRules[0]?s.cssRules[0].cssText:s.cssText||"":"";e=/src/i.test(o)&&o.indexOf(r.split(" ")[0])===0}),e},y.generatedcontent=function(){var e;return T(["#",u,"{font:0/0 a}#",u,':after{content:"',c,'";visibility:hidden;font:3px/1 a}'].join(""),function(t){e=t.offsetHeight>=3}),e},y.video=function(){var e=t.createElement("video"),n=!1;try{if(n=!!e.canPlayType)n=new Boolean(n),n.ogg=e.canPlayType('video/ogg; codecs="theora"').replace(/^no$/,""),n.h264=e.canPlayType('video/mp4; codecs="avc1.42E01E"').replace(/^no$/,""),n.webm=e.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/^no$/,"")}catch(r){}return n},y.audio=function(){var e=t.createElement("audio"),n=!1;try{if(n=!!e.canPlayType)n=new Boolean(n),n.ogg=e.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),n.mp3=e.canPlayType("audio/mpeg;").replace(/^no$/,""),n.wav=e.canPlayType('audio/wav; codecs="1"').replace(/^no$/,""),n.m4a=(e.canPlayType("audio/x-m4a;")||e.canPlayType("audio/aac;")).replace(/^no$/,"")}catch(r){}return n},y.localstorage=function(){try{return localStorage.setItem(u,u),localStorage.removeItem(u),!0}catch(e){return!1}},y.sessionstorage=function(){try{return sessionStorage.setItem(u,u),sessionStorage.removeItem(u),!0}catch(e){return!1}},y.webworkers=function(){return!!e.Worker},y.applicationcache=function(){return!!e.applicationCache},y.svg=function(){return!!t.createElementNS&&!!t.createElementNS(g.svg,"svg").createSVGRect},y.inlinesvg=function(){var e=t.createElement("div");return e.innerHTML="<svg/>",(e.firstChild&&e.firstChild.namespaceURI)==g.svg},y.smil=function(){return!!t.createElementNS&&/SVGAnimate/.test(h.call(t.createElementNS(g.svg,"animate")))},y.svgclippaths=function(){return!!t.createElementNS&&/SVGClipPath/.test(h.call(t.createElementNS(g.svg,"clipPath")))};for(var j in y)L(y,j)&&(x=j.toLowerCase(),i[x]=y[j](),E.push((i[x]?"":"no-")+x));return i.input||B(),i.addTest=function(e,t){if(typeof e=="object")for(var r in e)L(e,r)&&i.addTest(r,e[r]);else{e=e.toLowerCase();if(i[e]!==n)return i;t=typeof t=="function"?t():t,typeof s!="undefined"&&s&&(o.className+=" "+(t?"":"no-")+e),i[e]=t}return i},A(""),a=l=null,function(e,t){function c(e,t){var n=e.createElement("p"),r=e.getElementsByTagName("head")[0]||e.documentElement;return n.innerHTML="x<style>"+t+"</style>",r.insertBefore(n.lastChild,r.firstChild)}function h(){var e=y.elements;return typeof e=="string"?e.split(" "):e}function p(e){var t=f[e[u]];return t||(t={},a++,e[u]=a,f[a]=t),t}function d(e,n,r){n||(n=t);if(l)return n.createElement(e);r||(r=p(n));var o;return r.cache[e]?o=r.cache[e].cloneNode():s.test(e)?o=(r.cache[e]=r.createElem(e)).cloneNode():o=r.createElem(e),o.canHaveChildren&&!i.test(e)&&!o.tagUrn?r.frag.appendChild(o):o}function v(e,n){e||(e=t);if(l)return e.createDocumentFragment();n=n||p(e);var r=n.frag.cloneNode(),i=0,s=h(),o=s.length;for(;i<o;i++)r.createElement(s[i]);return r}function m(e,t){t.cache||(t.cache={},t.createElem=e.createElement,t.createFrag=e.createDocumentFragment,t.frag=t.createFrag()),e.createElement=function(n){return y.shivMethods?d(n,e,t):t.createElem(n)},e.createDocumentFragment=Function("h,f","return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&("+h().join().replace(/[\w\-]+/g,function(e){return t.createElem(e),t.frag.createElement(e),'c("'+e+'")'})+");return n}")(y,t.frag)}function g(e){e||(e=t);var n=p(e);return y.shivCSS&&!o&&!n.hasCSS&&(n.hasCSS=!!c(e,"article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")),l||m(e,n),e}var n="3.7.0",r=e.html5||{},i=/^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i,s=/^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i,o,u="_html5shiv",a=0,f={},l;(function(){try{var e=t.createElement("a");e.innerHTML="<xyz></xyz>",o="hidden"in e,l=e.childNodes.length==1||function(){t.createElement("a");var e=t.createDocumentFragment();return typeof e.cloneNode=="undefined"||typeof e.createDocumentFragment=="undefined"||typeof e.createElement=="undefined"}()}catch(n){o=!0,l=!0}})();var y={elements:r.elements||"abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",version:n,shivCSS:r.shivCSS!==!1,supportsUnknownElements:l,shivMethods:r.shivMethods!==!1,type:"default",shivDocument:g,createElement:d,createDocumentFragment:v};e.html5=y,g(t)}(this,t),i._version=r,i._prefixes=p,i._domPrefixes=m,i._cssomPrefixes=v,i.mq=N,i.hasEvent=C,i.testProp=function(e){return D([e])},i.testAllProps=H,i.testStyles=T,i.prefixed=function(e,t,n){return t?H(e,t,n):H(e,"pfx")},o.className=o.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(s?" js "+E.join(" "):""),i}(this,this.document),Modernizr.addTest("cookies",function(){if(navigator.cookieEnabled)return!0;document.cookie="cookietest=1";var e=document.cookie.indexOf("cookietest=")!=-1;return document.cookie="cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT",e}),Modernizr.addTest("contextmenu","contextMenu"in document.documentElement&&"HTMLMenuItemElement"in window),Modernizr.addTest("boxsizing",function(){return Modernizr.testAllProps("boxSizing")&&(document.documentMode===undefined||document.documentMode>7)}),Modernizr.addTest("cssremunit",function(){var e=document.createElement("div");try{e.style.fontSize="3rem"}catch(t){}return/rem/.test(e.style.fontSize)}),Modernizr.addTest("csscalc",function(){var e="width:",t="calc(10px);",n=document.createElement("div");return n.style.cssText=e+Modernizr._prefixes.join(t+e),!!n.style.length}),Modernizr.addTest("userselect",function(){return Modernizr.testAllProps("user-select")}),Modernizr.addTest("cssvhunit",function(){var e;return Modernizr.testStyles("#modernizr { height: 50vh; }",function(t,n){var r=parseInt(window.innerHeight/2,10),i=parseInt((window.getComputedStyle?getComputedStyle(t,null):t.currentStyle).height,10);e=i==r}),e}),Modernizr.addTest("cssvmaxunit",function(){var e;return Modernizr.testStyles("#modernizr { width: 50vmax; }",function(t,n){var r=window.innerWidth/100,i=window.innerHeight/100,s=parseInt((window.getComputedStyle?getComputedStyle(t,null):t.currentStyle).width,10);e=parseInt(Math.max(r,i)*50,10)==s}),e}),Modernizr.addTest("cssvwunit",function(){var e;return Modernizr.testStyles("#modernizr { width: 50vw; }",function(t,n){var r=parseInt(window.innerWidth/2,10),i=parseInt((window.getComputedStyle?getComputedStyle(t,null):t.currentStyle).width,10);e=i==r}),e}),Modernizr.addTest("cssvminunit",function(){var e;return Modernizr.testStyles("#modernizr { width: 50vmin; }",function(t,n){var r=window.innerWidth/100,i=window.innerHeight/100,s=parseInt((window.getComputedStyle?getComputedStyle(t,null):t.currentStyle).width,10);e=parseInt(Math.min(r,i)*50,10)==s}),e}),Modernizr.addTest("filereader",function(){return!!(window.File&&window.FileList&&window.FileReader)}),Modernizr.addTest("placeholder",function(){return"placeholder"in(Modernizr.input||document.createElement("input"))&&"placeholder"in(Modernizr.textarea||document.createElement("textarea"))}),Modernizr.addTest("fileinput",function(){var e=document.createElement("input");return e.type="file",!e.disabled}),function(e,t){t.formvalidationapi=!1,t.formvalidationmessage=!1,t.addTest("formvalidation",function(){var n=e.createElement("form");if("checkValidity"in n){var r=e.body,i=e.documentElement,s=!1,o=!1,u;return t.formvalidationapi=!0,n.onsubmit=function(e){window.opera||e.preventDefault(),e.stopPropagation()},n.innerHTML='<input name="modTest" required><button></button>',n.style.position="absolute",n.style.top="-99999em",r||(s=!0,r=e.createElement("body"),r.style.background="",i.appendChild(r)),r.appendChild(n),u=n.getElementsByTagName("input")[0],u.oninvalid=function(e){o=!0,e.preventDefault(),e.stopPropagation()},t.formvalidationmessage=!!u.validationMessage,n.getElementsByTagName("button")[0].click(),r.removeChild(n),s&&i.removeChild(r),o}return!1})}(document,window.Modernizr),Modernizr.addTest("textoverflow",function(){var e=document.documentElement.style;return"textOverflow"in e||"OTextOverflow"in e}),Modernizr.addTest("mstouch",function(){return Modernizr.prefixed("MaxTouchPoints",navigator)>1});
//     Underscore.js 1.5.2
//     http://underscorejs.org
//     (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.
(function(){var n=this,t=n._,r={},e=Array.prototype,u=Object.prototype,i=Function.prototype,a=e.push,o=e.slice,c=e.concat,l=u.toString,f=u.hasOwnProperty,s=e.forEach,p=e.map,h=e.reduce,v=e.reduceRight,g=e.filter,d=e.every,m=e.some,y=e.indexOf,b=e.lastIndexOf,x=Array.isArray,w=Object.keys,_=i.bind,j=function(n){return n instanceof j?n:this instanceof j?(this._wrapped=n,void 0):new j(n)};"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=j),exports._=j):n._=j,j.VERSION="1.5.2";var A=j.each=j.forEach=function(n,t,e){if(null!=n)if(s&&n.forEach===s)n.forEach(t,e);else if(n.length===+n.length){for(var u=0,i=n.length;i>u;u++)if(t.call(e,n[u],u,n)===r)return}else for(var a=j.keys(n),u=0,i=a.length;i>u;u++)if(t.call(e,n[a[u]],a[u],n)===r)return};j.map=j.collect=function(n,t,r){var e=[];return null==n?e:p&&n.map===p?n.map(t,r):(A(n,function(n,u,i){e.push(t.call(r,n,u,i))}),e)};var E="Reduce of empty array with no initial value";j.reduce=j.foldl=j.inject=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),h&&n.reduce===h)return e&&(t=j.bind(t,e)),u?n.reduce(t,r):n.reduce(t);if(A(n,function(n,i,a){u?r=t.call(e,r,n,i,a):(r=n,u=!0)}),!u)throw new TypeError(E);return r},j.reduceRight=j.foldr=function(n,t,r,e){var u=arguments.length>2;if(null==n&&(n=[]),v&&n.reduceRight===v)return e&&(t=j.bind(t,e)),u?n.reduceRight(t,r):n.reduceRight(t);var i=n.length;if(i!==+i){var a=j.keys(n);i=a.length}if(A(n,function(o,c,l){c=a?a[--i]:--i,u?r=t.call(e,r,n[c],c,l):(r=n[c],u=!0)}),!u)throw new TypeError(E);return r},j.find=j.detect=function(n,t,r){var e;return O(n,function(n,u,i){return t.call(r,n,u,i)?(e=n,!0):void 0}),e},j.filter=j.select=function(n,t,r){var e=[];return null==n?e:g&&n.filter===g?n.filter(t,r):(A(n,function(n,u,i){t.call(r,n,u,i)&&e.push(n)}),e)},j.reject=function(n,t,r){return j.filter(n,function(n,e,u){return!t.call(r,n,e,u)},r)},j.every=j.all=function(n,t,e){t||(t=j.identity);var u=!0;return null==n?u:d&&n.every===d?n.every(t,e):(A(n,function(n,i,a){return(u=u&&t.call(e,n,i,a))?void 0:r}),!!u)};var O=j.some=j.any=function(n,t,e){t||(t=j.identity);var u=!1;return null==n?u:m&&n.some===m?n.some(t,e):(A(n,function(n,i,a){return u||(u=t.call(e,n,i,a))?r:void 0}),!!u)};j.contains=j.include=function(n,t){return null==n?!1:y&&n.indexOf===y?n.indexOf(t)!=-1:O(n,function(n){return n===t})},j.invoke=function(n,t){var r=o.call(arguments,2),e=j.isFunction(t);return j.map(n,function(n){return(e?t:n[t]).apply(n,r)})},j.pluck=function(n,t){return j.map(n,function(n){return n[t]})},j.where=function(n,t,r){return j.isEmpty(t)?r?void 0:[]:j[r?"find":"filter"](n,function(n){for(var r in t)if(t[r]!==n[r])return!1;return!0})},j.findWhere=function(n,t){return j.where(n,t,!0)},j.max=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.max.apply(Math,n);if(!t&&j.isEmpty(n))return-1/0;var e={computed:-1/0,value:-1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a>e.computed&&(e={value:n,computed:a})}),e.value},j.min=function(n,t,r){if(!t&&j.isArray(n)&&n[0]===+n[0]&&n.length<65535)return Math.min.apply(Math,n);if(!t&&j.isEmpty(n))return 1/0;var e={computed:1/0,value:1/0};return A(n,function(n,u,i){var a=t?t.call(r,n,u,i):n;a<e.computed&&(e={value:n,computed:a})}),e.value},j.shuffle=function(n){var t,r=0,e=[];return A(n,function(n){t=j.random(r++),e[r-1]=e[t],e[t]=n}),e},j.sample=function(n,t,r){return arguments.length<2||r?n[j.random(n.length-1)]:j.shuffle(n).slice(0,Math.max(0,t))};var k=function(n){return j.isFunction(n)?n:function(t){return t[n]}};j.sortBy=function(n,t,r){var e=k(t);return j.pluck(j.map(n,function(n,t,u){return{value:n,index:t,criteria:e.call(r,n,t,u)}}).sort(function(n,t){var r=n.criteria,e=t.criteria;if(r!==e){if(r>e||r===void 0)return 1;if(e>r||e===void 0)return-1}return n.index-t.index}),"value")};var F=function(n){return function(t,r,e){var u={},i=null==r?j.identity:k(r);return A(t,function(r,a){var o=i.call(e,r,a,t);n(u,o,r)}),u}};j.groupBy=F(function(n,t,r){(j.has(n,t)?n[t]:n[t]=[]).push(r)}),j.indexBy=F(function(n,t,r){n[t]=r}),j.countBy=F(function(n,t){j.has(n,t)?n[t]++:n[t]=1}),j.sortedIndex=function(n,t,r,e){r=null==r?j.identity:k(r);for(var u=r.call(e,t),i=0,a=n.length;a>i;){var o=i+a>>>1;r.call(e,n[o])<u?i=o+1:a=o}return i},j.toArray=function(n){return n?j.isArray(n)?o.call(n):n.length===+n.length?j.map(n,j.identity):j.values(n):[]},j.size=function(n){return null==n?0:n.length===+n.length?n.length:j.keys(n).length},j.first=j.head=j.take=function(n,t,r){return null==n?void 0:null==t||r?n[0]:o.call(n,0,t)},j.initial=function(n,t,r){return o.call(n,0,n.length-(null==t||r?1:t))},j.last=function(n,t,r){return null==n?void 0:null==t||r?n[n.length-1]:o.call(n,Math.max(n.length-t,0))},j.rest=j.tail=j.drop=function(n,t,r){return o.call(n,null==t||r?1:t)},j.compact=function(n){return j.filter(n,j.identity)};var M=function(n,t,r){return t&&j.every(n,j.isArray)?c.apply(r,n):(A(n,function(n){j.isArray(n)||j.isArguments(n)?t?a.apply(r,n):M(n,t,r):r.push(n)}),r)};j.flatten=function(n,t){return M(n,t,[])},j.without=function(n){return j.difference(n,o.call(arguments,1))},j.uniq=j.unique=function(n,t,r,e){j.isFunction(t)&&(e=r,r=t,t=!1);var u=r?j.map(n,r,e):n,i=[],a=[];return A(u,function(r,e){(t?e&&a[a.length-1]===r:j.contains(a,r))||(a.push(r),i.push(n[e]))}),i},j.union=function(){return j.uniq(j.flatten(arguments,!0))},j.intersection=function(n){var t=o.call(arguments,1);return j.filter(j.uniq(n),function(n){return j.every(t,function(t){return j.indexOf(t,n)>=0})})},j.difference=function(n){var t=c.apply(e,o.call(arguments,1));return j.filter(n,function(n){return!j.contains(t,n)})},j.zip=function(){for(var n=j.max(j.pluck(arguments,"length").concat(0)),t=new Array(n),r=0;n>r;r++)t[r]=j.pluck(arguments,""+r);return t},j.object=function(n,t){if(null==n)return{};for(var r={},e=0,u=n.length;u>e;e++)t?r[n[e]]=t[e]:r[n[e][0]]=n[e][1];return r},j.indexOf=function(n,t,r){if(null==n)return-1;var e=0,u=n.length;if(r){if("number"!=typeof r)return e=j.sortedIndex(n,t),n[e]===t?e:-1;e=0>r?Math.max(0,u+r):r}if(y&&n.indexOf===y)return n.indexOf(t,r);for(;u>e;e++)if(n[e]===t)return e;return-1},j.lastIndexOf=function(n,t,r){if(null==n)return-1;var e=null!=r;if(b&&n.lastIndexOf===b)return e?n.lastIndexOf(t,r):n.lastIndexOf(t);for(var u=e?r:n.length;u--;)if(n[u]===t)return u;return-1},j.range=function(n,t,r){arguments.length<=1&&(t=n||0,n=0),r=arguments[2]||1;for(var e=Math.max(Math.ceil((t-n)/r),0),u=0,i=new Array(e);e>u;)i[u++]=n,n+=r;return i};var R=function(){};j.bind=function(n,t){var r,e;if(_&&n.bind===_)return _.apply(n,o.call(arguments,1));if(!j.isFunction(n))throw new TypeError;return r=o.call(arguments,2),e=function(){if(!(this instanceof e))return n.apply(t,r.concat(o.call(arguments)));R.prototype=n.prototype;var u=new R;R.prototype=null;var i=n.apply(u,r.concat(o.call(arguments)));return Object(i)===i?i:u}},j.partial=function(n){var t=o.call(arguments,1);return function(){return n.apply(this,t.concat(o.call(arguments)))}},j.bindAll=function(n){var t=o.call(arguments,1);if(0===t.length)throw new Error("bindAll must be passed function names");return A(t,function(t){n[t]=j.bind(n[t],n)}),n},j.memoize=function(n,t){var r={};return t||(t=j.identity),function(){var e=t.apply(this,arguments);return j.has(r,e)?r[e]:r[e]=n.apply(this,arguments)}},j.delay=function(n,t){var r=o.call(arguments,2);return setTimeout(function(){return n.apply(null,r)},t)},j.defer=function(n){return j.delay.apply(j,[n,1].concat(o.call(arguments,1)))},j.throttle=function(n,t,r){var e,u,i,a=null,o=0;r||(r={});var c=function(){o=r.leading===!1?0:new Date,a=null,i=n.apply(e,u)};return function(){var l=new Date;o||r.leading!==!1||(o=l);var f=t-(l-o);return e=this,u=arguments,0>=f?(clearTimeout(a),a=null,o=l,i=n.apply(e,u)):a||r.trailing===!1||(a=setTimeout(c,f)),i}},j.debounce=function(n,t,r){var e,u,i,a,o;return function(){i=this,u=arguments,a=new Date;var c=function(){var l=new Date-a;t>l?e=setTimeout(c,t-l):(e=null,r||(o=n.apply(i,u)))},l=r&&!e;return e||(e=setTimeout(c,t)),l&&(o=n.apply(i,u)),o}},j.once=function(n){var t,r=!1;return function(){return r?t:(r=!0,t=n.apply(this,arguments),n=null,t)}},j.wrap=function(n,t){return function(){var r=[n];return a.apply(r,arguments),t.apply(this,r)}},j.compose=function(){var n=arguments;return function(){for(var t=arguments,r=n.length-1;r>=0;r--)t=[n[r].apply(this,t)];return t[0]}},j.after=function(n,t){return function(){return--n<1?t.apply(this,arguments):void 0}},j.keys=w||function(n){if(n!==Object(n))throw new TypeError("Invalid object");var t=[];for(var r in n)j.has(n,r)&&t.push(r);return t},j.values=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=n[t[u]];return e},j.pairs=function(n){for(var t=j.keys(n),r=t.length,e=new Array(r),u=0;r>u;u++)e[u]=[t[u],n[t[u]]];return e},j.invert=function(n){for(var t={},r=j.keys(n),e=0,u=r.length;u>e;e++)t[n[r[e]]]=r[e];return t},j.functions=j.methods=function(n){var t=[];for(var r in n)j.isFunction(n[r])&&t.push(r);return t.sort()},j.extend=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]=t[r]}),n},j.pick=function(n){var t={},r=c.apply(e,o.call(arguments,1));return A(r,function(r){r in n&&(t[r]=n[r])}),t},j.omit=function(n){var t={},r=c.apply(e,o.call(arguments,1));for(var u in n)j.contains(r,u)||(t[u]=n[u]);return t},j.defaults=function(n){return A(o.call(arguments,1),function(t){if(t)for(var r in t)n[r]===void 0&&(n[r]=t[r])}),n},j.clone=function(n){return j.isObject(n)?j.isArray(n)?n.slice():j.extend({},n):n},j.tap=function(n,t){return t(n),n};var S=function(n,t,r,e){if(n===t)return 0!==n||1/n==1/t;if(null==n||null==t)return n===t;n instanceof j&&(n=n._wrapped),t instanceof j&&(t=t._wrapped);var u=l.call(n);if(u!=l.call(t))return!1;switch(u){case"[object String]":return n==String(t);case"[object Number]":return n!=+n?t!=+t:0==n?1/n==1/t:n==+t;case"[object Date]":case"[object Boolean]":return+n==+t;case"[object RegExp]":return n.source==t.source&&n.global==t.global&&n.multiline==t.multiline&&n.ignoreCase==t.ignoreCase}if("object"!=typeof n||"object"!=typeof t)return!1;for(var i=r.length;i--;)if(r[i]==n)return e[i]==t;var a=n.constructor,o=t.constructor;if(a!==o&&!(j.isFunction(a)&&a instanceof a&&j.isFunction(o)&&o instanceof o))return!1;r.push(n),e.push(t);var c=0,f=!0;if("[object Array]"==u){if(c=n.length,f=c==t.length)for(;c--&&(f=S(n[c],t[c],r,e)););}else{for(var s in n)if(j.has(n,s)&&(c++,!(f=j.has(t,s)&&S(n[s],t[s],r,e))))break;if(f){for(s in t)if(j.has(t,s)&&!c--)break;f=!c}}return r.pop(),e.pop(),f};j.isEqual=function(n,t){return S(n,t,[],[])},j.isEmpty=function(n){if(null==n)return!0;if(j.isArray(n)||j.isString(n))return 0===n.length;for(var t in n)if(j.has(n,t))return!1;return!0},j.isElement=function(n){return!(!n||1!==n.nodeType)},j.isArray=x||function(n){return"[object Array]"==l.call(n)},j.isObject=function(n){return n===Object(n)},A(["Arguments","Function","String","Number","Date","RegExp"],function(n){j["is"+n]=function(t){return l.call(t)=="[object "+n+"]"}}),j.isArguments(arguments)||(j.isArguments=function(n){return!(!n||!j.has(n,"callee"))}),"function"!=typeof/./&&(j.isFunction=function(n){return"function"==typeof n}),j.isFinite=function(n){return isFinite(n)&&!isNaN(parseFloat(n))},j.isNaN=function(n){return j.isNumber(n)&&n!=+n},j.isBoolean=function(n){return n===!0||n===!1||"[object Boolean]"==l.call(n)},j.isNull=function(n){return null===n},j.isUndefined=function(n){return n===void 0},j.has=function(n,t){return f.call(n,t)},j.noConflict=function(){return n._=t,this},j.identity=function(n){return n},j.times=function(n,t,r){for(var e=Array(Math.max(0,n)),u=0;n>u;u++)e[u]=t.call(r,u);return e},j.random=function(n,t){return null==t&&(t=n,n=0),n+Math.floor(Math.random()*(t-n+1))};var I={escape:{"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#x27;"}};I.unescape=j.invert(I.escape);var T={escape:new RegExp("["+j.keys(I.escape).join("")+"]","g"),unescape:new RegExp("("+j.keys(I.unescape).join("|")+")","g")};j.each(["escape","unescape"],function(n){j[n]=function(t){return null==t?"":(""+t).replace(T[n],function(t){return I[n][t]})}}),j.result=function(n,t){if(null==n)return void 0;var r=n[t];return j.isFunction(r)?r.call(n):r},j.mixin=function(n){A(j.functions(n),function(t){var r=j[t]=n[t];j.prototype[t]=function(){var n=[this._wrapped];return a.apply(n,arguments),z.call(this,r.apply(j,n))}})};var N=0;j.uniqueId=function(n){var t=++N+"";return n?n+t:t},j.templateSettings={evaluate:/<%([\s\S]+?)%>/g,interpolate:/<%=([\s\S]+?)%>/g,escape:/<%-([\s\S]+?)%>/g};var q=/(.)^/,B={"'":"'","\\":"\\","\r":"r","\n":"n","	":"t","\u2028":"u2028","\u2029":"u2029"},D=/\\|'|\r|\n|\t|\u2028|\u2029/g;j.template=function(n,t,r){var e;r=j.defaults({},r,j.templateSettings);var u=new RegExp([(r.escape||q).source,(r.interpolate||q).source,(r.evaluate||q).source].join("|")+"|$","g"),i=0,a="__p+='";n.replace(u,function(t,r,e,u,o){return a+=n.slice(i,o).replace(D,function(n){return"\\"+B[n]}),r&&(a+="'+\n((__t=("+r+"))==null?'':_.escape(__t))+\n'"),e&&(a+="'+\n((__t=("+e+"))==null?'':__t)+\n'"),u&&(a+="';\n"+u+"\n__p+='"),i=o+t.length,t}),a+="';\n",r.variable||(a="with(obj||{}){\n"+a+"}\n"),a="var __t,__p='',__j=Array.prototype.join,"+"print=function(){__p+=__j.call(arguments,'');};\n"+a+"return __p;\n";try{e=new Function(r.variable||"obj","_",a)}catch(o){throw o.source=a,o}if(t)return e(t,j);var c=function(n){return e.call(this,n,j)};return c.source="function("+(r.variable||"obj")+"){\n"+a+"}",c},j.chain=function(n){return j(n).chain()};var z=function(n){return this._chain?j(n).chain():n};j.mixin(j),A(["pop","push","reverse","shift","sort","splice","unshift"],function(n){var t=e[n];j.prototype[n]=function(){var r=this._wrapped;return t.apply(r,arguments),"shift"!=n&&"splice"!=n||0!==r.length||delete r[0],z.call(this,r)}}),A(["concat","join","slice"],function(n){var t=e[n];j.prototype[n]=function(){return z.call(this,t.apply(this._wrapped,arguments))}}),j.extend(j.prototype,{chain:function(){return this._chain=!0,this},value:function(){return this._wrapped}})}).call(this);
//# sourceMappingURL=underscore-min.map
/**
* ua-sniffer.js for Web Skin v0.2.34
* 
* This script parses information from the user-agent string
* to make available for ua-sniffer-decorator
*/

/* jshint -W044: true */

if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.$);
    };
    define.isFake = true;
}

define(['jquery'], function($) {
    
    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || 'unknown_browser';
            this.version = this.searchVersion(navigator.userAgent) || this.searchVersion(navigator.appVersion) || 'unknown_version';
            this.versionRange = this.versionRange(navigator.userAgent);
            this.OS = this.searchString(this.dataOS) || 'unknown_os';
            this.device = this.searchString(this.dataDevice) || 'desktop_laptop';
            this.userAgent = navigator.userAgent || 'unknown_ua';
            this.vendor = navigator.vendor || 'unknown_vendor';
            this.platform = navigator.platform || 'unknown_platform';
        },
        searchString: function (data) {
            for (var i=0;i<data.length;i++) {
                var dataString = data[i].string;
                var dataProp = data[i].prop;
                this.versionSearchString = data[i].versionSearch || data[i].identity;
                if (dataString) {
                    var subStrTest = new RegExp(data[i].subString,'i');
                    if(subStrTest.test(dataString)) {
                        // known identity
                        return data[i].identity;
                    }
                }
                else if (dataProp) {
                    return data[i].identity;
                }
            }
        },
        searchVersion: function (dataString) {
            var index = dataString.indexOf(this.versionSearchString);
            if (index == -1) return;
            return parseFloat(dataString.substring(index+this.versionSearchString.length+1));
        },
        versionRange: function(dataString) {
            var version = Math.floor(this.searchVersion(dataString));
            return version + 1;
        },
        dataBrowser: [
            {
                string: navigator.userAgent,
                subString: 'Chrome',
                identity: 'Chrome'
            },
            {
                string: navigator.userAgent,
                subString: '(?=.*CriOS\/)(?=.*Safari\/)', // Chrome iOS App
                identity: 'Chrome',
                versionSearch: 'CriOS'
            },
            {   string: navigator.userAgent,
                subString: 'OmniWeb',
                versionSearch: 'OmniWeb/',
                identity: 'OmniWeb'
            },
            {
                string: navigator.userAgent,
                subString: '(?=.*Version\/)(?=.*Safari\/)',
                identity: 'Safari',
                versionSearch: 'Version'
            },
            {
                prop: window.opera,
                identity: 'Opera'
            },
            {
                string: navigator.vendor,
                subString: 'iCab',
                identity: 'iCab'
            },
            {
                string: navigator.vendor,
                subString: 'KDE',
                identity: 'Konqueror'
            },
            {
                string: navigator.userAgent,
                subString: 'Firefox',
                identity: 'Firefox'
            },
            {
                string: navigator.vendor,
                subString: 'Camino',
                identity: 'Camino'
            },
            {
                string: navigator.userAgent,
                subString: 'Dolfin',
                identity: 'Dolfin'
            },
            {
                string: navigator.userAgent,
                subString: 'skyfire',
                identity: 'Skyfire'
            },
            {
                string: navigator.userAgent,
                subString: 'bolt',
                identity: 'Bolt'
            },
            {
                string: navigator.userAgent,
                subString: 'teashark',
                identity: 'TeaShark'
            },
            {
                string: navigator.userAgent,
                subString: 'Blazer',
                identity: 'Blazer'
            },
            {
                string: navigator.userAgent,
                subString: 'midori',
                identity: 'Midori'
            },
            {
                string: navigator.userAgent,
                subString: 'NokiaBrowser',
                identity: 'NokiaBrowser',
                versionSearch: 'NokiaBrowser'
            },
            {
                string: navigator.userAgent,
                subString: 'OviBrowser|SEMC.*Browser',
                identity: 'GenericBrowser'
            },
            {       // for newer Netscapes (6+)
                string: navigator.userAgent,
                subString: 'Netscape',
                identity: 'Netscape'
            },
            {
                string: navigator.userAgent,
                subString: 'MSIE',
                identity: 'IE',
                versionSearch: 'MSIE'
            },
            {       // for other Gecko browsers
                string: navigator.userAgent,
                subString: 'Gecko',
                identity: 'Mozilla',
                versionSearch: 'rv'
            },
            {       // for older Netscapes (4-)
                string: navigator.userAgent,
                subString: 'Mozilla',
                identity: 'Netscape',
                versionSearch: 'Mozilla'
            }
        ],
        dataOS : [
            {
                string: navigator.platform,
                subString: 'Win',
                identity: 'Windows'
            },
            {
                string: navigator.userAgent,
                subString: 'IEMobile|Windows Phone|Windows CE.*(PPC|Smartphone)|MSIEMobile|Window Mobile|XBLWP7',
                identity: 'WindowsMobile'
            },
            {
                string: navigator.platform,
                subString: 'Mac',
                identity: 'Mac'
            },
            {
                string: navigator.userAgent,
                subString: 'iPod|iPad|iPhone',
                identity: 'iOS'
            },
            {
                string: navigator.userAgent,
                subString: '(android.*mobile|android(?!.*mobile))',
                identity: 'Android Linux'
            },
            {       // catch-all Linux
                string: navigator.platform + ' ' + navigator.userAgent,
                subString: '(?=.*Linux)(?!.*Android)',
                identity: 'Linux'
            },
            {
                string: navigator.userAgent,
                subString: '(blackberry|rim\stablet\sos)',
                identity: 'Blackberry'
            },
            {
                string: navigator.userAgent,
                subString: '(avantgo|blazer|elaine|hiptop|palm|plucker|xiino)',
                identity: 'Palm'
            },
            {
                string: navigator.userAgent,
                subString: 'Symbian|SymbOS|Series60|Series40|\bS60\b',
                identity: 'Symbian'
            },
            {
                string: navigator.userAgent,
                subString: 'MeeGo',
                identity: 'Nokia'
            },
            {
                string: navigator.userAgent,
                subString: 'Googlebot|YandexBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|facebookexternalhit',
                identity: 'Bot'
            },
            {
                string: navigator.userAgent,
                subString: 'Googlebot-Mobile|YahooSeeker\/M1A1-R2D2',
                identity: 'MobileBot'
            }
        ],
        dataDevice : [
            // TABLETS
            {
                string: navigator.userAgent,
                subString: 'iPad',
                identity: 'iPad Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Nexus\s7',
                identity: 'Nexus7 MiniTablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Nexus\s10',
                identity: 'Nexus10 Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'PlayBook|RIM\sTablet',
                identity: 'BlackBerry Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'ARM',
                identity: 'Surface Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Kindle|Silk.*Accelerated',
                identity: 'Kindle Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'NookColor|nook\sbrowser|BNTV250A|LogicPD\sZoom2',
                identity: 'Nook Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'SAMSUNG.*Tablet|Galaxy.*Tab|GT-P1000|GT-P1010|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P1000|GT-P3100|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7300|GT-P7320|GT-P7500|GT-P7510|GT-P7511',
                identity: 'Samsung Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'HTC\sFlyer|HTC\sJetstream|HTC-P715a|HTC\sEVO\sView\s4G|PG41200',
                identity: 'HTC Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617',
                identity: 'Motorola Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Transformer|TF101',
                identity: 'ASUS Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Android.*\b(A100|A101|A200|A500|A501|A510|W500|W500P|W501|W501P)\b',
                identity: 'Acer Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Android.*(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468)',
                identity: 'Yarvik Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Android.*\bOYO\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB',
                identity: 'Medion Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT',
                identity: 'Arnova Tablet'
            },
            {
                string: navigator.userAgent,
                subString: 'Tablet(?!.*PC)|ViewPad7|LG-V909|MID7015|BNTV250A|LogicPD\sZoom2|\bA7EB\b|CatNova8|A1_07|CT704|CT1002|\bM721\b',
                identity: 'Tablet' // Generic Tablet
            },
            // PHONES
            {
                string: navigator.userAgent,
                subString: '(iPhone.*Mobile|iPod|iTunes)',
                identity: 'iPhone iPod Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'BlackBerry|rim[0-9]+',
                identity: 'BlackBerry Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'HTC|HTC.*(6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT',
                identity: 'HTC Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'Nexus\sOne|Nexus\sS|Galaxy.*Nexus|Android.*Nexus',
                identity: 'Nexus Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue\sPro|Dell\sFlash|Dell\sSmoke|Dell\sMini\s3iX|XCD28|XCD35',
                identity: 'Dell Phone'
            },
            {
                string: navigator.userAgent,
                subString: '\bDroid\b.*Build|DROIDX|HRI39|MOT\-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT909|XT910|XT912|XT928',
                identity: 'Motorola Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'Samsung|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9300 |GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-P6810|GT-P7100|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100',
                identity: 'Samsung Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'E10i|SonyEricsson|SonyEricssonLT15iv',
                identity: 'Sony Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'Asus.*Galaxy',
                identity: 'ASUS Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'PalmSource|Palm',
                identity: 'Palm Phone'
            },
            {
                string: navigator.userAgent,
                subString: 'Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature',
                identity: 'Vertu Phone'
            },
            {
                string: navigator.userAgent,
                subString: '(mmp|pocket|psp|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|wap|nokia|Series40|Series60|S60|SonyEricsson|N900|PPC;|MAUI.*WAP.*Browser|LG-P500)',
                identity: 'Phone' // Generic Phone
            }
        ]

    };

    BrowserDetect.init();

    $.client = { os : BrowserDetect.OS, browser : BrowserDetect.browser, version : BrowserDetect.version.toString(), versionRange : BrowserDetect.versionRange.toString(), userAgent : BrowserDetect.userAgent, vendor : BrowserDetect.vendor, platform : BrowserDetect.platform, device : BrowserDetect.device };

});

if (define.isFake) {
    define = undefined;
}

/**
* ua-sniffer-decorator.js for Web Skin v0.2.34
* 
* This script decorates the <html> DOM element with
* CSS classes that contain information parsed from the user-agent string
*/
if (typeof define !== 'function') {
    define = function(deps, module) {
        module(window.$);
    };
    define.isFake = true;
}

define(['jquery', 'ua-sniffer'], function($) {

    // decorate the <html> tag
    // with browser / OS detection classes
    // provided by ua-sniffer.js
    var _brPrefix = 'ua-';
    var _osPrefix = 'os-';
    var _rangePrefix = 'lt-';
    var $uaBrowser = $.client.browser.toLowerCase();
    var $uaBrowserVersion = $.client.version.toLowerCase();
    var $uaBrowserVersionRange = $.client.versionRange.toLowerCase();
    var $uaOS = $.client.os.toLowerCase();
    var $uaDevice = $.client.device.toLowerCase();

    var $ua = $.client.userAgent;
    var $vendor = $.client.vendor;
    var $platform = $.client.platform;

    // Uncomment this for debuggin
    // var debugMsg = "You are using " + $uaBrowser + $uaBrowserVersion + " with " + $uaOS + " running on a " + $uaDevice;
    // var debugXtra = "UA: " + $ua + "\n" + "vendor: " + $vendor + "\n" + "platform: " + $platform;
    // console.log(debugMsg);
    // console.log(debugXtra);
    $('html')
        .addClass(_brPrefix + $uaBrowser)
        .addClass(_brPrefix + $uaBrowser + $uaBrowserVersion)
        .addClass(_brPrefix + _rangePrefix + $uaBrowser + $uaBrowserVersionRange)
        .addClass(_osPrefix + $uaOS)
        .addClass($uaDevice);

});

if (define.isFake) {
    define = undefined;
}