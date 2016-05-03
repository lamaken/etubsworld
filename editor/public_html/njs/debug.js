/*
 gestio dels missatges de debug per la consola
 */


function Debug(tag){
 this.tag=tag;
 this.clear();
 this.line=0;
};

Debug.prototype.output = function(text){
	var div_debug = document.getElementById("debug");
	this.line++;
	div_debug.innerHTML=div_debug.innerHTML+"<br/>"+"["+this.line+":"+this.tag+"] > "+text; 
	div_debug.scrollTop = div_debug.scrollHeight;
};

Debug.prototype.clear = function(){
	var m = new Manifest();
	var div_debug = document.getElementById("debug");
	div_debug.innerHTML=m.getrelease(); 
	div_debug.scrollTop = div_debug.scrollHeight;
};



