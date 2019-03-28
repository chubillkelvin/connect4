$(document).ready(function(){
    let columns = $.makeArray($('.column'));

    $('.piece').draggable({
        containment: '.droprow',
        cursor: 'grabbing',
        distance: 50,
        grid: [100, 100],
        helper: 'clone',
        
        drag:function(event, ui){
            let xPos = parseInt(ui.position.left / 100);
            $('.available').removeClass('highlight-slot');
            $(columns[xPos]).find('.available').addClass('highlight-slot');
        },

        stop: function(event, ui){
            let xPos = parseInt(ui.position.left / 100);
            let target = $(columns[xPos]).find('.available');
            if(target.length !== 0){
                target.removeClass('available').removeClass('highlight-slot').addClass('occupied');
                target.siblings('.slot:not(.occupied):last').addClass('available');
                if($(this).hasClass('red')){
                    target.addClass('red');
                    $(this).removeClass('red').addClass('yellow');
                } else {
                    target.addClass('yellow');
                    $(this).removeClass('yellow').addClass('red');
                }
            }
        },
    });
});