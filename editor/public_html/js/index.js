   


function savetofile(){
	save();
}



function init(){
	document.forms.fmain.circuits.value="default.xml";
	getCircuitFromFile("default.xml");
}









function loadXMLDoc(dname) {
	if (window.XMLHttpRequest) {
		xhttp = new XMLHttpRequest();
	} else {
		xhttp = new ActiveXObject("Microsoft.XMLHTTP");
	}
	xhttp.open("GET", dname, false);
	xhttp.send();
	return xhttp.responseXML;
}

function handleFileSelect(evt) {
	evt.stopPropagation();
	evt.preventDefault();

	var files = evt.dataTransfer.files;
	// FileList object.

	var reader = new FileReader();
	reader.onload = function(e) {
		// get file content
		var text = e.target.result;
		document.fmain.drop_zone.value = text;
	};
	reader.readAsText(files[0]);

}

function handleDragOver(evt) {
	evt.stopPropagation();
	evt.preventDefault();
	evt.dataTransfer.dropEffect = 'copy';
	// Explicitly show this is a copy.
}

//Get mouse position
function getMouseXY(e) {
	if (ie) {
		mouseX = event.clientX + document.body.parentElement.scrollLeft;
		mouseY = event.clientY + document.body.parentElement.scrollTop;
	} else {
		mouseX = e.pageX;
		mouseY = e.pageY;
	}

	if (mouseX < 0) {
		mouseX = 0;
	}
	if (mouseY < 0) {
		mouseY = 0;
	}

	mouseX = mouseX - canvasDiv.offsetLeft;
	mouseY = mouseY - canvasDiv.offsetTop;

	return true;
}

function setPenColor(noAlert) {
	col = new jsColor("blue");

	penWidth = 1;

	if (!isNaN(penWidth))
		pen = new jsPen(col, penWidth);
	else
		pen = new jsPen(col, 1);

	if (!noAlert) {
		if (points.length == 0) {
			alert("Please click at any location on the blank canvas at left side to plot the points!");
			return false;
		} else if (points.length == 1) {
			alert("2 or more points are required to draw any curve! Please plot more points by clicking at any location on the blank canvas at left side.");
			return false;
		}
	}
	return true;
}

function drawPoint() {
	gr.fillRectangle(new jsColor("green"), new jsPoint(mouseX - 6, mouseY - 6), 6, 6);
	points[points.length] = new jsPoint(mouseX - 3, mouseY - 3);
}

function drawCurve() {
	if (!setPenColor())
		return;
	var ten = document.getElementById("tension").value;

	gr.drawCurve(pen, points, ten);

}

function drawClosedCurve() {
	if (!setPenColor())
		return;
	var ten = document.getElementById("tension").value;

	gr.drawClosedCurve(pen, points, ten);

}

function drawPolyBezier() {
	if (!setPenColor())
		return;
/*
	if (points.length == 4) {

		gr.drawBezier(pen, points);
	} else {
*/
		gr.drawPolyBezier(pen, points);
		
	/*}*/

}

function drawPointXY(px, py) {
	gr.fillRectangle(new jsColor("#00ff00"), new jsPoint(px - 3, py - 3), 6, 6);
	points[points.length] = new jsPoint(px, py);
}

function drawLine() {
	if (!setPenColor())
		return;

	gr.drawLine(pen, points[points.length - 2], points[points.length - 1]);

}

function getCircuitFromFile(quin) {
	xmlDoc = loadXMLDoc("../xmlcircuits/" + quin);
	var xmlString = (new XMLSerializer()).serializeToString(xmlDoc);
	document.fmain.drop_zone.value = xmlString;
	tubsworld();

}

function drawEixos() {
	var pcol = new jsColor("#eeeeee");
	var mypen = new jsPen(pcol, "1");

	var n = 0;
	for ( nx = -10; nx <= 10; nx++) {
		points[n++] = new jsPoint(nx * gr.ww / 20 + gr.ww / 2, 0);
		points[n++] = new jsPoint(nx * gr.ww / 20 + gr.ww / 2, gr.hh);
		gr.drawLine(mypen, points[points.length - 2], points[points.length - 1]);
	}
	for ( ny = -10; ny <= 10; ny++) {
		points[n++] = new jsPoint(0, ny * gr.hh / 20 + gr.hh / 2);
		points[n++] = new jsPoint(gr.ww, ny * gr.hh / 20 + gr.hh / 2);
		gr.drawLine(mypen, points[points.length - 2], points[points.length - 1]);
	}
	pcol = new jsColor("#eeeeee");
	mypen = new jsPen(pcol, "2");

	points[0] = new jsPoint(gr.ww, 0);
	points[1] = new jsPoint(gr.ww, gr.hh);

	points[2] = new jsPoint(0, gr.hh);
	points[3] = new jsPoint(0, gr.hh0);

	gr.drawLine(mypen, new jsPoint(gr.ww / 2, 0), new jsPoint(gr.ww / 2, gr.hh));
	gr.drawLine(mypen, new jsPoint(0, gr.hh / 2), new jsPoint(gr.ww, gr.hh / 2));

}

