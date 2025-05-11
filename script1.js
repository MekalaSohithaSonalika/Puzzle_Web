// Letter definitions (each letter is an array of [row, col] positions)
const letters = {
    'A': [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,0],[3,2]],
    'B': [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,0],[3,2],[4,0],[4,1],[4,2]],
    'C': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[3,1],[3,2]],
    'D': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[1,2],[2,2],[3,2],[3,1],[4,1]],
    'E': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[4,1]],                        
    'F': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[0,2],[2,1]],
    'G': [[0,0],[0,1],[0,2],[0,3],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[3,3],[2,2],[2,3]],
    'H': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[2,1]],
    'I': [[0,0],[0,1],[0,2],[1,1],[2,1],[3,1],[4,0],[4,1],[4,2]],
    'J': [[0,2],[1,2],[2,2],[3,2],[4,0],[4,1],[4,2],[3,0]],
    'K': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[3,2],[4,2],[1,1],[2,1],[3,1]],
    'L': [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2]],
    'M': [[0,0],[1,0],[2,0],[3,0],[0,4],[1,4],[2,4],[3,4],[0,1],[0,2],[0,3],[1,2],[2,2]],                       
    'N': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[0,1]], 
    'O': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[0,1],[4,1]], 
    'P': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[0,2],[0,3],[2,1],[2,2],[2,3],[1,3]],
    'Q': [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[2,1],[3,2]],
    'R': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2]],
    'S': [[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[3,2],[4,0],[4,1],[4,2]],
    'T': [[0,0],[0,1],[0,2],[1,1],[2,1],[3,1],[4,1]],
    'U': [[0,0],[1,0],[2,0],[3,0],[0,2],[1,2],[2,2],[3,2],[4,0],[4,1],[4,2]],
    'V': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[0,3]],
    'X': [[0,2],[1,2],[2,0],[2,1],[2,2],[2,3],[2,4],[3,2],[4,2]],
    'W': [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4]],
    'Y': [[1,1],[2,1],[3,1],[4,1],[5,1],[1,0],[1,2],[0,0],[0,2]],                   
    'Z': [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[3,3],[3,4]],     
    '.': [[0,0]], // Dot character
    ' ': [] // Space character (empty)
};

function createGuaranteedSolution(lettersToPlace) {
    // Calculate required grid size with more buffer space
    const totalCells = lettersToPlace.reduce((sum, letter) => sum + letter.cells.length, 0);
    const gridSize = Math.ceil(Math.sqrt(totalCells * 2)); // Increased buffer to 2x
    
    // Create grid with proper initialization
    const grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
    
    let currentRow = 0;
    let currentCol = 0;
    let maxHeightInRow = 0;

    for (const letter of lettersToPlace) {
        if (!letter.cells || letter.cells.length === 0) continue; // Skip empty letters
        
        const letterHeight = Math.max(...letter.cells.map(pos => pos[0])) + 1;
        const letterWidth = Math.max(...letter.cells.map(pos => pos[1])) + 1;

        // Check if we need to move to a new row
        if (currentCol + letterWidth > gridSize) {
            currentRow += maxHeightInRow + 1;
            currentCol = 0;
            maxHeightInRow = 0;
            
            // Check if we've run out of space vertically
            if (currentRow + letterHeight > gridSize) {
                // Expand the grid and retry
                return createGuaranteedSolution(lettersToPlace);
            }
        }

        // Place the letter with bounds checking
        for (const [y, x] of letter.cells) {
            const row = currentRow + y;
            const col = currentCol + x;
            
            // Ensure the position is within bounds
            if (row >= 0 && row < gridSize && col >= 0 && col < gridSize) {
                grid[row][col] = letter.index;
            }
        }

        // Update position tracking
        currentCol += letterWidth + 1;
        maxHeightInRow = Math.max(maxHeightInRow, letterHeight);
    }

    return trimGrid(grid);
}

