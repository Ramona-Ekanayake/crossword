// Define the puzzle grid and the list of words to be placed in the grid
const puzzle = `...1...........
..1000001000...
...0....0......
.1......0...1..
.0....100000000
100000..0...0..
.0.....1001000.
.0.1....0.0....
.10000000.0....
.0.0......0....
.0.0.....100...
...0......0....
..........0....`
const words = [
    'sun',
    'sunglasses',
    'suncream',
    'swimming',
    'bikini',
    'beach',
    'icecream',
    'tan',
    'deckchair',
    'sand',
    'seaside',
    'sandals',
]

const debug = true;

// Parse the puzzle string into a grid array
function parsePuzzle(puzzle) {
    // Split the puzzle string into rows and then split each row into characters
    const grid = puzzle.split('\n').map(row => row.split(''));
    console.log(`Grid Dimensions: ${grid.length}x${grid[0].length}`);
    return { grid, width: grid[0].length, height: grid.length };
}

// Find all possible positions in the grid where words can be placed
function findWordPosition(grid) {
    const slots = [];

    // Helper function to calculate the length of a slot in a given direction
    function getSlotLength(row, col, direction) {
        let length = 0;
        // Continue counting as long as the cell contains '0' or '1'
        while (
            row < grid.length &&
            col < grid[0].length &&
            (grid[row][col] === '0' || grid[row][col] === '1')
        ) {
            length++;
            // Move in the specified direction
            row += direction === 'down' ? 1 : 0;
            col += direction === 'across' ? 1 : 0;
        }
        return length;
    }

    // Iterate through the grid to find slots
    for (let y = 0; y < grid.length; y++) {
        for (let x = 0; x < grid[y].length; x++) {
            if (grid[y][x] === '1') {
                // Check for slots in both directions from the current cell
                let lengthDown = getSlotLength(y, x, 'down');
                let lengthAcross = getSlotLength(y, x, 'across');

                // Add the slot to the list if its length is greater than 1
                if (lengthDown > 1) {
                    slots.push({
                        start: { row: y, col: x },
                        direction: 'down',
                        length: lengthDown,
                    });
                }
                if (lengthAcross > 1) {
                    slots.push({
                        start: { row: y, col: x },
                        direction: 'across',
                        length: lengthAcross,
                    });
                }
            }
        }
    }

    console.log('Detected Word Slots:', slots);
    return slots;
}

// Check if a word can be placed in a given slot
function isWordPlaceable(grid, slot, word) {
    // Ensure the word length matches the slot length
    if (word.length !== slot.length) return false;

    // Check each cell in the slot to see if the word can be placed
    for (let i = 0; i < word.length; i++) {
        const row = slot.start.row + (slot.direction === 'down' ? i : 0);
        const col = slot.start.col + (slot.direction === 'across' ? i : 0);

        // Ensure the cell is within grid bounds
        if (row >= grid.length || col >= grid[row].length) return false;

        const cell = grid[row][col];
        // Ensure the cell is empty ('0'), a starting point ('1'), or matches the word character
        if (!(cell === '0' || cell === '1' || cell === word[i])) return false;
    }
    return true;
}

// Place a word in the grid at the specified slot
function placeWordInGrid(grid, slot, word) {
    // Place each character of the word in the corresponding cell of the slot
    for (let i = 0; i < word.length; i++) {
        const row = slot.start.row + (slot.direction === 'down' ? i : 0);
        const col = slot.start.col + (slot.direction === 'across' ? i : 0);
        grid[row][col] = word[i];
    }
    console.log(
        `Placed word: '${word}' at Row: ${slot.start.row}, Column: ${slot.start.col}, Direction: ${slot.direction}`
    );
}

// Main function to solve the puzzle by placing all words in the grid
function crosswordSolver(puzzle, words) {
    const { grid } = parsePuzzle(puzzle);
    let wordSlots = findWordPosition(grid);

    console.log('\nTotal Slots Found:', wordSlots.length);
    console.log('Total Words Given:', words.length);
    words.forEach(word => console.log(`Word: ${word}, Length: ${word.length}`));
    wordSlots.forEach(slot =>
        console.log(
            `Possible Slot at Row: ${slot.start.row}, Col: ${slot.start.col}, Direction: ${slot.direction}, Length: ${slot.length}`
        )
    );

    // Sort words and slots by length in descending order
    words.sort((a, b) => b.length - a.length);
    wordSlots.sort((a, b) => b.length - a.length);

    // Try to place each word in the first available slot
    for (const word of words) {
        for (const slot of wordSlots) {
            if (isWordPlaceable(grid, slot, word)) {
                placeWordInGrid(grid, slot, word);
                break;
            }
        }
    }

    console.log('\nFinal Grid:');
    return formatSolvedGrid(grid);
}

// Format the solved grid into a string for display
function formatSolvedGrid(grid) {
    return grid.map(row => row.join('')).join('\n');
}

// Solve the puzzle and print the result
console.log(crosswordSolver(puzzle, words));
