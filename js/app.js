const WALL = 'WALL';
const FLOOR = 'FLOOR';
const BALL = 'BALL';
const GAMER = 'GAMER';

const GAMER_IMG = '<img src="img/gamer.png" />';
const BALL_IMG = '<img src="img/ball.png" />';

var gBoard;
var gGamerPos;
var gCollecte;
var aBalls;
var gIntervalBall;

function initGame() {
	gGamerPos = { i: 2, j: 9 };
	gCollecte = 0;
	aBalls = 2;
	if (gIntervalBall) {
		clearInterval(gIntervalBall);
	}
	gBoard = buildBoard();
	renderBoard(gBoard);
	console.log(gBoard);
	gIntervalBall = setInterval(insertBall, 3000);

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
			if ((i === 4 && j === 0) || (i === 0 && j === 6) || (i === 4 && j === 11) || (i === 9 && j === 6)) {
				var cell = { type: FLOOR, gameElement: null };
			}
			// Add created cell to The game board
			board[i][j] = cell;
		}
	}

	// Place the gamer at selected position
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER;

	// Place the Balls (currently randomly chosen positions)
	board[3][8].gameElement = BALL;
	board[7][4].gameElement = BALL;

	console.log(board);
	return board;
}

// Render the board to an HTML table
function renderBoard(board) {


	var strHTML = '';
	for (var i = 0; i < board.length; i++) {
		strHTML += '<tr>\n';
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j];

			var cellClass = getClassName({ i: i, j: j })

			// TODO - change to short if statement
			if (currCell.type === FLOOR) cellClass += ' floor';
			else if (currCell.type === WALL) cellClass += ' wall';

			// TODO - Change To template string
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

	console.log('strHTML is:');
	console.log(strHTML);
	var elBoard = document.querySelector('.board');
	elBoard.innerHTML = strHTML;
}

// Move the player to a specific location
function moveTo(i, j) {

	var targetCell = gBoard[i][j];
	if (targetCell.type === WALL) return;

	// Calculate distance to make sure we are moving to a neighbor cell
	var iAbsDiff = Math.abs(i - gGamerPos.i);
	var jAbsDiff = Math.abs(j - gGamerPos.j);


	// If the clicked Cell is one of the four allowed
	if ((iAbsDiff === 1 && jAbsDiff === 0) || (jAbsDiff === 1 && iAbsDiff === 0) ) {
		//	console.log('trgetcell: ', targetCell.gameElement);
		if (targetCell.gameElement === BALL) {
			gCollecte++;
			console.log('Collecting!' + gCollecte);
			yair();
			console.log('gColl: ', gCollecte, ' aBalls: ', aBalls);
			if (gCollecte === aBalls) {
				alert('you are win!');
				clearInterval(gIntervalBall);
				return
			}
		}
	}
	// MOVING from current position
	// Model:
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null;
	// Dom:
	renderCell(gGamerPos, '');

	// MOVING to selected position

		gGamerPos.i = i;
		gGamerPos.j = j;
		gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		if (gGamerPos.i === 4 && gGamerPos.j === 0) { //i = 4; j = 11; 
			gGamerPos.i = 4;
			gGamerPos.j = 10;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		}
		else if (gGamerPos.i === 0 && gGamerPos.j === 6) { //i = 9; j = 6; 
			gGamerPos.i = 8;
			gGamerPos.j = 6;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		}
		else if (gGamerPos.i === 4 && gGamerPos.j === 11) { //i = 4; j = 0; 
			gGamerPos.i = 4;
			gGamerPos.j = 1;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER;
		}
		else if (gGamerPos.i === 9 && gGamerPos.j === 6) {
			gGamerPos.i = 1;
			gGamerPos.j = 6;
			gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER; //i = 0; j = 6;
		} 

	// Model:

	// DOM:
	renderCell(gGamerPos, GAMER_IMG);

	// else console.log('TOO FAR', iAbsDiff, jAbsDiff);

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
			moveTo(i, j - 1);
			break;
		case 'ArrowRight':
			moveTo(i, j + 1);
			break;
		case 'ArrowUp':
			moveTo(i - 1, j);
			break;
		case 'ArrowDown':
			moveTo(i + 1, j);
			break;

	}

}

// Returns the class name for a specific cell
function getClassName(location) {
	var cellClass = 'cell-' + location.i + '-' + location.j;
	return cellClass;
}



function getRandomEmptyCell(board) {
	var res = [];
	var coord = {};
	//console.log(board);
	for (var i = 1; i < board.length - 1; i++) {

		//	console.log(board[i]);
		for (var j = 1; j < board[0].length - 1; j++) {
			if (board[i][j].type === FLOOR) {
				coord = { i: i, j: j };
				res.push(coord);
			}
		}

	}
	return res[getRandomNumber(res.length)];
}

function insertBall() {
	var emptyCell = getRandomEmptyCell(gBoard);
	console.log(emptyCell);
	gBoard[emptyCell.i][emptyCell.j].gameElement = BALL; //model
	renderCell(emptyCell, BALL_IMG); //Dom
	aBalls++;
}

function getRandomNumber(max) {
	return Math.floor(Math.random() * max + 1)
}

function yair() {
	document.getElementById("getCollected").innerHTML = `count collected: ${gCollecte}`;
}