function findCompactSolution(word) {
    const lettersToPlace = word.split('').map((char, index) => ({
        char,
        cells: letters[char], // Now correctly accessing the letters object
        index: index + 1,
        rotations: getOptimizedRotations(letters[char], char),
        size: letters[char].length
    }));

    // Rest of your solver implementation...
    lettersToPlace.sort((a, b) => b.size - a.size);

    const size = calculateOptimalInitialSize(word, lettersToPlace);
    const grid = Array(size).fill().map(() => Array(size).fill(0));
    const placed = new Array(lettersToPlace.length).fill(false);
    
    if (placeLettersOptimized(lettersToPlace, grid, placed, 0, size)) {
        return trimGrid(grid);
    }
    
    return createGuaranteedSolution(lettersToPlace);
}

const colors = [
    '#FF5733', '#33FF57', '#3357FF', '#F3FF33', '#FF33F3',
    '#33FFF3', '#8A2BE2', '#FF6347', '#7CFC00', '#FFD700'
];

document.getElementById('generateBtn').addEventListener('click', function() {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    
    setTimeout(function() {
        try {
            generateGrid();
        } catch (error) {
            alert('Error generating grid: ' + error.message);
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Grid';
        }
    }, 100);
});

// Optimized grid generator using CSP approach
function generateGrid() {
    const word = document.getElementById('wordInput').value.toUpperCase();
    if (!word.trim()) {
        alert('Please enter a word');
        return;
    }

    if (word.length > 15) {
        alert('Maximum word length is 15 characters');
        return;
    }

    // Validate all characters
    for (const char of word) {
        if (!letters[char]) {
            alert(`Character '${char}' is not supported`);
            return;
        }
    }

    const startTime = Date.now();
    const solution = findCompactSolution(word);
    
    if (solution) {
        console.log(`Solved in ${(Date.now() - startTime)/1000} seconds`);
        displayGrid(solution.grid, solution.width, solution.height);
    } else {
        alert('Could not find a compact solution');
    }
}


// Specialized rotation generator for instant solving
function getInstantRotations(cells, char) {
    if (!cells.length) return [];
    
    const symmetricLetters = ['O', 'I', 'X', 'H', 'T', 'U', 'V', 'W', 'A'];
    if (symmetricLetters.includes(char)) return [cells];
    
    const symmetric180 = ['S', 'Z', 'N', 'M'];
    if (symmetric180.includes(char)) {
        const maxRow = Math.max(...cells.map(pos => pos[0]));
        const maxCol = Math.max(...cells.map(pos => pos[1]));
        const rotated180 = cells.map(([y, x]) => [maxRow - y, maxCol - x]);
        return [cells, rotated180];
    }
    
    const maxRow = Math.max(...cells.map(pos => pos[0]));
    const maxCol = Math.max(...cells.map(pos => pos[1]));
    const rotated180 = cells.map(([y, x]) => [maxRow - y, maxCol - x]);
    return [cells, rotated180];
}


function canPlaceLetter(cells, grid, y, x, size) {
    for (const [dy, dx] of cells) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= size || nx >= size || ny < 0 || nx < 0 || grid[ny][nx] !== 0) {
            return false;
        }
    }
    return true;
}

function placeLetter(cells, grid, y, x, value) {
    for (const [dy, dx] of cells) {
        grid[y + dy][x + dx] = value;
    }
}

function getLetterDimensions(cells) {
    if (cells.length === 0) return { width: 0, height: 0 };
    
    const maxY = Math.max(...cells.map(pos => pos[0]));
    const maxX = Math.max(...cells.map(pos => pos[1]));
    return { width: maxX + 1, height: maxY + 1 };
}

// Create a fallback solution when normal placement fails
function createFallbackSolution(letters) {
    let width = 0;
    let height = 0;
    const grids = [];
    
    // Calculate total size needed
    letters.forEach(letter => {
        const dims = getLetterDimensions(letter.cells);
        width = Math.max(width, dims.width);
        height += dims.height + 1; // +1 for spacing
    });
    
    // Create grid with all letters stacked vertically
    const grid = Array(height).fill().map(() => Array(width).fill(0));
    let currentY = 0;
    
    letters.forEach((letter, index) => {
        const dims = getLetterDimensions(letter.cells);
        const offsetX = Math.floor((width - dims.width) / 2);
        
        letter.cells.forEach(([y, x]) => {
            grid[currentY + y][offsetX + x] = index + 1;
        });
        
        currentY += dims.height + 1;
    });
    
    return {
        grid,
        width,
        height
    };
}

