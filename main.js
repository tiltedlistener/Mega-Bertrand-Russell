// JavaScript Document
window.requestAnimFrame = (function(){
      return  window.requestAnimationFrame       || 
              window.webkitRequestAnimationFrame || 
              window.mozRequestAnimationFrame    || 
              window.oRequestAnimationFrame      || 
              window.msRequestAnimationFrame     || 
              function( callback ){
                window.setTimeout(callback, 1000 / 60);
              };
})();


Game = {
	canvas : {
		c : document.getElementById('c'),
		width : document.getElementById('c').width,
		height : document.getElementById('c').height,
		ctx : document.getElementById('c').getContext("2d"),
	},
	constants : {
		bg : new Image(),
		br : new Image(),
		arm : new Image(),
		man : new Image(),
		manR : new Image(),
		pm : new Image(),
	},
	quotes : [ "War does not determine who is right - only who is left.", 
			   "The trouble with the world is that the stupid are cocksure and the intelligent are full of doubt.", 
			   "To fear love is to fear life, and those who fear life are already three parts dead.",
			   "Anything you're good at contributes to happiness.",
			   "To conquer fear is the beginning of wisdom. "]
}

Game.bootstrap = (function () {
	
	var c,
		ctx,
		i = 0,
		stopTimeout = 0;
	
	function pull() {
		
			for (module in Game) {
				if (module != '_proto_' && module != 'interface') {
					if (typeof Game[module] != 'undefined') {
						
						// Get all of our Init Functions
						if (typeof Game[module].init != 'undefined') 	
							Game[module].init();
					}
				}
			}
			
		startQuotes();
	}
	
	function startQuotes() {
		
			$('#quotes').text(Game.quotes[i]);
			$('#quotes').fadeIn('slow', function () {
				i++;
				if (i++ >= 5)
					i = 0;	
				if (stopTimeout == 0) {
					setTimeout (function () {
						$('#quotes').fadeOut('slow', function() {
							startQuotes();	
						});	
					}, 4000)
				} else {
				}
				
			});
	}
	
	function stopQuotes() {
		stopTimeout = 1;	
	}
	
	return {
		pull : pull,
		stopQuotes : stopQuotes
	}
	
})();

Game.background = (function() {
	
	// Modules 
	var Constants;
	
	function init() {
	
		Constants = Game.constants;
		
		Constants.bg.src = 'images/bg.png';
		Constants.arm.src = 'images/arm.png';
		Constants.br.src ='images/b-man.jpg';
		Constants.man.src = 'images/man.png';
		Constants.manR.src = 'images/man-right.png';
		Constants.pm.src = 'images/pm.jpg';
		
	}
	
	return {
		init : init	
	}
	
})();

Game.loop = (function () {
	
	// Modules
	var Constants,
		Canvas;
	
	var timeNow,
		lastTime = 0,
		elapsedTime,
		stopAnim = 0;
	
	function init() {
		
		// Set Modules
		Constants = Game.constants;
		Canvas = Game.canvas;
		
		// Stroke style 
		Canvas.ctx.strokeStyle = "rgba(141,141,141,0.5)";
		Canvas.ctx.lineWidth = "4";
	
		// Fire in the hole
		setTimeout(function () {
			$('#overlay').fadeOut('slow', tick);	
		}, 2000);
		
	}
	
		// Animation Functions
	function animate() {
		timeNow = new Date().getTime();
		if (lastTime != 0) {
			elapsed = timeNow - lastTime;		
		}
		lastTime = timeNow;
	}	
    function tick() {
		
		if (stopAnim == 0) {
			requestAnimFrame(tick);
			animate();
			loop();
		} else {
			
		}
    }
	
	function stopIt() {
		stopAnim = 1;	
		$('#end').fadeIn();
		$('#c, #title, #controls').fadeOut();
		$('#quotes').stop().fadeOut();
	}
	
	function loop() {
		
		// Clear
		Canvas.ctx.clearRect(0, 0, Game.canvas.width, Game.canvas.height);
		
		// Set Loop
		Canvas.ctx.drawImage(Constants.br, 0,0);
		Canvas.ctx.drawImage(Constants.arm, Game.bertrand.moveArm(), 175);
		
		// Set Backround
		Canvas.ctx.drawImage(Constants.bg, 0,100);						
		Game.bertrand.fireBook();		
		Game.bertrand.smoke();
				
		// Draw Man
		Canvas.ctx.drawImage(Game.man.setImage(), Game.man.setX(), Game.man.setY());
		
	}
	
	
	return {
		init : init,
		stopIt : stopIt 
	}
	
})();

