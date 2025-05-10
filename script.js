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

// Modify the generateGrid function to handle spaces better
function generateGrid() {
    let word = document.getElementById('wordInput').value.toUpperCase();
    if (!word.trim()) {
        alert('Please enter a word');
        return;
    }

    // Replace multiple spaces with single space
    word = word.replace(/\s+/g, ' ');

    // Validate input
    for (const char of word) {
        if (!letters.hasOwnProperty(char)) {
            alert(`Character '${char}' is not supported`);
            return;
        }
    }

    // Calculate initial grid size (include space for spaces between letters)
    const initialSize = calculateInitialGridSize(word);
    
    // Try to find solution with increasing grid sizes
    for (let size = initialSize; size <= 15; size++) {
        const solution = findCompactSolution(word, size);
        if (solution) {
            displayGrid(solution.grid, size, size);
            return;
        }
    }
    
    alert('Could not find a compact solution (tried up to 15×15 grid)');
}

// Modify calculateInitialGridSize function to account for spaces
function calculateInitialGridSize(word) {
    const totalCells = word.split('').reduce((sum, char) => {
        // Add 1 unit of space for each space character
        if (char === ' ') {
            return sum + 1;
        }
        return sum + (letters[char]?.length || 0);
    }, 0);
    
    return Math.max(
        Math.ceil(Math.sqrt(totalCells * 0.6)),
        Math.max(...word.split('').map(char => 
            char === ' ' ? 1 : Math.max(...letters[char].map(pos => Math.max(pos[0], pos[1])))
        )) + 1
    );
}

// Add this new function to get all possible rotations of a letter
function getAllRotations(letterCells) {
    const rotations = new Set();
    
    // Try all possible rotations and flips
    for (let flip = 0; flip < 2; flip++) {
        let cells = flip ? flipHorizontal(letterCells) : [...letterCells];
        
        for (let rot = 0; rot < 4; rot++) {
            const key = JSON.stringify(cells);
            rotations.add(key);
            cells = rotateLetter(cells, 1);
        }
    }
    
    return Array.from(rotations).map(key => JSON.parse(key));
}

function flipHorizontal(cells) {
    const maxX = Math.max(...cells.map(([_, x]) => x));
    return cells.map(([y, x]) => [y, maxX - x]);
}

// Modify findCompactSolution function
function findCompactSolution(word, size) {
    const lettersToPlace = word.split('').map((char, index) => ({
        char,
        cells: letters[char],
        index: index + 1,
        rotations: getAllRotations(letters[char])
    }));

    // Sort letters by size (larger letters first)
    lettersToPlace.sort((a, b) => b.cells.length - a.cells.length);

    const grid = Array(size).fill().map(() => Array(size).fill(0));
    return tryPlacementWithAllRotations(lettersToPlace, grid, size) ? { grid } : null;
}

// Add new placement function with all rotations
function tryPlacementWithAllRotations(letters, grid, size) {
    if (letters.length === 0) return true;

    const letter = letters[0];
    const remaining = letters.slice(1);

    // Try each rotation of the current letter
    for (const rotation of letter.rotations) {
        // Try each position in the grid
        for (let y = 0; y < size; y++) {
            for (let x = 0; x < size; x++) {
                if (canPlaceLetter(rotation, grid, x, y, size)) {
                    // Place the letter
                    placeLetter(rotation, grid, x, y, letter.index);
                    
                    // Try to place remaining letters
                    if (tryPlacementWithAllRotations(remaining, grid, size)) {
                        return true;
                    }
                    
                    // If unsuccessful, remove the letter
                    removeLetter(rotation, grid, x, y);
                }
            }
        }
    }
    
    return false;
}

// Modify canPlaceLetter function to check adjacency
function canPlaceLetter(letterCells, grid, x, y, size) {
    // First check cells availability
    for (const [dy, dx] of letterCells) {
        const ny = y + dy;
        const nx = x + dx;
        
        if (ny < 0 || nx < 0 || ny >= size || nx >= size || grid[ny][nx] !== 0) {
            return false;
        }
    }

    // Check if letter touches another letter (only if not first letter)
    if (countUsedCells(grid) > 0) {
        let touchesExisting = false;
        for (const [dy, dx] of letterCells) {
            const ny = y + dy;
            const nx = x + dx;
            
            // Check adjacent cells
            const adjacentPositions = [
                [ny-1, nx], [ny+1, nx],
                [ny, nx-1], [ny, nx+1]
            ];
            
            for (const [ay, ax] of adjacentPositions) {
                if (ay >= 0 && ax >= 0 && ay < size && ax < size) {
                    if (grid[ay][ax] !== 0) {
                        touchesExisting = true;
                        break;
                    }
                }
            }
            if (touchesExisting) break;
        }
        
        if (!touchesExisting) return false;
    }
    
    return true;
}