// Fallback solver with optimized backtracking
function findSolutionWithBacktracking(lettersToPlace, initialSize) {
    let size = initialSize;
    const maxSize = initialSize + 5; // Only try slightly larger grids
    
    while (size <= maxSize) {
        const grid = Array(size).fill().map(() => Array(size).fill(0));
        const placed = new Array(lettersToPlace.length).fill(false);
        
        if (placeLettersOptimized(lettersToPlace, grid, placed, 0, size)) {
            return trimGrid(grid);
        }
        
        size++;
    }
    
    // If still no solution, return a simple grid with letters stacked
    return createFallbackSolution(lettersToPlace);
}

function calculateComplexity(cells) {
    let complexity = 0;
    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
    
    for (const [y, x] of cells) {
        let neighbors = 0;
        for (const [dy, dx] of dirs) {
            if (cells.some(([cy, cx]) => cy === y + dy && cx === x + dx)) {
                neighbors++;
            }
        }
        if (neighbors < 4) complexity++;
    }
    
    return complexity;
}

function calculateOptimalInitialSize(word, letters) {
    const totalCells = letters.reduce((sum, letter) => sum + letter.size, 0);
    const maxDim = Math.max(...letters.map(l => 
        Math.max(...l.cells.map(pos => Math.max(pos[0], pos[1])))
    ));
    
    return Math.ceil(Math.sqrt(totalCells * 1.2)) + maxDim;
}

function calculateTightInitialSize(letters) {
    const totalArea = letters.reduce((sum, l) => sum + l.size, 0);
    const maxDim = Math.max(...letters.map(l => 
        Math.max(...l.cells.map(pos => Math.max(pos[0], pos[1]))) + 1
    ));
    return Math.max(
        Math.ceil(Math.sqrt(totalArea * 1.1)),
        maxDim
    );
}


// Main solver function using optimized CSP approach
// Ultra-optimized solver that works instantly for most words

function placeLetterOptimized(cells, grid, y, x, value) {
    for (const [dy, dx] of cells) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && ny < grid.length && nx >= 0 && nx < grid[0].length) {
            grid[ny][nx] = value;
        }
    }
}

function countPlacementOptions(letter, grid, size) {
    let count = 0;
    const positions = getOptimizedPositions(grid, size, false);
    
    for (const rotation of letter.rotations) {
        for (const [y, x] of positions) {
            if (canPlaceLetterOptimized(rotation, grid, y, x, size, 0)) {
                count++;
                // Early exit if we've found enough options
                if (count > 100) return count;
            }
        }
    }
    
    return count;
}

// 1. First define the missing selection function
function selectNextLetterMRV(letters, placed, grid, size) {
    let bestLetter = null;
    let minOptions = Infinity;
    
    for (let i = 0; i < letters.length; i++) {
        if (!placed[i]) {
            const letter = letters[i];
            const options = countPlacementOptions(letter, grid, size);
            
            if (options < minOptions) {
                minOptions = options;
                bestLetter = letter;
                // Early exit if we find a letter with very few options
                if (minOptions <= 1) break;
            }
        }
    }
    
    return bestLetter;
}

function tryCompactGrid(grid, letters) {
    // Make a deep copy of the grid
    const tempGrid = grid.map(row => [...row]);
    
    // Try to shift all letters up as much as possible
    let changed;
    do {
        changed = false;
        for (let y = 1; y < tempGrid.length; y++) {
            for (let x = 0; x < tempGrid[0].length; x++) {
                if (tempGrid[y][x] !== 0 && tempGrid[y-1][x] === 0) {
                    // Can move this cell up
                    tempGrid[y-1][x] = tempGrid[y][x];
                    tempGrid[y][x] = 0;
                    changed = true;
                }
            }
        }
    } while (changed);
    
    // Check if this resulted in any empty rows at the bottom
    const lastRow = tempGrid[tempGrid.length - 1];
    if (lastRow.every(cell => cell === 0)) {
        // Found more compact arrangement - update original grid
        for (let y = 0; y < grid.length; y++) {
            for (let x = 0; x < grid[0].length; x++) {
                grid[y][x] = tempGrid[y][x];
            }
        }
        return true;
    }
    
    return false;
}

