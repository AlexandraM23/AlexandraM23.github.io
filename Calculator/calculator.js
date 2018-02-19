$(document).ready(function () {
    bindkeyListeners();
    allClear();
});

var bindkeyListeners = function () {
    $("#ac").click(allClear);
    $("#ce").click(clearEntry);
    $(".numberKey").click(numberPressed)
    $(".opKey").click(opPressed);
    $("#dot").click(handleDot);
    $("#equal").click(handleResult);
};

var allClear = function () {
    $("#screenTop").text("0");
    $("#screenBottom").text("0");
};

var clearEntry = function () {
    var currEx = readExpr().split(" ");
    currEx.pop();
    writeExpr(currEx.join(" "));
    writeResult(0);
};

var numberPressed = function (event) {
    var digit = parseInt(event.currentTarget.id);
    actionDigit(digit);
};

var actionDigit = function (digit) {

    var currVal = readResult();
    var currExpr = readExpr();
    if(currVal.length > 19 || currExpr.length > 19){
        writeExpr("Digit Limit Met");
        writeResult("0");
    } else{
        var reOp = /[-\+\*\/]/;
        var reDot = /[\.]$/;
        var reEqual = /\=/;
        var val = digit.toString();
    
        if ((currVal == "0" && currExpr == "0") || currExpr.match(reEqual) != null) {
            currVal = val;
            currExpr = currVal;
        } else if (currVal == "0" && currExpr != currVal) {
            currVal = val;
            currExpr += currVal;
        } else if (currVal != "0" && currExpr == currVal && currVal.match(reOp) == null) {
            currVal += val;
            currExpr = currVal;
        } else if (currVal != "0" && currExpr != currVal && currVal.match(reOp) == null) {
            currVal += val;
            currExpr += val;
        } else if (currVal.match(reOp) != null) {
            currVal = val;
            currExpr += currVal;
        } else if (currVal.match(reDot) != null) {
            currVal += val;
            currExpr += currVal;
        } else if (currExpr.match(reEqual) != null) {
            currVal = val;
            currExpr = currVal;
        }

        if(currVal.length > 19 || currExpr.length > 19){
            writeExpr("Digit Limit Met");
            writeResult("0");
        } else {
            writeResult(currVal);
            writeExpr(currExpr);
        }
       
    }
    

};

var opPressed = function (event) {
    var op = event.currentTarget.id;
    actionOp(op);
};

var actionOp = function (op) {
    var Val = readResult();
    var Expr = readExpr();
    var re1 = /[-\+\*\/\.]\s$/; //RegEx checking if the expresion to be evaluated has any of the operators or dot at the end
    var reEqual = /=/;
    
    if (Expr.match(re1) == null && Expr.match(reEqual) == null) {
        Val = op;
        writeResult(Val);
        Expr += " " + op.toString() + " ";
        writeExpr(Expr);
    } else if (Expr.match(reEqual) != null){
        Expr = Val + " " + op.toString() + " ";
        Val = op;
        writeResult(Val);
        writeExpr(Expr);
    }
};


var writeResult = function (val) {
    $("#screenTop").text(val);
};

var readResult = function () {
    return $("#screenTop").text();
};

var writeExpr = function (str) {
    $("#screenBottom").text(str);
};

var readExpr = function () {
    return $("#screenBottom").text();
};

var handleDot = function () {
    var result = readResult();
    var expr = readExpr();
    if (!result.includes('.')) {
        writeResult(result + '.');
        writeExpr(expr + ".");
    }
}

var handleResult = function () {
    var currExp = readExpr();
    var resultExp = parseFloat(eval(currExp));
    currExp = currExp + " = " + resultExp;
    if(resultExp.length > 19 || currExp.length > 19){
        writeExpr("Digit Limit Met");
        writeResult("0");
    } else {
        writeResult(resultExp);
        writeExpr(currExp);
    }
}









