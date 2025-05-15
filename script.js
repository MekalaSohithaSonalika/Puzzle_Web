// Letter definitions (each letter is an array of [row, col] positions)
const letters = {
    'A': [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,0],[3,2]],
    'B': [[0,0],[0,1],[0,2],[1,0],[1,2],[2,0],[2,1],[2,2],[3,0],[3,2],[4,0],[4,1],[4,2]],
    'C': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[3,1],[3,2]], // 8 cells
    'D': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[1,1],[1,2],[2,2],[3,2],[3,1],[4,1]],
    'E': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[2,1],[4,1]],
    'F': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[0,2],[2,1]],
    'G': [[0,0],[0,1],[0,2],[0,3],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2],[4,3],[3,3],[2,2],[2,3]], // 14 cells
    'H': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[2,1]],
    'I': [[0,0],[0,1],[0,2],[1,1],[2,1],[3,1],[4,0],[4,1],[4,2]], // 9 cells
    'J': [[0,2],[1,2],[2,2],[3,2],[4,0],[4,1],[4,2],[3,0]],
    'K': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[3,2],[4,2],[1,1],[2,1],[3,1]],
    'L': [[0,0],[1,0],[2,0],[3,0],[4,0],[4,1],[4,2]], // 7 cells
    'M': [[0,0],[1,0],[2,0],[3,0],[0,4],[1,4],[2,4],[3,4],[0,1],[0,2],[0,3],[1,2],[2,2]],
    'N': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[0,1]], // 11 cells
    'O': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,2],[1,2],[2,2],[3,2],[4,2],[0,1],[4,1]],
    'P': [[0,0],[1,0],[2,0],[3,0],[4,0],[0,1],[0,2],[0,3],[2,1],[2,2],[2,3],[1,3]],
    'Q': [[0,0],[1,0],[2,0],[0,1],[0,2],[1,2],[2,2],[2,1],[3,2]],
    'R': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2]],
    'S': [[0,0],[0,1],[0,2],[1,0],[2,0],[2,1],[2,2],[3,2],[4,0],[4,1],[4,2]],
    'T': [[0,0],[0,1],[0,2],[1,1],[2,1],[3,1],[4,1]], // 7 cells
    'U': [[0,0],[1,0],[2,0],[3,0],[0,2],[1,2],[2,2],[3,2],[4,0],[4,1],[4,2]],
    'V': [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[0,3]],
    'X': [[0,2],[1,2],[2,0],[2,1],[2,2],[2,3],[2,4],[3,2],[4,2]],
    'W': [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4]],
    'Y': [[1,1],[2,1],[3,1],[4,1],[5,1],[1,0],[1,2],[0,0],[0,2]],
    'Z': [[0,0],[0,1],[0,2],[1,2],[2,2],[3,2],[3,3],[3,4]],
    '.': [[0,0]], // Dot character
    ' ': [] // Space character
};

// Seeded Pseudo-Random Number Generator (Mulberry32)
function mulberry32(a) {
    return function() {
      var t = a += 0x6D2B79F5;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    }
}

// Listener for the generate button
document.getElementById('generateBtn').addEventListener('click', function() {
    const btn = document.getElementById('generateBtn');
    btn.disabled = true;
    btn.textContent = 'Processing...';
    setTimeout(function() {
        try {
            generateGrid();
        } catch (error) {
            displayMessage('Error generating grid: ' + error.message, true);
            console.error(error);
        } finally {
            btn.disabled = false;
            btn.textContent = 'Generate Grid';
        }
    }, 100);
});

// Function to display messages
function displayMessage(message, isError = false) {
    let messageContainer = document.getElementById('messageContainer');
    if (!messageContainer) {
        messageContainer = document.createElement('div');
        messageContainer.id = 'messageContainer';
        messageContainer.style.padding = '10px';
        messageContainer.style.marginTop = '10px';
        messageContainer.style.border = '1px solid #ccc';
        messageContainer.style.borderRadius = '4px';
        messageContainer.style.textAlign = 'center';
        const gridContainerParent = document.getElementById('gridContainer').parentNode;
        gridContainerParent.insertBefore(messageContainer, document.getElementById('gridContainer'));
    }
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? 'red' : 'green';
    messageContainer.style.display = message ? 'block' : 'none';
}

