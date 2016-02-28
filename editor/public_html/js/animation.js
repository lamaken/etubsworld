var canvas = document.getElementById("canvas");

// set starting values
var fps = 60;
var percent = 0
var direction = 1;

// start the animation
//animate();

function animate() {

    // set the animation position (0-100)
    percent += direction;
    if (percent < 0) {
        percent = 0;
        direction = 1;
    }
    ;
    if (percent > circuitXML.paths.length) {
        percent = circuitXML.paths.length;
        direction = -1;
    }
    ;

    draw2(percent);

    // request another frame
    setTimeout(function() {
        requestAnimationFrame(animate);
    }, 1400 / fps);
}


// draw the current frame based on sliderValue
function draw2(sliderValue) {

    // redraw path
    context.clearRect(0, 0, canvas.width, canvas.height);
    drawAll();
    context.lineWidth = 5;

    context.beginPath();
    context.strokeStyle = 'red';
    context.stroke();


    // draw the tracking rectangle
    var xy;



    for (var p = 0; p < circuitXML.paths.length; p++) {

        var arr = new Array();
        for (var c = 0; c < circuitXML.paths[p].cells.length; c++) {
            var px = parseFloat(circuitXML.paths[p].cells[c].x);
            var py = parseFloat(circuitXML.paths[p].cells[c].y);
            var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
            var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
            arr[c] = new Point(cx + 20, cy + 20);
        }


        if (arr.length === 2) {
            var percent = sliderValue / circuitXML.paths.length;
            xy = getLineXYatPercent({
                x: arr[0].x,
                y: arr[0].y
            }, {
                x: arr[1].x,
                y: arr[1].y
            }, percent);
        } else if (arr.length === 3) {
            var percent = sliderValue / circuitXML.paths.length;
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
            var percent = sliderValue / circuitXML.paths.length;
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
            var percent = sliderValue / circuitXML.paths.length;
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
            var percent = sliderValue / circuitXML.paths.length;
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
        }
        else if (arr.length === 7) {
            var percent = sliderValue / circuitXML.paths.length;
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
        }else drawDot(xy, "yellow", circuitXML.paths[p].name);
        //drawRect(xy, "red", circuitXML.paths[p].name);
        drawDot(xy, "red", circuitXML.paths[p].name);

    }
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
    context.strokeStyle = "white";
    context.lineWidth = 1;
    context.beginPath();
    context.arc(point.x, point.y, 8, 0, Math.PI * 2, false);
    context.closePath();
    context.fill();
    context.stroke();
}

// line: percent is 0-1
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

// quadratic bezier: percent is 0-1
function getQuadraticBezierXYatPercent(startPt, controlPt, endPt, percent) {
    var x = Math.pow(1 - percent, 2) * startPt.x + 2 * (1 - percent) * percent * controlPt.x + Math.pow(percent, 2) * endPt.x;
    var y = Math.pow(1 - percent, 2) * startPt.y + 2 * (1 - percent) * percent * controlPt.y + Math.pow(percent, 2) * endPt.y;
    return ({
        x: x,
        y: y
    });
}

// cubic bezier percent is 0-1
function getCubicBezierXYatPercent(startPt, controlPt1, controlPt2, endPt, percent) {
    var x = CubicN(percent, startPt.x, controlPt1.x, controlPt2.x, endPt.x);
    var y = CubicN(percent, startPt.y, controlPt1.y, controlPt2.y, endPt.y);
    return ({
        x: x,
        y: y
    });
}

// cubic helper formula at percent distance
function CubicN(pct, a, b, c, d) {
    var t2 = pct * pct;
    var t3 = t2 * pct;
    return a + (-a * 3 + pct * (3 * a - a * pct)) * pct + (3 * b + pct * (-6 * b + b * 3 * pct)) * pct + (c * 3 - c * 3 * pct) * t2 + d * t3;
}