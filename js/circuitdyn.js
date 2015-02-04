//classe circuit : per guardar les dades del xml
//9.11.2012

var circuitXML;

///////////////////////////////// cell
function cCell(x, y, type) {
	this.x = x;
	this.y = y;
	this.type = type;
}

function cCell(x, y) {
	this.x = x;
	this.y = y;
	this.type="not set";
}

cCell.prototype.toString = function toString() {
	return ("x:" + this.x + " y:" + this.y + " type:" + this.type);
	//<coord type="start" x="-0.9" y="0" />
};



///////////////////////////////// path
function cPath(name, nextpath, nextgate) {
	this.name = name;
	this.nextpath = nextpath;
	this.nextgate = nextgate;

	var cells = new Array;

}

cPath.prototype.toString = function toString() {
	return ("name:" + this.name + " nextpath:" + this.nextpath + " nextgate:" + this.nextgate);
};

cPath.prototype.addCell = function addCell(cells) {
	this.cells = cells;
};

//////////////////////////////////// gate
function cGate(name) {
	this.name = name;
	var paths = new Array;
}

cGate.prototype.addPaths = function addPaths(paths) {
	this.paths = paths;
};
cGate.prototype.toString = function toString() {
	return ("name:" + this.name);
};


////////////////////////////////////// circuit
function cCircuit(name, id, version, author, md5) {
	this.name = name;
	this.id = id;
	this.version = version;
	this.author = author;
	this.md5 = md5;
	var paths = new Array;
	var gates = new Array;
}


cCircuit.prototype.getAllCellsFromPaths = function getAllCellsFromPaths(p){
	var cells = new Array;
	for (c=0;c<paths[p].cells.lenght;c++)cells[c]=new cCell(paths[p].cells[c].x,paths[p].cells[c].y);
	return cells;
};

cCircuit.prototype.getAllCellsFromGates = function getAllCellsFromGates(g){
	var cells = new Array;
	for (c=0;c<gates[g].cells.lenght;c++)cells[c]=new cCell(gates[g].cells[c].x,gates[g].cells[c].y);
	return cells;
};


cCircuit.prototype.toString = function toString() {
	return ("name:" + this.name + " id:" + this.id + " version:" + this.version + " author:" + this.author + " md5:" + this.md5);
};

cCircuit.prototype.addPaths = function addPaths(paths) {
	this.paths = paths;
};

cCircuit.prototype.addGates = function addGates(gates) {
	this.gates = gates;
};
