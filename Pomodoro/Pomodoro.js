var interval;

$(document).ready(function () {
    $("#break-length").text("5");
    $("#session-length").text("25");
    $(".opKeyBreak").click(opBreakPressed);
    $(".opKeySession").click(opSessionPressed);
    $("#startButton").click(startSession);
    $("#pauseButton").click(pauseSession);
    $("#elapsing").text("25");
});

var opBreakPressed = function (event) {
    var op = event.currentTarget.id;
    var currBreak = readBreakLength();
    var newTime = eval(currBreak + op + "1");
    if (newTime > 0 && newTime <= 30) {
        writeBreakLength(newTime);
    } else if (newTime <= 0) {
        $("#elapsing").text("This tomato read that breaks increase productivity!");
    } else if (newTime >= 31) {
        $("#elapsing").text("This tomato hopes you're happy with how productive you are :D");
    }
};

var opSessionPressed = function (event) {
    clearInterval(interval);

    var op = event.currentTarget.id;
    var currSession = readSessionLength();
    var newTime = eval(currSession + op + "1");
    if (newTime > 0 && newTime <= 60) {
        writeSessionLength(newTime);
        $("#elapsing").text(newTime);
    } else if (newTime <= 0) {
        $("#elapsing").text("This tomato can't go back in time :(");
    } else if (newTime >= 0) {
        $("#elapsing").text("This tomato thinks you should split your work in smaller chunks ;)")
    }
};


var startSession = function () {

    if (interval === undefined) {
        var sessionMin = readSessionLength() - 1;
        timer(sessionMin, 60);
    } else if (interval >= 1) {
        clearInterval(interval);
        var currMin = $("#elapsing").text().substring(0, 2);
        var currSec = $("#elapsing").text().substring(3);
        if (currSec == "") {
            timer(currMin, 60);
        } else if (currMin == "00" || currMin == "1") {
            timer(0, currSec);
        } else {
            timer(currMin, currSec);
        }
    }

};

var pauseSession = function () {
    clearInterval(interval);
};

var timer = function (min, sec) {
    var decrease = function () {
        sec--;
        if (sec == 0) {
            sec = 60;
            min--;
        }

        if (min == 0 && sec == 1) {
            clearInterval(interval);
            breakTime();
        }

        if (min >= 10 && sec >= 10) {
            $("#elapsing").text(min + ":" + sec);
        } else if (min >= 10 && sec < 10) {
            $("#elapsing").text(min + ":0" + sec);
        } else if (min < 10 && sec >= 10) {
            $("#elapsing").text("0" + min + ":" + sec);
        } else if (min < 10 && sec < 10) {
            $("#elapsing").text("0" + min + ":0" + sec);
        }
    }
    interval = setInterval(decrease, 1000);
}

var breakTime = function () {
    $("#currentStatus").text("Break!");
    var breakMin = readBreakLength() - 1;
    timer(breakMin, 60);
};

var readBreakLength = function () {
    return $("#break-length").text();
};

var readSessionLength = function () {
    return $("#session-length").text();
};

var writeBreakLength = function (val) {
    $("#break-length").text(val);
};

var writeSessionLength = function (val) {
    $("#session-length").text(val);
};