function getOptimizedPositions(grid, size, isFirstLetter) {
    const positions = [];
    const center = Math.floor(size / 2);
    
    if (isFirstLetter) {
        return [[center, center]]; // Always start first letter in center
    }
    
    // Find all empty cells adjacent to placed letters
    const adjacent = new Set();
    const emptyCells = [];
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (grid[y][x] !== 0) {
                // Check surrounding positions
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dy === 0 && dx === 0) continue;
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && nx >= 0 && ny < size && nx < size && grid[ny][nx] === 0) {
                            adjacent.add(`${ny},${nx}`);
                        }
                    }
                }
            } else {
                emptyCells.push([y, x]);
            }
        }
    }
    
    // If no adjacent cells, fall back to all empty cells
    const cellsToUse = adjacent.size > 0 ? 
        Array.from(adjacent).map(pos => pos.split(',').map(Number)) : 
        emptyCells;
    
    // Sort by centrality with some randomness
    return cellsToUse.sort((a, b) => {
        const da = Math.abs(a[0] - center) + Math.abs(a[1] - center);
        const db = Math.abs(b[0] - center) + Math.abs(b[1] - center);
        return da - db + (Math.random() - 0.5); // Add slight randomness
    });
}

// Optimized placement algorithm with backtracking
function placeLettersOptimized(letters, grid, placed, count, size) {
    if (count === letters.length) {
        const compacted = tryCompactGrid(grid, letters);
        if (compacted) return true;
        return false;
    }
    
    const letter = selectNextLetterMRV(letters, placed, grid, size);
    if (!letter) return false;
    
    const positions = getOptimizedPositions(grid, size, count === 0);
    
    for (const rotation of letter.rotations) {
        for (const [y, x] of positions) {
            if (canPlaceLetterOptimized(rotation, grid, y, x, size, count)) {
                placeLetterOptimized(rotation, grid, y, x, letter.index);
                placed[letters.indexOf(letter)] = true;
                
                if (placeLettersOptimized(letters, grid, placed, count + 1, size)) {
                    return true;
                }
                
                // Backtrack
                removeLetterOptimized(rotation, grid, y, x);
                placed[letters.indexOf(letter)] = false;
            }
        }
    }
    
    return false;
}

// Helper functions for optimized solver
function selectUnplacedLetter(letters, placed) {
    for (let i = 0; i < letters.length; i++) {
        if (!placed[i]) return letters[i];
    }
    return null;
}

function getOptimizedRotations(cells, char) {
    if (char === 'K') {
        // Only need 0° and 180° for K
        const maxRow = Math.max(...cells.map(pos => pos[0]));
        const maxCol = Math.max(...cells.map(pos => pos[1]));
        const rotated180 = cells.map(([y, x]) => [maxRow - y, maxCol - x]);
        return [cells, rotated180];
    }
    return getAllRotations(cells);
}

function getAllRotations(cells) {
    if (!cells.length) return [];
    
    const rotations = new Set();
    const maxRow = Math.max(...cells.map(pos => pos[0]));
    const maxCol = Math.max(...cells.map(pos => pos[1]));
    
    // Original
    rotations.add(JSON.stringify(cells));
    
    // 90°
    const rotated90 = cells.map(([y, x]) => [x, maxRow - y]);
    rotations.add(JSON.stringify(rotated90));
    
    // 180°
    const rotated180 = rotated90.map(([y, x]) => [x, maxRow - y]);
    rotations.add(JSON.stringify(rotated180));
    
    // 270°
    const rotated270 = rotated180.map(([y, x]) => [x, maxRow - y]);
    rotations.add(JSON.stringify(rotated270));
    
    return Array.from(rotations).map(str => JSON.parse(str));
}

