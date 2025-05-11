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

// Main solver function using optimized CSP approach
function findCompactSolution(word) {
    const lettersToPlace = word.split('').map((char, index) => ({
        char,
        cells: letters[char],
        index: index + 1,
        rotations: getOptimizedRotations(letters[char], char)
    }));

    // Sort by most constrained first (most cells first)
    lettersToPlace.sort((a, b) => b.cells.length - a.cells.length);

    // Start with minimal grid size and increase as needed
    let size = calculateInitialSize(word);
    const maxSize = 50; // Maximum grid size to try
    
    while (size <= maxSize) {
        const grid = Array(size).fill().map(() => Array(size).fill(0));
        const placed = Array(lettersToPlace.length).fill(false);
        
        if (placeLettersOptimized(lettersToPlace, grid, placed, 0, size)) {
            const trimmed = trimGrid(grid);
            return {
                grid: trimmed.grid,
                width: trimmed.width,
                height: trimmed.height
            };
        }
        
        size++; // Try larger grid if no solution found
    }
    
    return null;
}

// Optimized placement algorithm with backtracking
function placeLettersOptimized(letters, grid, placed, count, size) {
    if (count === letters.length) return true;
    
    // Select most constrained letter not yet placed
    const letter = selectUnplacedLetter(letters, placed);
    if (!letter) return false;
    
    // Try all rotations
    for (const rotation of letter.rotations) {
        // Get candidate positions sorted by centrality
        const positions = getCandidatePositions(grid, size, count === 0);
        
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
        if (ny >= size || nx >= size || grid[ny][nx] !== 0) {
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

function placeLetterOptimized(cells, grid, y, x, value) {
    for (const [dy, dx] of cells) {
        grid[y + dy][x + dx] = value;
    }
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
                minY = Math.min(minY, y);
                maxY = Math.max(maxY, y);
                minX = Math.min(minX, x);
                maxX = Math.max(maxX, x);
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
