$(document).ready(function(){
    let tickSound = document.createElement('AUDIO');
    tickSound.src = './tick.wav';
    let winSound = document.createElement('AUDIO');
    winSound.src = './win.wav';
    let columns = $.makeArray($('.column'));

    $('.piece').draggable({
        containment: '.droprow',
        cursor: 'grabbing',
        grid: [100, 100],
        helper: 'clone',

        drag: function(event, ui){
            let xPos = parseInt(ui.position.left / 100);
            $('.available').removeClass('highlight-slot');
            $(columns[xPos]).find('.available').addClass('highlight-slot');
        },

        stop: function(event, ui){
            let xPos = parseInt(ui.position.left / 100);
            let target = $(columns[xPos]).find('.available');
            let currentColor = $(this).hasClass('red')? 'red' : 'yellow';
            if(target.length !== 0){
                tickSound.play();
                target.removeClass('available').removeClass('highlight-slot').addClass('occupied');
                target.siblings('.slot:not(.occupied):last').addClass('available');
                if(currentColor === 'red'){
                    target.addClass('red');
                    $(this).removeClass('red').addClass('yellow');
                } else {
                    target.addClass('yellow');
                    $(this).removeClass('yellow').addClass('red');
                }
                if(checkWin(target, currentColor)){
                    winSound.play();
                    $(this).draggable('disable');
                    let message = $('#message');
                    message.html(`${currentColor} wins!`.toProperCase());
                    message.css('color', currentColor);
                    message.css('display', 'block');
                }
            }
        },
    });
});

function checkWin(lastMove, color){
    let currentColIndex = $(lastMove).closest('.column').index('.column');
    let currentPosIndex = $(lastMove).index();

    // Check for vertical
    let verticalSlots = $.makeArray($(`.column:eq(${currentColIndex}) > .slot`)).map((slot) => $(slot).hasClass(color)? 1 : 0);
    for(let i=0; i<3; i++){
        if(verticalSlots.slice(i, i+4).reduce((total, num) => total + num) === 4){
            return true;
        }
    }

    // Check for horizontal
    let horizontalSlots = $.makeArray($(`.column > .slot:nth-child(${currentPosIndex+1})`)).map((slot) => $(slot).hasClass(color)? 1 : 0);
    for(let i=0; i<4; i++){
        if(horizontalSlots.slice(i, i+4).reduce((total, num) => total + num) === 4){
            return true;
        }
    }

    // Check for slanting

    // Check for entries in the two slanting lines
    let leftTop = { col: currentColIndex, pos: currentPosIndex, };
    let rightBot = { col: currentColIndex, pos: currentPosIndex, };
    let leftBot = { col: currentColIndex, pos: currentPosIndex, };
    let rightTop = { col: currentColIndex, pos: currentPosIndex, };

    let fixedTop = false;
    let fixedBot = false;
    let i = currentColIndex;
    while(i > 0){
        i -= 1;

        if(leftTop.pos-1 >= 0 && !fixedTop){
            leftTop.col = i;
            leftTop.pos -= 1;
        } else {
            fixedTop = true;
        }

        if(leftBot.pos+1 <= 5 && !fixedBot){
            leftBot.col = i;
            leftBot.pos += 1;
        } else {
            fixedBot = true;
        }
    }

    fixedTop = false;
    fixedBot = false;
    i = currentColIndex;
    while(i < 6){
        i += 1;

        if(rightTop.pos-1 >= 0 && !fixedTop){
            rightTop.col = i;
            rightTop.pos -= 1;
        } else {
            fixedTop = true;
        }

        if(rightBot.pos+1 <= 5 && !fixedBot){
            rightBot.col = i;
            rightBot.pos += 1;
        } else {
            fixedBot = true;
        }
    }

    let line1 = [];
    for(let i=0; i<=rightBot.col-leftTop.col; i++){
        line1.push($(`.column:eq(${leftTop.col+i})`).find(`.slot:eq(${leftTop.pos+i})`));
    }
    let line2 = [];
    for(let i=0; i<=rightTop.col-leftBot.col; i++){
        line2.push($(`.column:eq(${leftBot.col+i})`).find(`.slot:eq(${leftBot.pos-i})`));
    }
    line1 = line1.map((slot) => $(slot).hasClass(color)? 1 : 0);
    line2 = line2.map((slot) => $(slot).hasClass(color)? 1 : 0);

    // Check for the two slanting lines
    if(line1.length >= 4){
        for(let i=0; i<=line1.length-4; i++){
            if(line1.slice(i, i+4).reduce((total, num) => total + num) === 4){
                return true;
            }
        }
    }
    if(line2.length >= 4){
        for(let i=0; i<=line2.length-4; i++){
            if(line2.slice(i, i+4).reduce((total, num) => total + num) === 4){
                return true;
            }
        }
    }
    return false;
}

String.prototype.toProperCase = function () {
    return this.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
}
