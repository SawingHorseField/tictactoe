//global variable declarations
var newGameButton;
var table;
var label;
var checkbox;

var cells = [];
var player = "X";
var turnCounter;
var win = false;

document.addEventListener('DOMContentLoaded', function () {

    table = document.getElementById("table");

    label = document.getElementById("label");

    checkbox = document.getElementById("checkbox");

    newGameButton = document.getElementById("newGameButton");
    newGameButton.addEventListener("click", newGame);

    for (let i = 0; i < 3; i++) {

        let row = document.createElement("tr");

        for (let j = 0; j < 3; j++) {
            let cell = document.createElement("td");

            cells[i+3*j] = cell;
            cell.addEventListener("click", () => handleClick(i + 3 * j))

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    newGame();

});

function newGame() {
    player = "X";
    label.innerHTML = `It\'s ${player}\'s turn`
    cells.forEach((cell) => { cell.innerHTML = ""; });
    turnCounter = 0;
    win = false;
}

function handleClick(ind) {
    //no overriding positions
    if (win || cells[ind].innerHTML != "") return;

    cells[ind].innerHTML = player;
    turnCounter++;

    //playing against computer?

    if (checkWin(player)) {
        label.innerHTML = `The winner is ${player}s!`;
        win = true;
    }
    else if (turnCounter > 8) {
        label.innerHTML = "It's a draw!";
    }
    //play against computer section
    else if (checkbox.checked && player == "X") {
        player = "O";
        handleClick(computerTurn());
        return;
    }
    else {
        if (player == "X") player = "O";
        else player = "X";
        label.innerHTML = `It\'s ${player}\'s turn`;
    }
}


function checkWin(character) {
    //the eight possible lines to victory
    let horizontal = [0, 0, 0];
    let vertical = [0, 0, 0];
    let diagonal = [0, 0];
    for (let i = 0; i < 9; i++) {
        if (cells[i].innerHTML != character) continue;

        //conditions that happen to determine if the index is in a certain line
        horizontal[i % 3] += 1;
        vertical[parseInt(i / 3)] += 1;
        if ((i % 4) == 0) diagonal[0] += 1;
        if (i == 2 || i == 4 || i == 6) diagonal[1] += 1;
    }

    //if any of the line sums are 3, there is a winner
    return (horizontal.indexOf(3) != -1 || vertical.indexOf(3) != -1 || diagonal.indexOf(3) != -1);
}

function computerTurn() {
    // if Os can win, do
    let index = winIndex("O");
    if (index != -1) return index;

    // if Xs can win, block
    index = winIndex("X")
    if (index != -1) return index;

    // otherwise, choose a random spot
    //get a integer from 0 to the number of open spots-1 (8-turnCounter)
    index = Math.floor(Math.random() * (8 - turnCounter));
    for (let i = 0; i < 9; i++) {

        if (cells[i].innerHTML == "") {
            if (index == 0) return i;
            //if you cross an open spot remove one from index
            index--;
            //thus the index that gets returned will be the ind'th index without a X or O where ind is the original index found before the for loop
        }

    }

    throw "it should be impossible to get this far";
    return -1;
}

/**
 * returns index by which character could win or -1 if no such index exists
 * @param  {String} character  X or O
 */
function winIndex(character) {
    let horizontal = [0, 0, 0];
    let vertical = [0, 0, 0];
    let diagonal = [0, 0];
    for (let i = 0; i < 9; i++) {
        let n = 1;
        if (cells[i].innerHTML != character && cells[i].innerHTML != "") continue;

        //differentiate blanks from characters
        if (cells[i].innerHTML == character) n = 2;

        //conditions that happen to determine if the index is in a certain line
        horizontal[i % 3] += n;
        vertical[parseInt(i / 3)] += n;
        if ((i % 4) == 0) diagonal[0] += n;
        if (i == 2 || i == 4|| i == 6) diagonal[1] += n;
    }

    //a row with a sum of 5 has two characters and a blank spot
    let index = horizontal.indexOf(5);

    if (index != -1) {
        for (let i = 0; i < 3; i++) {
            if (cells[index + 3 * i].innerHTML == "") { return index + i * 3; }
        }
    }
    index = vertical.indexOf(5);
    if (index != -1) {
        for (let i = 0; i < 3; i++) {
            if (cells[3 * index + i].innerHTML == "") return 3 * index + i;
        }
    }
    index = diagonal.indexOf(5);
    if (index == 0) {
        for (let i = 0; i < 9; i+=4) {
            if (cells[i].innerHTML == "") return i;
        }
    }
    else if (index == 1) {
        for (let i = 2; i < 7; i += 2) {
            if (cells[i].innerHTML == "") return i;
        }
    }
    return -1;
}