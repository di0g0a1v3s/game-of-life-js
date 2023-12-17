const CANVAS_HEIGHT = 500;
const CANVAS_WIDTH = 500;
const GRID_WIDTH = 100;
const GRID_HEIGHT = 100;
const RANDOM_INITIAL_DEAD_CELLS_RATIO = 0.5
const SPEED = 50


const GridElementType = {
    ALIVE: 1,
    DEAD: 0
}

class Grid {
    constructor(width, height, startRandom) {
        this.height = height;
        this.width = width;
        this.grid = new Array(width).fill();
        this.grid = this.grid.map(_ => new Array(height).fill());
        for(let i = 0; i < width; i++) {
            for(let j = 0; j < height; j++) {
                this.grid[i][j] = startRandom ? 
                            (Math.random() < RANDOM_INITIAL_DEAD_CELLS_RATIO ? GridElementType.DEAD : GridElementType.ALIVE)
                            : GridElementType.DEAD;
            }
        }
    }
    
    getElement(x, y) {
        if(x >= 0 && y >= 0 && x < this.width && y < this.width){
            return this.grid[x][y];
        }
        return GridElementType.DEAD;
        
    }

    setElement(x, y, value){
        if(x >= 0 && y >= 0 && x < this.width && y < this.width && (value === GridElementType.ALIVE || value === GridElementType.DEAD)){
            this.grid[x][y] = value;
        }
    }

    getHeight() {
        return this.height;
    }

    getWidth() {
        return this.width;
    }

    calcNextGrid() {
        const newGrid = new Grid(this.width, this.height, false);
        for(let i = 0; i < this.width; i++) {
            for(let j = 0; j < this.height; j++) {
                const neighbourCount = this.getNumberOfAliveNeighbours(i, j);
                const isLive = this.getElement(i,j) === GridElementType.ALIVE
                if(isLive && neighbourCount < 2){
                    newGrid.setElement(i, j, GridElementType.DEAD)
                } else if(isLive && (neighbourCount === 2 || neighbourCount === 3)){
                    newGrid.setElement(i, j, GridElementType.ALIVE)
                } else if(isLive && neighbourCount > 3){
                    newGrid.setElement(i, j, GridElementType.DEAD)
                } else if(!isLive && neighbourCount === 3){
                    newGrid.setElement(i, j, GridElementType.ALIVE)
                } else{
                    newGrid.setElement(i, j, GridElementType.DEAD)
                }
            }
        }
        return newGrid;
    }

    getNumberOfAliveNeighbours(x, y){
        const neighbours = 
        [
            {x: x-1, y: y}, 
            {x: x-1, y: y-1},  
            {x: x-1, y: y+1}, 
            {x: x, y: y-1}, 
            {x: x, y: y+1}, 
            {x: x+1, y: y}, 
            {x: x+1, y: y-1},  
            {x: x+1, y: y+1}, 
        ];
        let count = 0;
        neighbours.forEach(neighbour => {
            if(this.getElement(neighbour.x, neighbour.y) === GridElementType.ALIVE){
                count++;
            }
        })
        return count;
    }
}

class Canvas {
    constructor(width, height) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = width;
        this.canvas.height = height;
        document.body.appendChild(this.canvas);
        this.clearCanvas();
    }

    clearCanvas() {
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    updateWithGrid(grid) {
        this.clearCanvas();
        let ctx = this.canvas.getContext("2d");
        ctx.fillStyle = "white";
        const squareWidth = this.canvas.width/grid.getWidth();
        const squareHeight = this.canvas.height/grid.getHeight();
        for(let i = 0; i < grid.getWidth(); i++) {
            for(let j = 0; j < grid.getHeight(); j++) {
                if(grid.getElement(i, j) === GridElementType.ALIVE){
                    ctx.fillRect(i*squareWidth, j*squareHeight, squareWidth, squareHeight);
                }
            }
        }
    }

}

let grid = new Grid(GRID_WIDTH, GRID_HEIGHT, true)
let canvas = new Canvas(CANVAS_WIDTH, CANVAS_HEIGHT)
canvas.updateWithGrid(grid);
setInterval(() => {
    grid = grid.calcNextGrid()
    canvas.updateWithGrid(grid);
}, 1000/SPEED)

