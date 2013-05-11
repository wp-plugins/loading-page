(function ($) {
    /*Browser detection patch*/
    var browser = {};
    browser.mozilla = /mozilla/.test(navigator.userAgent.toLowerCase()) && !/webkit/.test(navigator.userAgent.toLowerCase());
    browser.webkit = /webkit/.test(navigator.userAgent.toLowerCase());
    browser.opera = /opera/.test(navigator.userAgent.toLowerCase());
    browser.msie = /msie/.test(navigator.userAgent.toLowerCase());
	
    if (!Array.prototype.indexOf){
	   Array.prototype.indexOf = function(elt /*, from*/){
         var len  = this.length >>> 0;
         var from = Number(arguments[1]) || 0;
             from = (from < 0)
                  ? Math.ceil(from)
                  : Math.floor(from);
         if (from < 0)
             from += len;

             for (; from < len; from++)
                 {
                 if (from in this &&
                 this[from] === elt)
                 return from;
                 }
         return -1;
       };
    }
    
    // Defining namespace
    $.loadingpage = $.loadingpage || {};

    var lp      = $.loadingpage, // Namespace shortcut
        // Global variables
        
        // Lazy load variables
        $window = $(window),
        
        // Loading page variables
        images = new Array,
        done = 0,
        destroyed = false,
        imageContainer = "",
        imageCounter = 0,
        start = 0,
            
        // Default options
        
        default_options = {
            // Options for lazy load
            threshold: 100,
            effect: "show",
            effectspeed: 0,
            
            // Options for loading page
            loadingScreen: true,
            graphic : 'bar',
            onComplete: function () {}, // callback for loading page complete
            backgroundColor: "#000",
            foregroundColor: "#fff",
            text: true,
            deepSearch: true
        },
        
        options; // Default options extended with values passed as parameters
        
    
    // Methods used in loading page
    lp.onLoadComplete = function () {
        lp.graphics[options.graphic].complete(function(){options.onComplete});
    };
    
    lp.afterEach = function () {
        //start timer
        var currentTime = new Date();
        start = currentTime.getTime();

        lp.createPreloadContainer();
        lp.createOverlayLoader();
    };

    lp.createPreloadContainer = function() {
        imageContainer = $("<div></div>").appendTo("body").css({
            display: "none",
            width: 0,
            height: 0,
            overflow: "hidden"
        });
        
        for (var i = 0; images.length > i; i++) {
            $.ajax({
                url: images[i],
                type: 'HEAD',
                complete: function(data) {
                    if(!destroyed && data.status==200){
                        imageCounter++;
                        lp.addImageForPreload(this['url']);
                    }
                }
            });
        }        	

    };
    
    lp.addImageForPreload = function(url) {
        var image = $("<img />").attr("src", url).bind("load", function () {
            lp.completeImageLoading();
        }).appendTo(imageContainer);
    };

    lp.completeImageLoading = function () {
        done++;

        var percentage = (done / imageCounter) * 100;
        lp.graphics[options.graphic].set(percentage);
        
        if (done == imageCounter) {
            lp.destroyLoader();
        }
    };

    lp.destroyLoader = function () {
        $(imageContainer).remove();
        lp.onLoadComplete();
        destroyed = true;
    };

    lp.createOverlayLoader = function () {
        lp.graphics[options.graphic].create(options);    
        if ( !images.length) {
        	lp.destroyLoader()
        }
    };
    
    lp.findImageInElement = function (element) {
        var url = "";

        if ($(element).css("background-image") != "none") {
            var url = $(element).css("background-image");
        } else if (typeof($(element).attr("src")) != "undefined" && element.nodeName.toLowerCase() == "img") {
            var url = $(element).attr("src");
        }

        if (url.indexOf("gradient") == -1) {
            url = url.replace(/url\(\"/g, "");
            url = url.replace(/url\(/g, "");
            url = url.replace(/\"\)/g, "");
            url = url.replace(/\)/g, "");

            var urls = url.split(", ");

            for (var i = 0; i < urls.length; i++) {
                if (urls[i].length > 0 && images.indexOf(urls[i]) == -1) {
                    var extra = "";
                    if (browser.msie && browser.version < 9) {
                        extra = "?" + Math.floor(Math.random() * 3000);
                    }
                    images.push(urls[i] + extra);
                }
            }
        }
    };
    
    
    
    $.fn.loadingpage = function(o){
        options = $.extend(
            default_options, o || {}
        );
        
        // loading page
        if(options['loadingScreen']){
            this.each(function() {
                lp.findImageInElement(this);
                if (options.deepSearch == true) {
                    $(this).find("*:not(script)").each(function() {
                        lp.findImageInElement(this);
                    });
                }
            });

            lp.afterEach();
        }    
        return this;
    };

})(jQuery);