Game.bertrand = (function () {
	
	// Modules
	var Canvas,
		Constants;
	
	var height =10,
		way = 1,
		current = 0,
		currentBook = 0,
		currentBookY = 0,
		currentBookX = 0,
		time = 0,
		setFiring = 0,
		maxRight = 0,
		smokePos = 225,
		canSmoke = 0;
		
	function init() {
		Canvas = Game.canvas;
		Constants = Game.constants;		
		currentBookX = Canvas.width/2-50;
		maxRight = Canvas.width - 50 - 91;
	}
	
	function moveArm() {
		
		if (current > 4) { 
			if (height > 30) {
				way = -1;
				allowSmoke();
			}
			else if (height < 5)
				way = 1;
				
			height += way;
			current = 0;
			
			return height;
		} else {
			current++;
			return height;	
		}
	}
	
	function fireBook() {
		
		if (setFiring == 1) {
			Canvas.ctx.drawImage(Constants.pm, getX(), setY());
				
			if (setY() > Canvas.height || Game.man.checkCollision(Canvas.width/2-50, setY()))
				setFiring = time = 0;
		}
		
	}
	
	function setY() {
		time++;
		return currentBookY = 0.25 * (9.8 * (time)^2);
	}
	
	function setX(val) {
		var tempVal = currentBookX + val;
		
		if (tempVal< 0)
			currentBookX = 0;
		else if (tempVal > maxRight) 
			currentBookX = maxRight;
		else 
			currentBookX = tempVal;
	}
	
	function getX() {
		return currentBookX;	
	}
	
	function setToFire() {
		setFiring = 1;	
	}
	
	function smoke() {
		if (canSmoke == 1) {
			bezierCurve(60, smokePos, 80, 25);
			smokePos--;	
			
			if (smokePos < 0) {
				canSmoke = 0;
				smokePos = 225;	
			}
		}
	}
	
	function bezierCurve(centerX, centerY, width, height) {
		Canvas.ctx.beginPath();
		Canvas.ctx.moveTo(centerX, centerY - height / 2);
	
		Canvas.ctx.bezierCurveTo(
			centerX + width / 2, centerY - height / 2,
			centerX + width / 2, centerY + height / 2,
			centerX, centerY + height / 2
		);
		Canvas.ctx.bezierCurveTo(
			centerX - width / 2, centerY + height / 2,
			centerX - width / 2, centerY - height / 2,
			centerX, centerY - height / 2
		);
		
		Canvas.ctx.stroke();
		Canvas.ctx.closePath();
	}
	
	function allowSmoke() {
		canSmoke = 1;
	}	
	
	return {
		init : init,
		setX : setX,
		moveArm : moveArm,
		fireBook : fireBook,
		setToFire : setToFire,
		smoke : smoke
	}

})();

Game.man = (function() {
	
	// Modules
	var Canvas,
		Constants;
	
	var startHeight,
		startWidth,
		direction = -1,
		widthLimitLeft = 10,
		widthLimit = 450,
		width,
		height,
		heightPercent = 1;
		
	function init() {
		Canvas = Game.canvas;
		Constants = Game.constants;
		
		startWidth = width = Canvas.width/2;
		startHeight = height = Canvas.height - 100;
		widthLimit = Canvas.width - 50;
	}
	
	function setX() {
	
		if (width < widthLimitLeft)  {
			direction = 1;
			width += direction;
		} else if (width > widthLimit) {
			direction = -1;
			width += direction;
		} else {
			width += direction;	
		}
		
		return width;
	}
	
	function setY() {
		if (height < 100)
			height = startHeight;
		else 
			height--;
		
		heightPercent = height/startHeight
		
		return height;
	}
	
	function checkCollision(x, y) {
				
		if (height > y && height < (y+141)) 
			if (width > x && width < (x + 91) || (width + 38) > x && (width + 38) < (x + 91)) {
				Game.bootstrap.stopQuotes();
				Game.loop.stopIt();
				return true;	
			}
		return false;
	}
	
	function resetMan() {
		width = startWidth;
		height = startHeight;
	}
	
	function setImage() {
		if (direction == -1)
			return Constants.man;
		else 
			return Constants.manR;
	}
	
	return {
		init : init,
		setX : setX,
		setY : setY,
		setImage : setImage,
		checkCollision : checkCollision
	}
	
})();

Game.controls = (function (){
	
	var fire, left, right;
	
	function init() {
		
		fire = $('#fire');
		left = $('#left');
		right = $('#right');
		
		fire.click(fireBook);
		left.click(moveLeft);
		right.click(moveRight);
	}
	
	function moveLeft() {
		Game.bertrand.setX(-10);
	}
	
	function moveRight() {
		Game.bertrand.setX(10);
	}
	
	function fireBook() {
		Game.bertrand.setToFire();
	}
	
	return {
		init : init	
	}
	
})();

window.onload = Game.bootstrap.pull