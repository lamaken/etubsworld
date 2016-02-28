var canvas;
var context;
var swapgates;
var point;
///////////////////////////////// cell
function Point(x, y) {
    this.x = x;
    this.y = y;
}

////////////// paths and gates tags
function pathsHint(pgHint, gateorpath) {
    pgHint.innerHTML = pgHint.innerHTML + " <a href='#' onmouseover=\"iluminapath('" + gateorpath + "')\">" + gateorpath + "</a> ";
}

function gatesHint(pgHint, gateorpath, link) {
    pgHint.innerHTML = pgHint.innerHTML + "<a onmouseover=\"iluminagate('" + gateorpath + "')\" href='#'>" + gateorpath + "</a>";
}


function iluminapath(name) {
    loadCircuit();
    initcanvas();
    clear();
    drawAll();
    drawPathsIlumina(name);
}

function iluminagate(name) {
    loadCircuit();
    initcanvas();
    clear();
    drawAll();
    drawGatesIlumina(name);
}

function drawPathsIlumina(name) {
    for (var p = 0; p < circuitXML.paths.length; p++) {
        var ArrayPoints = new Array();
        if (circuitXML.paths[p].name == name) {
            for (var c = 0; c < circuitXML.paths[p].cells.length; c++) {
                var px = parseFloat(circuitXML.paths[p].cells[c].x);
                var py = parseFloat(circuitXML.paths[p].cells[c].y);
                var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
                var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
                ArrayPoints[c] = new Point(cx + 20, cy + 20);
            }
            drawPath(ArrayPoints, 'yellow');
        }
    }
}


function drawGatesIlumina(name) {
    for (g = 0; g < circuitXML.gates.length; g++) {
        for (gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {
            var ArrayPoints = new Array();
            if (circuitXML.gates[g].paths[gp].name == name) {
                for (cp = 0; cp < circuitXML.gates[g].paths[gp].cells.length; cp++) {
                    var px = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].x);
                    var py = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].y);
                    var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
                    var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
                    ArrayPoints[cp] = new Point(cx + 20, cy + 20);
                }
                drawGate(ArrayPoints, 'yellow');
            }
        }
    }

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

function init() {
    debug.output("Init.");
    loadCircuit();
    initShapGatesArray();
    initcanvas();
    clear();
}

function load(quin) {
    debug.output("Load:" + quin);
    xmlDoc = loadXMLDoc("xmlcircuits/" + quin);
    var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
    document.fmain.drop_zone.value = xmlString;
    init();
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
        writeTxt('cyan', startx, starty, circuitXML.paths[p].name);
    }
}

function drawGates() {
    var startx, starty;
    for (g = 0; g < circuitXML.gates.length; g++) {
        for (gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {
            var ArrayPoints = new Array();
            for (cp = 0; cp < circuitXML.gates[g].paths[gp].cells.length; cp++) {
                var px = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].x);
                var py = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].y);
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
        writeTxt('magenta', startx, starty, circuitXML.gates[g].name);
    }
}

function drawGatesSwap() {
    for (g = 0; g < circuitXML.gates.length; g++) {
        var open = swapgates[g];
        debug.output("g:" + g + " open:" + open);
        for (gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {
            var ArrayPoints = new Array();
            if (open == gp) {//gp) {

                for (cp = 0; cp < circuitXML.gates[g].paths[gp].cells.length; cp++) {

                    var px = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].x);
                    var py = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].y);
                    var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
                    var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
                    //document.fmain.debug += "cx:" + cx + " cy:" + cy;
                    ArrayPoints[cp] = new Point(cx + 20, cy + 20);
                }
                drawGate(ArrayPoints, "green");
            }
        }

        open++;
        if (open >= circuitXML.gates[g].paths.length) {
            open = 0;
        }

        swapgates[g] = open;
    }

}

function drawAll() {

////////
    drawPaths();
    drawGates();
    updatePanthsAndGatesHints();
}

function updatePanthsAndGatesHints() {

    var pgHint = document.getElementById('pathsandtubs');
    pgHint.innerHTML = "paths > ";
    for (var p = 0; p < circuitXML.paths.length; p++) {
        pathsHint(pgHint, circuitXML.paths[p].name);
        if (p < circuitXML.paths[p].length - 1)
            pgHint.innerHTML += ", ";
    }
    pgHint.innerHTML += "<br/>gates > ";
    for (g = 0; g < circuitXML.gates.length; g++) {

        gatesHint(pgHint, circuitXML.gates[g].name + "(", "update()");
        for (gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {

            gatesHint(pgHint, circuitXML.gates[g].paths[gp].name, "update()");
            if (gp < circuitXML.gates[g].paths.length - 1)
                pgHint.innerHTML += ", ";
        }
        pgHint.innerHTML += ")&nbsp;&nbsp;";
    }

}

function drawSwap() {
    drawPaths();
    drawGatesSwap();
}

function drawPath(points, color) {

    context.strokeStyle = color;
    context.lineWidth = 1;
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
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y,points[3].x,points[3].y);
        context.quadraticCurveTo(points[4].x, points[4].y, points[5].x, points[5].y);
        
        
    }
    context.stroke();
}

function drawGate(points, color) {
   context.strokeStyle = color;
    context.lineWidth = 1;
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
        context.bezierCurveTo(points[1].x, points[1].y, points[2].x, points[2].y,points[3].x,points[3].y);
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
  
    
    animate();
    /*
    var curve = new Array();
    var o = document.getElementById('pilota');
    o.style.position = 'absolute';
    for (var p = 0; p < circuitXML.paths.length; p++) {

        var arr = new Array();
        for (var c = 0; c < circuitXML.paths[p].cells.length; c++) {
            var px = parseFloat(circuitXML.paths[p].cells[c].x);
            var py = parseFloat(circuitXML.paths[p].cells[c].y);
            var cx = parseInt((((px + 1.0) / 2.0) * (canvas.width - 40)));
            var cy = parseInt((((1.0 - py) / 2.0) * (canvas.height - 40)));
            arr[c] = new Point(cx + 20, cy + 20);
        }


        writeTxt("white", 10, 10, circuitXML.paths[p].name);
        context.fillStyle = 'red';
        if (arr.length === 2) {
            curve[p] = new CurveAnimator([arr[0].x, arr[0].y], [arr[1].x, arr[1].y]);
        }
        if (arr.length === 3) {
            curve[p] = new CurveAnimator([arr[0].x, arr[0].y], [arr[1].x, arr[1].y], [arr[2].x, arr[2].y]);
        }
        if (arr.length === 4) {
            curve[p] = new CurveAnimator([arr[0].x, arr[0].y], [arr[1].x, arr[1].y], [arr[2].x, arr[2].y]);
        }
        if (arr.length === 5) {
            curve[p] = new CurveAnimator([arr[0].x, arr[0].y], [arr[1].x, arr[1].y], [arr[2].x, arr[2].y]);
        }

    }
    for (var k = 0; k < curve.length; k++) {
        curve[k].animate(2, function(point, angle) {
            // context.clearRect(0, 0, canvas.width, canvas.height);
            //drawAll();
            context.fillRect(point.x, point.y, 10, 10);
        });
    }
*/

}


