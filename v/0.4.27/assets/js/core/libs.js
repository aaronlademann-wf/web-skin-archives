/**
 * JS Dependencies Lib for web-skin.js v0.4.27
 *
 * Include this script in your app alongside web-skin.js
 *
 */
/* Modernizr (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-backgroundsize-inputtypes-backgroundsize--boxshadow-canvas-canvastext-cookies-css_boxsizing-css_userselect-cssanimations-cssgradients-csstransforms-csstransforms3d-csstransitions-generatedcontent-draganddrop-file_api-forms-fileinput-forms_placeholder-forms_validation-hashchange-history-localstorage-opacity-rgba-sessionstorage-svg-inlinesvg-smil-svgclippaths-textshadow-touch-shiv-cssclasses-addtest-prefixed-testprops-testallprops-domprefixes
 * Custom Tests: webskin-modernizr-tests.js
 */
;



window.Modernizr = (function( window, document, undefined ) {

    var version = '2.8.3',

    Modernizr = {},

    enableClasses = true,

    docElement = document.documentElement,

    mod = 'modernizr',
    modElem = document.createElement(mod),
    mStyle = modElem.style,

    inputElem  = document.createElement('input')  ,

    smile = ':)',

    toString = {}.toString,

    prefixes = ' -webkit- -moz- -o- -ms- '.split(' '),



    omPrefixes = 'Webkit Moz O ms',

    cssomPrefixes = omPrefixes.split(' '),

    domPrefixes = omPrefixes.toLowerCase().split(' '),

    ns = {'svg': 'http://www.w3.org/2000/svg'},

    tests = {},
    inputs = {},
    attrs = {},

    classes = [],

    slice = classes.slice,

    featureName, 


    injectElementWithStyles = function( rule, callback, nodes, testnames ) {

      var style, ret, node, docOverflow,
          div = document.createElement('div'),
                body = document.body,
                fakeBody = body || document.createElement('body');

      if ( parseInt(nodes, 10) ) {
                      while ( nodes-- ) {
              node = document.createElement('div');
              node.id = testnames ? testnames[nodes] : mod + (nodes + 1);
              div.appendChild(node);
          }
      }

                style = ['&#173;','<style id="s', mod, '">', rule, '</style>'].join('');
      div.id = mod;
          (body ? div : fakeBody).innerHTML += style;
      fakeBody.appendChild(div);
      if ( !body ) {
                fakeBody.style.background = '';
                fakeBody.style.overflow = 'hidden';
          docOverflow = docElement.style.overflow;
          docElement.style.overflow = 'hidden';
          docElement.appendChild(fakeBody);
      }

      ret = callback(div, rule);
        if ( !body ) {
          fakeBody.parentNode.removeChild(fakeBody);
          docElement.style.overflow = docOverflow;
      } else {
          div.parentNode.removeChild(div);
      }

      return !!ret;

    },



    isEventSupported = (function() {

      var TAGNAMES = {
        'select': 'input', 'change': 'input',
        'submit': 'form', 'reset': 'form',
        'error': 'img', 'load': 'img', 'abort': 'img'
      };

      function isEventSupported( eventName, element ) {

        element = element || document.createElement(TAGNAMES[eventName] || 'div');
        eventName = 'on' + eventName;

            var isSupported = eventName in element;

        if ( !isSupported ) {
                if ( !element.setAttribute ) {
            element = document.createElement('div');
          }
          if ( element.setAttribute && element.removeAttribute ) {
            element.setAttribute(eventName, '');
            isSupported = is(element[eventName], 'function');

                    if ( !is(element[eventName], 'undefined') ) {
              element[eventName] = undefined;
            }
            element.removeAttribute(eventName);
          }
        }

        element = null;
        return isSupported;
      }
      return isEventSupported;
    })(),


    _hasOwnProperty = ({}).hasOwnProperty, hasOwnProp;

    if ( !is(_hasOwnProperty, 'undefined') && !is(_hasOwnProperty.call, 'undefined') ) {
      hasOwnProp = function (object, property) {
        return _hasOwnProperty.call(object, property);
      };
    }
    else {
      hasOwnProp = function (object, property) { 
        return ((property in object) && is(object.constructor.prototype[property], 'undefined'));
      };
    }


    if (!Function.prototype.bind) {
      Function.prototype.bind = function bind(that) {

        var target = this;

        if (typeof target != "function") {
            throw new TypeError();
        }

        var args = slice.call(arguments, 1),
            bound = function () {

            if (this instanceof bound) {

              var F = function(){};
              F.prototype = target.prototype;
              var self = new F();

              var result = target.apply(
                  self,
                  args.concat(slice.call(arguments))
              );
              if (Object(result) === result) {
                  return result;
              }
              return self;

            } else {

              return target.apply(
                  that,
                  args.concat(slice.call(arguments))
              );

            }

        };

        return bound;
      };
    }

    function setCss( str ) {
        mStyle.cssText = str;
    }

    function setCssAll( str1, str2 ) {
        return setCss(prefixes.join(str1 + ';') + ( str2 || '' ));
    }

    function is( obj, type ) {
        return typeof obj === type;
    }

    function contains( str, substr ) {
        return !!~('' + str).indexOf(substr);
    }

    function testProps( props, prefixed ) {
        for ( var i in props ) {
            var prop = props[i];
            if ( !contains(prop, "-") && mStyle[prop] !== undefined ) {
                return prefixed == 'pfx' ? prop : true;
            }
        }
        return false;
    }

    function testDOMProps( props, obj, elem ) {
        for ( var i in props ) {
            var item = obj[props[i]];
            if ( item !== undefined) {

                            if (elem === false) return props[i];

                            if (is(item, 'function')){
                                return item.bind(elem || obj);
                }

                            return item;
            }
        }
        return false;
    }

    function testPropsAll( prop, prefixed, elem ) {

        var ucProp  = prop.charAt(0).toUpperCase() + prop.slice(1),
            props   = (prop + ' ' + cssomPrefixes.join(ucProp + ' ') + ucProp).split(' ');

            if(is(prefixed, "string") || is(prefixed, "undefined")) {
          return testProps(props, prefixed);

            } else {
          props = (prop + ' ' + (domPrefixes).join(ucProp + ' ') + ucProp).split(' ');
          return testDOMProps(props, prefixed, elem);
        }
    }



    tests['canvas'] = function() {
        var elem = document.createElement('canvas');
        return !!(elem.getContext && elem.getContext('2d'));
    };

    tests['canvastext'] = function() {
        return !!(Modernizr['canvas'] && is(document.createElement('canvas').getContext('2d').fillText, 'function'));
    };
    tests['touch'] = function() {
        var bool;

        if(('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
          bool = true;
        } else {
          injectElementWithStyles(['@media (',prefixes.join('touch-enabled),('),mod,')','{#modernizr{top:9px;position:absolute}}'].join(''), function( node ) {
            bool = node.offsetTop === 9;
          });
        }

        return bool;
    };    tests['hashchange'] = function() {
      return isEventSupported('hashchange', window) && (document.documentMode === undefined || document.documentMode > 7);
    };

    tests['history'] = function() {
      return !!(window.history && history.pushState);
    };

    tests['draganddrop'] = function() {
        var div = document.createElement('div');
        return ('draggable' in div) || ('ondragstart' in div && 'ondrop' in div);
    };



    tests['rgba'] = function() {
        setCss('background-color:rgba(150,255,150,.5)');

        return contains(mStyle.backgroundColor, 'rgba');
    };

    tests['backgroundsize'] = function() {
        return testPropsAll('backgroundSize');
    };
    tests['boxshadow'] = function() {
        return testPropsAll('boxShadow');
    };

    tests['textshadow'] = function() {
        return document.createElement('div').style.textShadow === '';
    };


    tests['opacity'] = function() {
                setCssAll('opacity:.55');

                    return (/^0.55$/).test(mStyle.opacity);
    };


    tests['cssanimations'] = function() {
        return testPropsAll('animationName');
    };    tests['cssgradients'] = function() {
        var str1 = 'background-image:',
            str2 = 'gradient(linear,left top,right bottom,from(#9f9),to(white));',
            str3 = 'linear-gradient(left top,#9f9, white);';

        setCss(
                       (str1 + '-webkit- '.split(' ').join(str2 + str1) +
                       prefixes.join(str3 + str1)).slice(0, -str1.length)
        );

        return contains(mStyle.backgroundImage, 'gradient');
    };    tests['csstransforms'] = function() {
        return !!testPropsAll('transform');
    };


    tests['csstransforms3d'] = function() {

        var ret = !!testPropsAll('perspective');

                        if ( ret && 'webkitPerspective' in docElement.style ) {

                      injectElementWithStyles('@media (transform-3d),(-webkit-transform-3d){#modernizr{left:9px;position:absolute;height:3px;}}', function( node, rule ) {
            ret = node.offsetLeft === 9 && node.offsetHeight === 3;
          });
        }
        return ret;
    };


    tests['csstransitions'] = function() {
        return testPropsAll('transition');
    };



    tests['generatedcontent'] = function() {
        var bool;

        injectElementWithStyles(['#',mod,'{font:0/0 a}#',mod,':after{content:"',smile,'";visibility:hidden;font:3px/1 a}'].join(''), function( node ) {
          bool = node.offsetHeight >= 3;
        });

        return bool;
    };



    tests['localstorage'] = function() {
        try {
            localStorage.setItem(mod, mod);
            localStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['sessionstorage'] = function() {
        try {
            sessionStorage.setItem(mod, mod);
            sessionStorage.removeItem(mod);
            return true;
        } catch(e) {
            return false;
        }
    };

    tests['svg'] = function() {
        return !!document.createElementNS && !!document.createElementNS(ns.svg, 'svg').createSVGRect;
    };

    tests['inlinesvg'] = function() {
      var div = document.createElement('div');
      div.innerHTML = '<svg/>';
      return (div.firstChild && div.firstChild.namespaceURI) == ns.svg;
    };

    tests['smil'] = function() {
        return !!document.createElementNS && /SVGAnimate/.test(toString.call(document.createElementNS(ns.svg, 'animate')));
    };


    tests['svgclippaths'] = function() {
        return !!document.createElementNS && /SVGClipPath/.test(toString.call(document.createElementNS(ns.svg, 'clipPath')));
    };

    function webforms() {
                            Modernizr['inputtypes'] = (function(props) {

            for ( var i = 0, bool, inputElemType, defaultView, len = props.length; i < len; i++ ) {

                inputElem.setAttribute('type', inputElemType = props[i]);
                bool = inputElem.type !== 'text';

                                                    if ( bool ) {

                    inputElem.value         = smile;
                    inputElem.style.cssText = 'position:absolute;visibility:hidden;';

                    if ( /^range$/.test(inputElemType) && inputElem.style.WebkitAppearance !== undefined ) {

                      docElement.appendChild(inputElem);
                      defaultView = document.defaultView;

                                        bool =  defaultView.getComputedStyle &&
                              defaultView.getComputedStyle(inputElem, null).WebkitAppearance !== 'textfield' &&
                                                                                  (inputElem.offsetHeight !== 0);

                      docElement.removeChild(inputElem);

                    } else if ( /^(search|tel)$/.test(inputElemType) ){
                                                                                    } else if ( /^(url|email)$/.test(inputElemType) ) {
                                        bool = inputElem.checkValidity && inputElem.checkValidity() === false;

                    } else {
                                        bool = inputElem.value != smile;
                    }
                }

                inputs[ props[i] ] = !!bool;
            }
            return inputs;
        })('search tel url email datetime date month week time datetime-local number range color'.split(' '));
        }
    for ( var feature in tests ) {
        if ( hasOwnProp(tests, feature) ) {
                                    featureName  = feature.toLowerCase();
            Modernizr[featureName] = tests[feature]();

            classes.push((Modernizr[featureName] ? '' : 'no-') + featureName);
        }
    }

    Modernizr.input || webforms();


     Modernizr.addTest = function ( feature, test ) {
       if ( typeof feature == 'object' ) {
         for ( var key in feature ) {
           if ( hasOwnProp( feature, key ) ) {
             Modernizr.addTest( key, feature[ key ] );
           }
         }
       } else {

         feature = feature.toLowerCase();

         if ( Modernizr[feature] !== undefined ) {
                                              return Modernizr;
         }

         test = typeof test == 'function' ? test() : test;

         if (typeof enableClasses !== "undefined" && enableClasses) {
           docElement.className += ' ' + (test ? '' : 'no-') + feature;
         }
         Modernizr[feature] = test;

       }

       return Modernizr; 
     };


    setCss('');
    modElem = inputElem = null;

    ;(function(window, document) {
                var version = '3.7.0';

            var options = window.html5 || {};

            var reSkip = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i;

            var saveClones = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i;

            var supportsHtml5Styles;

            var expando = '_html5shiv';

            var expanID = 0;

            var expandoData = {};

            var supportsUnknownElements;

        (function() {
          try {
            var a = document.createElement('a');
            a.innerHTML = '<xyz></xyz>';
                    supportsHtml5Styles = ('hidden' in a);

            supportsUnknownElements = a.childNodes.length == 1 || (function() {
                        (document.createElement)('a');
              var frag = document.createDocumentFragment();
              return (
                typeof frag.cloneNode == 'undefined' ||
                typeof frag.createDocumentFragment == 'undefined' ||
                typeof frag.createElement == 'undefined'
              );
            }());
          } catch(e) {
                    supportsHtml5Styles = true;
            supportsUnknownElements = true;
          }

        }());

            function addStyleSheet(ownerDocument, cssText) {
          var p = ownerDocument.createElement('p'),
          parent = ownerDocument.getElementsByTagName('head')[0] || ownerDocument.documentElement;

          p.innerHTML = 'x<style>' + cssText + '</style>';
          return parent.insertBefore(p.lastChild, parent.firstChild);
        }

            function getElements() {
          var elements = html5.elements;
          return typeof elements == 'string' ? elements.split(' ') : elements;
        }

            function getExpandoData(ownerDocument) {
          var data = expandoData[ownerDocument[expando]];
          if (!data) {
            data = {};
            expanID++;
            ownerDocument[expando] = expanID;
            expandoData[expanID] = data;
          }
          return data;
        }

            function createElement(nodeName, ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createElement(nodeName);
          }
          if (!data) {
            data = getExpandoData(ownerDocument);
          }
          var node;

          if (data.cache[nodeName]) {
            node = data.cache[nodeName].cloneNode();
          } else if (saveClones.test(nodeName)) {
            node = (data.cache[nodeName] = data.createElem(nodeName)).cloneNode();
          } else {
            node = data.createElem(nodeName);
          }

                                                    return node.canHaveChildren && !reSkip.test(nodeName) && !node.tagUrn ? data.frag.appendChild(node) : node;
        }

            function createDocumentFragment(ownerDocument, data){
          if (!ownerDocument) {
            ownerDocument = document;
          }
          if(supportsUnknownElements){
            return ownerDocument.createDocumentFragment();
          }
          data = data || getExpandoData(ownerDocument);
          var clone = data.frag.cloneNode(),
          i = 0,
          elems = getElements(),
          l = elems.length;
          for(;i<l;i++){
            clone.createElement(elems[i]);
          }
          return clone;
        }

            function shivMethods(ownerDocument, data) {
          if (!data.cache) {
            data.cache = {};
            data.createElem = ownerDocument.createElement;
            data.createFrag = ownerDocument.createDocumentFragment;
            data.frag = data.createFrag();
          }


          ownerDocument.createElement = function(nodeName) {
                    if (!html5.shivMethods) {
              return data.createElem(nodeName);
            }
            return createElement(nodeName, ownerDocument, data);
          };

          ownerDocument.createDocumentFragment = Function('h,f', 'return function(){' +
                                                          'var n=f.cloneNode(),c=n.createElement;' +
                                                          'h.shivMethods&&(' +
                                                                                                                getElements().join().replace(/[\w\-]+/g, function(nodeName) {
            data.createElem(nodeName);
            data.frag.createElement(nodeName);
            return 'c("' + nodeName + '")';
          }) +
            ');return n}'
                                                         )(html5, data.frag);
        }

            function shivDocument(ownerDocument) {
          if (!ownerDocument) {
            ownerDocument = document;
          }
          var data = getExpandoData(ownerDocument);

          if (html5.shivCSS && !supportsHtml5Styles && !data.hasCSS) {
            data.hasCSS = !!addStyleSheet(ownerDocument,
                                                                                'article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}' +
                                                                                    'mark{background:#FF0;color:#000}' +
                                                                                    'template{display:none}'
                                         );
          }
          if (!supportsUnknownElements) {
            shivMethods(ownerDocument, data);
          }
          return ownerDocument;
        }

            var html5 = {

                'elements': options.elements || 'abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video',

                'version': version,

                'shivCSS': (options.shivCSS !== false),

                'supportsUnknownElements': supportsUnknownElements,

                'shivMethods': (options.shivMethods !== false),

                'type': 'default',

                'shivDocument': shivDocument,

                createElement: createElement,

                createDocumentFragment: createDocumentFragment
        };

            window.html5 = html5;

            shivDocument(document);

    }(this, document));

    Modernizr._version      = version;

    Modernizr._prefixes     = prefixes;
    Modernizr._domPrefixes  = domPrefixes;
    Modernizr._cssomPrefixes  = cssomPrefixes;


    Modernizr.hasEvent      = isEventSupported;

    Modernizr.testProp      = function(prop){
        return testProps([prop]);
    };

    Modernizr.testAllProps  = testPropsAll;


    Modernizr.testStyles    = injectElementWithStyles;
    Modernizr.prefixed      = function(prop, obj, elem){
      if(!obj) {
        return testPropsAll(prop, 'pfx');
      } else {
            return testPropsAll(prop, obj, elem);
      }
    };


    docElement.className = docElement.className.replace(/(^|\s)no-js(\s|$)/, '$1$2') +

                                                    (enableClasses ? ' js ' + classes.join(' ') : '');

    return Modernizr;

})(this, this.document);Modernizr.addTest('cookies', function () {
  
  if (navigator.cookieEnabled) return true;
  
  document.cookie = "cookietest=1";
  var ret = document.cookie.indexOf("cookietest=") != -1;
  
  document.cookie = "cookietest=1; expires=Thu, 01-Jan-1970 00:00:01 GMT";
  return ret;
});
Modernizr.addTest("boxsizing",function(){
    return Modernizr.testAllProps("boxSizing") && (document.documentMode === undefined || document.documentMode > 7);
});



Modernizr.addTest("userselect",function(){
    return Modernizr.testAllProps("user-select");
});


Modernizr.addTest('filereader', function () {
    return !!(window.File && window.FileList && window.FileReader);
});



Modernizr.addTest('fileinput', function() {
    var elem = document.createElement('input');
    elem.type = 'file';
    return !elem.disabled;
});



Modernizr.addTest('placeholder', function(){

  return !!( 'placeholder' in ( Modernizr.input    || document.createElement('input')    ) && 
             'placeholder' in ( Modernizr.textarea || document.createElement('textarea') )
           );

});

(function(document, Modernizr){


Modernizr.formvalidationapi = false;
Modernizr.formvalidationmessage = false;

Modernizr.addTest('formvalidation', function(){
    var form = document.createElement('form');
    if ( !('checkValidity' in form) ) {
        return false;
    }
    var body = document.body,

    html = document.documentElement,

    bodyFaked = false,

    invaildFired = false,

    input;

    Modernizr.formvalidationapi = true;

    form.onsubmit = function(e) {
            if ( !window.opera ) {
            e.preventDefault();
        }
        e.stopPropagation();
    };

    form.innerHTML = '<input name="modTest" required><button></button>';

    form.style.position = 'absolute';
    form.style.top = '-99999em';

    if ( !body ) {
        bodyFaked = true;
        body = document.createElement('body');
            body.style.background = "";
        html.appendChild(body);
    }

    body.appendChild(form);

    input = form.getElementsByTagName('input')[0];	

    input.oninvalid = function(e) {
        invaildFired = true;
        e.preventDefault();
        e.stopPropagation();
    };

    Modernizr.formvalidationmessage = !!input.validationMessage;

    form.getElementsByTagName('button')[0].click();

    body.removeChild(form);
    bodyFaked && html.removeChild(body);

    return invaildFired;
});


})(document, window.Modernizr);


Modernizr.addTest('textoverflow', function () {
    var s = document.documentElement.style;
    return 'textOverflow' in s || 'OTextOverflow' in s;
});



Modernizr.addTest('mstouch', function () {
    return Modernizr.prefixed('MaxTouchPoints', navigator) > 1;
});
;
/**
* ua-sniffer.js for Web Skin
*
* This script parses information from the user-agent string
* to make available for ua-sniffer-decorator
*/

/* jshint -W044: true */

+function($) {
    var _navigator = navigator;

    var BrowserDetect = {
        init: function () {
            this.browser = this.searchString(this.dataBrowser) || 'unknown_browser';
            this.version = this.searchVersion(_navigator.userAgent) || this.searchVersion(_navigator.appVersion) || 'unknown_version';
            this.versionRange = this.versionRange(_navigator.userAgent);
            this.OS = this.searchString(this.dataOS) || 'unknown_os';
            this.device = this.searchString(this.dataDevice) || 'desktop_laptop';
            this.userAgent = _navigator.userAgent || 'unknown_ua';
            this.vendor = _navigator.vendor || 'unknown_vendor';
            this.platform = _navigator.platform || 'unknown_platform';
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
                string: _navigator.userAgent,
                subString: 'PhantomJS',
                identity: 'PhantomJS'
            },
            {
                string: _navigator.userAgent,
                subString: 'Chrome',
                identity: 'Chrome'
            },
            {
                string: _navigator.userAgent,
                subString: '(?=.*CriOS\/)(?=.*Safari\/)', // Chrome iOS App
                identity: 'Chrome',
                versionSearch: 'CriOS'
            },
            {   string: _navigator.userAgent,
                subString: 'OmniWeb',
                versionSearch: 'OmniWeb/',
                identity: 'OmniWeb'
            },
            {
                string: _navigator.userAgent,
                subString: '(?=.*Version\/)(?=.*Safari\/)',
                identity: 'Safari',
                versionSearch: 'Version'
            },
            {
                prop: window.opera,
                identity: 'Opera'
            },
            {
                string: _navigator.vendor,
                subString: 'iCab',
                identity: 'iCab'
            },
            {
                string: _navigator.vendor,
                subString: 'KDE',
                identity: 'Konqueror'
            },
            {
                string: _navigator.userAgent,
                subString: 'Firefox',
                identity: 'Firefox'
            },
            {
                string: _navigator.vendor,
                subString: 'Camino',
                identity: 'Camino'
            },
            {
                string: _navigator.userAgent,
                subString: 'Dolfin',
                identity: 'Dolfin'
            },
            {
                string: _navigator.userAgent,
                subString: 'skyfire',
                identity: 'Skyfire'
            },
            {
                string: _navigator.userAgent,
                subString: 'bolt',
                identity: 'Bolt'
            },
            {
                string: _navigator.userAgent,
                subString: 'teashark',
                identity: 'TeaShark'
            },
            {
                string: _navigator.userAgent,
                subString: 'Blazer',
                identity: 'Blazer'
            },
            {
                string: _navigator.userAgent,
                subString: 'midori',
                identity: 'Midori'
            },
            {
                string: _navigator.userAgent,
                subString: 'NokiaBrowser',
                identity: 'NokiaBrowser',
                versionSearch: 'NokiaBrowser'
            },
            {
                string: _navigator.userAgent,
                subString: 'OviBrowser|SEMC.*Browser',
                identity: 'GenericBrowser'
            },
            {       // for newer Netscapes (6+)
                string: _navigator.userAgent,
                subString: 'Netscape',
                identity: 'Netscape'
            },
            {       // For MSIE 10 and below
                string: _navigator.userAgent,
                subString: 'MSIE',
                identity: 'IE',
                versionSearch: 'MSIE'
            },
            {       // For MSIE 11+
                string: _navigator.userAgent,
                subString: 'Trident',
                identity: 'IE',
                versionSearch: 'rv'
            },
            {       // for other Gecko browsers
                string: _navigator.userAgent,
                subString: 'Gecko',
                identity: 'Mozilla',
                versionSearch: 'rv'
            },
            {       // for older Netscapes (4-)
                string: _navigator.userAgent,
                subString: 'Mozilla',
                identity: 'Netscape',
                versionSearch: 'Mozilla'
            }
        ],
        dataOS : [
            {
                string: _navigator.platform,
                subString: 'Win',
                identity: 'Windows'
            },
            {
                string: _navigator.userAgent,
                subString: 'IEMobile|Windows Phone|Windows CE.*(PPC|Smartphone)|MSIEMobile|Window Mobile|XBLWP7',
                identity: 'WindowsMobile'
            },
            {
                string: _navigator.platform,
                subString: 'Mac',
                identity: 'Mac'
            },
            {
                string: _navigator.userAgent,
                subString: 'iPod|iPad|iPhone',
                identity: 'iOS'
            },
            {
                string: _navigator.userAgent,
                subString: '(android.*mobile|android(?!.*mobile))',
                identity: 'Android Linux'
            },
            {       // catch-all Linux
                string: _navigator.platform + ' ' + _navigator.userAgent,
                subString: '(?=.*Linux)(?!.*Android)',
                identity: 'Linux'
            },
            {
                string: _navigator.userAgent,
                subString: '(blackberry|rim\stablet\sos)',
                identity: 'Blackberry'
            },
            {
                string: _navigator.userAgent,
                subString: '(avantgo|blazer|elaine|hiptop|palm|plucker|xiino)',
                identity: 'Palm'
            },
            {
                string: _navigator.userAgent,
                subString: 'Symbian|SymbOS|Series60|Series40|\bS60\b',
                identity: 'Symbian'
            },
            {
                string: _navigator.userAgent,
                subString: 'MeeGo',
                identity: 'Nokia'
            },
            {
                string: _navigator.userAgent,
                subString: 'Googlebot|YandexBot|bingbot|ia_archiver|AhrefsBot|Ezooms|GSLFbot|WBSearchBot|Twitterbot|TweetmemeBot|Twikle|PaperLiBot|Wotbox|UnwindFetchor|facebookexternalhit',
                identity: 'Bot'
            },
            {
                string: _navigator.userAgent,
                subString: 'Googlebot-Mobile|YahooSeeker\/M1A1-R2D2',
                identity: 'MobileBot'
            }
        ],
        dataDevice : [
            // TABLETS
            {
                string: _navigator.userAgent,
                subString: 'iPad',
                identity: 'iPad Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Nexus\s7',
                identity: 'Nexus7 MiniTablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Nexus\s10',
                identity: 'Nexus10 Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'PlayBook|RIM\sTablet',
                identity: 'BlackBerry Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'ARM',
                identity: 'Surface Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Kindle|Silk.*Accelerated',
                identity: 'Kindle Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'NookColor|nook\sbrowser|BNTV250A|LogicPD\sZoom2',
                identity: 'Nook Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'SAMSUNG.*Tablet|Galaxy.*Tab|GT-P1000|GT-P1010|GT-P6210|GT-P6800|GT-P6810|GT-P7100|GT-P7300|GT-P7310|GT-P7500|GT-P7510|SCH-I800|SCH-I815|SCH-I905|SGH-I957|SGH-I987|SGH-T849|SGH-T859|SGH-T869|SPH-P100|GT-P1000|GT-P3100|GT-P3110|GT-P5100|GT-P5110|GT-P6200|GT-P7300|GT-P7320|GT-P7500|GT-P7510|GT-P7511',
                identity: 'Samsung Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'HTC\sFlyer|HTC\sJetstream|HTC-P715a|HTC\sEVO\sView\s4G|PG41200',
                identity: 'HTC Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'xoom|sholest|MZ615|MZ605|MZ505|MZ601|MZ602|MZ603|MZ604|MZ606|MZ607|MZ608|MZ609|MZ615|MZ616|MZ617',
                identity: 'Motorola Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Transformer|TF101',
                identity: 'ASUS Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Android.*\b(A100|A101|A200|A500|A501|A510|W500|W500P|W501|W501P)\b',
                identity: 'Acer Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Android.*(TAB210|TAB211|TAB224|TAB250|TAB260|TAB264|TAB310|TAB360|TAB364|TAB410|TAB411|TAB420|TAB424|TAB450|TAB460|TAB461|TAB464|TAB465|TAB467|TAB468)',
                identity: 'Yarvik Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Android.*\bOYO\b|LIFE.*(P9212|P9514|P9516|S9512)|LIFETAB',
                identity: 'Medion Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'AN10G2|AN7bG3|AN7fG3|AN8G3|AN8cG3|AN7G3|AN9G3|AN7dG3|AN7dG3ST|AN7dG3ChildPad|AN10bG3|AN10bG3DT',
                identity: 'Arnova Tablet'
            },
            {
                string: _navigator.userAgent,
                subString: 'Tablet(?!.*PC)|ViewPad7|LG-V909|MID7015|BNTV250A|LogicPD\sZoom2|\bA7EB\b|CatNova8|A1_07|CT704|CT1002|\bM721\b',
                identity: 'Tablet' // Generic Tablet
            },
            // PHONES
            {
                string: _navigator.userAgent,
                subString: '(iPhone.*Mobile|iPod|iTunes)',
                identity: 'iPhone iPod Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'BlackBerry|rim[0-9]+',
                identity: 'BlackBerry Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'HTC|HTC.*(6800|8100|8900|A7272|S510e|C110e|Legend|Desire|T8282)|APX515CKT|Qtek9090|APA9292KT',
                identity: 'HTC Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'Nexus\sOne|Nexus\sS|Galaxy.*Nexus|Android.*Nexus',
                identity: 'Nexus Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'Dell.*Streak|Dell.*Aero|Dell.*Venue|DELL.*Venue\sPro|Dell\sFlash|Dell\sSmoke|Dell\sMini\s3iX|XCD28|XCD35',
                identity: 'Dell Phone'
            },
            {
                string: _navigator.userAgent,
                subString: '\bDroid\b.*Build|DROIDX|HRI39|MOT\-|A1260|A1680|A555|A853|A855|A953|A955|A956|Motorola.*ELECTRIFY|Motorola.*i1|i867|i940|MB200|MB300|MB501|MB502|MB508|MB511|MB520|MB525|MB526|MB611|MB612|MB632|MB810|MB855|MB860|MB861|MB865|MB870|ME501|ME502|ME511|ME525|ME600|ME632|ME722|ME811|ME860|ME863|ME865|MT620|MT710|MT716|MT720|MT810|MT870|MT917|Motorola.*TITANIUM|WX435|WX445|XT300|XT301|XT311|XT316|XT317|XT319|XT320|XT390|XT502|XT530|XT531|XT532|XT535|XT603|XT610|XT611|XT615|XT681|XT701|XT702|XT711|XT720|XT800|XT806|XT860|XT862|XT875|XT882|XT883|XT894|XT909|XT910|XT912|XT928',
                identity: 'Motorola Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'Samsung|BGT-S5230|GT-B2100|GT-B2700|GT-B2710|GT-B3210|GT-B3310|GT-B3410|GT-B3730|GT-B3740|GT-B5510|GT-B5512|GT-B5722|GT-B6520|GT-B7300|GT-B7320|GT-B7330|GT-B7350|GT-B7510|GT-B7722|GT-B7800|GT-C3010|GT-C3011|GT-C3060|GT-C3200|GT-C3212|GT-C3212I|GT-C3222|GT-C3300|GT-C3300K|GT-C3303|GT-C3303K|GT-C3310|GT-C3322|GT-C3330|GT-C3350|GT-C3500|GT-C3510|GT-C3530|GT-C3630|GT-C3780|GT-C5010|GT-C5212|GT-C6620|GT-C6625|GT-C6712|GT-E1050|GT-E1070|GT-E1075|GT-E1080|GT-E1081|GT-E1085|GT-E1087|GT-E1100|GT-E1107|GT-E1110|GT-E1120|GT-E1125|GT-E1130|GT-E1160|GT-E1170|GT-E1175|GT-E1180|GT-E1182|GT-E1200|GT-E1210|GT-E1225|GT-E1230|GT-E1390|GT-E2100|GT-E2120|GT-E2121|GT-E2152|GT-E2220|GT-E2222|GT-E2230|GT-E2232|GT-E2250|GT-E2370|GT-E2550|GT-E2652|GT-E3210|GT-E3213|GT-I5500|GT-I5503|GT-I5700|GT-I5800|GT-I5801|GT-I6410|GT-I6420|GT-I7110|GT-I7410|GT-I7500|GT-I8000|GT-I8150|GT-I8160|GT-I8320|GT-I8330|GT-I8350|GT-I8530|GT-I8700|GT-I8703|GT-I8910|GT-I9000|GT-I9001|GT-I9003|GT-I9010|GT-I9020|GT-I9023|GT-I9070|GT-I9100|GT-I9103|GT-I9220|GT-I9250|GT-I9300|GT-I9300 |GT-M3510|GT-M5650|GT-M7500|GT-M7600|GT-M7603|GT-M8800|GT-M8910|GT-N7000|GT-P6810|GT-P7100|GT-S3110|GT-S3310|GT-S3350|GT-S3353|GT-S3370|GT-S3650|GT-S3653|GT-S3770|GT-S3850|GT-S5210|GT-S5220|GT-S5229|GT-S5230|GT-S5233|GT-S5250|GT-S5253|GT-S5260|GT-S5263|GT-S5270|GT-S5300|GT-S5330|GT-S5350|GT-S5360|GT-S5363|GT-S5369|GT-S5380|GT-S5380D|GT-S5560|GT-S5570|GT-S5600|GT-S5603|GT-S5610|GT-S5620|GT-S5660|GT-S5670|GT-S5690|GT-S5750|GT-S5780|GT-S5830|GT-S5839|GT-S6102|GT-S6500|GT-S7070|GT-S7200|GT-S7220|GT-S7230|GT-S7233|GT-S7250|GT-S7500|GT-S7530|GT-S7550|GT-S8000|GT-S8003|GT-S8500|GT-S8530|GT-S8600|SCH-A310|SCH-A530|SCH-A570|SCH-A610|SCH-A630|SCH-A650|SCH-A790|SCH-A795|SCH-A850|SCH-A870|SCH-A890|SCH-A930|SCH-A950|SCH-A970|SCH-A990|SCH-I100|SCH-I110|SCH-I400|SCH-I405|SCH-I500|SCH-I510|SCH-I515|SCH-I600|SCH-I730|SCH-I760|SCH-I770|SCH-I830|SCH-I910|SCH-I920|SCH-LC11|SCH-N150|SCH-N300|SCH-R100|SCH-R300|SCH-R351|SCH-R400|SCH-R410|SCH-T300|SCH-U310|SCH-U320|SCH-U350|SCH-U360|SCH-U365|SCH-U370|SCH-U380|SCH-U410|SCH-U430|SCH-U450|SCH-U460|SCH-U470|SCH-U490|SCH-U540|SCH-U550|SCH-U620|SCH-U640|SCH-U650|SCH-U660|SCH-U700|SCH-U740|SCH-U750|SCH-U810|SCH-U820|SCH-U900|SCH-U940|SCH-U960|SCS-26UC|SGH-A107|SGH-A117|SGH-A127|SGH-A137|SGH-A157|SGH-A167|SGH-A177|SGH-A187|SGH-A197|SGH-A227|SGH-A237|SGH-A257|SGH-A437|SGH-A517|SGH-A597|SGH-A637|SGH-A657|SGH-A667|SGH-A687|SGH-A697|SGH-A707|SGH-A717|SGH-A727|SGH-A737|SGH-A747|SGH-A767|SGH-A777|SGH-A797|SGH-A817|SGH-A827|SGH-A837|SGH-A847|SGH-A867|SGH-A877|SGH-A887|SGH-A897|SGH-A927|SGH-B100|SGH-B130|SGH-B200|SGH-B220|SGH-C100|SGH-C110|SGH-C120|SGH-C130|SGH-C140|SGH-C160|SGH-C170|SGH-C180|SGH-C200|SGH-C207|SGH-C210|SGH-C225|SGH-C230|SGH-C417|SGH-C450|SGH-D307|SGH-D347|SGH-D357|SGH-D407|SGH-D415|SGH-D780|SGH-D807|SGH-D980|SGH-E105|SGH-E200|SGH-E315|SGH-E316|SGH-E317|SGH-E335|SGH-E590|SGH-E635|SGH-E715|SGH-E890|SGH-F300|SGH-F480|SGH-I200|SGH-I300|SGH-I320|SGH-I550|SGH-I577|SGH-I600|SGH-I607|SGH-I617|SGH-I627|SGH-I637|SGH-I677|SGH-I700|SGH-I717|SGH-I727|SGH-I777|SGH-I780|SGH-I827|SGH-I847|SGH-I857|SGH-I896|SGH-I897|SGH-I900|SGH-I907|SGH-I917|SGH-I927|SGH-I937|SGH-I997|SGH-J150|SGH-J200|SGH-L170|SGH-L700|SGH-M110|SGH-M150|SGH-M200|SGH-N105|SGH-N500|SGH-N600|SGH-N620|SGH-N625|SGH-N700|SGH-N710|SGH-P107|SGH-P207|SGH-P300|SGH-P310|SGH-P520|SGH-P735|SGH-P777|SGH-Q105|SGH-R210|SGH-R220|SGH-R225|SGH-S105|SGH-S307|SGH-T109|SGH-T119|SGH-T139|SGH-T209|SGH-T219|SGH-T229|SGH-T239|SGH-T249|SGH-T259|SGH-T309|SGH-T319|SGH-T329|SGH-T339|SGH-T349|SGH-T359|SGH-T369|SGH-T379|SGH-T409|SGH-T429|SGH-T439|SGH-T459|SGH-T469|SGH-T479|SGH-T499|SGH-T509|SGH-T519|SGH-T539|SGH-T559|SGH-T589|SGH-T609|SGH-T619|SGH-T629|SGH-T639|SGH-T659|SGH-T669|SGH-T679|SGH-T709|SGH-T719|SGH-T729|SGH-T739|SGH-T746|SGH-T749|SGH-T759|SGH-T769|SGH-T809|SGH-T819|SGH-T839|SGH-T919|SGH-T929|SGH-T939|SGH-T959|SGH-T989|SGH-U100|SGH-U200|SGH-U800|SGH-V205|SGH-V206|SGH-X100|SGH-X105|SGH-X120|SGH-X140|SGH-X426|SGH-X427|SGH-X475|SGH-X495|SGH-X497|SGH-X507|SGH-X600|SGH-X610|SGH-X620|SGH-X630|SGH-X700|SGH-X820|SGH-X890|SGH-Z130|SGH-Z150|SGH-Z170|SGH-ZX10|SGH-ZX20|SHW-M110|SPH-A120|SPH-A400|SPH-A420|SPH-A460|SPH-A500|SPH-A560|SPH-A600|SPH-A620|SPH-A660|SPH-A700|SPH-A740|SPH-A760|SPH-A790|SPH-A800|SPH-A820|SPH-A840|SPH-A880|SPH-A900|SPH-A940|SPH-A960|SPH-D600|SPH-D700|SPH-D710|SPH-D720|SPH-I300|SPH-I325|SPH-I330|SPH-I350|SPH-I500|SPH-I600|SPH-I700|SPH-L700|SPH-M100|SPH-M220|SPH-M240|SPH-M300|SPH-M305|SPH-M320|SPH-M330|SPH-M350|SPH-M360|SPH-M370|SPH-M380|SPH-M510|SPH-M540|SPH-M550|SPH-M560|SPH-M570|SPH-M580|SPH-M610|SPH-M620|SPH-M630|SPH-M800|SPH-M810|SPH-M850|SPH-M900|SPH-M910|SPH-M920|SPH-M930|SPH-N100|SPH-N200|SPH-N240|SPH-N300|SPH-N400|SPH-Z400|SWC-E100',
                identity: 'Samsung Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'E10i|SonyEricsson|SonyEricssonLT15iv',
                identity: 'Sony Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'Asus.*Galaxy',
                identity: 'ASUS Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'PalmSource|Palm',
                identity: 'Palm Phone'
            },
            {
                string: _navigator.userAgent,
                subString: 'Vertu|Vertu.*Ltd|Vertu.*Ascent|Vertu.*Ayxta|Vertu.*Constellation(F|Quest)?|Vertu.*Monika|Vertu.*Signature',
                identity: 'Vertu Phone'
            },
            {
                string: _navigator.userAgent,
                subString: '(mmp|pocket|psp|symbian|Smartphone|smartfon|treo|up.browser|up.link|vodafone|wap|nokia|Series40|Series60|S60|SonyEricsson|N900|PPC;|MAUI.*WAP.*Browser|LG-P500)',
                identity: 'Phone' // Generic Phone
            }
        ]

    };

    BrowserDetect.init();

    $.client = { os : BrowserDetect.OS, browser : BrowserDetect.browser, version : BrowserDetect.version.toString(), versionRange : BrowserDetect.versionRange.toString(), userAgent : BrowserDetect.userAgent, vendor : BrowserDetect.vendor, platform : BrowserDetect.platform, device : BrowserDetect.device };

}(jQuery);
/**
* ua-sniffer-decorator.js for Web Skin
*
* This script decorates the <html> DOM element with
* CSS classes that contain information parsed from the user-agent string
*/

+function($) {

    // decorate the <html> tag
    // with browser / OS detection classes
    // provided by ua-sniffer.js
    var _brPrefix = 'ua-';
    var _osPrefix = 'os-';
    var _rangePrefix = 'lt-';
    var _client = $.client;

    var $uaBrowser = _client.browser;
    var $uaBrowserVersion = _client.version;
    var $uaBrowserVersionRange = _client.versionRange;
    var $uaOS = _client.os;
    var $uaDevice = _client.device;

    var $ua = _client.userAgent;
    var $vendor = _client.vendor;
    var $platform = _client.platform;

    var expandVersionRanges = function (minRange) {
        // since, for example, MSIE 8 is "less than" 9, it is also "less than" 10, 11, etc...
        // so we need to ensure that we provide an appropriate range so that individual CSS classes like
        // .ua-ie8, .ua-ie9, .ua-ie10 are all required to satisfy Web Skin's IE mixin
        // that uses an argument like @include ie('<11')
        minRange = parseInt(minRange);

        var rangeVersions = [
            minRange,
            minRange + 1,
            minRange + 2,
            minRange + 3,
            minRange + 4,
            minRange + 5
        ];

        var buildHtmlRangeClass = function (rangeVersion) {
            return _brPrefix + _rangePrefix + $uaBrowser + rangeVersion + ' ';
        };

        var rangeVersionClasses = '';

        for (var range in rangeVersions) {
            rangeVersionClasses += buildHtmlRangeClass(rangeVersions[range]);
        }

        return rangeVersionClasses;
    };

    // Uncomment this for debuggin
    // var debugMsg = "You are using " + $uaBrowser + $uaBrowserVersion + " with " + $uaOS + " running on a " + $uaDevice;
    // var debugXtra = "UA: " + $ua + "\n" + "vendor: " + $vendor + "\n" + "platform: " + $platform;
    // console.log(debugMsg);
    // console.log(debugXtra);
    var htmlClass = _brPrefix + $uaBrowser + ' ' +
                    _brPrefix + $uaBrowser + $uaBrowserVersion + ' ' +
                    expandVersionRanges($uaBrowserVersionRange) +
                    _osPrefix + $uaOS + ' ' +
                    $uaDevice + ' ';

    $('html').addClass(htmlClass.toLowerCase());

}(jQuery);

/*
HTML5 Number polyfill | Jonathan Stipe | https://github.com/jonstipe/number-polyfill
 */

(function() {
  (function($) {

    /*
    OPTIONS
     */
    var i, numberPolyfill, options;
    options = {
      isDisabled: false,
      inputClass: "form-control",
      btnClass: "btn",
      btnUpContent: "<i class='caret caret-up' />",
      btnDownContent: "<i class='caret caret-down' />"
    };
    
    if (typeof Modernizr === 'undefined') {
        throw new Error('number-polyfill.js requires Modernizr');
    }
    
    if (Modernizr && !Modernizr.inputtypes.number) {
      $.fn.inputNumber = function() {
        $(this).filter(function() {
          var $this;
          $this = $(this);
          return $this.is('input[type="number"]') && !($this.parent().is("span") && $this.next().is("div.number-spin-btn-container") && $this.next().children().first().is("div.number-spin-btn-up") && $this.next().children().eq(1).is("div.number-spin-btn-down"));
        }).each(function() {
          var disabledClass;
          options.isDisabled = $(this).is(':disabled');
          disabledClass = ' ';
          if (options.isDisabled) {
            disabledClass = ' disabled ';
          }
          options.btnClass += disabledClass;
          numberPolyfill.polyfills.push(new numberPolyfill(this, options));
        });
        return $(this);
      };
      numberPolyfill = function(elem, options) {
        var $fieldContainer, MutationObserver, attrObserver, halfHeight;
        this.elem = $(elem);
        this.options = options;
        if (!(this.elem.is(":root *") && this.elem.height() > 0)) {
          throw new Error("Element must be in DOM and displayed so that its height can be measured.");
        }
        halfHeight = (this.elem.outerHeight() / 2) + 'px';
        this.elem.addClass('number-polyfill');
        this.upBtn = $('<div/>', {
          "class": this.options.btnClass + ' number-spin-btn number-spin-btn-up',
          style: "height: " + halfHeight
        });
        this.downBtn = $('<div/>', {
          "class": this.options.btnClass + ' number-spin-btn number-spin-btn-down',
          style: "height: " + halfHeight
        });
        this.btnContainer = $('<div/>', {
          "class": 'number-spin-btn-container'
        });
        $fieldContainer = $('<span/>', {
          style: "white-space: nowrap"
        });
        this.upBtn.appendTo(this.btnContainer);
        this.downBtn.appendTo(this.btnContainer);
        $(this.options.btnUpContent).appendTo(this.upBtn);
        $(this.options.btnDownContent).appendTo(this.downBtn);
        this.elem.wrap($fieldContainer);
        this.btnContainer.insertAfter(this.elem);
        this.elem.on({
          focus: (function(_this) {
            return function(e) {
              _this.elem.on({
                DOMMouseScroll: numberPolyfill.domMouseScrollHandler,
                mousewheel: numberPolyfill.mouseWheelHandler
              }, {
                p: _this
              });
            };
          })(this),
          blur: (function(_this) {
            return function(e) {
              _this.elem.off({
                DOMMouseScroll: numberPolyfill.domMouseScrollHandler,
                mousewheel: numberPolyfill.mouseWheelHandler
              });
            };
          })(this)
        });
        this.elem.on({
          keypress: numberPolyfill.elemKeypressHandler,
          change: numberPolyfill.elemChangeHandler
        }, {
          p: this
        });
        this.upBtn.on("mousedown", {
          p: this,
          func: "increment"
        }, numberPolyfill.elemBtnMousedownHandler);
        this.downBtn.on("mousedown", {
          p: this,
          func: "decrement"
        }, numberPolyfill.elemBtnMousedownHandler);
        this.elem.css("textAlign", 'right');
        this.attrMutationHandler("class");
        if ((typeof WebKitMutationObserver !== "undefined" && WebKitMutationObserver !== null) || (typeof MutationObserver !== "undefined" && MutationObserver !== null)) {
          if ((typeof WebKitMutationObserver !== "undefined" && WebKitMutationObserver !== null) && (typeof MutationObserver === "undefined" || MutationObserver === null)) {
            MutationObserver = WebKitMutationObserver;
          }
          attrObserver = new MutationObserver((function(_this) {
            return function(mutations, observer) {
              var mutation, _i, _len;
              for (_i = 0, _len = mutations.length; _i < _len; _i++) {
                mutation = mutations[_i];
                if (mutation.type === "attributes") {
                  _this.attrMutationHandler(mutation.attributeName, mutation.oldValue, _this.elem.attr(mutation.attributeName));
                }
              }
            };
          })(this));
          attrObserver.observe(elem, {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ["class", "style", "min", "max", "step"]
          });
        } else if (typeof MutationEvent !== "undefined" && MutationEvent !== null) {
          this.elem.on("DOMAttrModified", (function(_this) {
            return function(evt) {
              _this.attrMutationHandler(evt.originalEvent.attrName, evt.originalEvent.prevValue, evt.originalEvent.newValue);
            };
          })(this));
        }
      };
      numberPolyfill.polyfills = [];
      numberPolyfill.isNumber = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+(?:\.\d+)?$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isFloat = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+\.\d+$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isInt = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-?\d+$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.isNegative = function(input) {
        if ((input != null) && typeof input.toString === "function") {
          return /^-\d+(?:\.\d+)?$/.test(input.toString());
        } else {
          return false;
        }
      };
      numberPolyfill.raiseNum = function(num) {
        var a, numi, nump;
        if (typeof num === "number" || (typeof num === "object" && num instanceof Number)) {
          if (num % 1) {
            return {
              num: num.toString(),
              precision: 0
            };
          } else {
            return numberPolyfill.raiseNum(num.toString());
          }
        } else if (typeof num === "string" || (typeof num === "object" && num instanceof String)) {
          if (numberPolyfill.isFloat(num)) {
            num = num.replace(/(\.\d)0+$/, "$1");
            nump = numberPolyfill.getPrecision(num);
            numi = num.slice(0, -(nump + 1)) + num.slice(-nump);
            numi = numi.replace(/^(-?)0+(\d+)/, "$1$2");
            a = {
              num: numi,
              precision: nump
            };
            return a;
          } else if (numberPolyfill.isInt(num)) {
            return {
              num: num,
              precision: 0
            };
          }
        }
      };
      numberPolyfill.raiseNumPrecision = function(rNum, newPrecision) {
        var _i, _ref;
        if (rNum.precision < newPrecision) {
          for (i = _i = _ref = rNum.precision; _ref <= newPrecision ? _i < newPrecision : _i > newPrecision; i = _ref <= newPrecision ? ++_i : --_i) {
            rNum.num += "0";
          }
          rNum.precision = newPrecision;
        }
      };
      numberPolyfill.lowerNum = function(num) {
        if (num.precision > 0) {
          while (num.num.length < (num.precision + 1)) {
            if (numberPolyfill.isNegative(num.num)) {
              num.num = num.num.slice(0, 1) + "0" + num.num.slice(1);
            } else {
              num.num = "0" + num.num;
            }
          }
          return (num.num.slice(0, -num.precision) + "." + num.num.slice(-num.precision)).replace(/\.?0+$/, '').replace(/^(-?)(\.)/, "$10$2");
        } else {
          return num.num;
        }
      };
      numberPolyfill.preciseAdd = function(num1, num2) {
        var num1i, num2i, result;
        if ((typeof num1 === "number" || (typeof num1 === "object" && num1 instanceof Number)) && (typeof num2 === "number" || (typeof num2 === "object" && num2 instanceof Number))) {
          if (num1 % 1 === 0 && num2 % 1 === 0) {
            return (num1 + num2).toString();
          } else {
            return numberPolyfill.preciseAdd(num1.toString(), num2.toString());
          }
        } else if ((typeof num1 === "string" || (typeof num1 === "object" && num1 instanceof String)) && (typeof num2 === "string" || (typeof num2 === "object" && num2 instanceof String))) {
          if (numberPolyfill.isNumber(num1)) {
            if (numberPolyfill.isNumber(num2)) {
              if (numberPolyfill.isInt(num1)) {
                if (numberPolyfill.isInt(num2)) {
                  return numberPolyfill.preciseAdd(parseInt(num1, 10), parseInt(num2, 10));
                } else if (numberPolyfill.isFloat(num2)) {
                  num1 += ".0";
                }
              } else if (numberPolyfill.isFloat(num1)) {
                if (numberPolyfill.isInt(num2)) {
                  num2 += ".0";
                }
              }
              num1i = numberPolyfill.raiseNum(num1);
              num2i = numberPolyfill.raiseNum(num2);
              if (num1i.precision < num2i.precision) {
                numberPolyfill.raiseNumPrecision(num1i, num2i.precision);
              } else if (num1i.precision > num2i.precision) {
                numberPolyfill.raiseNumPrecision(num2i, num1i.precision);
              }
              result = (parseInt(num1i.num, 10) + parseInt(num2i.num, 10)).toString();
              if (num1i.precision > 0) {
                if (numberPolyfill.isNegative(result)) {
                  while (num1i.precision > (result.length - 1)) {
                    result = "-0" + result.slice(1);
                  }
                } else {
                  while (num1i.precision > result.length) {
                    result = "0" + result;
                  }
                }
                result = numberPolyfill.lowerNum({
                  num: result,
                  precision: num1i.precision
                });
              }
              result = result.replace(/^(-?)\./, '$10.');
              if (numberPolyfill.isFloat(result)) {
                result = result.replace(/0+$/, '');
              }
              return result;
            } else {
              throw new SyntaxError("Argument \"" + num2 + "\" is not a number.");
            }
          } else {
            throw new SyntaxError("Argument \"" + num1 + "\" is not a number.");
          }
        } else {
          return numberPolyfill.preciseAdd(num1.toString(), num2.toString());
        }
      };
      numberPolyfill.preciseSubtract = function(num1, num2) {
        if (typeof num2 === "number" || (typeof num2 === "object" && num2 instanceof Number)) {
          return numberPolyfill.preciseAdd(num1, -num2);
        } else if (typeof num2 === "string" || (typeof num2 === "object" && num2 instanceof String)) {
          if (numberPolyfill.isNegative(num2)) {
            return numberPolyfill.preciseAdd(num1, num2.slice(1));
          } else {
            return numberPolyfill.preciseAdd(num1, "-" + num2);
          }
        }
      };
      numberPolyfill.getPrecision = function(num) {
        var k, kNum;
        if (typeof num === "number") {
          k = 0;
          kNum = num;
          while (kNum !== Math.floor(kNum)) {
            kNum = num * Math.pow(10, ++k);
          }
          return k;
        } else if (typeof num === "string") {
          if (numberPolyfill.isNumber(num)) {
            if (numberPolyfill.isFloat(num)) {
              return /^-?\d+(?:\.(\d+))?$/.exec(num)[1].length;
            } else {
              return 0;
            }
          }
        }
      };
      numberPolyfill.prototype.getParams = function() {
        var max, min, step, val;
        step = this.elem.attr('step');
        min = this.elem.attr('min');
        max = this.elem.attr('max');
        val = this.elem.val();
        if (!numberPolyfill.isNumber(step)) {
          step = null;
        }
        if (!numberPolyfill.isNumber(min)) {
          min = null;
        }
        if (!numberPolyfill.isNumber(max)) {
          max = null;
        }
        if (!numberPolyfill.isNumber(val)) {
          val = min || 0;
        }
        return {
          min: (min != null) ? min : null,
          max: (max != null) ? max : null,
          step: (step != null) ? step : "1",
          val: (val != null) ? val : null
        };
      };
      numberPolyfill.prototype.clipValues = function(value, min, max) {
        if ((max != null) && parseFloat(value) > parseFloat(max)) {
          return max;
        } else if ((min != null) && parseFloat(value) < parseFloat(min)) {
          return min;
        } else {
          return value;
        }
      };
      numberPolyfill.prototype.stepNormalize = function(value) {
        var cValue, min, params, sn, step;
        params = this.getParams();
        step = params['step'];
        min = params['min'];
        if (step == null) {
          return value;
        } else {
          step = numberPolyfill.raiseNum(step);
          cValue = numberPolyfill.raiseNum(value);
          if (cValue.precision > step.precision) {
            numberPolyfill.raiseNumPrecision(step, cValue.precision);
          } else if (cValue.precision < step.precision) {
            numberPolyfill.raiseNumPrecision(cValue, step.precision);
          }
          if (min != null) {
            cValue = numberPolyfill.raiseNum(numberPolyfill.preciseSubtract(value, min));
            numberPolyfill.raiseNumPrecision(cValue, step.precision);
          }
          if (parseFloat(cValue.num) % parseFloat(step.num) === 0) {
            return value;
          } else {
            cValue = numberPolyfill.lowerNum({
              num: (Math.round(parseFloat(cValue.num) / (sn = parseFloat(step.num))) * sn).toString(),
              precision: cValue.precision
            });
            if (min != null) {
              cValue = numberPolyfill.preciseAdd(cValue, min);
            }
            return cValue;
          }
        }
      };
      numberPolyfill.domMouseScrollHandler = function(evt) {
        var p;
        p = evt.data.p;
        evt.preventDefault();
        if (evt.originalEvent.detail < 0) {
          p.increment();
        } else {
          p.decrement();
        }
      };
      numberPolyfill.mouseWheelHandler = function(evt) {
        var p;
        p = evt.data.p;
        evt.preventDefault();
        if (evt.originalEvent.wheelDelta > 0) {
          p.increment();
        } else {
          p.decrement();
        }
      };
      numberPolyfill.elemKeypressHandler = function(evt) {
        var p, _ref, _ref1;
        p = evt.data.p;
        if (evt.keyCode === 38) {
          p.increment();
        } else if (evt.keyCode === 40) {
          p.decrement();
        } else if (((_ref = evt.keyCode) !== 8 && _ref !== 9 && _ref !== 35 && _ref !== 36 && _ref !== 37 && _ref !== 39 && _ref !== 46) && ((_ref1 = evt.which) !== 45 && _ref1 !== 48 && _ref1 !== 49 && _ref1 !== 50 && _ref1 !== 51 && _ref1 !== 52 && _ref1 !== 53 && _ref1 !== 54 && _ref1 !== 55 && _ref1 !== 56 && _ref1 !== 57)) {
          evt.preventDefault();
        }
      };
      numberPolyfill.elemChangeHandler = function(evt) {
        var min, newVal, p, params;
        p = evt.data.p;
        if (numberPolyfill.isNumber(p.elem.val())) {
          params = p.getParams();
          newVal = p.clipValues(params['val'], params['min'], params['max']);
          newVal = p.stepNormalize(newVal);
          if (newVal.toString() !== p.elem.val()) {
            p.elem.val(newVal).change();
          }
        } else {
          min = p.elem.attr('min');
          p.elem.val((min != null) && numberPolyfill.isNumber(min) ? min : "0").change();
        }
      };
      numberPolyfill.elemBtnMousedownHandler = function(evt) {
        var func, p, releaseFunc, timeoutFunc;
        p = evt.data.p;
        func = evt.data.func;
        p[func]();
        timeoutFunc = (function(_this) {
          return function(incFunc) {
            p[func]();
            p.timeoutID = window.setTimeout(timeoutFunc, 10);
          };
        })(this);
        releaseFunc = (function(_this) {
          return function(e) {
            window.clearTimeout(p.timeoutID);
            $(document).off('mouseup', releaseFunc);
            $(_this).off('mouseleave', releaseFunc);
          };
        })(this);
        $(document).on('mouseup', releaseFunc);
        $(this).on('mouseleave', releaseFunc);
        p.timeoutID = window.setTimeout(timeoutFunc, 700);
      };
      numberPolyfill.prototype.attrMutationHandler = function(name, oldValue, newValue) {
        var ei, h, _i, _len, _ref;
        if (name === "class" || name === "style") {
          h = {};
          ei = null;
          _ref = ["opacity", "visibility", "-moz-transition-property", "-moz-transition-duration", "-moz-transition-timing-function", "-moz-transition-delay", "-webkit-transition-property", "-webkit-transition-duration", "-webkit-transition-timing-function", "-webkit-transition-delay", "-o-transition-property", "-o-transition-duration", "-o-transition-timing-function", "-o-transition-delay", "transition-property", "transition-duration", "transition-timing-function", "transition-delay"];
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            i = _ref[_i];
            if ((ei = this.elem.css(i)) !== this.btnContainer.css(i)) {
              h[i] = ei;
            }
          }
          if (this.elem.css("display") === "none") {
            h["display"] = "none";
          } else {
            h["display"] = "inline-block";
          }
          this.btnContainer.css(h);
        } else if (name === "min" || name === "max" || name === "step") {
          this.elem.change();
        }
      };
      numberPolyfill.prototype.increment = function() {
        var newVal, params;
        if (!this.elem.is(":disabled")) {
          params = this.getParams();
          newVal = numberPolyfill.preciseAdd(params['val'], params['step']);
          if ((params['max'] != null) && parseFloat(newVal) > parseFloat(params['max'])) {
            newVal = params['max'];
          }
          newVal = this.stepNormalize(newVal);
          this.elem.val(newVal).change();
        }
      };
      numberPolyfill.prototype.decrement = function() {
        var newVal, params;
        if (!this.elem.is(":disabled")) {
          params = this.getParams();
          newVal = numberPolyfill.preciseSubtract(params['val'], params['step']);
          if ((params['min'] != null) && parseFloat(newVal) < parseFloat(params['min'])) {
            newVal = params['min'];
          }
          newVal = this.stepNormalize(newVal);
          this.elem.val(newVal).change();
        }
      };
    } else {
      $.fn.inputNumber = function() {
        return $(this);
      };
      return;
    }
    $(function() {
      $('input[type="number"]').inputNumber();
    });
  })(jQuery);

}).call(this);

