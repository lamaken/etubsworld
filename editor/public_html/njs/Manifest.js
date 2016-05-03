var packagename = "visualk.games.circuitstubs";
var revision = ".0";
var version = "v0.0.1";
var projectname = "etubsworld";
var changes = "Initial steps.";
var description = "Try to save the balls in theirs houses.";
var debugmode = false;
var build = 0;

function Manifest() {
	this.version = version;
	this.projectname = projectname;
	this.packagename = packagename;
	this.changes = changes;
	this.description = description;
	this.debugmode = debugmode;
	this.revision = revision;
};

Manifest.prototype.toString = function() {
	var result = "<xml><manifest version=\"" + this.version + this.revision + "\" > projectname=\"" + this.projectname + "\">";
	result = result + "</manifest></xml>";
	return result;
};

Manifest.prototype.getrelease = function() {
	return(this.projectname+" "+this.version+this.revision);
};