function imageCanvas() {

	var original = document.getElementById('canvas');
	var original3 = document.getElementById('spaces');

	var original2 = document.getElementById('data');

	var mywindow = window.open('', 'my div', 'height=400,width=600');
	mywindow.document.write('<html><head><title>my div</title>');

	mywindow.document.write('</head><body style=\"background-image:../img/fondo.png\">');

	html2canvas(original, {
		onrendered : function(canvas) {
			mywindow.document.body.appendChild(canvas);
		}
	});

	html2canvas(original3, {
		onrendered : function(canvas) {

			mywindow.document.body.appendChild(canvas);
		}
	});

	html2canvas(original2, {
		onrendered : function(canvas) {

			mywindow.document.body.appendChild(canvas);
		}
	});

	mywindow.document.write('</body></html>');

}

function tubsworld() {

	canvasDiv = document.getElementById("canvas");
	gr = new jsGraphics(canvasDiv);

	loadCircuit();

	var data = document.getElementById("data");
	data.innerHTML = "<b>" + "name:" + circuitXML.name + "<br/>" + "id:" + circuitXML.id + "<br/>" + "version:" + circuitXML.version + "<br/>" + "author:" + circuitXML.author + "<br/>" + "md5:" + circuitXML.md5 + "</b>";

	writedata();
	gr.clear();

	points = new Array();
	drawEixos();

	//posem els eixos de coordenades

	points = new Array();

	//paths
	document.forms.fmain.color.value="#0000FF";
	
	
	for ( p = 0; p < circuitXML.paths.length; p++) {
		points = new Array();

		for ( c = 0; c < circuitXML.paths[p].cells.length; c++) {
			var px = parseFloat(circuitXML.paths[p].cells[c].x);
			var py = parseFloat(circuitXML.paths[p].cells[c].y);

			var cx = parseInt((((px + 1.0) / 2.0) * gr.ww));
			var cy = parseInt((((1.0 - py) / 2.0) * gr.hh));
			drawPointXY(cx, cy);
		}

		var kpxs = parseFloat(circuitXML.paths[p].cells[0].x);
		var kpys = parseFloat(circuitXML.paths[p].cells[0].y);

		var kcxs = parseInt((((kpxs + 1.0) / 2.0) * gr.ww));
		var kcys = parseInt((((1.0 - kpys) / 2.0) * gr.hh));

		var kpxe = parseFloat(circuitXML.paths[p].cells[c - 1].x);
		var kpye = parseFloat(circuitXML.paths[p].cells[c - 1].y);

		var kcxe = parseInt((((kpxe + 1.0) / 2.0) * gr.ww));
		var kcye = parseInt((((1.0 - kpye) / 2.0) * gr.hh));

		/////////////
		var absx = 0;

		if (kcxe > kcxs) {
			absx = ((kcxe - kcxs) / 2) + kcxs;
		} else {
			absx = ((kcxs - kcxe) / 2) + kcxe;
		}

		var absy = 0;

		if (kcye > kcys) {
			absy = ((kcye - kcys) / 2) + kcys;
		} else {
			absy = ((kcys - kcye) / 2) + kcye;
		}

		//debug.output("absx:" + absx + " absy:" + absy);

		gr.drawText(circuitXML.paths[p].name, new jsPoint(absx, absy), "", new jsColor("red"), "0.2", "center");
		drawPolyBezier();



		/*
		var ctx=c.getContext("2d");
        var img=document.getElementById("scream");
        ctx.drawImage(img,10,10);
            */

	}
	//gates
	document.forms.fmain.color.value = "#AA0000";
	var g, gp;
	for ( g = 0; g < circuitXML.gates.length; g++) {

		for ( gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {
			points = new Array();

			for ( cp = 0; cp < circuitXML.gates[g].paths[gp].cells.length; cp++) {

				var px = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].x);
				var py = parseFloat(circuitXML.gates[g].paths[gp].cells[cp].y);

				var cx = parseInt((((px + 1.0) / 2.0) * gr.ww));
				var cy = parseInt((((1.0 - py) / 2.0) * gr.hh));
				//document.fmain.debug += "cx:" + cx + " cy:" + cy;
				drawPointXY(cx, cy);

			}
			drawPolyBezier();
		}

	}
}

function fillClosedCurve() {
	if (!setPenColor())
		return;
	var ten = document.getElementById("tension").value;

	gr.fillClosedCurve(col, points, ten);

}

function clearCanvas() {

	var r = confirm("Perdràs tots els canvis. Estàs segur ?");
	if (r == true) {
		canvasDiv = document.getElementById("canvas");
		gr = new jsGraphics(canvasDiv);
		gr.clear();
		points = new Array();
		drawEixos();
		document.forms.fmain.drop_zone.value="";
			
		var data = document.getElementById("data");
		data.innerHTML = "<b>" + "name:<br/>" + "id:" + "<br/>" + "version:" + "<br/>" + "author:" + "<br/>" + "md5:	" + "</b>";
		
		debug.clear();
		document.forms.fmain.circuits.value="default.xml";
		getCircuitFromFile("default.xml");
	}
}

function clearPreviousPoints() {
	points = new Array();
}

function CheckTension() {
	var ten = document.getElementById("tension").value;
	if (!isNaN(ten)) {
		if (ten > 10)
			document.getElementById("tension").value = 10;
		else if (ten < -10)
			document.getElementById("tension").value = -10;
	}
}

