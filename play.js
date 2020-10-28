let width = 20;
let height = 20;
let size = 500/width;
let grid_field = [];

Array.prototype.random = function () {
    return this[Math.floor((Math.random()*this.length))];
}

var line = (x, y, w, z) => {
    context.moveTo(x, y);
    context.lineTo(w, z);
}

var canvas = document.getElementById('my_canvas');
var context = canvas.getContext('2d');

function Cell(i, j) {
    this.i = i;
    this.j = j;
    this.visited = false;
    
    let x = i * size;
    let y = j * size;

    // top, bottom, left, right
    this.walls = {
        top: { status: true, coords: [x, y + size, x, y] },
        bottom: { status: true, coords: [x + size, y, x + size, y + size] },
        left: { status: true, coords: [x, y, x + size, y] },
        right: { status: true, coords: [x + size, y + size, x, y + size] }
    }

    this.show = () => {
        context.strokeStyle = 'black';
        context.stroke();

        Object.values(this.walls).forEach(
            (value) => {
                value.status ? line(...value.coords) : null
            }
        )
    }
}

function generate_empty_maze() {
    for (let i = 0; i < width; i++) {
        for (let j = 0; j < height; j++) {
            grid_field.push(new Cell(i, j));
        }
    }
}

function get_cell(i, j) {
    for (let x = 0; x < grid_field.length; x++) {
        if (grid_field[x].i === i && grid_field[x].j === j) {
            return grid_field[x];
        }
    }
}

function get_neighbors(neighbors, i, j) {
    // x, y, current cell wall to remove, neighbor cell wall to remove
    let all_neighbors = [
        [i-1, j, 'top', 'bottom'],
        [i+1, j, 'bottom', 'top'],
        [i, j-1, 'left', 'right'],
        [i, j+1, 'right', 'left']
    ]

    all_neighbors.forEach((element) => {
        if (
            element[0] >= 0 && element[1] >= 0 &&
            element[0] < width && element[1] < height &&
            get_cell(element[0], element[1]).visited === false
        ) neighbors.push(element);
    });
}

function remove_neighbor(neighbors, i, j) {
    let index = null;

    for (let x = 0; x < neighbors.length; x++) {
        if (neighbors[x][0] === i && neighbors[x][1] === j) index = x;
    }

    if (index !== null) {
        neighbors.splice(index);
    }
}

// true is setted when cell is visited
function generate_maze(current_cell) {
    current_cell.visited = true;
    let neighbors = [];
    get_neighbors(neighbors, current_cell.i, current_cell.j);

    while (neighbors.length !== 0) {
        // get neighbors
        let [x, y, current_wall, neighbor_wall] = neighbors.random();
        remove_neighbor(neighbors, x, y);

        current_cell.walls[current_wall].status = false;

        let neighbor_cell = get_cell(x, y);
        neighbor_cell.walls[neighbor_wall].status = false;

        generate_maze(neighbor_cell);
    }
}

function draw() {
    context.fillStyle = "black";
    grid_field.forEach((element) => {element.show()});
}

// build grid field
generate_empty_maze();

// console.log(grid_field);

// generate maze
generate_maze(grid_field[0]);

draw();