function countUsedCells(grid) {
    return grid.reduce((sum, row) => 
        sum + row.reduce((rowSum, cell) => rowSum + (cell !== 0 ? 1 : 0), 0), 0);
}

// Replace the existing generatePermutations function with this optimized version
function generatePermutations(arr, maxPerms = 50) {
    if (arr.length <= 1) return [arr];
    if (arr.length > 8) { // For longer words, just try a few variations
        return [arr, arr.slice().reverse()];
    }
    
    const result = [];
    let count = 0;
    
    for (let i = 0; i < arr.length && count < maxPerms; i++) {
        const current = arr[i];
        const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
        const perms = generatePermutations(remaining, maxPerms - count);
        
        for (const perm of perms) {
            result.push([current, ...perm]);
            count++;
            if (count >= maxPerms) break;
        }
    }
    
    return result;
}

function rotateLetter(cells, rotation) {
    switch(rotation) {
        case 0: // no rotation
            return cells;
        case 1: // 90 degrees
            const maxCol90 = Math.max(...cells.map(pos => pos[1]));
            return cells.map(([y, x]) => [x, maxCol90 - y]);
        case 2: // 180 degrees
            const maxRow180 = Math.max(...cells.map(pos => pos[0]));
            const maxCol180 = Math.max(...cells.map(pos => pos[1]));
            return cells.map(([y, x]) => [maxRow180 - y, maxCol180 - x]);
        case 3: // 270 degrees
            const maxRow270 = Math.max(...cells.map(pos => pos[0]));
            return cells.map(([y, x]) => [maxRow270 - x, y]);
    }
}

function calculatePotentialSpaces(letterCells) {
    if (letterCells.length === 0) return 0;
    
    const height = Math.max(...letterCells.map(pos => pos[0])) + 1;
    const width = Math.max(...letterCells.map(pos => pos[1])) + 1;
    
    // Calculate how many empty cells are surrounded by filled cells
    let spaceCount = 0;
    const letterGrid = Array(height).fill().map(() => Array(width).fill(0));
    
    for (const [y, x] of letterCells) {
        letterGrid[y][x] = 1;
    }
    
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (letterGrid[y][x] === 0) {
                // Check if this empty cell is surrounded
                if ((y > 0 && letterGrid[y-1][x] === 1) &&
                    (y < height-1 && letterGrid[y+1][x] === 1) &&
                    (x > 0 && letterGrid[y][x-1] === 1) &&
                    (x < width-1 && letterGrid[y][x+1] === 1)) {
                    spaceCount++;
                }
            }
        }
    }
    
    return spaceCount;
}

function placeLettersCompact(lettersToPlace, grid, size, index) {
    if (index >= lettersToPlace.length) {
        return true; // All letters placed
    }
    
    const letter = lettersToPlace[index];
    
    // Try all possible positions for this letter
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            // Try normal placement
            if (canPlaceLetterCompact(letter.cells, grid, x, y, size, 0)) {
                placeLetter(letter.cells, grid, x, y, letter.index);
                
                if (placeLettersCompact(lettersToPlace, grid, size, index + 1)) {
                    return true;
                }
                
                removeLetter(letter.cells, grid, x, y);
            }
            
            // Try rotated placement (90 degrees)
            const rotated = rotateLetter(letter.cells);
            if (canPlaceLetterCompact(rotated, grid, x, y, size, 0)) {
                placeLetter(rotated, grid, x, y, letter.index);
                
                if (placeLettersCompact(lettersToPlace, grid, size, index + 1)) {
                    return true;
                }
                
                removeLetter(rotated, grid, x, y);
            }
        }
    }
    
    return false;
}

function canPlaceLetterCompact(letterCells, grid, x, y, size, emptyValue) {
    for (const [dy, dx] of letterCells) {
        const ny = y + dy;
        const nx = x + dx;
        
        if (ny >= size || nx >= size || grid[ny][nx] !== emptyValue) {
            return false;
        }
    }
    return true;
}

