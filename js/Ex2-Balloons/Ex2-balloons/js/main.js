'use strict'

var gBalloons = [
    { bottom: '20', speed: 70 },
    { bottom: '25', speed: 90 },
    { bottom: '15', speed: 70 },
    { bottom: '20', speed: 80 },
    { bottom: '24', speed: 60 },
]

var gPopSound = new Audio('audio/pop.wav');

function init(){
    renderBalloon()
    upBalloon()
}
// function isVictory(){
// if( )
// }

function explodingBalloon(elBall) {
    elBall.style.display = 'none'
    gPopSound.play()
}

function renderBalloon() {
    var strHTML = '';
    for (var i = 0; i < gBalloons.length; i++) {
        strHTML += '<div class="balloon balloon' + (i + 1) + '"onclick="explodingBalloon( this )"></div>';
    }
    var elBall = document.querySelector('.balloon-container');
    elBall.innerHTML = strHTML;
}


function upBalloon() {
    var elBall = document.querySelectorAll('.balloon')
    var count = 0
    setInterval(() => {
        count++
        gBalloons
        for (let i = 0; i < elBall.length; i++) {
            var bottom = gBalloons[i].bottom * count
            elBall[i].style.bottom = bottom + 'px'
            gBalloons[i].bottom
        }
    }, 100);
}







