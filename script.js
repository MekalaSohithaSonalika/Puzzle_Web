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
    
    const uniqueLetters = [...new Set(word.toUpperCase().split('').filter(char => char !== ' '))];
    
    uniqueLetters.forEach(char => {
        if (letters[char]) {
            const letterContainer = document.createElement('div');
            letterContainer.className = 'letter-container';
            
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
    const fixedSeed = 12345; // Use a constant seed for consistency
    const prng = mulberry32(fixedSeed);

    const minPossibleStartSize = calculateInitialGridSize(word);
    let bestOverallSolutionGrid = null;
    let smallestTrimmedArea = Infinity;
    // let smallestTrimmedDimForMsg = ""; // Not strictly needed if we recalculate for the final message
    let solutionFoundAtAll = false;

    const searchWindowBeyondMin = 10;
    const maxInternalSizeToSearch = minPossibleStartSize + searchWindowBeyondMin;

    for (let currentInternalSize = minPossibleStartSize; currentInternalSize <= maxInternalSizeToSearch; currentInternalSize++) {
        const earlyExitSearchWindowExtension = 5;
        if (bestOverallSolutionGrid) {
            const tempTrimmed = trimGrid(bestOverallSolutionGrid);
             if (tempTrimmed && tempTrimmed.length > 0 && tempTrimmed[0] && tempTrimmed[0].length > 0) {
                const maxDimOfBestTrimmed = Math.max(tempTrimmed.length, tempTrimmed[0].length);
                 if (currentInternalSize > maxDimOfBestTrimmed + earlyExitSearchWindowExtension) {
                    console.log(`Stopping search early. Current internal size ${currentInternalSize} is significantly larger than the best trimmed solution max dimension ${maxDimOfBestTrimmed}.`);
                    break;
                }
            }
        }

        console.log(`Attempting internal grid size: ${currentInternalSize}x${currentInternalSize}`);
        // Pass the PRNG to solveWordPuzzle
        const solution = solveWordPuzzle(word, currentInternalSize, prng);

        if (solution && solution.grid && solution.grid.length > 0 && solution.grid[0] && solution.grid[0].length > 0) {
            solutionFoundAtAll = true;
            const trimmedSolution = trimGrid(solution.grid);

            if (trimmedSolution && trimmedSolution.length > 0 && trimmedSolution[0] && trimmedSolution[0].length > 0) {
                const currentTrimmedHeight = trimmedSolution.length;
                const currentTrimmedWidth = trimmedSolution[0].length;
                const currentTrimmedArea = currentTrimmedHeight * currentTrimmedWidth;

                console.log(`  Solution found for internal size ${currentInternalSize}x${currentInternalSize}. Trimmed to ${currentTrimmedWidth}x${currentTrimmedHeight} (Area: ${currentTrimmedArea})`);

                let isBetter = false;
                if (!bestOverallSolutionGrid) {
                    isBetter = true;
                } else {
                     const bestTrimmedForComparison = trimGrid(bestOverallSolutionGrid);
                     const bestTrimmedHeight = bestTrimmedForComparison.length;
                     const bestTrimmedWidth = bestTrimmedForComparison[0].length;
                     const bestOverallTrimmedArea = bestTrimmedHeight * bestTrimmedWidth;

                     if (currentTrimmedArea < bestOverallTrimmedArea) {
                         isBetter = true;
                     } else if (currentTrimmedArea === bestOverallTrimmedArea) {
                        const currentMaxDim = Math.max(currentTrimmedHeight, currentTrimmedWidth);
                        const bestMaxDim = Math.max(bestTrimmedHeight, bestTrimmedWidth);
                        if (currentMaxDim < bestMaxDim) {
                            isBetter = true;
                        }
                    }
                }

                if (isBetter) {
                    smallestTrimmedArea = currentTrimmedArea;
                    bestOverallSolutionGrid = solution.grid;
                    // smallestTrimmedDimForMsg = `${currentTrimmedWidth} × ${currentTrimmedHeight}`;
                    console.log(`    New best overall solution found. Trimmed Area: ${smallestTrimmedArea}, Dimensions: ${currentTrimmedWidth} × ${currentTrimmedHeight}`);
                }
            } else {
                 console.warn(`  Solution found for size ${currentInternalSize}, but trimmed grid was empty.`);
            }
        } else {
             console.log(`  No solution found for internal size ${currentInternalSize}x${currentInternalSize} after all attempts within solveWordPuzzle.`);
        }
    }

    if (solutionFoundAtAll && bestOverallSolutionGrid) {
        displayGrid(bestOverallSolutionGrid);
        const finalTrimmedForDisplay = trimGrid(bestOverallSolutionGrid);
        if (finalTrimmedForDisplay && finalTrimmedForDisplay.length > 0 && finalTrimmedForDisplay[0] && finalTrimmedForDisplay[0].length > 0) {
            const finalTrimmedWidth = finalTrimmedForDisplay[0].length;
            const finalTrimmedHeight = finalTrimmedForDisplay.length;
            const finalTrimmedArea = finalTrimmedWidth * finalTrimmedHeight;
             displayMessage(`Solution found. Smallest effective grid: ${finalTrimmedWidth} × ${finalTrimmedHeight} (Area: ${finalTrimmedArea})`);
        } else {
             displayMessage('Error: Best solution grid was empty after trimming.', true);
        }
    } else {
        displayMessage(`Could not find a solution within the tested grid sizes (from ${minPossibleStartSize}x${minPossibleStartSize} up to ${maxInternalSizeToSearch}x${maxInternalSizeToSearch}). Consider trying a smaller word or a larger grid search window if applicable.`, true);
    }
}

function calculateInitialGridSize(word) {
    const plottableChars = word.split('').filter(char => letters[char] && letters[char].length > 0);
    const totalCells = plottableChars.reduce((sum, char) => sum + letters[char].length, 0);

    if (totalCells === 0 && word.trim().length > 0) return 3;
    if (totalCells === 0) return 1;

    let estimatedMinSide = Math.ceil(Math.sqrt(totalCells * 1.1));

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

function canPlaceLetter(letterCells, grid, x_offset, y_offset, gridSize, mustConnect) {
    if (!letterCells || letterCells.length === 0) {
        return true;
    }

    const cellsThisLetterWouldOccupyOnGrid = [];

    for (const [relativeY, relativeX] of letterCells) {
        const absoluteGridY = y_offset + relativeY;
        const absoluteGridX = x_offset + relativeX;

        if (absoluteGridY < 0 || absoluteGridY >= gridSize || absoluteGridX < 0 || absoluteGridX >= gridSize) {
            return false;
        }
        if (grid[absoluteGridY][absoluteGridX] !== 0) {
            return false;
        }
        cellsThisLetterWouldOccupyOnGrid.push([absoluteGridY, absoluteGridX]);
    }

    if (mustConnect) {
        let foundValidConnectionToExistingLetter = false;
        for (const [currentCellY, currentCellX] of cellsThisLetterWouldOccupyOnGrid) {
            for (let dy_adj = -1; dy_adj <= 1; dy_adj++) {
                for (let dx_adj = -1; dx_adj <= 1; dx_adj++) {
                    if (dy_adj === 0 && dx_adj === 0) continue;

                    const adjacentCellY = currentCellY + dy_adj;
                    const adjacentCellX = currentCellX + dx_adj;

                    if (adjacentCellY >= 0 && adjacentCellY < gridSize &&
                        adjacentCellX >= 0 && adjacentCellX < gridSize &&
                        grid[adjacentCellY][adjacentCellX] > 0) {
                         foundValidConnectionToExistingLetter = true;
                        break;
                    }
                }
                if (foundValidConnectionToExistingLetter) break;
            }
            if (foundValidConnectionToExistingLetter) break;
        }
        if (!foundValidConnectionToExistingLetter) {
            return false;
        }
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

// Modified shuffleArray to use a provided PRNG
function shuffleArray(array, randomNumberGenerator) {
    const RND = randomNumberGenerator || Math.random; // Use provided PRNG or fallback
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(RND() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Modified solveWordPuzzle function
function solveWordPuzzle(word, gridSize, prng) { // Added prng parameter
    const lettersToPlace = word.split('').filter(char => char !== ' ' && letters[char] && letters[char].length > 0);

    if (lettersToPlace.length === 0) {
        return (word.trim().length === 0) ? { grid: [[]] } : null;
    }

    const maxAttemptsPerSize = 7500;
    let bestSolutionFoundForThisGridSize = null;
    let smallestTrimmedAreaForThisGridSize = Infinity;

    for (let attempt = 0; attempt < maxAttemptsPerSize; attempt++) {
        const currentLetterOrder = [...lettersToPlace];
        // Shuffle letter order using the seeded PRNG
        if (attempt > 0 || lettersToPlace.length > 1) { // Ensure some shuffling unless it's the very first attempt of a single letter
             shuffleArray(currentLetterOrder, prng);
        }


        const gridCandidate = Array(gridSize).fill(null).map(() => Array(gridSize).fill(0));
        let successfullyPlacedCount = 0;
        let placementSuccessfulForThisAttempt = true;

        for (let i = 0; i < currentLetterOrder.length; i++) {
            const charToPlace = currentLetterOrder[i];
            const originalLetterShape = letters[charToPlace];
            const allPossibleRotations = getAllRotations(originalLetterShape); // Order is consistent from getAllRotations
            let currentLetterSuccessfullyPlacedThisIteration = false;

            // DO NOT shuffle allPossibleRotations - try in consistent order
            // shuffleArray(allPossibleRotations, prng); // REMOVED

            placementAttemptLoop:
            for (const rotatedShape of allPossibleRotations) {
                 if (rotatedShape.length === 0) {
                      currentLetterSuccessfullyPlacedThisIteration = true;
                      break placementAttemptLoop;
                 }

                const maxYInRotation = Math.max(0, ...rotatedShape.map(p => p[0]));
                const maxXInRotation = Math.max(0, ...rotatedShape.map(p => p[1]));

                const possiblePositions = [];
                for (let y_offset = 0; y_offset <= gridSize - 1 - maxYInRotation; y_offset++) {
                    for (let x_offset = 0; x_offset <= gridSize - 1 - maxXInRotation; x_offset++) {
                        possiblePositions.push({ x: x_offset, y: y_offset });
                    }
                }
                // DO NOT shuffle possiblePositions - try in consistent order
                // shuffleArray(possiblePositions, prng); // REMOVED
                const requiresConnection = successfullyPlacedCount > 0;

                for (const pos of possiblePositions) { // Iterates in fixed order
                    const x_offset = pos.x;
                    const y_offset = pos.y;
                    const letterValue = successfullyPlacedCount + 1;

                    if (canPlaceLetter(rotatedShape, gridCandidate, x_offset, y_offset, gridSize, requiresConnection)) {
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

                if (trimmedCandidate && trimmedCandidate.length > 0 && trimmedCandidate[0] && trimmedCandidate[0].length > 0) {
                    const currentTrimmedHeight = trimmedCandidate.length;
                    const currentTrimmedWidth = trimmedCandidate[0].length;
                    const currentTrimmedArea = currentTrimmedHeight * currentTrimmedWidth;

                    let isNewBestForThisGridSize = false;
                    if (!bestSolutionFoundForThisGridSize) {
                        isNewBestForThisGridSize = true;
                    } else {
                        if (currentTrimmedArea < smallestTrimmedAreaForThisGridSize) {
                            isNewBestForThisGridSize = true;
                        } else if (currentTrimmedArea === smallestTrimmedAreaForThisGridSize) {
                            const currentMaxDim = Math.max(currentTrimmedHeight, currentTrimmedWidth);
                            const tempBestTrimmed = trimGrid(bestSolutionFoundForThisGridSize.grid);
                            const bestMaxDimSoFar = Math.max(tempBestTrimmed.length, tempBestTrimmed[0].length);
                            if (currentMaxDim < bestMaxDimSoFar) {
                                isNewBestForThisGridSize = true;
                            }
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

    // Ensure initial points are consistently ordered for the first shape.
    const initialPoints = letterCells.map(p => [...p]).sort((a, b) => {
        if (a[0] === b[0]) return a[1] - b[1];
        return a[0] - b[0];
    });

    const normalizeAndStringify = (points) => {
        if (!points || points.length === 0) return JSON.stringify([]);
        // Normalize by shifting to origin (0,0) based on minX, minY
        const minX = Math.min(...points.map(p => p[1]));
        const minY = Math.min(...points.map(p => p[0]));
        let shifted = points.map(([y, x]) => [y - minY, x - minX]);
        // Sort points for a canonical representation before stringifying
        shifted.sort((a, b) => {
            if (a[0] === b[0]) return a[1] - b[1];
            return a[0] - b[0];
        });
        return JSON.stringify(shifted);
    };

    let currentPoints = initialPoints.map(p => [...p]); // Start with a copy of sorted initial points

    for (let rot = 0; rot < 4; rot++) { // 0, 90, 180, 270 degrees
        if (rot > 0) { // For 90, 180, 270 degrees, calculate new rotation
            // Rotate 90 degrees clockwise: (x, y) -> (y, max_x - x) (relative to current shape's bounds)
            // Or simpler for this letter representation: (y,x) -> (x, MaxY - y) for point cloud.
            const maxY_before_rotation = currentPoints.length > 0 ? Math.max(0, ...currentPoints.map(p => p[0])) : 0;
            currentPoints = currentPoints.map(([y, x]) => [x, maxY_before_rotation - y]);
        }

        // Normalize the current rotation (shift to origin 0,0 based on its own bounds)
        let normalizedShape;
        if (currentPoints.length > 0) {
            const minX_rot = Math.min(...currentPoints.map(p => p[1]));
            const minY_rot = Math.min(...currentPoints.map(p => p[0]));
            normalizedShape = currentPoints.map(([y, x]) => [y - minY_rot, x - minX_rot]);
        } else {
            normalizedShape = [];
        }

        // Use the consistent normalizeAndStringify for the key, which includes sorting
        const shapeKey = normalizeAndStringify(normalizedShape);
        if (!uniqueShapesStrings.has(shapeKey)) {
            uniqueShapesStrings.add(shapeKey);
            // The normalizedShape itself (before stringify sort) might not be sorted yet
            // but it's what we want to store if it's unique.
            // However, to be extremely sure, sort the shape we push as well.
             normalizedShape.sort((a, b) => {
                if (a[0] === b[0]) return a[1] - b[1];
                return a[0] - b[0];
            });
            resultShapes.push(normalizedShape);
        }
    }
    return resultShapes.length > 0 ? resultShapes : (letterCells.length === 0 ? [[]] : [initialPoints.map(p => [...p])]);
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

    const containerElement = document.getElementById('gridContainer');
    const containerWidth = containerElement ? containerElement.clientWidth : (window.innerWidth * 0.8);
    const containerHeight = window.innerHeight * 0.5;

    const cellSize = 20; // Fixed cell size for consistency

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

// DLXNode class and related functions (kept for completeness, not primary solver)
class DLXNode { constructor() { this.L = this.R = this.U = this.D = this.C = this; this.S = 0; this.N = ''; } }
function createDLXMatrix() { console.warn("DLX Matrix creation not fully utilized by current solver."); return null; }
function searchDLX() { console.warn("DLX search not fully utilized."); return false; }
function cover() {}
function uncover() {}
function chooseColumn() {}
