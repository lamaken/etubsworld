/*
*
* tubsworld.js
* created:9.11.2012
* author:alk@soft
*
*
*/

//////////////////////////////////
//lector de XML circuits pel tubsworld
//////////////////////////////////

var action = "edit";
var cwidth = 500;
var cheight = 500;

function loadCircuit() {

	var txt = document.fmain.drop_zone.value;
	if (window.DOMParser) {
		parser = new DOMParser();
		xmlDoc = parser.parseFromString(txt, "text/xml");
	} else// Internet Explorer
	{
		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
		xmlDoc.async = false;
		xmlDoc.loadXML(txt);
	}

	var x = xmlDoc.getElementsByTagName("circuit");
	var c_name = x[0].getAttributeNode("name").nodeValue;
	var c_id = x[0].getAttributeNode("id").nodeValue;
	var c_version = x[0].getAttributeNode("version").nodeValue;
	var c_author = x[0].getAttributeNode("author").nodeValue;
	var c_md5 = x[0].getAttributeNode("md5").nodeValue;

	circuitXML = new cCircuit(c_name, c_id, c_version, c_author, c_md5);

	var px = x[0].getElementsByTagName("paths");

	var ps = px[0].getElementsByTagName("path");

	var index = 0;

	//// lector dels paths
	var
	pi;

	var paths = new Array;

	for ( pi = 0; pi < ps.length; pi++) {

		var name = ps[pi].getAttributeNode("name").nodeValue;

		var nextpath = "";
		if (ps[pi].getAttributeNode("nextpath") != null)//si te nextpath l'assignem'
			nextpath = ps[pi].getAttributeNode("nextpath").nodeValue;

		var nextgate = "";
		if (ps[pi].getAttributeNode("nextgate") != null)//si te next gate l'assignem
			nextgate = ps[pi].getAttributeNode("nextgate").nodeValue;

		//creo el path
		paths[pi] = new cPath(name, nextpath, nextgate);

		var coord = new Array();
		var cp = ps[pi].getElementsByTagName("coord");
		//coords from path

		var cpi;
		var coords = new Array;

		for ( cpi = 0; cpi < cp.length; cpi++) {
			var xx, yy, type;
			xx = cp[cpi].getAttributeNode("x").nodeValue;
			yy = cp[cpi].getAttributeNode("y").nodeValue;
			type = cp[cpi].getAttributeNode("type").nodeValue;

			//alert("x:" + x + " y:" + y + " type:" + type);
			coords[cpi] = new cCell(xx, yy, type);

		}

		paths[pi].addCell(coords);
	}

	circuitXML.addPaths(paths);

	//// lector dels gates
	var gx = x[0].getElementsByTagName("gates");
	var gs = gx[0].getElementsByTagName("gate");

	var gi;

	var gates = new Array;

	for ( gi = 0; gi < gs.length; gi++) {

		var gname = gs[gi].getAttributeNode("name").nodeValue;
		//document.write("gname:"+gname+"<br/>");

		gates[gi] = new cGate(gname);

		//paths dels gates
		var gpaths = new Array;
		var gp = gs[gi].getElementsByTagName("path");

		for ( gpi = 0; gpi < gp.length; gpi++) {

			var pname = gp[gpi].getAttributeNode("name").nodeValue;
			//document.write("> pname:"+pname+"<br/>");

			var pnextpath = "";
			if (gp[gpi].getAttributeNode("nextpath") != null)//si te nextpath l'assignem'
				pnextpath = gp[gpi].getAttributeNode("nextpath").nodeValue;

			var pnextgate = "";
			if (gp[gpi].getAttributeNode("nextgate") != null)//si te next gate l'assignem
				pnextgate = gp[gpi].getAttributeNode("nextgate").nodeValue;

			//creo el path
			gpaths[gpi] = new cPath(pname, pnextpath, pnextgate);

			var coord = new Array();
			var cp = gp[gpi].getElementsByTagName("coord");
			//coords from path

			var cpi;
			var coords = new Array;

			for ( cpi = 0; cpi < cp.length; cpi++) {
				var x, y, type;
				x = cp[cpi].getAttributeNode("x").nodeValue;
				y = cp[cpi].getAttributeNode("y").nodeValue;
				type = cp[cpi].getAttributeNode("type").nodeValue;

				//alert();
				//document.write("> pname:"+pname+" << x:" + x + " y:" + y + " type:" + type+"<br/>");
				coords[cpi] = new cCell(x, y, type);

			}

			gpaths[gpi].addCell(coords);

		}
		gates[gi].addPaths(gpaths);

	}

	circuitXML.addGates(gates);

}

////////////////////////////////////////
//genera codi java per l'aplicacio//////
////////////////////////////////////////
function writedata() {
	var p, c;
	var db = "";

	db += circuitXML.toString() + "\n";
	db += "paths+\n";
	for ( p = 0; p < circuitXML.paths.length; p++) {
		db += circuitXML.paths[p].toString() + "\n";
		for ( c = 0; c < circuitXML.paths[p].cells.length; c++) {
			db += circuitXML.paths[p].cells[c].toString() + "\n";
		}
	}

	db += "\ngates\n";
	var g, gp;
	for ( g = 0; g < circuitXML.gates.length; g++) {

		db += circuitXML.gates[g].toString() + "\n";

		for ( gp = 0; gp < circuitXML.gates[g].paths.length; gp++) {

			db += circuitXML.gates[g].paths[gp].toString() + "\n";
			for ( cp = 0; cp < circuitXML.gates[g].paths[gp].cells.length; cp++) {
				db += circuitXML.gates[g].paths[gp].cells[cp].toString() + "\n";
			}

		}

	}

}



function generateView() {

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

		//drawPolyBezier();
		//gr.drawText(circuitXML.paths[p].name, new jsPoint(absx, absy), "", new jsColor("red"), "0.2", "center");

		//per cada path

		var step = curvePoints.length / 100;

		for (var i = 0; i < curvePoints.length; i += Math.round(step)) {
			var next = false;
			var x = curvePoints[i].x;
			var y = curvePoints[i].y;
			if (i == 0) {
				context.moveTo(x, y);

			} else {
			}

			context.lineTo(x, y);
		}

	}

	//---------------
	function run() {

		canvas = document.getElementById("tbcanvas");
		canvas.style.background = "white";
		canvas.width = cwidth;
		canvas.height = cheight;

		context = canvas.getContext("2d");
		debug.output("total points of curve:" + curvePoints.length);
		debug.output("width:" + cwidth + " height:" + cheight);

		context.beginPath();
		context.lineWidth = 1;

		context.strokeStyle = '#000000';

		context.moveTo(0, 0);

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

			drawPolyBezier();
			gr.drawText(circuitXML.paths[p].name, new jsPoint(absx, absy), "", new jsColor("red"), "0.2", "center");

			//per cada path

			var step = curvePoints.length / 100;

			for (var i = 0; i < curvePoints.length; i += Math.round(step)) {
				var next = false;
				var x = curvePoints[i].x;
				var y = curvePoints[i].y;
				if (i === 0) {
					context.moveTo(x, y);

				} else {
				}

				context.lineTo(x, y);
			}

			context.lineWidth = 1;
			context.strokeStyle = '#0000ff';
			context.lineCap = 'butt';
			context.stroke();

		}

	}

}