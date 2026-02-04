/* ============================================
   💕 The Two of Us - Game Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // Game Data
    // ============================================
    
    const chapters = [
        {
            number: 1,
            title: "THE BEGINNING",
            puzzles: [
                { clue: "Where we first met", answer: "UNI", special: 2 },
                { clue: "Your first impression of me", answer: "PUZZLED", special: 4 },
                { clue: "The first thing I noticed about you", answer: "SMILE", special: null }
            ]
        },
        {
            number: 2,
            title: "THE LITTLE THINGS",
            puzzles: [
                { clue: "Our go-to snack", answer: "BOBA", special: 1 },
                { clue: "What we always forget to decide", answer: "DINNER", special: null },
                { clue: "Your most-used emoji with me 🐢", answer: "TURTLE", special: 1 },
                { clue: "Our unspoken routine", answer: "COFFEE", special: null }
            ]
        },
        {
            number: 3,
            title: "US BEING US",
            puzzles: [
                { clue: "Our most said word 😭", answer: "BOMBOCLAAT", special: null },
                { clue: "What we laugh at way too much", answer: "REELS", special: null },
                { clue: "My favourite thing you do without realising", answer: "CARE", special: null }
            ]
        },
        {
            number: 4,
            title: "HOW YOU MAKE ME FEEL",
            puzzles: [
                { clue: "One word that describes you", answer: "LOVELY", special: [2, 5] },
                { clue: "You make me feel...", answer: "HOME", special: 3 },
                { clue: "What I feel when you walk in", answer: "CALM", special: null },
                { clue: "What I never feel with you", answer: "ALONE", special: 2 }
            ]
        }
    ];

    // ============================================
    // State
    // ============================================
    
    const state = {
        currentScreen: 'loading',
        currentChapter: 0,
        currentPuzzle: 0,
        currentRow: 0,
        currentTile: 0,
        currentGuess: '',
        isAnimating: false
    };

    // ============================================
    // DOM Elements
    // ============================================
    
    const screens = {
        loading: document.getElementById('loading-screen'),
        landing: document.getElementById('landing-screen'),
        chapterIntro: document.getElementById('chapter-intro-screen'),
        game: document.getElementById('game-screen'),
        secret: document.getElementById('secret-screen'),
        celebration: document.getElementById('celebration-screen')
    };

    const elements = {
        loadingFill: document.getElementById('loading-fill'),
        chapterNumber: document.getElementById('chapter-number'),
        chapterTitle: document.getElementById('chapter-title'),
        gameTitle: document.getElementById('game-title'),
        gameSubtitle: document.getElementById('game-subtitle'),
        progressDots: document.getElementById('progress-dots'),
        progressText: document.getElementById('progress-text'),
        clueText: document.getElementById('clue-text'),
        wordleGrid: document.getElementById('wordle-grid'),
        keyboard: document.getElementById('keyboard'),
        message: document.getElementById('message')
    };

    // ============================================
    // Screen Management
    // ============================================
    
    function showScreen(screenName) {
        Object.entries(screens).forEach(([name, screen]) => {
            screen.classList.remove('active');
        });
        screens[screenName].classList.add('active');
        state.currentScreen = screenName;
    }

    // ============================================
    // Loading Screen
    // ============================================
    
    function startLoading() {
        let progress = 0;
        const duration = 3500; // 3.5 seconds for dramatic effect
        const interval = 50;
        const increment = (interval / duration) * 100;
        
        const loadingInterval = setInterval(() => {
            progress += increment;
            elements.loadingFill.style.width = `${Math.min(progress, 100)}%`;
            
            if (progress >= 100) {
                clearInterval(loadingInterval);
                setTimeout(() => {
                    showScreen('landing');
                }, 600);
            }
        }, interval);
    }

    // ============================================
    // Chapter & Puzzle Navigation
    // ============================================
    
    function showChapterIntro() {
        const chapter = chapters[state.currentChapter];
        elements.chapterNumber.textContent = `CHAPTER ${chapter.number}`;
        elements.chapterTitle.textContent = chapter.title;
        showScreen('chapterIntro');
    }
    
    function startPuzzle() {
        const chapter = chapters[state.currentChapter];
        const puzzle = chapter.puzzles[state.currentPuzzle];
        
        // Update header
        elements.gameTitle.textContent = `CHAPTER ${chapter.number}`;
        elements.gameSubtitle.textContent = chapter.title;
        elements.clueText.textContent = puzzle.clue;
        
        // Update progress
        updateProgressIndicator();
        
        // Create grid
        createWordleGrid(puzzle.answer.length);
        
        // Reset keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.classList.remove('correct', 'present', 'absent');
        });
        
        // Reset state
        state.currentRow = 0;
        state.currentTile = 0;
        state.currentGuess = '';
        
        showScreen('game');
    }
    
    function updateProgressIndicator() {
        const chapter = chapters[state.currentChapter];
        const total = chapter.puzzles.length;
        const current = state.currentPuzzle + 1;
        
        elements.progressText.textContent = `Puzzle ${current} of ${total}`;
        
        elements.progressDots.innerHTML = '';
        chapter.puzzles.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = 'progress-dot';
            if (index < state.currentPuzzle) {
                dot.classList.add('completed');
            } else if (index === state.currentPuzzle) {
                dot.classList.add('current');
            }
            elements.progressDots.appendChild(dot);
        });
    }

    // ============================================
    // Wordle Grid
    // ============================================
    
    function createWordleGrid(wordLength) {
        elements.wordleGrid.innerHTML = '';
        const maxAttempts = 6;
        
        for (let row = 0; row < maxAttempts; row++) {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'wordle-row';
            
            for (let col = 0; col < wordLength; col++) {
                const tile = document.createElement('div');
                tile.className = 'wordle-tile';
                tile.dataset.row = row;
                tile.dataset.col = col;
                rowDiv.appendChild(tile);
            }
            
            elements.wordleGrid.appendChild(rowDiv);
        }
    }
    
    function getTile(row, col) {
        return document.querySelector(
            `.wordle-tile[data-row="${row}"][data-col="${col}"]`
        );
    }

    // ============================================
    // Keyboard Input
    // ============================================
    
    function handleKeyPress(key) {
        if (state.isAnimating) return;
        
        const puzzle = chapters[state.currentChapter].puzzles[state.currentPuzzle];
        const wordLength = puzzle.answer.length;
        
        if (key === 'BACKSPACE') {
            deleteLetter();
        } else if (key === 'ENTER') {
            submitGuess();
        } else if (state.currentTile < wordLength && /^[A-Z]$/.test(key)) {
            addLetter(key);
        }
    }
    
    function addLetter(letter) {
        const tile = getTile(state.currentRow, state.currentTile);
        if (tile) {
            tile.textContent = letter;
            tile.classList.add('filled');
            state.currentGuess += letter;
            state.currentTile++;
        }
    }
    
    function deleteLetter() {
        if (state.currentTile > 0) {
            state.currentTile--;
            const tile = getTile(state.currentRow, state.currentTile);
            if (tile) {
                tile.textContent = '';
                tile.classList.remove('filled');
                state.currentGuess = state.currentGuess.slice(0, -1);
            }
        }
    }
    
    function submitGuess() {
        const puzzle = chapters[state.currentChapter].puzzles[state.currentPuzzle];
        const answer = puzzle.answer;
        
        if (state.currentGuess.length !== answer.length) {
            showMessage('Not enough letters!');
            shakeRow();
            return;
        }
        
        state.isAnimating = true;
        revealGuess(puzzle);
    }

    // ============================================
    // Guess Reveal Animation
    // ============================================
    
    function revealGuess(puzzle) {
        const answer = puzzle.answer;
        const guess = state.currentGuess;
        const answerArray = answer.split('');
        const guessArray = guess.split('');
        const results = new Array(answer.length).fill('absent');
        const usedIndices = new Set();
        
        // First pass: mark correct letters
        guessArray.forEach((letter, i) => {
            if (letter === answerArray[i]) {
                results[i] = 'correct';
                usedIndices.add(i);
            }
        });
        
        // Second pass: mark present letters
        guessArray.forEach((letter, i) => {
            if (results[i] === 'correct') return;
            
            const foundIndex = answerArray.findIndex((ansLetter, j) => 
                ansLetter === letter && !usedIndices.has(j)
            );
            
            if (foundIndex !== -1) {
                results[i] = 'present';
                usedIndices.add(foundIndex);
            }
        });
        
        // Animate reveal
        let delay = 0;
        guessArray.forEach((letter, i) => {
            setTimeout(() => {
                const tile = getTile(state.currentRow, i);
                tile.classList.add('reveal', results[i]);
                updateKeyboardKey(letter, results[i]);
            }, delay);
            delay += 300;
        });
        
        // After animation
        setTimeout(() => {
            state.isAnimating = false;
            
            if (guess === answer) {
                handleWin();
            } else if (state.currentRow >= 5) {
                handleLoss(puzzle);
            } else {
                state.currentRow++;
                state.currentTile = 0;
                state.currentGuess = '';
            }
        }, delay + 400);
    }
    
    function updateKeyboardKey(letter, result) {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        if (!key) return;
        
        const currentClass = key.classList.contains('correct') ? 'correct' :
                           key.classList.contains('present') ? 'present' :
                           key.classList.contains('absent') ? 'absent' : null;
        
        if (result === 'correct') {
            key.classList.remove('present', 'absent');
            key.classList.add('correct');
        } else if (result === 'present' && currentClass !== 'correct') {
            key.classList.remove('absent');
            key.classList.add('present');
        } else if (result === 'absent' && !currentClass) {
            key.classList.add('absent');
        }
    }

    // ============================================
    // Win/Loss Handling
    // ============================================
    
    function handleWin() {
        showMessage('💕 Perfect!');
        setTimeout(() => advanceToNext(), 1500);
    }
    
    function handleLoss(puzzle) {
        showMessage(`Answer: ${puzzle.answer}`);
        setTimeout(() => advanceToNext(), 2500);
    }
    
    function advanceToNext() {
        const chapter = chapters[state.currentChapter];
        
        if (state.currentPuzzle < chapter.puzzles.length - 1) {
            // Next puzzle in chapter
            state.currentPuzzle++;
            startPuzzle();
        } else if (state.currentChapter < chapters.length - 1) {
            // Next chapter
            state.currentChapter++;
            state.currentPuzzle = 0;
            showChapterIntro();
        } else {
            // Game complete
            showScreen('secret');
        }
    }

    // ============================================
    // Messages & Effects
    // ============================================
    
    function showMessage(text) {
        elements.message.textContent = text;
        elements.message.classList.add('show');
        setTimeout(() => {
            elements.message.classList.remove('show');
        }, 2000);
    }
    
    function shakeRow() {
        const row = elements.wordleGrid.children[state.currentRow];
        row.style.animation = 'none';
        row.offsetHeight;
        row.style.animation = 'shake 0.5s ease';
    }

    // ============================================
    // Event Listeners
    // ============================================
    
    // Landing screen tap
    screens.landing.addEventListener('click', () => {
        showChapterIntro();
    });
    
    // Chapter intro tap
    screens.chapterIntro.addEventListener('click', () => {
        startPuzzle();
    });
    
    // Secret screen tap
    screens.secret.addEventListener('click', () => {
        showScreen('celebration');
    });
    
    // Keyboard clicks
    elements.keyboard.addEventListener('click', (e) => {
        const key = e.target.closest('.key');
        if (key) {
            handleKeyPress(key.dataset.key);
        }
    });
    
    // Physical keyboard
    document.addEventListener('keydown', (e) => {
        if (state.currentScreen !== 'game') return;
        
        if (e.key === 'Enter') {
            handleKeyPress('ENTER');
        } else if (e.key === 'Backspace') {
            handleKeyPress('BACKSPACE');
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            handleKeyPress(e.key.toUpperCase());
        }
    });

    // ============================================
    // Add shake animation
    // ============================================
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            20% { transform: translateX(-5px); }
            40% { transform: translateX(5px); }
            60% { transform: translateX(-5px); }
            80% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);

    // ============================================
    // Start Game
    // ============================================
    
    startLoading();
});
