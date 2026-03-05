// Constants and helpers

const BUBBLE = 'O';
const BLOCK = 'B';
const EMPTY = '.';

const MOVES = ['CW', 'CCW'];

const cloneGrid = (g) => g.map(r => r.slice());

const gridToString = (g) => g.map(r => r.join('')).join('\n');

const isEmptyGrid = (g) => g.every(row => row.every(c => c === EMPTY));

//Rotation (grid + door

const rotateCW = (grid) => {
    const N = grid.length;
    const r = Array.from({ length: N }, () => Array(N).fill(EMPTY));
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            r[x][N - 1 - y] = grid[y][x];
        }
    }
    return r;
};

const rotateCCW = (grid) => {
    const N = grid.length;
    const r = Array.from({ length: N }, () => Array(N).fill(EMPTY));
    for (let y = 0; y < N; y++) {
        for (let x = 0; x < N; x++) {
            r[N - 1 - x][y] = grid[y][x];
        }
    }
    return r;
};

const rotateDoorCW = (door) => {
    const { side, index } = door;
    if (side === 'top') {
        return { side: 'right', index };
    }
    if (side === 'right') {
        return { side: 'bottom', index };
    }
    if (side === 'bottom') {
        return { side: 'left', index };
    }
    if (side === 'left') {
        return { side: 'top', index };
    }
};

const rotateDoorCCW = (door) => {
    const { side, index } = door;
    if (side === 'top') {
        return { side: 'left', index };
    }
    if (side === 'left') {
        return { side: 'bottom', index };
    }
    if (side === 'bottom') {
        return { side: 'right', index };
    }
    if (side === 'right') {
        return { side: 'top', index };
    }
};

// Physics engine (gravity + buoyancy + pushing + exits)
// This is the core of the system.

const applyPhysics = (grid, door) => {
    const N = grid.length;
    let g = cloneGrid(grid);

    const cell = (y, x) => {
        if (y < 0 || y >= N || x < 0 || x >= N) return null;
        return g[y][x];
    };

    const set = (y, x, v) => {
        g[y][x] = v;
    };

    const isDoorAt = (y, x, dy) => {
        if (dy > 0 && door.side === 'bottom' && y === N - 1 && x === door.index) {
            return true;
        }
        if (dy < 0 && door.side === 'top' && y === 0 && x === door.index) {
            return true;
        }
        return false;
    };

    const slide = (y, x, dy) => {
        const obj = cell(y, x);
        if (obj === EMPTY) {
            return;
        }

        let cy = y;
        while (true) {
            const ny = cy + dy;
            if (ny < 0 || ny >= N) {
                if (isDoorAt(cy, x, dy)) {
                    set(cy, x, EMPTY);
                }
                break;
            }
            if (cell(ny, x) !== EMPTY) {
                break;
            }
            cy = ny;
        }

        if (cy !== y) {
            set(cy, x, obj);
            set(y, x, EMPTY);
        }
    };

    const resolveVacancies = () => {
        let moved = false;

        // Blocks fall
        for (let y = N - 2; y >= 0; y--) {
            for (let x = 0; x < N; x++) {
                if (cell(y, x) === BLOCK && cell(y + 1, x) === EMPTY) {
                    slide(y, x, +1);
                    moved = true;
                }
            }
        }

        // Bubbles rise
        for (let y = 1; y < N; y++) {
            for (let x = 0; x < N; x++) {
                if (cell(y, x) === BUBBLE && cell(y - 1, x) === EMPTY) {
                    slide(y, x, -1);
                    moved = true;
                }
            }
        }

        return moved;
    };

    const resolvePushing = () => {
        let moved = false;

        for (let x = 0; x < N; x++) {
            for (let y = 0; y < N; y++) {
                if (cell(y, x) !== BLOCK) {
                    continue;
                }

                let bubblesBelow = 0;
                for (let yy = y + 1; yy < N; yy++) {
                    if (cell(yy, x) === BUBBLE) {
                        bubblesBelow++;
                    }
                    else {
                        break;
                    }
                }

                if (bubblesBelow === 1) {
                    slide(y + 1, x, +1);
                    slide(y, x, +1);
                    moved = true;
                }

                if (bubblesBelow >= 2) {
                    slide(y, x, -1);
                    moved = true;
                }
            }
        }

        return moved;
    };

    while (true) {
        const v = resolveVacancies();
        const p = resolvePushing();
        if (!v && !p) {
            break;
        }
    }

    return g;
};

// Apply a move (rotate + physics)

const applyMove = (grid, door, move) => {
    let newGrid = grid;
    let newDoor = door;

    if (move === 'CW') {
        newGrid = rotateCW(newGrid);
        newDoor = rotateDoorCW(newDoor);
    }
    else {
        newGrid = rotateCCW(newGrid);
        newDoor = rotateDoorCCW(newDoor);
    }

    newGrid = applyPhysics(newGrid, newDoor);
    return { grid: newGrid, door: newDoor };
};

// BFS solver (minimal CW/CCW sequence)

const solveMinimal = (grid, door) => {
    const startKey = gridToString(grid) + '|' + door.side + '|' + door.index;
    const visited = new Set([startKey]);
    const queue = [{ grid, door, path: [] }];

    while (queue.length) {
        const { grid: g, door: d, path } = queue.shift();

        if (isEmptyGrid(g)) {
            return path;
        }

        for (const move of MOVES) {
            const next = applyMove(g, d, move);
            const key = gridToString(next.grid) + '|' + next.door.side + '|' + next.door.index;

            if (visited.has(key)) {
                continue;
            }
            visited.add(key);

            queue.push({ grid: next.grid, door: next.door, path: [...path, move] });
        }
    }

    return null;
};

// Puzzle generator (with optional difficulty)

const randomCornerDoor = (size) => {
    const corners = [
        { side: 'top', index: 0 },
        { side: 'top', index: size - 1 },
        { side: 'bottom', index: 0 },
        { side: 'bottom', index: size - 1 }
    ];
    return corners[Math.floor(Math.random() * corners.length)];
};

const randomGrid = (size) => {
    const g = [];
    for (let y = 0; y < size; y++) {
        const row = [];
        for (let x = 0; x < size; x++) {
            row.push(Math.random() < 0.5 ? BUBBLE : BLOCK);
        }
        g.push(row);
    }
    return g;
};

export const generatePuzzle = (size, targetLength = null) => {
    const matches = (len) => {
        if (targetLength == null) {
            return true;
        }
        if (typeof targetLength === 'number') {
            return len === targetLength;
        }
        return len >= targetLength.min && len <= targetLength.max;
    };

    while (true) {
        const grid = randomGrid(size);
        const door = randomCornerDoor(size);

        const sol = solveMinimal(grid, door);
        if (!sol) {
            continue;
        }
        if (!matches(sol.length)) {
            continue;
        }

        return { size, grid, door, solution: sol };
    }
};

// Usage example

const puzzle = generatePuzzle(4, { min: 8, max: 12 });
console.log('Door:', puzzle.door);
console.log('Solution:', puzzle.solution);
console.table(puzzle.grid);
