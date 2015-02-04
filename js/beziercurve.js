
/*
 * working in beizercurve_0.1
 */


var vBeizercurve = new BeizerCurve();


function point(x,y){this.x=x;this.y=y;};


function BezierCurve(){
};

BezierCurve.prototype.getAllData = function(circuit){
	this.circuit=circuit;
	this.P=new Array;
};

BezierCurve.prototype.clear = function(){
};

function P(point){
	this.pt=new Array;
	this.y=y;
	this.num=num;
}


/*
function readControlPointsFromPaths(path){
		
		
		var cells = new Array;
		cells = new cCircuit("circuit.xml").getCellsFromPath(path);
		
		for (i = 0; i < cells.size(); i++) {
			this.P.pt[i] = new Graphics.floatPoint();
			this.P.pt[i].x = (float) cells.get(i).getX();
			this.P.pt[i].y = (float) cells.get(i).getY();
		}
		P.num = i;
	};
/*
	function readControlPointsFromGates(Circuit c,
			Graphics.floatPointArray P, int k) {
		LinkedList<Cell> cells = new LinkedList<Cell>();
		cells = c.allCellsFromGate(k);
		int i;
		for (i = 0; i < cells.size(); i++) {
			P.pt[i] = new Graphics.floatPoint();
			P.pt[i].x = (float) cells.get(i).getX();
			P.pt[i].y = (float) cells.get(i).getY();
		}
		P.num = i;
	}

	function ComputeCoeff(int n) {
		int j, k;
		for (k = 0; k <= n; k++) { // compute n! / (k!*(n-k)!)
			coef[k] = 1;
			for (j = n; j >= k + 1; j--)
				coef[k] *= j;
			for (j = n - k; j >= 2; j--)
				coef[k] /= j;
		}
	}

	private float BlendingValue(int n, int k, float t) {
		int j;
		float bv;
		// compute c[k]*t^k * (1-t)^(n-k)
		bv = coef[k];
		for (j = 1; j <= k; j++)
			bv *= t;
		for (j = 1; j <= n - k; j++)
			bv *= (1 - t);
		return bv;
	}

	function ComputePoint(float t, int n, Graphics.floatPoint p,
			Graphics.floatPointArray ctrlPts) {

		int k;
		float b;

		p.x = (float) 0.0;
		p.y = (float) 0.0;
		for (k = 0; k <= n; k++) {
			b = BlendingValue(n, k, t);

			p.x += ctrlPts.pt[k].x * b;
			p.y += ctrlPts.pt[k].y * b;
		}
	}

	// compute the array of Bezier points - drawing done separately
	function Bezier(Graphics.floatPointArray controlPts, int numInter,
			Graphics.floatPointArray curve) {
		// there are numContPts+1 control points and numInter t values to
		// evaluate the curve

		int k;
		float t;
		ComputeCoeff(controlPts.num - 1);
		curve.num = numInter + 1;
		for (k = 0; k < numInter; k++) {
			t = (float) k / (float) numInter;
			ComputePoint(t, controlPts.num - 1, curve.pt[k], controlPts);
		}
	}
	*/