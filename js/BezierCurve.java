/**
 * 
 */
package visualk.games.tubsworld.model.scenes.TestScene.view;

import java.util.LinkedList;

import visualk.games.tubsworld.BuildConfig;
import visualk.games.tubsworld.MainActivity;
import visualk.games.tubsworld.R;

import visualk.games.tubsworld.control.Core;
import visualk.games.tubsworld.model.scenes.TestScene.Constants;

import visualk.games.tubsworld.model.scenes.TestScene.controler.LogicControl;
import visualk.games.tubsworld.model.scenes.TestScene.model.Ball;
import visualk.games.tubsworld.model.scenes.TestScene.model.Cell;
import visualk.games.tubsworld.model.scenes.TestScene.model.Circuit;
import visualk.games.tubsworld.model.scenes.TestScene.model.Path;

import android.annotation.SuppressLint;
import android.app.Application;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.BlurMaskFilter;
import android.graphics.Color;
import android.graphics.Paint.Join;
import android.graphics.Typeface;
import android.graphics.BlurMaskFilter.Blur;
import android.graphics.Canvas;
import android.graphics.MaskFilter;
import android.graphics.Paint;
import android.graphics.Paint.Cap;
import android.graphics.Paint.Style;
import android.util.Log;
import android.widget.LinearLayout;
import android.widget.TextView;

/**
 * @author alex
 * 
 * 
 *         Es lencarregat de dibuixar el circuit i les boles
 * 
 * 
 * 
 */

public class BezierCurve {

	public boolean canIDraw = true;

	public Circuit circuit;

	private int[] coef = new int[Constants.MAXCONTPTS]; // the binomial
	public boolean start = true;

	int espera = 0; // path
	float kBLUR = 0;// TODO:BLUR

	private Graphics.floatPointArray[] circuitCurve = null;

	private Graphics.floatPointArray[] gatesCurve = null;
	private Graphics.floatPointArray ControlPts = new Graphics.floatPointArray();

	public int numPaths;
	public int numGates;

	Bitmap bmpSave;
	Bitmap bmpDead;
	Bitmap bmpLive;

	Bitmap bmpTemp;

	// TODO:PATHS
	android.graphics.Path graph_path_Paths = null;

	// android.graphics.Path graph_path_Gates = null;

	private void drawPoints() {
		visualk.games.tubsworld.Graphics.canvas.drawText(Constants.points, 0,
				Graphics.fontsize, Graphics.paintText);
	}

	private void drawRecord() {

		float x = visualk.games.tubsworld.Graphics.width
				/ 2
				- Graphics.paintTextYellow
						.measureText(LogicControl.firstRecord) / 2;
		visualk.games.tubsworld.Graphics.canvas.drawText(
				LogicControl.firstRecord, x, Graphics.fontsize,
				Graphics.paintTextYellow);
	}

	public BezierCurve() {
		start = true;
		graph_path_Paths = new android.graphics.Path();// guardo
		// TODO:PATHS graph_path_Gates = new android.graphics.Path();// guardo

		circuitCurve = new Graphics.floatPointArray[Constants.MAXPATHS];
		gatesCurve = new Graphics.floatPointArray[Constants.MAXGATES];

		circuit = null;
		circuit = new Circuit();
		circuit.Create();

	}

	public void create() {

		creaJoc();

		numPaths = circuit.numPaths();
		for (int i = 0; i < numPaths; i++) {
			// read control points and draw them in red big points
			readControlPointsFromPaths(circuit, ControlPts, i);
			// Compute the Bezier curve points and draw
			Bezier(ControlPts, Constants.MAX, circuitCurve[i]);
		}

		numGates = circuit.numGates();
		for (int i = 0; i < numGates; i++) {
			// read control points and draw them in red big points
			readControlPointsFromGates(circuit, ControlPts, i);
			// Compute the Bezier curve points and draw
			Bezier(ControlPts, Constants.MAX, gatesCurve[i]);
		}

		resetCircuit();

	}