function calculateInitialSize(word) {
    const totalCells = word.split('').reduce((sum, char) => sum + letters[char].length, 0);
    return Math.max(
        Math.ceil(Math.sqrt(totalCells * 1.3)), // More space for complex words
        Math.max(...word.split('').map(char => 
            Math.max(...letters[char].map(pos => Math.max(pos[0], pos[1])))
        )) + 2
    );
}

function getCandidatePositions(grid, size, isFirstLetter) {
    const positions = [];
    const center = Math.floor(size / 2);
    
    if (isFirstLetter) {
        // For first letter, start near center
        return [[center, center]];
    }
    
    // Find all empty cells adjacent to placed letters
    const adjacent = new Set();
    
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            if (grid[y][x] !== 0) {
                // Check surrounding positions
                for (let dy = -1; dy <= 1; dy++) {
                    for (let dx = -1; dx <= 1; dx++) {
                        if (dy === 0 && dx === 0) continue;
                        const ny = y + dy;
                        const nx = x + dx;
                        if (ny >= 0 && nx >= 0 && ny < size && nx < size && grid[ny][nx] === 0) {
                            adjacent.add(JSON.stringify([ny, nx]));
                        }
                    }
                }
            }
        }
    }
    
    // Convert to array and sort by centrality
    return Array.from(adjacent)
        .map(pos => JSON.parse(pos))
        .sort((a, b) => {
            const da = Math.abs(a[0] - center) + Math.abs(a[1] - center);
            const db = Math.abs(b[0] - center) + Math.abs(b[1] - center);
            return da - db;
        });
}

function canPlaceLetterOptimized(cells, grid, y, x, size, placedCount) {
    // Check bounds and empty cells
    for (const [dy, dx] of cells) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= size || nx >= size || ny < 0 || nx < 0 || grid[ny][nx] !== 0) {
            return false;
        }
    }
    
    // Check adjacency if not first letter
    if (placedCount > 0) {
        for (const [dy, dx] of cells) {
            const ny = y + dy;
            const nx = x + dx;
            
            // Check adjacent cells
            const adjacent = [
                [ny-1, nx], [ny+1, nx], [ny, nx-1], [ny, nx+1]
            ];
            
            for (const [ay, ax] of adjacent) {
                if (ay >= 0 && ax >= 0 && ay < size && ax < size && grid[ay][ax] !== 0) {
                    return true;
                }
            }
        }
        return false;
    }
    return true;
}

// Specialized position selection for instant solving
function getInstantPositions(grid, size, isFirstLetter, cache) {
    if (isFirstLetter) {
        const center = Math.floor(size / 2);
        return [[center, center]];
    }
    
    if (!cache[0]) {
        const center = Math.floor(size / 2);
        let index = 0;
        
        for (let d = 0; d <= size; d++) {
            for (let x = center - d; x <= center + d; x++) {
                for (let y = center - d; y <= center + d; y++) {
                    if (x >= 0 && y >= 0 && x < size && y < size) {
                        if (Math.abs(x - center) === d || Math.abs(y - center) === d) {
                            cache[index++] = [y, x];
                        }
                    }
                }
            }
        }
    }
    
    const emptyPositions = [];
    for (let i = 0; i < cache.length; i++) {
        const [y, x] = cache[i] || [];
        if (y !== undefined && x !== undefined && grid[y][x] === 0) {
            emptyPositions.push([y, x]);
        }
    }
    
    return emptyPositions;
}

function isCornerLetter(cells) {
    if (cells.length === 0) return false;
    
    const minY = Math.min(...cells.map(pos => pos[0]));
    const maxY = Math.max(...cells.map(pos => pos[0]));
    const minX = Math.min(...cells.map(pos => pos[1]));
    const maxX = Math.max(...cells.map(pos => pos[1]));
    
    const corners = [
        [minY, minX], [minY, maxX],
        [maxY, minX], [maxY, maxX]
    ];
    
    let filledCorners = 0;
    for (const [y, x] of corners) {
        if (cells.some(([cy, cx]) => cy === y && cx === x)) {
            filledCorners++;
        }
    }
    
    return filledCorners >= 2;
}

