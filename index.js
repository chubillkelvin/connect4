$(document).ready(function(){
    $('.piece').draggable({
        containment: [0, 0, 600, 600],
        cursor: 'grabbing',
        distance: 50,
        grid: [100, 100],
        helper: 'clone',
    });

    $('.slot').droppable({
        drop: function(event, ui){
            if(Object.values(ui.draggable.context.classList).indexOf('red') !== -1){
                $(this).addClass('red').removeClass('lightgray').droppable({disabled: 'true'});
            } else {
                $(this).addClass('yellow').removeClass('lightgray').droppable({disabled: 'true'});
            }
            if($('.piece').hasClass('red')){
                $('.piece').removeClass('red').addClass('yellow');
            } else {
                $('.piece').removeClass('yellow').addClass('red');
            }
        },
        activate: function(event, ui){
            $(this).addClass('lightgray');
        },
        deactivate: function(event, ui){
            $(this).removeClass('lightgray');
        },
    });
});