	public void swapGates() {

		circuit.swapGates();
		for (int i = 0; i < numGates; i++) {
			// read control points
			readControlPointsFromGates(circuit, ControlPts, i);
			// Compute the Bezier curve points and draw
			Bezier(ControlPts, Constants.MAX, gatesCurve[i]);
		}
		// TODO:PATHS resetGates();

	}

	public void swapGatesPLAYERS() {

		// if (LogicControl.gameType == Constants._1P) {
		if (circuit != null) {// TODO:XAPUZA A VECES ES NULL
			if ((LogicControl.gameType == Constants._CHALENGE)
					|| (LogicControl.gameType == Constants._NEW)) {

				int numBalls = LogicControl.Player1().getBalls().size();

				for (int k = 0; k < numBalls; k++) {
					int actualpath = LogicControl.Player1().getBallAt(k)
							.actualPath();
					int actualgate = circuit.getPathAt(actualpath)
							.getNextGate();
					LogicControl.Player1().getBallAt(k)
							.setActualGate(actualgate);
				}
			}
		}

	}// refresh players gates

	public void controlPLAYERS(float elapsedtime) {
		// time += elapsedtime;
		// if (time >Constants.VELOCITY_AVATARS) {
		LogicControl.update(elapsedtime);
		// time = 0;
		// }
	} // logica

	@SuppressLint("ParserError")
	public void initdraw() {

		Graphics.paintGate = new Paint();
		Graphics.paintGate.setAntiAlias(true);
		Graphics.paintGate.setStyle(Style.STROKE);
		Graphics.paintGate.setStrokeCap(Cap.ROUND);
		Graphics.paintGate.setStrokeJoin(Join.ROUND);
		Graphics.paintGate.setStrokeWidth(Graphics.circuitWidth);
		Graphics.paintGate.setColor(0xFF4455fb);

		Graphics.paintPath = new Paint();
		Graphics.paintPath.setAntiAlias(true);
		Graphics.paintPath.setStrokeCap(Cap.ROUND);
		Graphics.paintPath.setStyle(Style.STROKE);
		Graphics.paintPath.setStrokeWidth(Graphics.circuitWidth);
		Graphics.paintPath.setColor(0xFFFFFFFF);
		Graphics.paintPath.setStrokeJoin(Join.ROUND);

		
		Typeface typeface = Typeface.createFromAsset(Core.singleton().getActivity().getAssets(), "fonts/LEHN085.ttf");
		
		Graphics.paintText = new Paint();
		Graphics.paintText.setAntiAlias(true);
		Graphics.paintText.setARGB(255, 255, 255, 255);
		Graphics.paintText.setStyle(Style.STROKE);
		Graphics.paintText.setTextSize(Graphics.fontsize);
		Graphics.paintText.setTypeface(typeface);
		
		Graphics.paintTextYellow = new Paint();
		Graphics.paintTextYellow.setAntiAlias(true);
		Graphics.paintTextYellow.setARGB(255, 170, 253, 89);
		Graphics.paintTextYellow.setStyle(Style.STROKE);
		Graphics.paintTextYellow.setTextSize(Graphics.fontsize);
		Graphics.paintTextYellow.setTypeface(typeface);

		Graphics.paintBall = new Paint();
		Graphics.paintBall.setAntiAlias(true);
		// Graphics.paintBall.setStyle(Style.STROKE);
		// Graphics.paintBall.setStrokeWidth(4);
		Graphics.paintBall.setARGB(255, 170, 253, 89);
		// Graphics.paintBall.setMaskFilter(new BlurMaskFilter(15, Blur.OUTER));

		Graphics.paintMain = new Paint();

		bmpDead = BitmapFactory.decodeResource(
				visualk.games.tubsworld.Graphics.context.getResources(),
				R.drawable.dead);
		bmpTemp = BitmapFactory.decodeResource(
				visualk.games.tubsworld.Graphics.context.getResources(),
				R.drawable.cor);

		bmpSave = BitmapFactory.decodeResource(
				visualk.games.tubsworld.Graphics.context.getResources(),
				R.drawable.home);
		bmpLive = Bitmap.createScaledBitmap(bmpTemp,
				(int) (bmpTemp.getWidth() * 0.5),
				(int) (bmpTemp.getHeight() * 0.5), true);

		

		// TODO:PATHS 
		resetCircuit();
	}

