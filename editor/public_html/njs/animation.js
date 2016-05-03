var canvas = document.getElementById("canvas");

// set starting values
var fps = 60;
var percentPath = 0;
var percentGate = 0;

var path = 0;
var timeout = null;
var gate = 0;
var pathName = "";
var gateName = "";
var direction = 1;
var pathIndex = 0;
var nextpath = 0;
var nextgate = 0;




var POINTS_GATE = 100;
var POINTS_PATH = 100;

var nextPathNotExists = 99999;
var error_gate = 99999;

function fnextpath(actualindex) {

    if (actualindex === nextPathNotExists) {
    } else {
        pathName = circuitXML.paths[actualindex].nextpath;

        for (var n = 0; n < circuitXML.paths.length; n++) {
            if (circuitXML.paths[n].name === pathName) {
                animation_debug.output("fnextpath PathName:" + pathName);

                return n;
            }

        }
    }
    return nextPathNotExists;
}


function fnextPathfromGate(actualindex) {
    //animation_debug.output("fnextgatefromgate:" + actualindex);

    var sgate = swapgates[actualindex];

    pathName = circuitXML.gates[actualindex].paths[sgate].nextpath;

    //  animation_debug.output("gateName:" + gateName);
    for (var n = 0; n < circuitXML.paths.length; n++) {
        if (circuitXML.paths[n].name === pathName) {
            animation_debug.output("fnextPathfromGate PathName:" + pathName);
            return n;
        }
    }

    return error_gate;

}


function fnextgate(actualindex) {
    // animation_debug.output("fnextgate:" + actualindex);
    if (actualindex !== error_gate) {

        gateName = circuitXML.paths[actualindex].nextgate;
        //   animation_debug.output("gateName:" + gateName);
        for (var n = 0; n < circuitXML.gates.length; n++) {
            if (circuitXML.gates[n].name === gateName) {
                animation_debug.output("fnextgate gateName:" + gateName);
                return n;
            }
        }

    }
    return error_gate;

}
function stop() {
    clearTimeout(timeout);
}

var pathinit = 1;

percentGate = 0;
percentPath = 0;

var percentage = 0;
var ggate = 0;
var ppath = 0;
var antpath = 0;
var antgate = 0;


var swapgates = new Array();

for (n = 0; n < 200; n++)
    swapgates[n] = 0;

function swapp() {
    for (s = 0; s < circuitXML.gates.length; s++) {
        var open = swapgates[s];
        open++;
        if (open >= circuitXML.gates[s].paths.length) {
            open = 0;
        }
        swapgates[s] = open;
    }
}


function animate2() {

// redraw path
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAll();
    drawGatesSwap();
    context.lineWidth = 5;


    drawBall();



    percentGate += 10;
    percentPath +=10;

}

function drawBall() {
    if (ppath == nextPathNotExists) {
        if (percentGate > POINTS_GATE) {
            percentGate = 0;
            percentPath = 0;
            ppath = fnextPathfromGate(ggate);
            drawPilotaThrowPath(percentPath, ppath);
        } else
            drawPilotaThrowGate(percentGate, ggate);
    } else {
        if (percentPath > POINTS_PATH) {
            percentPath = 0;
            percentGate = 0;
            antpath = ppath;
            ppath = fnextpath(ppath);
            if (ppath === nextPathNotExists) {
                ggate = fnextgate(antpath);
                
                drawPilotaThrowGate(percentGate, ggate);
            }else drawPilotaThrowPath(percentPath, ppath);
        } else
            drawPilotaThrowPath(percentPath, ppath);
    }
}





// draw the current frame based on sliderValue
function drawPilotaThrowPath(sliderValue, witchPathIndex) {



    context.beginPath();
    context.strokeStyle = 'red';
    context.stroke();


    // draw the tracking rectangle
    var xy;


    //for (var pathIndex = 0; pathIndex < circuitXML.paths.length; pathIndex++) {

    var arr = new Array();
    for (var c = 0; c < circuitXML.paths[witchPathIndex].cells.length; c++) {
        var px = parseFloat(circuitXML.paths[witchPathIndex].cells[c].x);
        var py = parseFloat(circuitXML.paths[witchPathIndex].cells[c].y);
        var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
        var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
        arr[c] = new Point(cx + 20, cy + 20);
    }

    //  if (pathIndex === 0) {
    if (arr.length === 2) {
        var percent = sliderValue / POINTS_PATH;
        xy = getLineXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, percent);
    } else if (arr.length === 3) {
        var percent = sliderValue / POINTS_PATH;
        xy = getQuadraticBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, percent);
    } else if (arr.length === 4) {
        var percent = sliderValue / POINTS_PATH;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, percent);
    } else if (arr.length === 5) {
        var percent = sliderValue / POINTS_PATH;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, percent);
    } else if (arr.length === 6) {
        var percent = sliderValue / POINTS_PATH;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, {
            x: arr[5].x,
            y: arr[5].y
        }, percent);
    } else if (arr.length === 7) {
        var percent = sliderValue / POINTS_PATH;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, {
            x: arr[5].x,
            y: arr[5].y
        }, {
            x: arr[6].x,
            y: arr[6].y
        }, percent);
    }


    drawDot(xy, "yellow");


}