/*!
 * Form Input HTML5 Placeholder Behavior Shim
 * by Aaron Lademann <aaron.lademann@workiva.com>
 *
 * WHY?
 *   1. Existing shims like jquery.placeholder implement a shim only
 *      if the browser has no support for the placeholder attribute.
 *      However, MSIE 10+ supports the placeholder attriute, yet it's
 *      behavior when focused is not compliant with the HTML5
 *      placeholder specificiation.
 *   2. MSIE 9 and below can be shimmed using jquery.placeholder,
 *      however the plugin reproduces the MSIE placeholder behavior,
 *      which IE Developers have acknowledged is incorrect.
 *      (@see https://twitter.com/deltakosh/status/479698349906333696)
 *
 * @requires jquery
 * @requires ua-sniffer.js
 */

+function (window, document, $) {

    'use strict';



    // -------------------------------------
    //   PLACEHOLDER CLASS DEFINITION
    // -------------------------------------

    var Placeholder = function(element, options) {
        var that = this;

        this.element = element;
        this.options = options;
        this.isInitialized = false;
        // so we can track value after a `keydown` to
        // prevent duplicate event broadcast again on `change`
        this.checkedVal = null;

        this.$form = $(element.form);
        this.$element = $(element);
        this.elementPlaceholder = this.$element.attr('placeholder');

        this.$element
            .on('focus.wdesk.placeholder',   $.proxy(this.setCaret, this))
            .on('drop.wdesk.placeholder',    $.proxy(this.setCaret, this))
            .on('click.wdesk.placeholder',   $.proxy(this.setCaret, this))
            .on('keydown.wdesk.placeholder', $.proxy(this.clear, this))
            .on('change.wdesk.placeholder',  $.proxy(this.checkNewValue, this))
            .on('keyup.wdesk.placeholder',   $.proxy(this.restore, this))
            .on('blur.wdesk.placeholder',    $.proxy(this.restore, this));

        this.$form
            .on('submit.wdesk.placeholder', $.proxy(this.clearPlaceholderBeforeSubmit, this));

        this.init();
    };



    // -------------------------------------
    //   PLACEHOLDER CLASS DEFAULTS
    // -------------------------------------

    Placeholder.DEFAULTS = {
        className: 'placeholder',
        // where to store the placeholder value after we remove the placeholder attribute
        replacementAttr: 'data-placeholder'
    };



    // -------------------------------------
    //   PLACEHOLDER KEYCODE CONSTANTS
    // -------------------------------------

    Placeholder.nonInputKeyCodes = [
        0, 38, 39, 40, 37, 17, 18, 91, 27, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121
    ];

    Placeholder.directionArrowKeyCodes = [
        40, 39, 37, 38
    ];


    // -------------------------------------
    //   PLACEHOLDER VAL() HOOKS
    //
    //   -> Customize getters and setters
    //      for the jQuery .val() method
    // -------------------------------------

    Placeholder.HOOKS = {
        'get': function(element) {
            var $element = $(element),
                data = $element.data('wdesk.placeholder');

            //
            // ensure that anyone requesting the value of the input
            // via .val() gets '' instead of the placeholder value
            //
            if (data && element.value === $element.attr(data.options.replacementAttr)) {
                if ($element.hasClass(data.options.className)) {
                    return '';
                } else {
                    return element.value;
                }
            }
        },
        'set': function(element, value) {
            var $element = $(element),
                data = $element.data('wdesk.placeholder');

            element.value = value;

            if (data && data.isInitialized) {
                //
                // ensure that placeholder logic knows to check the new value
                // since the change event is not fired by default when the value
                // of a form element is changed programatically.
                //
                $element.trigger('change.wdesk.placeholder');
            }

            return element.value;
        }
    };



    // -------------------------------------
    //   PLACEHOLDER REQUIREMENT CHECKS
    // -------------------------------------

    if (typeof $.client === 'undefined') {
        throw new Error('placeholder-behavior.js requires ua-sniffer.js');
    }

    if (typeof jQuery === 'undefined') {
        throw new Error('placeholder-behavior.js requires jQuery');
    }



    // -------------------------------------
    //   LOCAL HELPER VARS / METHODS
    // -------------------------------------

    var _isValidInputCharacter = function(keyCode) {
        // If we don't check for this, and allow the rest of the
        // clear / restore methods to execute, our inputs will
        // "flicker" when these keystrokes are made
        return Placeholder.nonInputKeyCodes.indexOf(keyCode) < 0;
    };

    var _isDirectionArrowKey = function(keyCode) {
        // If we don't check for this, and allow the rest of the
        // clear / restore methods to execute, our inputs will
        // give away our little secret - that the value that
        // looks like a placeholder is actually the value of the field
        return Placeholder.directionArrowKeyCodes.indexOf(keyCode) > -1;
    };


    // -------------------------------------
    //   PLACEHOLDER CLASS METHODS
    // -------------------------------------

    Placeholder.prototype.init = function() {
        this.$element.trigger('beforeInit.wdesk.placeholder'); // for unit testing

        this.getOptions();

        this.$element
            .attr(this.options.replacementAttr, this.elementPlaceholder)
            .removeAttr('placeholder');

        if (this.element.value === '') {
            this.$element
                .addClass(this.options.className)
                .val(this.elementPlaceholder);

            this.convertToTextInputType();
        } else {
            this.$element.removeClass(this.options.className);
        }

        if (this.element.type === 'password') {
            this.$element.attr('data-original-type', 'password');
        }

        this.isInitialized = true;

        this.$element.trigger('ready.wdesk.placeholder');
    };

    Placeholder.prototype.getDefaults = function() {
        return Placeholder.DEFAULTS;
    };

    Placeholder.prototype.getOptions = function(options) {
        var _options = options ? options : this.options;
        return this.options = $.extend({}, this.getDefaults(), this.$element.data(), _options);
    };

    Placeholder.prototype.isElementShimmed = function() {
        return this.$element.hasClass(this.options.className);
    };

    Placeholder.prototype.elementValPlaceholderMatch = function() {
        return this.element.value === this.$element.attr(this.options.replacementAttr);
    };

    Placeholder.prototype.convertToTextInputType = function() {
        if (this.element.type === 'password') {
            this.$element.attr('data-original-type', 'password');

            if (this.elementValPlaceholderMatch()) {
                try {
                    this.element.type = 'text';
                } catch(err) {
                    // Thanks MSIE 8!!!
                }
            }
        }
    };

    Placeholder.prototype.clearPlaceholderBeforeSubmit = function(event) {
        var that = this;

        if (this.elementValPlaceholderMatch() && this.isElementShimmed()) {
            this.$element.val('');
        }
    };

    Placeholder.prototype.setCaret = function(event) {
        if (this.elementValPlaceholderMatch() && this.isElementShimmed()) {
            try {
                this.element.setSelectionRange(0, 0);
            } catch(err) {
                // Thanks MSIE 8!!!
            }

            if (event) {
                event.preventDefault();
                event.stopPropagation();
            }

            return false;
        }
    };

    Placeholder.prototype.checkNewValue = function(event) {
        if (!event.originalEvent) {
            // When change event is fired via our custom
            // jQuery.valHooks setter, we need to check the
            // value that was set to determine whether the
            // placeholder should be added or removed

            var newValue = this.element.value,
                _event = event;

            if (newValue !== this.checkedVal) {
                // only call the associated method once by checking
                // if the value has changed since the event last fired
                // so that duplicate events are not fired in either
                // clear or restore methods
                if (newValue === '') {
                    this.restore(_event);
                } else {
                    this.clear(_event);
                }
            }

            this.checkedVal = newValue;
        } else {
            // change event was not triggered by us - it was the
            // side-affect of another event that we're already subscribed to.
        }
    };

    Placeholder.prototype.clear = function(event) {
        var keyCode = event ? event.keyCode : 0;
        var backspaceKeypress = event ? keyCode === 8 : false;
        var tabKeypress = event ? keyCode === 9 : false;
        var shiftKeypress = event ? (event.shiftKey && keyCode === 16) : false;
        var eventType = event ? event.type : false;

        // If its a direction arrow keypress, we need to make the
        // caret not move like it would if there were actually a value in the field
        if (_isDirectionArrowKey(keyCode) && this.$element.val() === '') {
            event.preventDefault();
        }

        if (!shiftKeypress && !tabKeypress && !backspaceKeypress && _isValidInputCharacter(keyCode)) {
            if ((this.elementValPlaceholderMatch() || eventType === 'change') && this.isElementShimmed()) {

                // Must change the element type before changing the value
                if (this.$element.attr('data-original-type') === 'password') {
                    try {
                        this.element.type = 'password';
                    } catch(err) {
                        // Thanks MSIE 8!!!
                    }
                }

                if (eventType && eventType !== 'change') {
                    // value change was NOT triggered programatically
                    this.element.value = '';
                }

                this.$element.removeClass(this.options.className);

                this.$element.trigger($.Event('cleared.wdesk.placeholder', { relatedEvent: event }));
            }
        }
    };

    Placeholder.prototype.restore = function(event) {
        var keyCode = event ? event.keyCode : 0;

        if (this.element.value === '' && _isValidInputCharacter(keyCode)) {
            this.$element
                .val(this.$element.attr(this.options.replacementAttr))
                .addClass(this.options.className);

            this.setCaret(event);
            this.convertToTextInputType();

            this.$element.trigger($.Event('restored.wdesk.placeholder', { relatedEvent: event }));
        }
    };



    // -------------------------------------
    //   PLACEHOLDER PLUGIN DEFINITION
    // -------------------------------------

    function Plugin(option) {
        return this.each(function() {
            var $this = $(this),
                data  = $this.data('wdesk.placeholder'),
                options = typeof option == 'object' && option;

            if (!data) {
                $this.data('wdesk.placeholder', (data = new Placeholder(this, options)));
            }

            if (typeof option == 'string' && option !== 'init') {
                data[option]();
            }
        });
    }

    var old = $.fn.placeholder;

    $.fn.placeholder             = Plugin;
    $.fn.placeholder.Constructor = Placeholder;



    // -------------------------------------
    //   PLACEHOLDER NO CONFLICT
    // -------------------------------------

    $.fn.placeholder.noConflict = function() {
        $.fn.placeholder = old;
        return this;
    };



    // -------------------------------------
    //   PLACEHOLDER DOM INSTANTIATION
    //
    //   -> Shim inputs/textareas based on
    //      support when the page loads
    // -------------------------------------

    $(document).ready(function() {
        var isMSIE                          = $.mockBrowser === 'IE' || $.client.browser === 'IE',
            isMSIElt9                       = $.mockBrowserVersion < 9 || parseInt($.client.version) < 9,
            isInputPlaceholderSupported     = isMSIE ? false : 'placeholder' in document.createElement('input'),
            isTextareaPlaceholderSupported  = isMSIE ? false : 'placeholder' in document.createElement('textarea'),
            elementsToShimSelector          = '',
            targetSelector                  = '[placeholder]';


        if (!isInputPlaceholderSupported) {
            $.valHooks.input = Placeholder.HOOKS;
            elementsToShimSelector = 'input' + targetSelector;
        }
        if (!isTextareaPlaceholderSupported) {
            $.valHooks.textarea = Placeholder.HOOKS;
            elementsToShimSelector += (isInputPlaceholderSupported ? '' : ', ') + 'textarea' + targetSelector;
        }

        var $dataPlaceholders = $(elementsToShimSelector);


        if ($dataPlaceholders.length > 0) {
            if (!isMSIElt9) {
                Plugin.call($dataPlaceholders, 'init');
            } else {
                // MSIE 8 and below
                // uses the old jquery.placeholder stuff
                // since you cannot change the type of an input
                $dataPlaceholders.placeholderMSIElt9();
            }
        }
    });



    // -----------------------------------------
    //   CLEAR PLACEHOLDERS BEFORE PAGE RELOAD
    // -----------------------------------------

    $(window).on('beforeunload.wdesk.placeholder', function() {
        $('[data-placeholder]').val('');
    });

}(this, document, jQuery);
