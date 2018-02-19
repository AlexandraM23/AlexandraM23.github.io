var userChoice = null;
var computer = null;
var board = [, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var winOptions = [[1, 2, 3], [1, 4, 7], [1, 5, 9], [4, 5, 6], [2, 5, 8], [3, 5, 7], [7, 8, 9], [3, 6, 9]];

$(document).ready(function () {

    if (userChoice == null) {
        $(".square").clearQueue();
    }

    $("#Xbox, #Xshape").click(setUserChoice);
    $("#Obox, #Oshape").click(setUserChoice);
    $(".square").click(handleSquareClick);

});

var handleSquareClick = function (event) {

    var clickedSquareNumber = parseInt(event.currentTarget.id);

    if (board[clickedSquareNumber] == 0) {
        handleUserMove(clickedSquareNumber);
    }

};


var setUserChoice = function (event) {

    choice = event.currentTarget.id;

    if (choice == "Xbox" || choice == "Xshape") {
        userChoice = "X";
        computer = "O";
    } else {
        userChoice = "O";
        computer = "X";
    }

    goToGame();
};

var goToGame = function () {

    $(".choice").fadeOut(300);
    $(".game").fadeIn(800);
    $(".result").fadeIn().text("");

};


var handleUserMove = function (clickedSquareNumber) {

    var userMoveDisplayId = "#" + clickedSquareNumber.toString();

    updateBoard(clickedSquareNumber, userChoice);
    displayMove(userMoveDisplayId, userChoice);

    var nextMove = checkProgress("computer");

    if (nextMove == "random move") {

        var randomPos = randomAvailablePosition(board);
        handleComputerMove(randomPos);

    } else if (nextMove && nextMove.hasOwnProperty("nextSuggestedMove")) {

        handleComputerMove(nextMove.nextSuggestedMove);

    } else if (nextMove && nextMove.hasOwnProperty("winner")) {

        handleResult(nextMove.winner, nextMove.winPosition);

    } else {

        handleResult("draw");

    }

};

var handleComputerMove = function (computerMoveOnBoard) {

    computerMoveId = "#" + computerMoveOnBoard.toString();

    updateBoard(computerMoveOnBoard, computer);
    displayMove(computerMoveId, computer);

    var nextMove = checkProgress("user");

    if (nextMove && nextMove.hasOwnProperty("winner")) {

        handleResult(nextMove.winner, nextMove.winPosition);

    } else if (nextMove == "draw") {

        handleResult("draw");

    }

};

var handleResult = function (result, winPosition) {

    if (result == "draw") {
        displayMessage("draw");
        styleSquares("all");
    } else if (result == userChoice) {
        displayMessage("user");
        styleSquares(winPosition);
    } else {
        displayMessage("computer");
        styleSquares(winPosition);
    }
    setTimeout(restart, 5000);
};

var styleSquares = function (whichSquares) { //whichSquares will either be "all" or a number representing the winning position in the winOptions array
    if (whichSquares == "all") {
        flash(".square");
    } else {
        var sq1 = "#" + winOptions[whichSquares][0];
        var sq2 = "#" + winOptions[whichSquares][1];
        var sq3 = "#" + winOptions[whichSquares][2];

        var squaresToStyle = sq1 + ", " + sq2 + ", " + sq3;
        
        flash(squaresToStyle);
    }
};


var flash = function(id){

    var styleOn = function () {
        $(id).css({
            "outline-offset": "0.2rem",
            "outline-style": "dotted",
            "outline-color": "#AA3A5E"
        });
    };
    
    var styleOff = function(){
        $(id).css({
            "outline": "none"
        });
    }
    
    var nFlashes = 5;
    var flashDuration = 400;

    for(var i=1; i <= nFlashes; i++){
        var nextOn = i*flashDuration*2;
        setTimeout(styleOn, nextOn);
        setTimeout(styleOff, nextOn+flashDuration);
    }
}

var displayMessage = function (whatMessage) {
       
    if (whatMessage == "draw") {
        $(".result").text("Yay! Everybody wins...");
    } else if (whatMessage == "user") {
        $(".result").text("Yay, you won against the machine!");
    } else {
        $(".result").text("Yay! I win!");
    }
}

var checkProgress = function (whoseTurn) {

    var numberOfMoves = currentNumberOfMoves();
    var win = checkWhoWon();

    if (numberOfMoves < 3) {
        return "random move";
    } else if (numberOfMoves == 9 && win == "no win yet") {
        return "draw";
    }

    if (win == "no win yet" && whoseTurn == "computer") {
        var suggestOrRandom = whereNext();
        if (suggestOrRandom) {
            return suggestOrRandom;
        } else {
            return "random move";
        }
    } else if (win != "no win yet") {

        return win;

    }

    if (whoseTurn == "computer") {

        return "random move";

    }

};

var randomAvailablePosition = function (boardArray) {
    var currFreePositions = [];
    boardArray.map(function (val, index) {
        if (val == 0) {
            currFreePositions.push(index);
        }
    });

    return currFreePositions[Math.floor(Math.random() * (currFreePositions.length - 1))];
};

var displayMove = function (position, symbol) {
    var handler = position + " > img.final" + symbol;
    $(handler).fadeIn();
};

var updateBoard = function (position, symbol) {
    board[position] = symbol;
};

var checkWhoWon = function () {
    for (var i = 0; i < winOptions.length; i++) {         //iterate through every win option
        var p1 = winOptions[i][0];                      //save win positions
        var p2 = winOptions[i][1];
        var p3 = winOptions[i][2];
        var b1 = board[p1];                             //check win positions against current board
        var b2 = board[p2];
        var b3 = board[p3];
        if (b1 == b2 && b1 == b3 && b2 == b3 && b3 != 0) {
            return {
                winner: b1,
                winPosition: i
            };
        }
    }
    return "no win yet";
};

var whereNext = function () {
    for (var i = 0; i < winOptions.length; i++) {         //iterate through every win option
        var p1 = winOptions[i][0];                      //save win positions
        var p2 = winOptions[i][1];
        var p3 = winOptions[i][2];
        var b1 = board[p1];                             //check win positions against current board
        var b2 = board[p2];
        var b3 = board[p3];
        if (b1 == b2 && b2 != 0 && b3 == 0) {
            return { nextSuggestedMove: p3 };
        } else if (b1 == b3 && b3 != 0 && b2 == 0) {
            return { nextSuggestedMove: p2 };
        } else if (b2 == b3 && b3 != 0 && b1 == 0) {
            return { nextSuggestedMove: p1 };
        }
    }
}

var currentNumberOfMoves = function () {
    return board.reduce(function (acc, curr) {
        if (curr == "X" || curr == "O") {
            acc++;
        }
        return acc;
    }, 0);
};

var restart = function () {
    $(".result").fadeOut(300);
    $(".game").fadeOut(300);
    $(".choice").fadeIn(1000);
    resetBoard();
    resetDisplay();
};

var resetBoard = function () {
    board = [, 0, 0, 0, 0, 0, 0, 0, 0, 0];
};

var resetDisplay = function () {
    $(".square").css({
        "outline": "none"
    });
    $("img.finalX").fadeOut();
    $("img.finalO").fadeOut();
    $(".game").fadeOut();
    
}