// Add this missing function to your script.js
function selectLetterForInstantPlacement(letters, placed) {
    // First try to find letters that must be placed in corners
    for (let i = 0; i < letters.length; i++) {
        if (!placed[i] && isCornerLetter(letters[i].cells)) {
            return letters[i];
        }
    }
    
    // Then try to find letters with most constraints
    for (let i = 0; i < letters.length; i++) {
        if (!placed[i] && letters[i].cells.length > 5) {
            return letters[i];
        }
    }
    
    // Finally return first unplaced letter
    for (let i = 0; i < letters.length; i++) {
        if (!placed[i]) {
            return letters[i];
        }
    }
    
    return null;
}

// Also add this optimized placement check
function canPlaceInstant(cells, grid, y, x, size, placedCount) {
    for (const [dy, dx] of cells) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= size || nx >= size || ny < 0 || nx < 0 || grid[ny][nx] !== 0) {
            return false;
        }
    }
    
    if (placedCount === 0) return true;
    
    for (const [dy, dx] of cells) {
        const ny = y + dy;
        const nx = x + dx;
        
        if (ny > 0 && grid[ny-1][nx] !== 0) return true;
        if (ny < size-1 && grid[ny+1][nx] !== 0) return true;
        if (nx > 0 && grid[ny][nx-1] !== 0) return true;
        if (nx < size-1 && grid[ny][nx+1] !== 0) return true;
    }
    
    return false;
}

// Instant placement strategy - tries to place letters without backtracking
function placeLettersInstantly(letters, grid, placed, count, size, positionCache) {
    if (count === letters.length) return true;
    
    const letter = selectLetterForInstantPlacement(letters, placed);
    if (!letter) return false;
    
    const positions = getInstantPositions(grid, size, count === 0, positionCache);
    
    for (const rotation of letter.rotations) {
        for (const [y, x] of positions) {
            if (canPlaceInstant(rotation, grid, y, x, size, count)) {
                placeLetterOptimized(rotation, grid, y, x, letter.index);
                placed[letters.indexOf(letter)] = true;
                
                if (placeLettersInstantly(letters, grid, placed, count + 1, size, positionCache)) {
                    return true;
                }
                
                removeLetterOptimized(rotation, grid, y, x);
                placed[letters.indexOf(letter)] = false;
                return false;
            }
        }
    }
    
    return false;
}

function removeLetterOptimized(cells, grid, y, x) {
    for (const [dy, dx] of cells) {
        grid[y + dy][x + dx] = 0;
    }
}

function trimGrid(grid) {
    let minY = grid.length, maxY = 0, minX = grid[0].length, maxX = 0;
    
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[0].length; x++) {
            if (grid[y][x] !== 0) {
                if (y < minY) minY = y;
                if (y > maxY) maxY = y;
                if (x < minX) minX = x;
                if (x > maxX) maxX = x;
            }
        }
    }
    
    const trimmed = [];
    for (let y = minY; y <= maxY; y++) {
        trimmed.push(grid[y].slice(minX, maxX + 1));
    }
    
    return {
        grid: trimmed,
        width: maxX - minX + 1,
        height: maxY - minY + 1
    };
}