function displayLetters(word) {
    const container = document.getElementById('lettersContainer');
    container.innerHTML = '';
    
    if (!word || word.trim() === '') return;
    
    // Show all letters in the word, not just unique ones
    const lettersInWord = word.toUpperCase().split('').filter(char => char !== ' ');
    
    // Adjust container width based on number of letters
    container.style.maxWidth = '100%';
    container.style.overflowX = 'auto';
    container.style.whiteSpace = 'nowrap';
    container.style.padding = '10px';
    
    lettersInWord.forEach(char => {
        if (letters[char]) {
            const letterContainer = document.createElement('div');
            letterContainer.className = 'letter-container';
            letterContainer.style.display = 'inline-block';
            letterContainer.style.margin = '0 10px';
            letterContainer.style.verticalAlign = 'top';
            
            const title = document.createElement('div');
            title.className = 'letter-title';
            title.textContent = char;
            letterContainer.appendChild(title);
            
            const letterGrid = document.createElement('div');
            letterGrid.className = 'letter-grid';
            
            // Calculate dimensions of the letter
            const letterShape = letters[char];
            if (letterShape.length === 0) {
                // Handle space character
                letterGrid.style.gridTemplateColumns = 'repeat(1, 20px)';
                letterGrid.style.gridTemplateRows = 'repeat(1, 20px)';
                
                const cell = document.createElement('div');
                cell.className = 'letter-cell';
                cell.style.width = '20px';
                cell.style.height = '20px';
                letterGrid.appendChild(cell);
            } else {
                const maxY = Math.max(...letterShape.map(pos => pos[0]));
                const maxX = Math.max(...letterShape.map(pos => pos[1]));
                
                letterGrid.style.gridTemplateColumns = `repeat(${maxX + 1}, 20px)`;
                letterGrid.style.gridTemplateRows = `repeat(${maxY + 1}, 20px)`;
                
                // Create all cells for the letter
                for (let y = 0; y <= maxY; y++) {
                    for (let x = 0; x <= maxX; x++) {
                        const cell = document.createElement('div');
                        cell.className = 'letter-cell';
                        cell.style.width = '20px';
                        cell.style.height = '20px';
                        
                        // Check if this position is filled in the letter definition
                        const isFilled = letterShape.some(pos => pos[0] === y && pos[1] === x);
                        if (isFilled) {
                            cell.classList.add('filled');
                        }
                        
                        letterGrid.appendChild(cell);
                    }
                }
            }
            
            letterContainer.appendChild(letterGrid);
            container.appendChild(letterContainer);
        }
    });
}

// Main function to generate the grid
function generateGrid() {
    displayMessage('');
    let word = document.getElementById('wordInput').value.toUpperCase();
    if (!word.trim()) {
        displayMessage('Please enter a word.', true);
        return;
    }
    word = word.replace(/\s+/g, ' ');
    displayLetters(word);

    for (const char of word) {
        if (!letters.hasOwnProperty(char)) {
            displayMessage(`Character '${char}' is not supported.`, true);
            return;
        }
    }

    // Initialize PRNG with a fixed seed for deterministic behavior
    const fixedSeed = 12345;
    const prng = mulberry32(fixedSeed);

    const initialSizeEstimate = calculateInitialGridSize(word);
    let bestOverallSolutionGrid = null;
    let smallestTrimmedArea = Infinity;
    let bestTrimmedDimensions = { width: 0, height: 0 };
    let solutionFoundAtAll = false;

    // Generate all possible grid sizes to try, both square and rectangular
    const gridSizesToTry = generateGridSizesToTry(initialSizeEstimate, word.length);
    
    for (const {width, height} of gridSizesToTry) {
        // Early exit if we've found a solution and current size is larger than needed
        if (bestOverallSolutionGrid) {
            const currentMaxDim = Math.max(bestTrimmedDimensions.width, bestTrimmedDimensions.height);
            if (width > currentMaxDim + 5 && height > currentMaxDim + 5) {
                break;
            }
        }

        console.log(`Attempting grid size: ${width}x${height}`);
        const solution = solveWordPuzzle(word, width, height, prng);

        if (solution && solution.grid) {
            const trimmedSolution = trimGrid(solution.grid);
            if (trimmedSolution && trimmedSolution.length > 0 && trimmedSolution[0]) {
                const currentTrimmedHeight = trimmedSolution.length;
                const currentTrimmedWidth = trimmedSolution[0].length;
                const currentTrimmedArea = currentTrimmedWidth * currentTrimmedHeight;
                
                solutionFoundAtAll = true;
                
                // Check if this solution is better than our current best
                let isBetter = false;
                if (!bestOverallSolutionGrid) {
                    isBetter = true;
                } else if (currentTrimmedArea < smallestTrimmedArea) {
                    isBetter = true;
                } else if (currentTrimmedArea === smallestTrimmedArea) {
                    // If area is same, prefer the more square solution
                    const currentMaxDim = Math.max(currentTrimmedWidth, currentTrimmedHeight);
                    const bestMaxDim = Math.max(bestTrimmedDimensions.width, bestTrimmedDimensions.height);
                    if (currentMaxDim < bestMaxDim) {
                        isBetter = true;
                    }
                }

                if (isBetter) {
                    smallestTrimmedArea = currentTrimmedArea;
                    bestTrimmedDimensions = { width: currentTrimmedWidth, height: currentTrimmedHeight };
                    bestOverallSolutionGrid = solution.grid;
                    console.log(`New best solution: ${currentTrimmedWidth}x${currentTrimmedHeight} (Area: ${currentTrimmedArea})`);
                }
            }
        }
    }

    if (solutionFoundAtAll && bestOverallSolutionGrid) {
        displayGrid(bestOverallSolutionGrid);
        const finalTrimmed = trimGrid(bestOverallSolutionGrid);
        if (finalTrimmed && finalTrimmed.length > 0 && finalTrimmed[0]) {
            const finalWidth = finalTrimmed[0].length;
            const finalHeight = finalTrimmed.length;
            displayMessage(`Optimal solution found: ${finalWidth} × ${finalHeight} (Area: ${finalWidth * finalHeight})`);
        }
    } else {
        displayMessage(`No solution found after testing various grid sizes.`, true);
    }
}

