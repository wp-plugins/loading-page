(function ($) {

    $.loadingpage = $.loadingpage || {};
    $.loadingpage.graphics = $.loadingpage.graphics || {};

    $.loadingpage.graphics['bar'] = {
        attr   : {},
        create : function(options){
            options.backgroundColor = options.backgroundColor || "#000000";
            options.height          = options.height || 1;
            options.foregroundColor = options.foregroundColor || "#FFFFFF";
            
            this.attr['overlay'] = $("<div></div>").css({
                width: "100%",
                height: "100%",
                backgroundColor: options.backgroundColor,
                backgroundPosition: "fixed",
                position: "fixed",
                zIndex: 666999,
                top: 0,
                left: 0
            }).appendTo("body");
            
            this.attr['bar'] = $("<div></div>").css({
                height: options.height+"px",
                marginTop: "-" + (options.height / 2) + "px",
                backgroundColor: options.foregroundColor,
                width: "0%",
                position: "absolute",
                top: "50%"
            }).appendTo(this.attr['overlay']);
            
            if (options.text) {
                this.attr['text'] = $("<div></div>").text("0%").css({
                    height: "40px",
                    width: "100px",
                    position: "absolute",
                    fontSize: "3em",
                    top: "50%",
                    left: "50%",
                    marginTop: "-" + (59 + options.height) + "px",
                    textAlign: "center",
                    marginLeft: "-50px",
                    color: options.foregroundColor
                }).appendTo(this.attr['overlay']);
            }
        },
        
        set : function(percentage){
            this.attr['bar'].stop().animate({
                width: percentage + "%",
                minWidth: percentage + "%"
            }, 200);

            if (this.attr['text']) {
                this.attr['text'].text(Math.ceil(percentage) + "%");
            }
        },
        
        complete : function(callback){
            var me = this;
            this.attr['overlay'].fadeOut(500, function () {
                me.attr['overlay'].remove();
                callback();
            });
        }
    };
})(jQuery);