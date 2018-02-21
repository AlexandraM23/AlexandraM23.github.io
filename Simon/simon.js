var pattern = [,];
var input = [,];
var strict = false;
var power = false;
var start = 0;
var audios = {
    "green": "sounds/simonSound1.mp3",
    "red": "sounds/simonSound2.mp3",
    "yellow": "sounds/simonSound3.mp3",
    "blue": "sounds/simonSound4.mp3"
};


$(document).ready(function () {

    $("#checkToTurnOn").change(powerToggle);
    $("#selectStrict").change(strictToggle);
    $("#startBtn").click(handleStartClick);
    $(".colorBtns").mousedown(handleColorMousedown);
    $(".colorBtns").mouseup(handleColorMouseUp);
    $("#win").hide();

});

var powerToggle = function () {

    if (power == true) {
        turnOff();
    } else {
        turnOn();
    }

};

var turnOn = function () {
    power = true;
    $("#startBtn").removeAttr("disabled");
    $(".colorBtns").removeAttr("disabled");
};

var turnOff = function () {
    power = false;
    $("#startBtn").attr("disabled", "disabled");
    $("#counter").text("00");
    disableColorBtns();
    start = 0;
}

var strictToggle = function () {

    if (strict == false) {
        strict = true;
    } else {
        strict = false;
    }

};

var handleStartClick = function () {
    start = 1;
    restart();
};

var restart = function () {
    resetColors();
    resetPattern();
    resetInput();
    $("#win").hide();
    $("#counterMain, #counter").css("color", "#e9e2e1");
    $("#counter").text("00");
    disableColorBtns();
    nextMove();

};

var handleColorMousedown = function (event) {

    if (start) {

        var color = event.currentTarget.id;
        playSound(color);
        input.push(color);

        displayHighlight(color);
    }

};

var handleColorMouseUp = function () {
    if (start) {
        resetColors();
        checkUserInput();

        if (input.length == pattern.length) {
            if (pattern.length == 21) {
                setTimeout(handleUserWin, 500);
            } else {
                resetColors();
                resetInput();
                disableColorBtns();
                nextMove();
            }
        }
    }

};

var checkUserInput = function () {

    for (var i = 1; i < input.length; i++) {
        if (input[i] != pattern[i]) {
            if (strict) {
                disableColorBtns();
                notifyUserOfMistake();
                setTimeout(restart, 1600);
            } else {
                resetColors();
                resetInput();
                disableColorBtns();
                notifyUserOfMistake();
                setTimeout(displayPattern, 1600);
            }
        }
    }
};

var notifyUserOfMistake = function () {

    var alertOn = function () {
        $("#startBtn").css('background-color', '#9e1e71');
        playAllSounds();
    };

    var alertOff = function () {
        $("#startBtn").css('background-color', '#8D607D');
    };

    var nFlashes = 3;
    var flashDuration = 290;

    for (var i = 1; i <= nFlashes; i++) {
        var nextOn = i * flashDuration * 2;
        setTimeout(alertOn, nextOn);
        setTimeout(alertOff, nextOn + flashDuration);
    }

};

var nextMove = function () {

    handleNextColor();
    displayCounter();

};

var handleNextColor = function () {
    var nextColor = generateRandomColor();
    pattern.push(nextColor);
    displayPattern();
    $(".colorBtns").removeAttr("disabled");
};

var displayEnabled = function (color) {
    var colorId = "#" + color;
    $(colorId).removeAttr("disabled");
    playSound(color);
}

var displayPattern = function () {

    var DL1 = 750; // DL = display length
    var DL2 = 500;
    var DL3 = 350;

    var displayColor = function (p) {

        disableColorBtns();
        var color = pattern[p];
        displayEnabled(color);

    };

    for (var i = 1; i < pattern.length; i++) {

        if (pattern.length <= 10) {
            setTimeout(displayColor, i * DL1, i);
            setTimeout(endDisplayPattern, i * DL1 + DL3);
        } else if (pattern.length <= 15) {
            setTimeout(displayColor, i * DL2, i);
            setTimeout(endDisplayPattern, i * DL2 + DL3);
        } else {
            setTimeout(displayColor, i * DL3, i);
            setTimeout(endDisplayPattern, i * DL3 + 200);
        }

    };

    if (pattern.length <= 10) {
        setTimeout(enableColorBtns, pattern.length * DL1);
    } else if (pattern.length <= 15) {
        setTimeout(enableColorBtns, pattern.length * DL2);
    } else {
        setTimeout(enableColorBtns, pattern.length * DL3);
    }

};

var endDisplayPattern = function () {
    disableColorBtns();
}

var enableColorBtns = function () {
    $(".colorBtns").removeAttr("disabled");
}

var resetColors = function () {

    $("#green").css('background-image', 'url("images/green.svg")');
    $("#yellow").css('background-image', 'url("images/yellow.svg")');
    $("#red").css('background-image', 'url("images/red.svg")');
    $("#blue").css('background-image', 'url("images/blue.svg")');

};


var handleUserWin = function () {

    disableColorBtns();
    $("#counterMain, #counter").css("color", "#aa863a")
    $("#win").show();
    setTimeout(restart, 5000);

};

var playAllSounds = function () {
    playSound("green");
    playSound("blue");
    playSound("yellow");
    playSound("red");
};

var displayAllHighlights = function () {
    displayHighlight("green");
    displayHighlight("red");
    displayHighlight("yellow");
    displayHighlight("blue");
};

var generateRandomColor = function () {
    var position = Math.floor(Math.random() * 4);
    if (position == 0) {
        return "green";
    } else if (position == 1) {
        return "red";
    } else if (position == 2) {
        return "yellow";
    } else if (position == 3) {
        return "blue";
    }
};

var playSound = function (color) {

    var audio = new Audio(audios[color]);
    audio.playbackRate = 0.8;
    audio.play();

};

var displayHighlight = function (color) {
    var colorId = "#" + color;
    var url = "url('images/" + color + "pressed.svg')";
    $(colorId).css('background-image', url);

};

var resetInput = function () {
    input = [,];
};

var resetPattern = function () {
    pattern = [,];
};

var disableColorBtns = function () {
    $(".colorBtns").attr("disabled", "disabled");
};

var displayCounter = function () {
    if (pattern.length < 10) {
        $("#counter").text("0" + (pattern.length - 1).toString());
    } else {
        $("#counter").text(pattern.length);
    }
};