function drawGatesSwap() {
    var gateIndex = 0;
    for (gateIndex = 0; gateIndex < circuitXML.gates.length; gateIndex++) {
        var open = swapgates[gateIndex];
        for (gp = 0; gp < circuitXML.gates[gateIndex].paths.length; gp++) {
            var ArrayPoints = new Array();
            if (open === gp) {//gp) {

                for (cp = 0; cp < circuitXML.gates[gateIndex].paths[gp].cells.length; cp++) {

                    var px = parseFloat(circuitXML.gates[gateIndex].paths[gp].cells[cp].x);
                    var py = parseFloat(circuitXML.gates[gateIndex].paths[gp].cells[cp].y);
                    var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
                    var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
                    //document.fmain.debug += "cx:" + cx + " cy:" + cy;
                    ArrayPoints[cp] = new Point(cx + 20, cy + 20);
                }
                drawGate(ArrayPoints, "blue");
            }
        }
    }

}

function drawPilotaThrowGate(sliderValue, witchGateIndex) {

    context.lineWidth = 5;

    context.beginPath();
    context.strokeStyle = 'red';
    context.stroke();


    var xy;



    var arr = new Array();


    var sgate = swapgates[witchGateIndex];

    for (var c = 0; c < circuitXML.gates[witchGateIndex].paths[sgate].cells.length; c++) {
        var px = parseFloat(circuitXML.gates[witchGateIndex].paths[sgate].cells[c].x);
        var py = parseFloat(circuitXML.gates[witchGateIndex].paths[sgate].cells[c].y);
        var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
        var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
        arr[c] = new Point(cx + 20, cy + 20);
    }

    if (arr.length === 2) {
        var percent = sliderValue / POINTS_GATE;
        xy = getLineXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, percent);
    } else if (arr.length === 3) {
        var percent = sliderValue / POINTS_GATE;
        xy = getQuadraticBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, percent);
    } else if (arr.length === 4) {
        var percent = sliderValue / POINTS_GATE;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, percent);
    } else if (arr.length === 5) {
        var percent = sliderValue / POINTS_GATE;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, percent);
    } else if (arr.length === 6) {
        var percent = sliderValue / POINTS_GATE;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, {
            x: arr[5].x,
            y: arr[5].y
        }, percent);
    } else if (arr.length === 7) {
        var percent = sliderValue / POINTS_GATE;
        xy = getCubicBezierXYatPercent({
            x: arr[0].x,
            y: arr[0].y
        }, {
            x: arr[1].x,
            y: arr[1].y
        }, {
            x: arr[2].x,
            y: arr[2].y
        }, {
            x: arr[3].x,
            y: arr[3].y
        }, {
            x: arr[4].x,
            y: arr[4].y
        }, {
            x: arr[5].x,
            y: arr[5].y
        }, {
            x: arr[6].x,
            y: arr[6].y
        }, percent);
    }


    drawDot(xy, "yellow");


}

// draw tracking rect at xy
function drawRect(point, color, name) {
    context.fillStyle = color;
    context.strokeStyle = "gray";
    context.lineWidth = 3;
    context.beginPath();
    context.rect(point.x - 13, point.y - 8, 25, 15);
    context.fill();
    context.stroke();
    writeTxt("black", point.x - 5, point.y - 5, name);
}

// draw tracking dot at xy
function drawDot(point, color) {
    context.fillStyle = color;
    context.strokeStyle = "black";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(point.x, point.y, 10, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    context.stroke();
}

// line: percentPath is 0-1
function getLineXYatPercent(startPt, endPt, percent) {
    var dx = endPt.x - startPt.x;
    var dy = endPt.y - startPt.y;
    var X = startPt.x + dx * percent;
    var Y = startPt.y + dy * percent;
    return ({
        x: X,
        y: Y
    });
}

// quadratic bezier: percentPath is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
    var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
    return ({
        x: x,
        y: y
    });
}

// cubic bezier percentPath is 0-1
function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
    var x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
        x: x,
        y: y
    });
}

// cubic helper formula at percentPath distance
function CubicN(pct, a, b, c, d) {
    var t2 = pct * pct;
    var t3 = t2 * pct;
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}