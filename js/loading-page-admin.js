(function($){
    // Main application
    window['send_to_editor_default'] = window.send_to_editor;
    window['loading_page_selected_image'] = function(){
        var img_field = $('input[name="lp_lazy_loading_image"]');
        window.send_to_editor = function(html){
            var file_url = jQuery(html).attr('href');
            if (file_url) {
                img_field.val(file_url);
            }
            tb_remove();
            window.send_to_editor = window.send_to_editor_default;
        };

        tb_show('', 'media-upload.php?TB_iframe=true');
        return false;
    };
    
    window['loading_page_display_screen_tips'] = function(e){
        t = $(e.options[e.selectedIndex]).attr('title');
        if(t && t.length){
            alert(t);
        }
    }
    
    function setPicker(field, colorPicker){
        $(colorPicker).hide();
        $(colorPicker).farbtastic(field);
        $(field).click(function(){$(colorPicker).slideToggle()});
    };
    
    $(function(){
        setPicker("#lp_backgroundColor", "#lp_backgroundColor_picker");
        setPicker("#lp_foregroundColor", "#lp_foregroundColor_picker");
    });
})(jQuery);