	void resetCircuit() {

		float cx;
		float cy;

		// /////////////////////////////
		graph_path_Paths.reset();
		for (int cc = 0; cc < numPaths; cc++) {
			cx = circuitCurve[cc].pt[0].x;
			cy = circuitCurve[cc].pt[0].y;
			float sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
			float sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);
			graph_path_Paths.moveTo(sX, sY);
			graph_path_Paths.lineTo(sX, sY);
			for (int k = 0; k < circuitCurve[cc].num - 1; k++) {
				cx = circuitCurve[cc].pt[k].x;
				cy = circuitCurve[cc].pt[k].y;
				sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
				sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);
				graph_path_Paths.lineTo(sX, sY);

			}
		}
		// TODO: PATHSresetGates();

	}

	/*
	 * TODO:PATHS void resetGates() {
	 * 
	 * float cx; float cy; canIDraw = false; graph_path_Gates.reset();
	 * 
	 * for (int cc = 0; cc < numGates; cc++) { cx = gatesCurve[cc].pt[0].x; cy =
	 * gatesCurve[cc].pt[0].y; float sX = (float) (((cx + 1.0) / 2.0) *
	 * visualk.games.tubsworld.Graphics.width); float sY = (float) (((1.0 - cy)
	 * / 2.0) * visualk.games.tubsworld.Graphics.height);
	 * 
	 * graph_path_Gates.moveTo(sX, sY); graph_path_Gates.lineTo(sX, sY);
	 * 
	 * for (int k = 0; k < gatesCurve[cc].num - 1; k++) { cx =
	 * gatesCurve[cc].pt[k].x; cy = gatesCurve[cc].pt[k].y; sX = (float) (((cx +
	 * 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width); sY = (float)
	 * (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);
	 * 
	 * graph_path_Gates.lineTo(sX, sY);
	 * 
	 * } } canIDraw = true; }
	 */
	public void draw() {

		// long startTime, timeDiff;

		if (start) {
			initdraw();
			start = false;
		} else {

			// TODO:draw all

			Integer k = LogicControl.step_draw;

			if (MainActivity.DEBUG)
				Log.v("STEP", k.toString());

			// if(LogicControl.step_draw==0){

			// startTime = System.currentTimeMillis();
			drawFondo();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawfondo", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawPaths();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawPaths", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawGates();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawGates", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawPilotaLLESTA();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawPilotaLLESTA", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawIcons();// icons de dead y se house }//pinta escena
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawIcons", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawLives();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawLives", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawPoints();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawPoints", timeDiff + "");

			// startTime = System.currentTimeMillis();
			drawRecord();
			// timeDiff = System.currentTimeMillis() - startTime;
			// Log.v("elapsed.drawRecord", timeDiff + "");

			if (MainActivity.DEBUG) {
				drawDebug();
			}
		}
	}

	private void drawDebug() {
		float cx;
		float cy;

		for (int cc = 0; cc < numPaths; cc++) {
			cx = circuitCurve[cc].pt[0].x;
			cy = circuitCurve[cc].pt[0].y;
			float sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
			float sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);

			if (null != circuit.getPathAt(cc)) {

				visualk.games.tubsworld.Graphics.canvas.drawText(circuit
						.getPathAt(cc).getId(), sX, sY - 3, Graphics.paintText);

				for (int k = 0; k < circuitCurve[cc].num - 1; k++) {
					cx = circuitCurve[cc].pt[k].x;
					cy = circuitCurve[cc].pt[k].y;
					sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
					sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);

				}

			}

		}

	}

	private void drawGates() {
		if (canIDraw) {
			// TODO: PATHS
			// visualk.games.tubsworld.Graphics.canvas.drawPath(graph_path_Gates,Graphics.paintGate);

			float startX = 0;
			float startY = 0;

			for (int num = 0; num < numGates; num++) {

				float cx = gatesCurve[num].pt[0].x;
				float cy = gatesCurve[num].pt[0].y;

				cx = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
				cy = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);

				startX = cx;
				startY = cy;

				for (int i = 0; i < gatesCurve[num].num - 1; i++) {

					// TODO Xapuza para no pinte gate en 0,0

					if ((gatesCurve[num].pt[i].x != 0)
							|| (gatesCurve[num].pt[i].y != 0)) {

						cx = gatesCurve[num].pt[i].x;
						cy = gatesCurve[num].pt[i].y;

						cx = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
						cy = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);

						int wx = (int) (visualk.games.tubsworld.Graphics.width / 2 - cx);
						int wy = (int) (visualk.games.tubsworld.Graphics.height / 2 - cy);

						int sx = (int) (visualk.games.tubsworld.Graphics.width / 2 - startX);
						int sy = (int) (visualk.games.tubsworld.Graphics.height / 2 - startY);

						if (((wx != 0) || (wy != 0))
								&& ((sx != 0) || (sy != 0))) {
							visualk.games.tubsworld.Graphics.canvas.drawLine(
									startX, startY, cx, cy, Graphics.paintGate);
						}
					}
					startX = cx;
					startY = cy;
				}
			}
		}
	}

	private void drawPaths() {
		// TODO:PATHS
		 visualk.games.tubsworld.Graphics.canvas.drawPath(graph_path_Paths,
		 Graphics.paintPath);
	/*	if (canIDraw) {

			float cx;

			float cy;
			float antX = 0;
			float antY = 0; //
			// ///////////////////////////
			for (int cc = 0; cc < numPaths; cc++) {
				cx = circuitCurve[cc].pt[0].x;
				cy = circuitCurve[cc].pt[0].y;
				float sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
				float sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);

				antX = sX;
				antY = sY;
				for (int k = 0; k < circuitCurve[cc].num - 1; k++) {
					cx = circuitCurve[cc].pt[k].x;
					cy = circuitCurve[cc].pt[k].y;
					sX = (float) (((cx + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
					sY = (float) (((1.0 - cy) / 2.0) * visualk.games.tubsworld.Graphics.height);
					visualk.games.tubsworld.Graphics.canvas.drawLine(antX,
							antY, sX, sY, Graphics.paintPath);

					antX = sX;
					antY = sY;
				}
			}
		}*/
	}

	private void readControlPointsFromPaths(Circuit c,
			Graphics.floatPointArray P, int k) {

		LinkedList<Cell> cells = new LinkedList<Cell>();
		cells = c.allCellsFromPath(k);
		int i;
		for (i = 0; i < cells.size(); i++) {
			P.pt[i] = new Graphics.floatPoint();
			P.pt[i].x = (float) cells.get(i).getX();
			P.pt[i].y = (float) cells.get(i).getY();
		}
		P.num = i;
	}

	private void readControlPointsFromGates(Circuit c,
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

	private void ComputeCoeff(int n) {
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

	private void ComputePoint(float t, int n, Graphics.floatPoint p,
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
	private void Bezier(Graphics.floatPointArray controlPts, int numInter,
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

	private void creaJoc() {

		circuitCurve = new Graphics.floatPointArray[Constants.MAXPATHS];
		gatesCurve = new Graphics.floatPointArray[Constants.MAXPATHS];

		for (int k = 0; k < Constants.MAXPATHS; k++) {
			circuitCurve[k] = new Graphics.floatPointArray();
			for (int m = 0; m < Constants.MAX; m++)
				circuitCurve[k].pt[m] = new Graphics.floatPoint();
		}

		for (int k = 0; k < Constants.MAXPATHS; k++) {
			gatesCurve[k] = new Graphics.floatPointArray();
			for (int m = 0; m < Constants.MAX; m++)
				gatesCurve[k].pt[m] = new Graphics.floatPoint();
		}

	}

	private void drawFondo() {
		// Graphics.canvas.drawBitmap(bmpFondo, 0, 0, Graphics.paintMain);
		visualk.games.tubsworld.Graphics.canvas.drawColor(Color.BLACK);
	}

	private void drawIcons() {
		for (int p = 0; p < circuit.numPaths(); p++) {
			Path path = circuit.getPathAt(p);
			if (path.getEndType() == Constants._KILLED) {
				putDead(path.getEndCell().getX(), path.getEndCell().getY());
			}
			if (path.getEndType() == Constants._SAVED) {
				putSaved(path.getEndCell().getX(), path.getEndCell().getY());
			}

		}
	}

	private void drawLives() {

		int num = Constants.lives.length();
		for (int n = 1; n < num; n++) {
			visualk.games.tubsworld.Graphics.canvas.drawBitmap(
					bmpLive,
					visualk.games.tubsworld.Graphics.width
							- (bmpLive.getWidth() * (num - n)), 0,
					Graphics.paintMain);
		}

	}

	private void putDead(double d, double e) {

		float x = (float) (((d + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
		float y = (float) (((1.0 - e) / 2.0) * visualk.games.tubsworld.Graphics.height);

		visualk.games.tubsworld.Graphics.canvas.drawBitmap(bmpDead,
				x - bmpDead.getWidth() / 2, y - bmpDead.getHeight() / 2,
				Graphics.paintMain);
	}

	// Graphics.canvas.drawBitmap(b, x, y, Graphics.paint);

	private void putSaved(double px, double py) {

		float x = (float) (((px + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
		float y = (float) (((1.0 - py) / 2.0) * visualk.games.tubsworld.Graphics.height);

		visualk.games.tubsworld.Graphics.canvas.drawBitmap(bmpSave,
				x - bmpSave.getWidth() / 2, y - bmpSave.getHeight() / 2,
				Graphics.paintMain);
	}

	private void drawPilotaLLESTA() {
		// hi posem la piloteta
		int numballs;
		int actualpath;

		// Integer b=LogicControl.step_draw;

		// Log.v("STEP", b.toString());

		float px = 0, py = 0;

		kBLUR += 1.1;
		if (kBLUR > 50.1)
			kBLUR = (float) 10.1;

		// ///////////////////////////////// oneplayer

		// if (LogicControl.gameType == Constants._1P) {
		if ((LogicControl.gameType == Constants._CHALENGE)
				|| (LogicControl.gameType == Constants._NEW)) {

			numballs = LogicControl.Player1().getBalls().size();

			// nomes pintem la que toca.
			for (Integer b = 0; b < numballs; b++) {
				// if(numballs>0){

				Ball ball = LogicControl.Player1().getBalls().get(b);
				actualpath = ball.actualPath();

				if (actualpath != Constants.FINAL_CIRCUIT) {
					if (ball.getSemafor() == 0) {// if is in a path
						px = circuitCurve[actualpath].pt[ball.position()].x;
						py = circuitCurve[actualpath].pt[ball.position()].y;
					} else {// if is in a gate
						px = gatesCurve[ball.actualGate()].pt[ball.position()].x;
						py = gatesCurve[ball.actualGate()].pt[ball.position()].y;
					}
				}

				int x = (int) (((px + 1.0) / 2.0) * visualk.games.tubsworld.Graphics.width);
				int y = (int) (((1.0 - py) / 2.0) * visualk.games.tubsworld.Graphics.height);

				if ((px != 0) || (py != 0)) {

					/*
					 * Graphics.paintBall.setMaskFilter(new
					 * BlurMaskFilter(kBLUR, Blur.OUTER));
					 * 
					 * visualk.games.tubsworld.Graphics.canvas.drawCircle(x, y,
					 * Graphics.ballWidth, Graphics.paintBall);
					 * 
					 * Graphics.paintBall.setMaskFilter(new BlurMaskFilter(5,
					 * Blur.INNER));
					 */
					if (MainActivity.DEBUG)
						Graphics.paintBall
								.setARGB(255, 70 * b, 253 * b / 2, 89);
					visualk.games.tubsworld.Graphics.canvas.drawCircle(x, y,
							Graphics.ballWidth, Graphics.paintBall);
					if (MainActivity.DEBUG)
						visualk.games.tubsworld.Graphics.canvas.drawText(
								ball.unique.toString(), x, y,
								Graphics.paintText);

				}
				// TODO:podria ser una elipse que seguis el path sinx rad etc..

			}

		}
		// //////////////////// one player
	}

	public Circuit getCircuit() {
		// TODO Auto-generated method stub
		return circuit;
	}
}