function placeLetter(letterCells, grid, x, y, value) {
    for (const [dy, dx] of letterCells) {
        grid[y + dy][x + dx] = value;
    }
}

function removeLetter(letterCells, grid, x, y) {
    for (const [dy, dx] of letterCells) {
        grid[y + dy][x + dx] = 0;
    }
}

function trimGrid(grid) {
    const height = grid.length;
    const width = grid[0].length;
    
    // Find bounds of non-empty cells
    let minRow = height - 1;
    let maxRow = 0;
    let minCol = width - 1;
    let maxCol = 0;
    
    // Find the boundaries of content
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (grid[y][x] !== 0) {
                minRow = Math.min(minRow, y);
                maxRow = Math.max(maxRow, y);
                minCol = Math.min(minCol, x);
                maxCol = Math.max(maxCol, x);
            }
        }
    }
    
    // Create new trimmed grid
    const trimmedGrid = [];
    for (let y = minRow; y <= maxRow; y++) {
        const row = [];
        for (let x = minCol; x <= maxCol; x++) {
            row.push(grid[y][x]);
        }
        trimmedGrid.push(row);
    }
    
    return trimmedGrid;
}

function displayGrid(grid, width, height) {
    // Clear all containers
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';
    
    // Trim the grid to remove empty rows and columns
    const trimmedGrid = trimGrid(grid);
    const trimmedHeight = trimmedGrid.length;
    const trimmedWidth = trimmedGrid[0].length;
    
    // Create a header container for positioning buttons
    const headerContainer = document.createElement('div');
    headerContainer.style.display = 'flex';
    headerContainer.style.justifyContent = 'flex-end'; // Align to right
    headerContainer.style.width = '100%';
    headerContainer.style.marginBottom = '20px';
    headerContainer.style.marginTop = '20px'; // Add some top margin to move button down
    container.appendChild(headerContainer);

    // Create download button and position it at the right corner
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download PDF';
    downloadBtn.style.padding = '8px 16px';
    downloadBtn.style.fontSize = '14px';
    downloadBtn.style.backgroundColor = '#4CAF50';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.cursor = 'pointer';
    headerContainer.appendChild(downloadBtn); // Add button to header container
    
    // Create main puzzle container
    const puzzleContainer = document.createElement('div');
    puzzleContainer.style.border = '1px solid #ddd';
    puzzleContainer.style.padding = '20px';
    puzzleContainer.style.marginBottom = '20px';
    puzzleContainer.style.clear = 'both'; // Clear the float
    
    // Add grid size text
    const sizeText = document.createElement('div');
    sizeText.textContent = `Grid size: ${trimmedWidth}×${trimmedHeight}`;
    sizeText.style.marginBottom = '10px';
    sizeText.style.fontWeight = 'bold';
    puzzleContainer.appendChild(sizeText);

    // Create container for letters
    const lettersContainer = document.createElement('div');
    lettersContainer.style.display = 'flex';
    lettersContainer.style.gap = '20px';
    lettersContainer.style.marginBottom = '30px';
    lettersContainer.style.flexWrap = 'wrap';
    lettersContainer.style.justifyContent = 'center';
    puzzleContainer.appendChild(lettersContainer);

    // Get the word from input
    const word = document.getElementById('wordInput').value.toUpperCase();

    // Display each letter separately using unit squares
    word.split('').forEach((char, index) => {
        if (char === ' ') return;

        const letterDiv = document.createElement('div');
        letterDiv.style.display = 'grid';
        letterDiv.style.gridTemplateColumns = 'repeat(5, 20px)';
        letterDiv.style.gridTemplateRows = 'repeat(5, 20px)';
        letterDiv.style.gap = '1px';
        letterDiv.style.margin = '0 10px';
        letterDiv.style.backgroundColor = '#ddd';

        for (let i = 0; i < 25; i++) {
            const square = document.createElement('div');
            const row = Math.floor(i / 5);
            const col = i % 5;
            
            square.style.width = '20px';
            square.style.height = '20px';
            square.style.backgroundColor = 'white';
            square.style.border = '1px solid #ccc';
            
            if (letters[char].some(([r, c]) => r === row && c === col)) {
                square.style.backgroundColor = colors[index % colors.length];
                square.style.border = '1px solid #999';
            }
            
            letterDiv.appendChild(square);
        }
        
        lettersContainer.appendChild(letterDiv);
    });
    
    // Add instruction text
    const instructionText = document.createElement('div');
    instructionText.textContent = 'Fit the above alphabets into the below grid';
    instructionText.style.marginBottom = '20px';
    instructionText.style.fontSize = '16px';
    instructionText.style.fontWeight = 'bold';
    puzzleContainer.appendChild(instructionText);

    // Create empty grid container
    const emptyGridContainer = document.createElement('div');
    emptyGridContainer.style.display = 'flex';
    emptyGridContainer.style.flexDirection = 'column';
    emptyGridContainer.style.alignItems = 'center';

    // Create empty grid
    const emptyGridElement = document.createElement('div');
    emptyGridElement.className = 'grid';
    emptyGridElement.style.gridTemplateColumns = `repeat(${trimmedWidth}, 20px)`;
    emptyGridElement.style.gridTemplateRows = `repeat(${trimmedHeight}, 20px)`;

    // Fill empty grid with cells
    for (let y = 0; y < trimmedHeight; y++) {
        for (let x = 0; x < trimmedWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            emptyGridElement.appendChild(cell);
        }
    }
    emptyGridContainer.appendChild(emptyGridElement);
    puzzleContainer.appendChild(emptyGridContainer);

    // Add puzzle container to main container
    container.appendChild(puzzleContainer);
    
    // Update PDF download event listener
    downloadBtn.addEventListener('click', () => {
        // Configure pdf options
        const opt = {
            margin: 10,
            filename: 'letter_puzzle.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Create a clone of the puzzle container for PDF generation
        const tempContainer = document.createElement('div');
        tempContainer.style.padding = '20px';
        tempContainer.appendChild(puzzleContainer.cloneNode(true));
        document.body.appendChild(tempContainer);

        // Generate and download PDF
        html2pdf().set(opt).from(tempContainer).save().then(() => {
            document.body.removeChild(tempContainer);
        });
    });

    // Create View Solution button outside the puzzle container
    const viewSolutionBtn = document.createElement('button');
    viewSolutionBtn.textContent = 'View Solution';
    viewSolutionBtn.style.padding = '10px 20px';
    viewSolutionBtn.style.fontSize = '16px';
    viewSolutionBtn.style.backgroundColor = '#4CAF50';
    viewSolutionBtn.style.color = 'white';
    viewSolutionBtn.style.border = 'none';
    viewSolutionBtn.style.borderRadius = '4px';
    viewSolutionBtn.style.cursor = 'pointer';
    viewSolutionBtn.style.margin = '20px auto';
    viewSolutionBtn.style.display = 'block';
    container.appendChild(viewSolutionBtn);
    
    viewSolutionBtn.addEventListener('click', () => {
        // Create solution container
        const solutionContainer = document.createElement('div');
        solutionContainer.style.display = 'flex';
        solutionContainer.style.flexDirection = 'column';
        solutionContainer.style.alignItems = 'center';
        solutionContainer.style.margin = '20px auto';
        
        // Create solution title
        const solutionTitle = document.createElement('div');
        solutionTitle.textContent = 'Solution';
        solutionTitle.style.fontSize = '16px';
        solutionTitle.style.fontWeight = 'bold';
        solutionTitle.style.marginBottom = '10px';
        solutionContainer.appendChild(solutionTitle);

        // Create solution grid
        const solutionGrid = document.createElement('div');
        solutionGrid.className = 'grid';
        solutionGrid.style.gridTemplateColumns = `repeat(${trimmedWidth}, 20px)`;
        solutionGrid.style.gridTemplateRows = `repeat(${trimmedHeight}, 20px)`;
        
        for (let y = 0; y < trimmedHeight; y++) {
            for (let x = 0; x < trimmedWidth; x++) {
                const cell = document.createElement('div');
                cell.className = 'grid-cell';
                
                const value = trimmedGrid[y][x];
                if (value > 0) {
                    cell.classList.add('filled');
                    cell.style.backgroundColor = colors[(value - 1) % colors.length];
                }
                
                solutionGrid.appendChild(cell);
            }
        }
        
        solutionContainer.appendChild(solutionGrid);
        
        // Add solution container below the button
        container.appendChild(solutionContainer);
        viewSolutionBtn.style.display = 'none';
    });
}
