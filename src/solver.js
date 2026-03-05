// ------------------------------------------------------------
// Your settleColumn logic (integrated exactly as provided)
// ------------------------------------------------------------

import { SIZE } from './const';

const settleColumn = (stack) => {
    // stack is guaranteed to be in row-major order in your engine
    const space = stack.find(c => c.weight === 0);

    if (!space) {
        return;
    }

    const { row: srow } = space;
    const brow = stack.find(cell => cell.weight > 0)?.row;

    if (brow + 1 && brow < srow) {
        // Hole rises to block
        space.row = brow;

        for (let row = brow; row < srow; row++) {
            stack[row - 1].row += 1;
        }

    } else if (srow < SIZE) {
        // Hole falls to just above next block (or bottom)
        const base = brow + 1 ? brow : SIZE + 1;
        space.row = base - 1;

        for (let row = srow + 1; row < base; row++) {
            stack[row - 1].row -= 1;
        }
    }
};

// ------------------------------------------------------------
// Helpers
// ------------------------------------------------------------

const encode = grid =>
    grid
        .slice()
        .sort((a, b) => a.row - b.row || a.col - b.col)
        .map(c => `${c.row}${c.col}${c.weight}`)
        .join('|');

const cloneGrid = grid => grid.map(c => ({ ...c }));

// ------------------------------------------------------------
// Rotation (CW and CCW)
// ------------------------------------------------------------

const rotateCW = (grid) => {
    const out = cloneGrid(grid);
    for (const cell of out) {
        const r = cell.row;
        const c = cell.col;
        cell.row = c;
        cell.col = SIZE + 1 - r;
    }
    return out;
};

const rotateCCW = (grid) => {
    const out = cloneGrid(grid);
    for (const cell of out) {
        const r = cell.row;
        const c = cell.col;
        cell.row = SIZE + 1 - c;
        cell.col = r;
    }
    return out;
};

// ------------------------------------------------------------
// Gravity settling (per column)
// ------------------------------------------------------------

const settleGrid = (grid) => {
    const out = cloneGrid(grid);

    for (let col = 1; col <= SIZE; col++) {
        const columnCells = out.filter(c => c.col === col);

        // Ensure correct order
        columnCells.sort((a, b) => a.row - b.row);

        settleColumn(columnCells);

        for (const c of columnCells) {
            const target = out.find(x => x.id === c.id);
            target.row = c.row;
        }
    }

    return out;
};

// ------------------------------------------------------------
// Apply move + settle
// ------------------------------------------------------------

const applyMove = (grid, move) => {
  const rotated =
    move === 'CW' ? rotateCW(grid) : rotateCCW(grid);

  return settleGrid(rotated);
};

// ------------------------------------------------------------
// Goal test
// ------------------------------------------------------------

const isSolved = (grid) => {
    const center = (SIZE + 1) / 2;
    return grid.some(c => c.weight === 0 && c.row === center && c.col === center);
};

// ------------------------------------------------------------
// BFS Solver
// ------------------------------------------------------------

export const solve = (startGrid) => {
  const startKey = encode(startGrid);
  const queue = [{ grid: startGrid, path: [] }];
  const visited = new Set([startKey]);

  while (queue.length > 0) {
    const { grid, path } = queue.shift();

    if (isSolved(grid)) {
      return path;
    }

    for (const move of ['CW', 'CCW']) {
      const next = applyMove(grid, move);
      const key = encode(next);

      if (!visited.has(key)) {
        visited.add(key);
        queue.push({ grid: next, path: [...path, move] });
      }
    }
  }

  return null;
};