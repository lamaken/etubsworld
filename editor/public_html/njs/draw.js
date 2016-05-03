//njs

var canvas;
var context;
var swapgates;
var point;
///////////////////////////////// cell
function Point(x, y) {
    this.x = x;
    this.y = y;
}

function initShapGatesArray() {
    swapgates = new Array(100);
    for (var n = 0; n < swapgates.length; n++) {
        swapgates[n] = 0;
    }

}

function initcanvas() {
    canvas = document.getElementById('myCanvas');
    context = canvas.getContext('2d');
}

function init(xmlString) {
    debug.output("Init.");
    loadCircuit(xmlString);
    initShapGatesArray();
    initcanvas();
    clear();
}

function load(quin) {
    debug.output("Load:" + quin);
    xmlDoc = loadXMLDoc("xmlcircuits/" + quin);
    var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
    
    init(xmlString);
}

function clear() {

    context.fillStyle = "black";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillRect(20, 20, canvas.width - 40, canvas.height - 40);
}

function swap() {
    loadCircuit();
    initcanvas();
    clear();
    drawSwap();
}

function update() {
    loadCircuit();
    initcanvas();
    clear();
    drawAll();
}

function start() {
    load(document.forms.fmain.circuits.value);
    drawAll();
}

function drawPaths() {
    //debug.output("drawPaths");
    var startx, starty;
    for (var p = 0; p < circuitXML.paths.length; p++) {
        var ArrayPoints = new Array();
        for (var c = 0; c < circuitXML.paths[p].cells.length; c++) {
            var px = parseFloat(circuitXML.paths[p].cells[c].x);
            var py = parseFloat(circuitXML.paths[p].cells[c].y);
            var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
            var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
            ArrayPoints[c] = new Point(cx + 20, cy + 20);
            if (c === 0) {
                startx = cx + 20;
                starty = cy + 20;
            }

        }


        drawPath(ArrayPoints, 'white');
        //writeTxt('cyan', startx, starty, circuitXML.paths[p].name);
    }
}

function drawGates() {
   // debug.output("drawGates");
    var startx, starty;
    for (gateIndex = 0; gateIndex < circuitXML.gates.length; gateIndex++) {
        for (gp = 0; gp < circuitXML.gates[gateIndex].paths.length; gp++) {
            var ArrayPoints = new Array();
            for (cp = 0; cp < circuitXML.gates[gateIndex].paths[gp].cells.length; cp++) {
                var px = parseFloat(circuitXML.gates[gateIndex].paths[gp].cells[cp].x);
                var py = parseFloat(circuitXML.gates[gateIndex].paths[gp].cells[cp].y);
                var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
                var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
                ArrayPoints[cp] = new Point(cx + 20, cy + 20);
                if (gp === 0) {
                    startx = cx + 20;
                    starty = cy + 20;
                }
            }
            drawGate(ArrayPoints, 'blue');
        }
        //writeTxt('red', startx, starty, circuitXML.gates[gateIndex].name);
    }
}

function drawGatesSwap() {
    for (gateIndex = 0; gateIndex < circuitXML.gates.length; gateIndex++) {
        var open = swapgates[gateIndex];
        //debug.output("gateIndex:" + gateIndex + " open:" + open);
        for (gp = 0; gp < circuitXML.gates[gateIndex].paths.length; gp++) {
            var ArrayPoints = new Array();
            if (open == gp) {//gp) {

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

function drawAll() {

////////
    drawPaths();
    //drawGates();
    
}


function drawSwap() {
    drawPaths();
    drawGatesSwap();
}

function drawPath(points, color) {

    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    var len = points.length;
    if (len === 2) {
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
    }
    if (len === 3) {
        context.moveTo(points[0].x, points[0].y);
        context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    }
    if (len === 4) {
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
    }

    if (len === 5) {
        context.moveTo(points[0].x, points[0].y);
        context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
        context.quadraticCurveTo(points[3].x, points[3].y, points[4].x, points[4].y);
    }


    if (len === 6) {
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);


    }
    context.stroke();
}

function drawGate(points, color) {
    context.strokeStyle = color;
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(points[0].x, points[0].y);
    var len = points.length;
    if (len === 2) {
        context.moveTo(points[0].x, points[0].y);
        context.lineTo(points[1].x, points[1].y);
    }
    if (len === 3) {
        context.moveTo(points[0].x, points[0].y);
        context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
    }
    if (len === 4) {
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
    }

    if (len === 5) {
        context.moveTo(points[0].x, points[0].y);
        context.quadraticCurveTo(points[1].x, points[1].y, points[2].x, points[2].y);
        context.quadraticCurveTo(points[3].x, points[3].y, points[4].x, points[4].y);
    }


    if (len === 6) {
        context.moveTo(points[0].x, points[0].y);
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y, points[3].x, points[3].y);
        context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);


    }
    context.stroke();
}
function writeTxt(color, x, y, text) {
    context.fillStyle = color;
    context.font = '10px "Courier New"';
    context.textBaseline = 'top';
    context.fillText(text, x, y);
    context.stroke();
}

function play() {
    run();
}


