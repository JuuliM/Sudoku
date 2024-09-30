class Sudoku {
    constructor(container, gridSize = 9, subgridSize = 3) { 
        this.container = container;
        this.grid = [];
        this.solution = [];
        this.gridSize = gridSize;
        this.subgridSize = subgridSize;
        this.tileSelected = null;

        this.selectTile = this.selectTile.bind(this);
        this.selectNumber = this.selectNumber.bind(this);
        this.pressNumber = this.pressNumber.bind(this);
    }

    //make the grid
    makeGrid() {
        for (let i = 0; i < this.gridSize; i++) {
            //All nodes in the grid are initially empty (marked with 0)
            this.grid[i] = new Array(9).fill(0);
            this.solution[i] = new Array(9).fill(0);
            }
    }

    //fill the grid with numbers one to nine
    populateGrid() {
        //go trough the grid
        for (let i = 0; i < this.gridSize; i++) {
            //go trough the row
            for (let j = 0; j < this.gridSize; j++) {
                //if grid node doesn't have designated number yet
                if (this.grid[i][j] == 0) {
                    let attempts = 0;
                    //while not all available numbers hasn't been tried yet
                    while (attempts < 9) {
                        // num = random int between one to nine
                        const num = Math.floor(Math.random()*9)+1;
                        //if isSafe method returns true num is added to the node in guestion
                        if(this.isSafe(i, j, num)) {
                            this.grid[i][j] = num;
                            this.solution[i][j] = num;
                            //if this method returns true, so num fits to the node in guestion
                            if (this.populateGrid(this.grid)) {
                                return true;
                                }
                            //if populated grid recursion = false the node in guestion will be 0 (empty)
                            this.grid[i][j] = 0;
                            this.solution[i][j] = 0;
                        }
                        //if isSafe returns false
                         attempts++;
                    }
                    //if attempts > 9
                    return false;
                }
            }
        }
        // if all conditions in this method are true
        return true;
    }

    //determine if num from previous method fits the node in guestion from previous method
    isSafe(row, column, num) {
        for (let i = 0; i < this.gridSize; i++) {
            //if there already is the same number in same row
            if (this.grid[row][i] == num) {
                    return false;
            }
            //if there already is the same number in same column
            if (this.grid[i][column] == num) {
                return false;
            }
        }
        //variables to determine the 3x3 subgrid, to make sure that no same num is in the subgrid
        // subgridSize = 3
        const startRow = Math.floor(row/this.subgridSize)*this.subgridSize;
        const startColumn = Math.floor(column/this.subgridSize)*this.subgridSize;
        for (let i = startRow; i < startRow+this.subgridSize; i++) {
            for (let j = startColumn; j < startColumn+this.subgridSize; j++) {
                //if the node in guestion in the subgrid = num
                if (this.grid[i][j] == num) {
                    return false;
                }
            }
        }
        //if the num from populateGrid method can be placed in the node from populateGrid method
        return true;
    }

    //remove random numbers from the grid to be filled by the player
    removeNumbers(count) {
        //while the number of numbers to be removed from grid is has not been met yet
        while (count > 0) {
            //variable for random row wehere to remove a number
            let row = Math.floor(Math.random()*9);
            //variable for random column wehere to remove a number
            let column = Math.floor(Math.random()*9);
            //if the node from where to remove a number is not empty already
            if (this.grid[row][column] !== 0) {
                //remove the number in guestion
                this.grid[row][column] = 0;
                count -= 1;
            }
        }
    }

    setGame() {
        //Digits 1-9 below the board that user can choose from 
        for (let i = 1; i <= 9; i++){
            let number = document.createElement("div");
            number.id = i;
            number.innerText = i;
            number.addEventListener("click", this.selectNumber);
            number.classList.add("number");
            document.getElementById("digits").appendChild(number);
        }
        //Generates the board and adds id to each tile (row-col) f.e (0-0), (2-1)....
        for (let row = 0; row < 9; row++){
            for (let col = 0; col < 9; col++){
                let tile = document.createElement("div");
                tile.id = row+"-"+col;
                if (this.grid[row][col] != "0"){
                    tile.innerText = this.grid[row][col];
                    tile.classList.add("tile-start");
                }
                //Add darker lines to the board so boxes are more visible
                if (row == 2 || row == 5){
                    tile.classList.add("horizontal-line");
                }
                if (col == 2 || col == 5){
                    tile.classList.add("vertical-line");
                }       
                tile.addEventListener("click", this.selectTile);
                document.addEventListener("keypress", this.pressNumber);
                tile.classList.add("tile");
                document.getElementById("sudoku-board").append(tile);
            }
        }
    }

    //After selecting tile, press number in keyboard to add it to the tile
    pressNumber(event) {
        if (this.tileSelected && event.key >= 1 && event.key <= 9) {
            let coords = this.tileSelected.id.split("-");
            let row = parseInt(coords[0]);
            let col = parseInt(coords[1]);
            let num = parseInt(event.key);

            if (this.grid[row][col] === num) {
                this.tileSelected.innerText = "";
                this.grid[row][col] = 0;
                this.tileSelected.classList.remove("tile-correct", "tile-error");
            } else if (this.grid[row][col] === 0) {
                this.tileSelected.innerText = num;
                if (this.solution[row][col] == num) {
                    this.tileSelected.classList.add("tile-correct");
                    this.tileSelected.classList.remove("tile-error");
                    this.grid[row][col] = num;
                } else {
                    this.tileSelected.classList.add("tile-error");
                    this.tileSelected.classList.remove("tile-correct");
                    this.grid[row][col] = num;
                }
            }
        }
    }
            
    // Changes the background of tile selected to gray
    selectTile(event){
        if (this.tileSelected != null){
            this.tileSelected.classList.remove("tile-selected");
            this.tileSelected.classList.remove("tile-correct");
        }
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                document.getElementById(i+"-"+j).classList.remove("highlight");
                console.log(i+"-"+j);
            }
        }
        
        let coords = this.tileSelected.id.split("-");
        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);
        for (let i = 0; i < this.gridSize; i++) {
            document.getElementById(row+"-"+i).classList.add("highlight");
            document.getElementById(i+"-"+col).classList.add("highlight");
            }
            //variables to determine the 3x3 subgrid
            const startRow = Math.floor(row/3)*3;
            const startColumn = Math.floor(col/3)*3;
            for (let i = startRow; i < startRow+3; i++) {
                for (let j = startColumn; j < startColumn+3; j++) {
                    document.getElementById(i+"-"+j).classList.add("highlight");
                }
            }
        //this.tileSelected = this;
        this.tileSelected = event.target;
        this.tileSelected.classList.add("tile-selected");
    }

    // After selecting tile, select number below and it is added to the tile.
    selectNumber(event){
        if (!this.tileSelected) {
            return;
        }
        let coords = this.tileSelected.id.split("-");
        let row = parseInt(coords[0]);
        let col = parseInt(coords[1]);
        let num = parseInt(event.target.id);

        if (this.grid[row][col] === num) {
            this.tileSelected.innerText = "";
            this.grid[row][col] = 0;
            this.tileSelected.classList.remove("tile-correct", "tile-error");
        } else { //if (this.tileSelected && this.grid[row][col] === 0) {
            this.tileSelected.innerText = num;
            //if sentence to check if the set number is correct
            if (this.solution[row][col] === num){
                this.tileSelected.classList.add("tile-correct");
                this.tileSelected.classList.remove("tile-error");
                this.grid[row][col] = num;
            } else {
                this.tileSelected.classList.add("tile-error");
                this.tileSelected.classList.remove("tile-correct");
                this.grid[row][col] = num;
            }
        }
    }

    solve() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.grid[i][j] === 0) {
                    this.grid[i][j] = this.solution[i][j];
                    document.getElementById(i+"-"+j).innerText = this.solution[i][j];
                    document.getElementById(i+"-"+j).classList.remove("tile-correct", "tile-error");
                }
            }
        }
    }
}
