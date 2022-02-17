//global variable declarations
var cells = [];
var table;
var player = "X";
var label;
var turnCounter;
var newGameButton;
var win = false;

document.addEventListener('DOMContentLoaded', function () {

    table = document.getElementById("table");

    label = document.getElementById("label");

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

    if (turnCounter > 8) {
        label.innerHTML = "It's a draw!";
    }
    else if (checkWin(player)) {
        label.innerHTML = `The winner is ${player}s!`;
        win = true;
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
        if ([2, 4, 6].indexOf(i) != -1) diagonal[1] += 1;
    }

    //if any of the line sums are 3, there is a winner
    return (horizontal.indexOf(3) != -1 || vertical.indexOf(3) != -1 || diagonal.indexOf(3) != -1);
}