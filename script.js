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
            puzzles: [
                {
                    clue: "We first met at:",
                    answer: "UNI"
                },
                {
                    clue: "The first thing I noticed about you was your:",
                    answer: "SMILE"
                },
                {
                    clue: "Our go to snack is:",
                    answer: "BOBA"
                },
                {
                    clue: "Our most-used emoji is a:.",
                    answer: "TURTLE"
                },
                {
                    clue: "My favourite routine with you is getting:",
                    answer: "COFFEE"
                }
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
        isAnimating: false,
        floatingElements: [],
        floatingAnimationId: null,
        landingAvoidRect: null,
        secretOpenedCount: 0,
        secretTotal: 0
    };

    // ============================================
    // DOM Elements
    // ============================================
    
    const screens = {
        loading: document.getElementById('loading-screen'),
        landing: document.getElementById('landing-screen'),
        game: document.getElementById('game-screen'),
        secret: document.getElementById('secret-screen'),
        puzzle: document.getElementById('puzzle-screen'),
        celebration: document.getElementById('celebration-screen')
    };

    const elements = {
        loadingFill: document.getElementById('loading-fill'),
        crosswordContainer: document.getElementById('crossword-container'),
        crosswordProgressText: document.getElementById('crossword-progress-text'),
        puzzleGrid: document.getElementById('puzzle-grid'),
        envelopeGrid: document.getElementById('envelope-grid'),
        secretInstruction: document.getElementById('secret-instruction')
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

        // Start or stop floating animation on the landing screen
        if (screenName === 'landing') {
            setupLandingFloat();
        }
    }

    // ============================================
    // Landing Screen Floating Animation
    // ============================================

    function setupLandingFloat() {
        const container = screens.landing;
        if (!container) return;

        // Cancel any previous animation
        if (state.floatingAnimationId !== null) {
            cancelAnimationFrame(state.floatingAnimationId);
            state.floatingAnimationId = null;
        }

        state.floatingElements = [];

        // Compute area to avoid (the main text block)
        const content = container.querySelector('.landing-content');
        if (content) {
            const cRect = content.getBoundingClientRect();
            const rRect = container.getBoundingClientRect();
            state.landingAvoidRect = {
                left: cRect.left - rRect.left - 40,
                right: cRect.right - rRect.left + 40,
                top: cRect.top - rRect.top - 40,
                bottom: cRect.bottom - rRect.top + 40
            };
        } else {
            state.landingAvoidRect = null;
        }

        const items = container.querySelectorAll('.teddy-image, .sparkle');
        const rect = container.getBoundingClientRect();
        const padding = 60; // keep away from edges a bit

        items.forEach((el) => {
            // Make sure elements are absolutely positioned
            el.style.position = 'absolute';
            el.style.bottom = 'auto';

            const maxX = Math.max(0, rect.width - padding);
            const maxY = Math.max(0, rect.height - padding);

            const startX = Math.random() * maxX;
            const startY = Math.random() * maxY;

            el.style.left = `${startX}px`;
            el.style.top = `${startY}px`;

            const speed = 0.4 + Math.random() * 0.6; // px per frame
            const angle = Math.random() * Math.PI * 2;

            state.floatingElements.push({
                el,
                x: startX,
                y: startY,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed
            });
        });

        if (state.floatingElements.length > 0) {
            animateLandingFloat();
        }
    }

    function animateLandingFloat() {
        if (state.currentScreen !== 'landing') {
            state.floatingAnimationId = null;
            return;
        }

        const container = screens.landing;
        const rect = container.getBoundingClientRect();
        const margin = 40; // keep inside bounds a little
        const avoid = state.landingAvoidRect;

        state.floatingElements.forEach(item => {
            item.x += item.vx;
            item.y += item.vy;

            const maxX = rect.width - margin;
            const maxY = rect.height - margin;

            if (item.x <= margin || item.x >= maxX) {
                item.vx *= -1;
                item.x = Math.max(margin, Math.min(item.x, maxX));
            }
            if (item.y <= margin || item.y >= maxY) {
                item.vy *= -1;
                item.y = Math.max(margin, Math.min(item.y, maxY));
            }

            // Avoid central text region by bouncing away
            if (avoid) {
                const size = 40; // rough size of icon
                const itemLeft = item.x;
                const itemRight = item.x + size;
                const itemTop = item.y;
                const itemBottom = item.y + size;

                const overlap =
                    itemRight > avoid.left &&
                    itemLeft < avoid.right &&
                    itemBottom > avoid.top &&
                    itemTop < avoid.bottom;

                if (overlap) {
                    // Push element back and invert direction
                    item.x -= item.vx * 4;
                    item.y -= item.vy * 4;
                    item.vx *= -1;
                    item.vy *= -1;
                }
            }

            item.el.style.left = `${item.x}px`;
            item.el.style.top = `${item.y}px`;
        });

        state.floatingAnimationId = requestAnimationFrame(animateLandingFloat);
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
    // Crossword Construction & Logic
    // ============================================

    const allClues = [];
    chapters.forEach((chapter, chapterIndex) => {
        chapter.puzzles.forEach((puzzle, puzzleIndex) => {
            allClues.push({
                chapterTitle: chapter.title,
                clue: puzzle.clue,
                answer: puzzle.answer,
                chapterIndex,
                puzzleIndex
            });
        });
    });

    function buildCrossword() {
        if (!elements.crosswordContainer) return;

        elements.crosswordContainer.innerHTML = '';
        let solvedCount = 0;

        const chapterGroups = new Map();
        allClues.forEach((entry, idx) => {
            if (!chapterGroups.has(entry.chapterTitle)) {
                chapterGroups.set(entry.chapterTitle, []);
            }
            chapterGroups.get(entry.chapterTitle).push({ ...entry, index: idx + 1 });
        });

        chapterGroups.forEach((clues, chapterTitle) => {
            const chapterBlock = document.createElement('div');

            const chapterHeading = document.createElement('div');
            chapterHeading.className = 'crossword-chapter-title';
            chapterHeading.textContent = chapterTitle;
            chapterBlock.appendChild(chapterHeading);

            clues.forEach((entry) => {
                const row = document.createElement('div');
                row.className = 'crossword-row';
                row.dataset.answer = entry.answer.toUpperCase();

                const label = document.createElement('div');
                label.className = 'crossword-label';
                label.textContent = entry.index;
                row.appendChild(label);

                const wordWrapper = document.createElement('div');
                wordWrapper.className = 'crossword-word';

                const hiddenInput = document.createElement('input');
                hiddenInput.type = 'text';
                hiddenInput.maxLength = entry.answer.length;
                hiddenInput.className = 'crossword-input';
                wordWrapper.appendChild(hiddenInput);

                const boxes = [];
                for (let i = 0; i < entry.answer.length; i++) {
                    const box = document.createElement('div');
                    box.className = 'crossword-box';
                    wordWrapper.appendChild(box);
                    boxes.push(box);
                }

                row.appendChild(wordWrapper);

                const clueEl = document.createElement('div');
                clueEl.className = 'crossword-clue';
                clueEl.textContent = entry.clue;
                row.appendChild(clueEl);

                elements.crosswordContainer.appendChild(row);

                hiddenInput.addEventListener('input', () => {
                    const value = hiddenInput.value.toUpperCase();
                    const answer = entry.answer.toUpperCase();

                    for (let i = 0; i < boxes.length; i++) {
                        boxes[i].textContent = value[i] || '';
                    }

                    if (value.length === answer.length && value === answer && !row.classList.contains('solved')) {
                        row.classList.add('solved');
                        hiddenInput.disabled = true;
                        solvedCount += 1;
                        updateCrosswordProgress(solvedCount);

                        if (solvedCount === allClues.length) {
                            setTimeout(() => showScreen('secret'), 800);
                        }
                    }
                });

                row.addEventListener('click', () => {
                    if (hiddenInput.disabled) return;
                    hiddenInput.focus();
                });
            });

            elements.crosswordContainer.appendChild(chapterBlock);
        });

        updateCrosswordProgress(0);
    }

    function updateCrosswordProgress(solvedCount) {
        if (!elements.crosswordProgressText) return;
        elements.crosswordProgressText.textContent = `${solvedCount} / ${allClues.length} clues solved`;
    }

    // ============================================
    // Image Puzzle (4x4) using thenukes.png
    // ============================================

    function initPuzzle() {
        const grid = elements.puzzleGrid;
        if (!grid) return;

        const size = 4;
        const total = size * size;
        grid.innerHTML = '';

        const indices = Array.from({ length: total }, (_, i) => i);
        shuffle(indices);

        indices.forEach((correctIndex) => {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            tile.draggable = true;
            tile.dataset.correctIndex = String(correctIndex);

            const row = Math.floor(correctIndex / size);
            const col = correctIndex % size;
            const posX = (col / (size - 1)) * 100;
            const posY = (row / (size - 1)) * 100;
            tile.style.backgroundPosition = `${posX}% ${posY}%`;

            grid.appendChild(tile);
        });

        enablePuzzleDragAndDrop(grid, size);
    }

    // ============================================
    // Secret Envelopes Logic
    // ============================================

    const SECRET_MESSAGE = 'ILOVEYOU';

    function initEnvelopes() {
        const grid = elements.envelopeGrid;
        if (!grid) return;

        grid.innerHTML = '';
        state.secretOpenedCount = 0;
        state.secretTotal = SECRET_MESSAGE.length;

        const chars = SECRET_MESSAGE.split('');

        chars.forEach((ch, index) => {
            const env = document.createElement('div');
            env.className = 'envelope';
            env.dataset.index = String(index);

            const span = document.createElement('span');
            span.className = 'envelope-letter';
            span.textContent = ch;

            env.appendChild(span);
            grid.appendChild(env);

            env.addEventListener('click', () => {
                if (!env.classList.contains('opened')) {
                    env.classList.add('opened');
                    state.secretOpenedCount += 1;
                    if (state.secretOpenedCount === state.secretTotal) {
                        if (elements.secretInstruction) {
                            elements.secretInstruction.textContent = 'That\'s the message. Hold this moment for a second...';
                        }

                        // Keep the envelope screen visible for 5 seconds,
                        // then move on to the puzzle automatically.
                        setTimeout(() => {
                            handleSecretContinueOnce();
                        }, 5000);
                    }
                }
            });
        });
    }

    function handleSecretContinueOnce() {
        showScreen('puzzle');
    }

    function enablePuzzleDragAndDrop(grid, size) {
        let dragSrc = null;

        // Mobile-friendly: tap-to-swap (always works on phones)
        let selectedTile = null;

        grid.addEventListener('dragstart', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement) || !target.classList.contains('puzzle-tile')) return;
            dragSrc = target;
            e.dataTransfer?.setData('text/plain', '');
        });

        grid.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        grid.addEventListener('drop', (e) => {
            e.preventDefault();
            const target = e.target;
            if (!dragSrc || !(target instanceof HTMLElement) || !target.classList.contains('puzzle-tile') || dragSrc === target) {
                return;
            }

            swapTiles(dragSrc, target);
            dragSrc = null;

            if (isPuzzleSolved(grid)) {
                handlePuzzleComplete();
            }
        });

        // Tap to select, tap another to swap (works on iOS/Android)
        grid.addEventListener('click', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement) || !target.classList.contains('puzzle-tile')) return;

            if (!selectedTile) {
                selectedTile = target;
                selectedTile.classList.add('selected');
                return;
            }

            if (selectedTile === target) {
                selectedTile.classList.remove('selected');
                selectedTile = null;
                return;
            }

            selectedTile.classList.remove('selected');
            swapTiles(selectedTile, target);
            selectedTile = null;

            if (isPuzzleSolved(grid)) {
                handlePuzzleComplete();
            }
        });

        // Pointer-drag swap (nice-to-have on mobile browsers that support Pointer Events)
        let pointerDraggingTile = null;
        grid.addEventListener('pointerdown', (e) => {
            const target = e.target;
            if (!(target instanceof HTMLElement) || !target.classList.contains('puzzle-tile')) return;
            pointerDraggingTile = target;
            try { target.setPointerCapture(e.pointerId); } catch (_) {}
        });

        grid.addEventListener('pointerup', (e) => {
            if (!pointerDraggingTile) return;
            const dropEl = document.elementFromPoint(e.clientX, e.clientY);
            const target = dropEl && (dropEl instanceof HTMLElement) ? dropEl.closest('.puzzle-tile') : null;
            const src = pointerDraggingTile;
            pointerDraggingTile = null;

            if (!target || !(target instanceof HTMLElement) || !target.classList.contains('puzzle-tile') || target === src) return;

            swapTiles(src, target);
            if (isPuzzleSolved(grid)) {
                handlePuzzleComplete();
            }
        });
    }

    function swapTiles(a, b) {
        const parent = a.parentNode;
        if (!parent || parent !== b.parentNode) return;

        const aNext = a.nextSibling === b ? a : a.nextSibling;
        parent.insertBefore(a, b);
        if (aNext) {
            parent.insertBefore(b, aNext);
        } else {
            parent.appendChild(b);
        }
    }

    function isPuzzleSolved(grid) {
        const tiles = Array.from(grid.querySelectorAll('.puzzle-tile'));
        return tiles.every((tile, index) => tile.dataset.correctIndex === String(index));
    }

    function handlePuzzleComplete() {
        const msg = document.createElement('div');
        msg.className = 'puzzle-complete-message';
        msg.textContent = 'Perfect. That\'s us. 💕';
        elements.puzzleGrid.parentElement?.appendChild(msg);

        setTimeout(() => {
            showScreen('celebration');
        }, 5000);
    }

    function shuffle(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }

    // ============================================
    // Start Game
    // ============================================ 
    
    // Landing screen tap -> crossword
    screens.landing.addEventListener('click', () => {
        showScreen('game');
    });

    buildCrossword();
    initPuzzle();
    initEnvelopes();
    startLoading();
});