// Display functions remain the same
function displayGrid(grid, width, height) {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';
    container.style.display = 'block';
    
    // Create main content container
    const contentContainer = document.createElement('div');
    contentContainer.id = 'pdfContent';
    contentContainer.style.width = '100%';
    contentContainer.style.maxWidth = '800px';
    contentContainer.style.margin = '0 auto';
    contentContainer.style.padding = '20px';
    container.appendChild(contentContainer);

    // Add title
    const title = document.createElement('h1');
    title.textContent = 'Letter Grid Puzzle';
    title.style.textAlign = 'center';
    title.style.marginBottom = '20px';
    contentContainer.appendChild(title);

    // Add word display
    const word = document.getElementById('wordInput').value.toUpperCase();
    const wordDisplay = document.createElement('h2');
    wordDisplay.textContent = `Word: ${word}`;
    wordDisplay.style.textAlign = 'center';
    wordDisplay.style.marginBottom = '30px';
    contentContainer.appendChild(wordDisplay);

    // Create letters section
    const lettersSection = document.createElement('div');
    lettersSection.id = 'lettersSection';
    lettersSection.style.display = 'flex';
    lettersSection.style.flexWrap = 'wrap';
    lettersSection.style.justifyContent = 'center';
    lettersSection.style.gap = '20px';
    lettersSection.style.marginBottom = '30px';
    contentContainer.appendChild(lettersSection);

    // Add individual letters
    word.split('').forEach((char, index) => {
        if (char === ' ') return;

        const letterDiv = document.createElement('div');
        letterDiv.style.display = 'flex';
        letterDiv.style.flexDirection = 'column';
        letterDiv.style.alignItems = 'center';
        letterDiv.style.margin = '10px';

        // Letter label
        const letterLabel = document.createElement('div');
        letterLabel.textContent = char;
        letterLabel.style.marginBottom = '10px';
        letterLabel.style.fontWeight = 'bold';
        letterDiv.appendChild(letterLabel);

        // Letter grid
        const letterGrid = document.createElement('div');
        letterGrid.style.display = 'grid';
        letterGrid.style.gridTemplateColumns = 'repeat(5, 20px)';
        letterGrid.style.gridTemplateRows = 'repeat(5, 20px)';
        letterGrid.style.gap = '1px';
        letterGrid.style.backgroundColor = '#f5f5f5';
        letterGrid.style.padding = '5px';
        letterGrid.style.borderRadius = '5px';

        for (let i = 0; i < 25; i++) {
            const square = document.createElement('div');
            const row = Math.floor(i / 5);
            const col = i % 5;
            
            square.style.width = '20px';
            square.style.height = '20px';
            square.style.backgroundColor = 'white';
            square.style.border = '1px solid #eee';
            
            if (letters[char].some(([r, c]) => r === row && c === col)) {
                square.style.backgroundColor = colors[index % colors.length];
                square.style.border = '1px solid #999';
            }
            
            letterGrid.appendChild(square);
        }

        letterDiv.appendChild(letterGrid);
        lettersSection.appendChild(letterDiv);
    });

    // Create empty grid section
    const emptyGridSection = document.createElement('div');
    emptyGridSection.id = 'emptyGridSection';
    emptyGridSection.style.display = 'flex';
    emptyGridSection.style.flexDirection = 'column';
    emptyGridSection.style.alignItems = 'center';
    contentContainer.appendChild(emptyGridSection);

    const gridTitle = document.createElement('div');
    gridTitle.innerHTML = '<strong>Fit the letters into this grid:</strong>';
    gridTitle.style.marginBottom = '15px';
    emptyGridSection.appendChild(gridTitle);

    const sizeDisplay = document.createElement('div');
    sizeDisplay.textContent = `Grid size: ${width}×${height}`;
    sizeDisplay.style.marginBottom = '10px';
    emptyGridSection.appendChild(sizeDisplay);

    const emptyGrid = document.createElement('div');
    emptyGrid.style.display = 'grid';
    emptyGrid.style.gridTemplateColumns = `repeat(${width}, 25px)`;
    emptyGrid.style.gridTemplateRows = `repeat(${height}, 25px)`;
    emptyGrid.style.gap = '2px';
    emptyGrid.style.border = '2px solid #333';
    emptyGrid.style.padding = '5px';
    emptyGrid.style.marginBottom = '20px';

    for (let i = 0; i < width * height; i++) {
        const cell = document.createElement('div');
        cell.style.width = '25px';
        cell.style.height = '25px';
        cell.style.backgroundColor = 'white';
        cell.style.border = '1px solid #ddd';
        emptyGrid.appendChild(cell);
    }

    emptyGridSection.appendChild(emptyGrid);

    // Add download button
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download PDF';
    downloadBtn.style.padding = '10px 20px';
    downloadBtn.style.margin = '20px auto';
    downloadBtn.style.display = 'block';
    downloadBtn.style.backgroundColor = '#4CAF50';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.cursor = 'pointer';
    container.appendChild(downloadBtn);

    downloadBtn.addEventListener('click', async () => {
        // Add printing class to elements for better PDF rendering
        contentContainer.classList.add('printing');
        
        const opt = {
            margin: 10,
            filename: 'letter_puzzle.pdf',
            image: { type: 'jpeg', quality: 1 },
            html2canvas: {
                scale: 2,
                scrollX: 0,
                scrollY: 0,
                windowWidth: contentContainer.scrollWidth,
                windowHeight: contentContainer.scrollHeight,
                ignoreElements: (element) => {
                    // Explicitly ignore any buttons
                    return element.tagName === 'BUTTON';
                }
            },
            jsPDF: {
                unit: 'mm',
                format: 'a4',
                orientation: 'portrait'
            }
        };
        
        try {
            await html2pdf().set(opt).from(contentContainer).save();
        } catch (error) {
            console.error('Error generating PDF:', error);
            alert('Error generating PDF. Please try again.');
        } finally {
            contentContainer.classList.remove('printing');
        }
    });
    // Add view solution button
    const viewSolutionBtn = document.createElement('button');
    viewSolutionBtn.textContent = 'View Solution';
    viewSolutionBtn.style.padding = '10px 20px';
    viewSolutionBtn.style.margin = '20px auto';
    viewSolutionBtn.style.display = 'block';
    viewSolutionBtn.style.backgroundColor = '#4CAF50';
    viewSolutionBtn.style.color = 'white';
    viewSolutionBtn.style.border = 'none';
    viewSolutionBtn.style.borderRadius = '4px';
    viewSolutionBtn.style.cursor = 'pointer';
    container.appendChild(viewSolutionBtn);

    viewSolutionBtn.addEventListener('click', () => {
        const solutionContainer = document.createElement('div');
        solutionContainer.style.display = 'flex';
        solutionContainer.style.flexDirection = 'column';
        solutionContainer.style.alignItems = 'center';
        solutionContainer.style.margin = '20px auto';
        
        const solutionTitle = document.createElement('h3');
        solutionTitle.textContent = 'Solution';
        solutionTitle.style.marginBottom = '10px';
        solutionContainer.appendChild(solutionTitle);

        const solutionGrid = document.createElement('div');
        solutionGrid.style.display = 'grid';
        solutionGrid.style.gridTemplateColumns = `repeat(${width}, 25px)`;
        solutionGrid.style.gridTemplateRows = `repeat(${height}, 25px)`;
        solutionGrid.style.gap = '2px';
        solutionGrid.style.border = '2px solid #333';
        solutionGrid.style.padding = '5px';
        solutionGrid.style.marginBottom = '20px';

        for (let y = 0; y < height; y++) {
            for (let x = 0; x < width; x++) {
                const cell = document.createElement('div');
                cell.style.width = '25px';
                cell.style.height = '25px';
                
                const value = grid[y][x];
                if (value > 0) {
                    cell.style.backgroundColor = colors[(value - 1) % colors.length];
                    cell.style.border = '1px solid #999';
                    
                    const letterLabel = document.createElement('div');
                    letterLabel.textContent = word[value - 1];
                    letterLabel.style.textAlign = 'center';
                    letterLabel.style.lineHeight = '25px';
                    letterLabel.style.color = '#fff';
                    letterLabel.style.textShadow = '1px 1px 1px rgba(0,0,0,0.5)';
                    cell.appendChild(letterLabel);
                } else {
                    cell.style.backgroundColor = 'white';
                    cell.style.border = '1px solid #ddd';
                }
                
                solutionGrid.appendChild(cell);
            }
        }

        solutionContainer.appendChild(solutionGrid);
        container.appendChild(solutionContainer);
        viewSolutionBtn.style.display = 'none';
    });
}
