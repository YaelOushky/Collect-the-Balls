'use strict'
var WALL = 'WALL';
var FLOOR = 'FLOOR';
var BALL = 'BALL';
var GAMER = 'GAMER';
var GLUE = 'GLUE';

var GAMER_IMG = '<img src="img/gamer.png" />';
var BALL_IMG = '<img src="img/ball.png" />';
var GLUE_IMG = '<img src="img/gamer-purple.png" />';

var gIsGlue = false
var gIntervalGLUE
var gInterval
var gBoard;
var gGamerPos;
var gCount = 0
var gNumBalls = 3
var gSound = new Audio('sound/pu.mp3');
var gWinnerSound = new Audio('sound/winner.mp3');
var gErrorSound = new Audio('sound/error.mp3');


function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gBoard = buildBoard();
	renderBoard();
	gInterval = setInterval(function () { creatBall() }, 3000)
	gIntervalGLUE = setInterval(function () { creatGLUE() }, 5000)
}

function checkWin() {
	var collect = document.querySelector('h2 span')
	collect.innerHTML = gCount
	console.log(collect);
	if (!gNumBalls) {
		clearInterval(gInterval)
		clearInterval(gIntervalGLUE)
		gWinnerSound.play()
		// gCount = 0
		var collect = document.querySelector('h2 span')
		collect.innerText = 0
	}
}

function creatGLUE() {
	var randomI = getRandomInt(1, 8)
	var randomJ = getRandomInt(1, 10)
	if (gBoard[randomI][randomJ].gameElement !== GAMER) {
		gBoard[randomI][randomJ].gameElement = GLUE
	}
	var location = { i: randomI, j: randomJ }
	renderCell(location, GLUE_IMG)
	setTimeout(() => {
		if (gBoard[randomI][randomJ].gameElement === GAMER) return
		gBoard[randomI][randomJ].gameElement = null
		elCell.innerHTML = '';
	}, 3000);
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
}

function creatBall() {
	var randomI = getRandomInt(1, 8)
	var randomJ = getRandomInt(1, 10)
	if (gBoard[randomI][randomJ].gameElement !== GAMER) {
		gBoard[randomI][randomJ].gameElement = BALL
		gNumBalls++
	}
	var location = { i: randomI, j: randomJ }
	renderCell(location, BALL_IMG)
}


function buildBoard() {
	// Create the Matrix
	var board = createMat(10, 12)
	// Put FLOOR everywhere and WALL at edges
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {

			// Put FLOOR in a regular cell
			var cell = { type: FLOOR, gameElement: null };

			// Place Walls at edges
			if (i === 0 || i === board.length - 1 || j === 0 || j === board[0].length - 1) {
				cell.type = WALL;
			}
			board[i][j] = cell;
		}
	}
	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;
	board[6][2].gameElement = BALL;
	board[0][Math.floor(board[0].length / 2)].type = FLOOR
	board[board.length - 1][Math.floor(board[0].length / 2)].type = FLOOR
	board[Math.floor(board[0].length / 2)][0].type = FLOOR
	board[Math.floor(board[0].length / 2)][board[0].length - 1].type = FLOOR
	return board;
}

// Render the board to an HTML table
function renderBoard() {
	var strHTML = '';
	for (var i = 0; i < gBoard.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < gBoard[0].length; j++) {
			var currCell = gBoard[i][j];
			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			//TODO - Change To template string
			strHTML += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n';

			// TODO - change to switch case statement
			if (currCell.gameElement === GAMER) {
				strHTML += GAMER_IMG;
			} else if (currCell.gameElement === BALL) {
				strHTML += BALL_IMG;
			}
			strHTML += '\t</td>\n';
		}
		strHTML += '</tr>\n';
	}
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {
	if (gIsGlue) return
	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);

	// If the clicked Cell is one of the four allowed
	if (((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0)) || (i === 0 || j === gBoard[0].length - 1 || j === 0 || i === gBoard.length - 1)) {
		if (targetCell.gameElement === BALL) {
			gSound.play()
			gCount++
			gNumBalls--
		}
		if (targetCell.gameElement === GLUE) {
			gErrorSound.play()
			gIsGlue = true
			setTimeout(() => {
				gIsGlue = false
			}, 3000);
		}
		// MOVING from current position
		// Model:
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
		// Dom:
		renderCell(gGamerPos, '');

		// MOVING to selected position
		// Model:
		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		// DOM:
		renderCell(gGamerPos, GAMER_IMG);
	}
	checkWin()
}

// Convert a location object {i, j} to a selector and render a value in that element
function renderCell(location, value) {
	var cellSelector = '.' + getClassName(location)
	var elCell = document.querySelector(cellSelector);
	elCell.innerHTML = value;
}

// Move the player by keyboard arrows
function handleKey(event) {
	var i = gGamerPos.i;
	var j = gGamerPos.j;

	switch (event.key) {
		case 'ArrowLeft':
			if (j === 0) moveTo(i, gBoard[0].length - 1)
			else moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			if (j === gBoard[0].length - 1) moveTo(i, 0)
			else moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			if (i === 0) moveTo(gBoard.length - 1, j)
			else moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			if (i === gBoard.length - 1) moveTo(0, j)
			else moveTo(i + 1, j);
			break;
	}
}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}

function getRandomInt(min, max) {
	min = Math.ceil(min);
	max = Math.floor(max);
	return Math.floor(Math.random() * (max - min + 1) + min);
}