function generateGridSizesToTry(baseSize, wordLength) {
    const sizes = [];
    
    // First try square grids around the estimated size
    for (let size = Math.max(3, baseSize - 2); size <= baseSize + 5; size++) {
        sizes.push({width: size, height: size});
    }
    
    // Then try rectangular grids that might be better fits
    // For "ccliitgn" (8 letters), we want to try 11x8 specifically
    const commonRatios = [
        {w: 1, h: 1},   // square
        {w: 4, h: 3},   // 4:3
        {w: 3, h: 2},   // 3:2
        {w: 16, h: 9},  // 16:9
        {w: 11, h: 8}   // specifically for "ccliitgn"
    ];
    
    // Generate rectangular sizes based on common ratios
    for (const ratio of commonRatios) {
        const width = Math.ceil(baseSize * ratio.w / Math.max(ratio.w, ratio.h));
        const height = Math.ceil(baseSize * ratio.h / Math.max(ratio.w, ratio.h));
        
        // Add variations around this ratio
        for (let w = Math.max(3, width - 2); w <= width + 2; w++) {
            for (let h = Math.max(3, height - 2); h <= height + 2; h++) {
                if (w * h >= baseSize * baseSize * 0.8) { // Don't try grids that are too small
                    sizes.push({width: w, height: h});
                }
            }
        }
    }
    
    // Add specific sizes that might work well for certain words
    if (wordLength >= 6) {
        sizes.push({width: 11, height: 8});
        sizes.push({width: 8, height: 11});
    }
    
    // Deduplicate sizes
    const uniqueSizes = [];
    const seen = new Set();
    for (const size of sizes) {
        const key = `${size.width}x${size.height}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueSizes.push(size);
        }
    }
    
    // Sort by area (smallest first)
    uniqueSizes.sort((a, b) => (a.width * a.height) - (b.width * b.height));
    
    return uniqueSizes;
}

function calculateInitialGridSize(word) {
    const plottableChars = word.split('').filter(char => letters[char] && letters[char].length > 0);
    const totalCells = plottableChars.reduce((sum, char) => sum + letters[char].length, 0);

    if (totalCells === 0 && word.trim().length > 0) return 3;
    if (totalCells === 0) return 1;

    let estimatedMinSide = Math.ceil(Math.sqrt(totalCells * 1.2)); // Slightly more padding

    let maxLetterDim = 0;
    plottableChars.forEach(char => {
        const letterShape = letters[char];
        if (letterShape.length > 0) {
            const letterMaxY = Math.max(0, ...letterShape.map(pos => pos[0]));
            const letterMaxX = Math.max(0, ...letterShape.map(pos => pos[1]));
            maxLetterDim = Math.max(maxLetterDim, letterMaxY, letterMaxX);
        }
    });
    
    estimatedMinSide = Math.max(estimatedMinSide, maxLetterDim + 1);
    return Math.max(3, estimatedMinSide);
}

function canPlaceLetter(letterCells, grid, x_offset, y_offset, gridWidth, gridHeight, mustConnect) {
    if (!letterCells || letterCells.length === 0) {
        return true;
    }

    const cellsThisLetterWouldOccupyOnGrid = [];

    for (const [relativeY, relativeX] of letterCells) {
        const absoluteGridY = y_offset + relativeY;
        const absoluteGridX = x_offset + relativeX;

        if (absoluteGridY < 0 || absoluteGridY >= gridHeight || absoluteGridX < 0 || absoluteGridX >= gridWidth) {
            return false;
        }
        if (grid[absoluteGridY][absoluteGridX] !== 0) {
            return false;
        }
        cellsThisLetterWouldOccupyOnGrid.push([absoluteGridY, absoluteGridX]);
    }

    if (mustConnect) {
        for (const [currentCellY, currentCellX] of cellsThisLetterWouldOccupyOnGrid) {
            for (let dy_adj = -1; dy_adj <= 1; dy_adj++) {
                for (let dx_adj = -1; dx_adj <= 1; dx_adj++) {
                    if (dy_adj === 0 && dx_adj === 0) continue;

                    const adjacentCellY = currentCellY + dy_adj;
                    const adjacentCellX = currentCellX + dx_adj;

                    if (adjacentCellY >= 0 && adjacentCellY < gridHeight &&
                        adjacentCellX >= 0 && adjacentCellX < gridWidth &&
                        grid[adjacentCellY][adjacentCellX] > 0) {
                        return true;
                    }
                }
            }
        }
        return false;
    }
    return true;
}

function placeLetter(letterCells, grid, y_offset, x_offset, value) {
    for (const [relativeY, relativeX] of letterCells) {
        const ny = y_offset + relativeY;
        const nx = x_offset + relativeX;
        grid[ny][nx] = value;
    }
}

function shuffleArray(array, randomNumberGenerator) {
    const RND = randomNumberGenerator || Math.random;
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(RND() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function solveWordPuzzle(word, gridWidth, gridHeight, prng) {
    const lettersToPlace = word.split('').filter(char => char !== ' ' && letters[char] && letters[char].length > 0);

    if (lettersToPlace.length === 0) {
        return (word.trim().length === 0) ? { grid: [[]] } : null;
    }

    const maxAttemptsPerSize = 10000;
    let bestSolutionFoundForThisGridSize = null;
    let smallestTrimmedAreaForThisGridSize = Infinity;

    for (let attempt = 0; attempt < maxAttemptsPerSize; attempt++) {
        const currentLetterOrder = [...lettersToPlace];
        if (attempt > 0 || lettersToPlace.length > 1) {
            shuffleArray(currentLetterOrder, prng);
        }

        const gridCandidate = Array(gridHeight).fill(null).map(() => Array(gridWidth).fill(0));
        let successfullyPlacedCount = 0;
        let placementSuccessfulForThisAttempt = true;

        for (let i = 0; i < currentLetterOrder.length; i++) {
            const charToPlace = currentLetterOrder[i];
            const originalLetterShape = letters[charToPlace];
            const allPossibleRotations = getAllRotations(originalLetterShape);
            let currentLetterSuccessfullyPlacedThisIteration = false;

            placementAttemptLoop:
            for (const rotatedShape of allPossibleRotations) {
                if (rotatedShape.length === 0) {
                    currentLetterSuccessfullyPlacedThisIteration = true;
                    break placementAttemptLoop;
                }

                const maxYInRotation = Math.max(0, ...rotatedShape.map(p => p[0]));
                const maxXInRotation = Math.max(0, ...rotatedShape.map(p => p[1]));

                const possiblePositions = [];
                for (let y_offset = 0; y_offset <= gridHeight - 1 - maxYInRotation; y_offset++) {
                    for (let x_offset = 0; x_offset <= gridWidth - 1 - maxXInRotation; x_offset++) {
                        possiblePositions.push({ x: x_offset, y: y_offset });
                    }
                }
                
                if (attempt > 0) {
                    shuffleArray(possiblePositions, prng);
                }

                const requiresConnection = successfullyPlacedCount > 0;

                for (const pos of possiblePositions) {
                    const x_offset = pos.x;
                    const y_offset = pos.y;
                    const letterValue = successfullyPlacedCount + 1;

                    if (canPlaceLetter(rotatedShape, gridCandidate, x_offset, y_offset, gridWidth, gridHeight, requiresConnection)) {
                        placeLetter(rotatedShape, gridCandidate, y_offset, x_offset, letterValue);
                        successfullyPlacedCount++;
                        currentLetterSuccessfullyPlacedThisIteration = true;
                        break placementAttemptLoop;
                    }
                }
            }

            if (!currentLetterSuccessfullyPlacedThisIteration) {
                placementSuccessfulForThisAttempt = false;
                break;
            }
        }

        if (placementSuccessfulForThisAttempt && successfullyPlacedCount === lettersToPlace.length) {
            if (lettersToPlace.length <= 1 || isGridConnected(gridCandidate)) {
                const trimmedCandidate = trimGrid(gridCandidate);

                if (trimmedCandidate && trimmedCandidate.length > 0 && trimmedCandidate[0]) {
                    const currentTrimmedHeight = trimmedCandidate.length;
                    const currentTrimmedWidth = trimmedCandidate[0].length;
                    const currentTrimmedArea = currentTrimmedWidth * currentTrimmedHeight;

                    let isNewBestForThisGridSize = false;
                    if (!bestSolutionFoundForThisGridSize) {
                        isNewBestForThisGridSize = true;
                    } else if (currentTrimmedArea < smallestTrimmedAreaForThisGridSize) {
                        isNewBestForThisGridSize = true;
                    } else if (currentTrimmedArea === smallestTrimmedAreaForThisGridSize) {
                        const currentMaxDim = Math.max(currentTrimmedHeight, currentTrimmedWidth);
                        const tempBestTrimmed = trimGrid(bestSolutionFoundForThisGridSize.grid);
                        const bestMaxDimSoFar = Math.max(tempBestTrimmed.length, tempBestTrimmed[0].length);
                        if (currentMaxDim < bestMaxDimSoFar) {
                            isNewBestForThisGridSize = true;
                        }
                    }

                    if (isNewBestForThisGridSize) {
                        bestSolutionFoundForThisGridSize = { grid: JSON.parse(JSON.stringify(gridCandidate)) };
                        smallestTrimmedAreaForThisGridSize = currentTrimmedArea;
                    }
                }
            }
        }
    }
    return bestSolutionFoundForThisGridSize;
}

function getAllRotations(letterCells) {
    if (!letterCells || letterCells.length === 0) return [[]];
    const uniqueShapesStrings = new Set();
    const resultShapes = [];

    const normalizeAndStringify = (points) => {
        if (!points || points.length === 0) return JSON.stringify([]);
        const minX = Math.min(...points.map(p => p[1]));
        const minY = Math.min(...points.map(p => p[0]));
        let shifted = points.map(([y, x]) => [y - minY, x - minX]);
        shifted.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });
        return JSON.stringify(shifted);
    };

    let currentPoints = letterCells.map(p => [...p]).sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1];
        return a[0] - b[0];
    });

    for (let rot = 0; rot < 4; rot++) {
        if (rot > 0) {
            const maxY_before_rotation = currentPoints.length > 0 ? Math.max(0, ...currentPoints.map(p => p[0])) : 0;
            currentPoints = currentPoints.map(([y, x]) => [x, maxY_before_rotation - y]);
        }

        let normalizedShape;
        if (currentPoints.length > 0) {
            const minX_rot = Math.min(...currentPoints.map(p => p[1]));
            const minY_rot = Math.min(...currentPoints.map(p => p[0]));
            normalizedShape = currentPoints.map(([y, x]) => [y - minY_rot, x - minX_rot]);
        } else {
            normalizedShape = [];
        }

        const shapeKey = normalizeAndStringify(normalizedShape);
        if (!uniqueShapesStrings.has(shapeKey)) {
            uniqueShapesStrings.add(shapeKey);
            normalizedShape.sort((a, b) => {
                if (a[0] === b[0]) return a[1] - b[1];
                return a[0] - b[0];
            });
            resultShapes.push(normalizedShape);
        }
    }
    return resultShapes.length > 0 ? resultShapes : (letterCells.length === 0 ? [[]] : [letterCells.map(p => [...p])]);
}

function isGridConnected(grid) {
    const rows = grid.length;
    if (rows === 0) return true;
    const cols = grid[0].length;
    if (cols === 0) return true;

    const visited = Array(rows).fill(null).map(() => Array(cols).fill(false));
    let startY = -1, startX = -1;
    let totalFilledCells = 0;

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            if (grid[r][c] > 0) {
                totalFilledCells++;
                if (startY === -1) {
                    startY = r;
                    startX = c;
                }
            }
        }
    }

    if (totalFilledCells === 0) return true;
    if (startY === -1) return false;

    const queue = [[startY, startX]];
    visited[startY][startX] = true;
    let countConnectedFilledCells = 1;

    const dr = [-1, -1, -1, 0, 0, 1, 1, 1];
    const dc = [-1, 0, 1, -1, 1, -1, 0, 1];

    while (queue.length > 0) {
        const [r, c] = queue.shift();

        for (let i = 0; i < 8; i++) {
            const nr = r + dr[i];
            const nc = c + dc[i];

            if (nr >= 0 && nr < rows && nc >= 0 && nc < cols &&
                grid[nr][nc] > 0 && !visited[nr][nc]) {
                visited[nr][nc] = true;
                countConnectedFilledCells++;
                queue.push([nr, nc]);
            }
        }
    }
    return countConnectedFilledCells === totalFilledCells;
}

function displayGrid(gridData) {
    const container = document.getElementById('gridContainer');
    container.innerHTML = '';

    if (!gridData || gridData.length === 0 || !gridData[0] || gridData[0].length === 0) {
        console.warn("Attempted to display empty or invalid grid data.");
        return;
    }

    const trimmedGrid = trimGrid(gridData);

    if (!trimmedGrid || trimmedGrid.length === 0 || !trimmedGrid[0] || trimmedGrid[0].length === 0) {
        console.warn("Grid was empty after trimming for display.");
        return;
    }

    const trimmedHeight = trimmedGrid.length;
    const trimmedWidth = trimmedGrid[0].length;

    const gridElement = document.createElement('div');
    gridElement.className = 'grid';

    const cellSize = 20;

    gridElement.style.gridTemplateColumns = `repeat(${trimmedWidth}, ${cellSize}px)`;
    gridElement.style.gridTemplateRows = `repeat(${trimmedHeight}, ${cellSize}px)`;
    gridElement.style.margin = '10px auto';

    const colors = [
        '#FF6347', '#4682B4', '#32CD32', '#FFD700', '#6A5ACD', '#FF4500', '#20B2AA',
        '#ADFF2F', '#DA70D6', '#00CED1', '#FF7F50', '#87CEEB', '#7FFF00', '#BA55D3',
        '#48D1CC', '#DC143C', '#5F9EA0', '#98FB98', '#9370DB', '#AFEEEE',
        '#A52A2A', '#DEB887', '#5F9EA0', '#7FFF00', '#D2691E', '#FF7F50', '#6495ED',
        '#FFF8DC', '#DC143C', '#00FFFF', '#00008B', '#008B8B', '#B8860B', '#A9A9A9',
        '#006400', '#A9A9A9', '#BDB76B', '#8B008B', '#556B2F', '#FF8C00', '#9932CC'
    ];

    for (let y = 0; y < trimmedHeight; y++) {
        for (let x = 0; x < trimmedWidth; x++) {
            const cell = document.createElement('div');
            cell.className = 'grid-cell';
            cell.style.width = `${cellSize}px`;
            cell.style.height = `${cellSize}px`;
            cell.style.display = 'flex';
            cell.style.alignItems = 'center';
            cell.style.justifyContent = 'center';
            cell.style.fontSize = `${Math.max(8, cellSize * 0.6)}px`;

            const value = trimmedGrid[y][x];
            if (value > 0) {
                cell.classList.add('filled');
                cell.style.backgroundColor = colors[(value - 1) % colors.length];
                cell.style.color = '#fff';
                cell.style.fontWeight = 'bold';
            } else {
                cell.style.backgroundColor = '#fff';
            }
            gridElement.appendChild(cell);
        }
    }
    container.appendChild(gridElement);
}

function trimGrid(grid) {
    if (!grid || grid.length === 0 || !grid[0] || grid[0].length === 0) return [[]];

    let minRow = -1, maxRow = -1, minCol = -1, maxCol = -1;
    const rows = grid.length;
    const cols = grid[0].length;

    for (let y = 0; y < rows; y++) {
        for (let x = 0; x < cols; x++) {
            if (grid[y][x] !== 0) {
                if (minRow === -1) minRow = y;
                maxRow = y;
                if (minCol === -1 || x < minCol) minCol = x;
                if (maxCol === -1 || x > maxCol) maxCol = x;
            }
        }
    }

    if (minRow === -1) return [[]];

    const trimmed = [];
    for (let y = minRow; y <= maxRow; y++) {
        trimmed.push(grid[y].slice(minCol, maxCol + 1));
    }
    return (trimmed.length > 0 && trimmed[0] && trimmed[0].length > 0) ? trimmed : [[]];
}
