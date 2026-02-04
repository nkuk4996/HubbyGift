/* ============================================
   💝 Valentine's Crossword - Game Logic
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // State
    // ============================================
    
    const state = {
        solvedClues: new Set(),
        totalClues: 14, // All clues except final
        secretMessage: 'ILOVEYOU',
        revealedLetters: new Array(8).fill(false),
        // Map: answer -> { letterIndex, secretIndex }
        specialLetters: {
            'UNI': { letterIndex: 2, secretIndex: 0 },        // I
            'PUZZLED': { letterIndex: 4, secretIndex: 1 },    // L
            'BOBA': { letterIndex: 1, secretIndex: 2 },       // O
            'LOVELY': [                                        // V and Y
                { letterIndex: 2, secretIndex: 3 },           // V
                { letterIndex: 5, secretIndex: 5 }            // Y
            ],
            'HOME': { letterIndex: 3, secretIndex: 4 },       // E
            'ALONE': { letterIndex: 2, secretIndex: 6 },      // O
            'TURTLE': { letterIndex: 1, secretIndex: 7 }      // U
        }
    };

    // ============================================
    // DOM Elements
    // ============================================
    
    const screens = {
        opening: document.getElementById('opening-screen'),
        game: document.getElementById('game-screen'),
        celebration: document.getElementById('celebration-screen')
    };
    
    const elements = {
        startBtn: document.getElementById('start-btn'),
        progressFill: document.getElementById('progress-fill'),
        progressText: document.getElementById('progress-text'),
        secretTracker: document.getElementById('secret-tracker'),
        lockOverlay: document.getElementById('lock-overlay'),
        finalChapter: document.getElementById('final-chapter'),
        confetti: document.getElementById('confetti')
    };

    // ============================================
    // Screen Management
    // ============================================
    
    function showScreen(screenName) {
        Object.values(screens).forEach(screen => {
            screen.classList.remove('active');
        });
        screens[screenName].classList.add('active');
        
        if (screenName === 'celebration') {
            launchConfetti();
        }
    }

    // ============================================
    // Game Initialization
    // ============================================
    
    function initGame() {
        // Start button handler
        elements.startBtn.addEventListener('click', () => {
            showScreen('game');
        });
        
        // Initialize all clue cards
        const clueCards = document.querySelectorAll('.clue-card:not(.final-clue)');
        clueCards.forEach(card => {
            initClueCard(card);
        });
        
        // Initialize final clue
        initFinalClue();
        
        // Set initial state
        elements.finalChapter.classList.add('locked');
        updateProgress();
    }

    // ============================================
    // Clue Card Logic
    // ============================================
    
    function initClueCard(card) {
        const input = card.querySelector('.letter-input');
        const answer = card.dataset.answer;
        const letterBoxes = card.querySelectorAll('.letter-box');
        
        input.addEventListener('input', (e) => {
            const value = e.target.value.toUpperCase();
            
            // Update letter boxes visually
            letterBoxes.forEach((box, index) => {
                if (value[index]) {
                    box.classList.add('filled');
                    box.textContent = value[index];
                } else {
                    box.classList.remove('filled');
                    box.textContent = answer[index]; // Keep original for reference
                }
            });
            
            // Check if answer is correct
            if (value === answer) {
                handleCorrectAnswer(card, answer);
            }
        });
        
        // Focus handling
        input.addEventListener('focus', () => {
            card.style.transform = 'scale(1.02)';
        });
        
        input.addEventListener('blur', () => {
            card.style.transform = 'scale(1)';
        });
    }

    // ============================================
    // Answer Validation
    // ============================================
    
    function handleCorrectAnswer(card, answer) {
        if (state.solvedClues.has(answer)) return;
        
        state.solvedClues.add(answer);
        card.classList.add('solved');
        
        // Disable input
        const input = card.querySelector('.letter-input');
        input.disabled = true;
        
        // Reveal special letters if any
        revealSpecialLetters(card, answer);
        
        // Update progress
        updateProgress();
        
        // Check if all clues are solved
        if (state.solvedClues.size === state.totalClues) {
            unlockFinalChapter();
        }
        
        // Play a subtle sound effect (optional)
        playSuccessSound();
    }

    // ============================================
    // Special Letters Reveal
    // ============================================
    
    function revealSpecialLetters(card, answer) {
        const specialData = state.specialLetters[answer];
        if (!specialData) return;
        
        const letterBoxes = card.querySelectorAll('.letter-box');
        const secretLetters = document.querySelectorAll('.secret-letter');
        
        // Handle single or multiple special letters
        const dataArray = Array.isArray(specialData) ? specialData : [specialData];
        
        dataArray.forEach(data => {
            const { letterIndex, secretIndex } = data;
            
            // Animate the special letter in the clue
            setTimeout(() => {
                if (letterBoxes[letterIndex]) {
                    letterBoxes[letterIndex].classList.add('revealed');
                }
                
                // Reveal in secret message tracker
                if (secretLetters[secretIndex]) {
                    state.revealedLetters[secretIndex] = true;
                    secretLetters[secretIndex].textContent = state.secretMessage[secretIndex];
                    secretLetters[secretIndex].classList.add('revealed');
                }
            }, 300);
        });
    }

    // ============================================
    // Progress Tracking
    // ============================================
    
    function updateProgress() {
        const progress = (state.solvedClues.size / state.totalClues) * 100;
        elements.progressFill.style.width = `${progress}%`;
        elements.progressText.textContent = `${state.solvedClues.size} / ${state.totalClues}`;
    }

    // ============================================
    // Final Chapter
    // ============================================
    
    function unlockFinalChapter() {
        elements.finalChapter.classList.remove('locked');
        elements.lockOverlay.classList.add('hidden');
        
        // Scroll to final chapter
        setTimeout(() => {
            elements.finalChapter.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 500);
        
        // Initialize final clue input
        const finalInput = elements.finalChapter.querySelector('.letter-input');
        finalInput.disabled = false;
    }
    
    function initFinalClue() {
        const finalCard = document.querySelector('.final-clue');
        const finalInput = finalCard.querySelector('.letter-input');
        const letterBoxes = finalCard.querySelectorAll('.letter-box:not(.space)');
        const answer = 'ILOVEYOU';
        
        finalInput.addEventListener('input', (e) => {
            // Remove spaces from input for comparison
            const value = e.target.value.toUpperCase().replace(/\s/g, '');
            
            // Update letter boxes
            let boxIndex = 0;
            for (let i = 0; i < value.length && boxIndex < letterBoxes.length; i++) {
                letterBoxes[boxIndex].classList.add('filled');
                letterBoxes[boxIndex].textContent = value[i];
                boxIndex++;
            }
            
            // Check if answer is correct
            if (value === answer) {
                handleFinalAnswer(finalCard);
            }
        });
    }
    
    function handleFinalAnswer(card) {
        card.classList.add('solved');
        
        // Big celebration delay
        setTimeout(() => {
            showScreen('celebration');
        }, 1000);
    }

    // ============================================
    // Confetti Effect
    // ============================================
    
    function launchConfetti() {
        const colors = ['#e84a7f', '#ff6b9d', '#ffd700', '#ff7b7b', '#9b59b6', '#fff'];
        const confettiCount = 100;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                createConfettiPiece(colors);
            }, i * 50);
        }
    }
    
    function createConfettiPiece(colors) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = Math.random() * 10 + 5 + 'px';
        confetti.style.borderRadius = Math.random() > 0.5 ? '50%' : '0';
        confetti.style.animationDuration = Math.random() * 3 + 2 + 's';
        
        elements.confetti.appendChild(confetti);
        
        // Remove after animation
        setTimeout(() => {
            confetti.remove();
        }, 5000);
    }

    // ============================================
    // Sound Effect (Optional - Web Audio API)
    // ============================================
    
    function playSuccessSound() {
        // Create a simple success tone
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (e) {
            // Audio not supported, fail silently
        }
    }

    // ============================================
    // Keyboard Navigation
    // ============================================
    
    document.addEventListener('keydown', (e) => {
        // Enter on opening screen starts the game
        if (e.key === 'Enter' && screens.opening.classList.contains('active')) {
            elements.startBtn.click();
        }
    });

    // ============================================
    // Initialize
    // ============================================
    
    initGame();
});
