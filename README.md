# 💕 The Two of Us - A Valentine's Wordle Adventure

> *"Every word led here."*

A pixel-art styled Valentine's Day game that takes your partner through your relationship story via Wordle-style puzzles. Each clue reveals a moment from your journey together, and hidden letters spell out the ultimate message: **I LOVE YOU**.

🔗 **[Play the Game](https://YOUR_USERNAME.github.io/HubbyGift/)**

---

## 🎮 Game Flow

### 1. 📊 Loading Screen
- Animated loading bar with heart icon
- "THENUKI AND KUKI 2026" title with pixel couple
- Automatically transitions after loading completes

### 2. 🧸 Landing Screen
- "THE TWO OF US..." title
- "PLAY ME TO WIN!" subtitle
- **Bouncing teddy bear and hearts** animate around the screen
- **Tap anywhere** to begin

### 3. 📖 Chapter Intros
- Each chapter has a dramatic intro screen
- Shows chapter number and theme
- Tap to start the puzzles

### 4. 🟩 Wordle Puzzles
- Each clue presents a Wordle-style guessing game
- Type your guess using the on-screen or physical keyboard
- **Green** = correct letter in correct position
- **Yellow** = correct letter in wrong position
- **Gray** = letter not in word
- Progress dots show puzzle completion

### 5. ✨ Secret Message Reveal
- Hidden letters from special answers spell out "I LOVE YOU"
- Animated letter-by-letter reveal

### 6. 💕 Celebration Screen
- "I LOVE YOU" in pixel glory
- Bouncing hearts
- Sweet closing message

---

## 📖 Chapters & Clues

### 🕯️ Chapter 1: The Beginning
| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Where we first met | UNI | **I** |
| Your first impression of me | PUZZLED | **L** |
| The first thing I noticed about you | SMILE | — |

### 🌱 Chapter 2: The Little Things
| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Our go-to snack | BOBA | **O** |
| What we always forget to decide | DINNER | — |
| Your most-used emoji with me 🐢 | TURTLE | **U** |
| Our unspoken routine | COFFEE | — |

### 🔥 Chapter 3: Us Being Us
| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Our most said word 😭 | BOMBOCLAAT | — |
| What we laugh at way too much | REELS | — |
| My favourite thing you do without realising | CARE | — |

### 🧲 Chapter 4: How You Make Me Feel
| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| One word that describes you | LOVELY | **V** and **Y** |
| You make me feel... | HOME | **E** |
| What I feel when you walk in | CALM | — |
| What I never feel with you | ALONE | **O** |

---

## ✨ Hidden Message

Special letters combine to reveal:

```
I  L  O  V  E  Y  O  U
```

---

## 🚀 Setup & Deployment

### Quick Start

1. **Fork or clone** this repository
2. **Customize** the names in `index.html` (change "THENUKI AND KUKI")
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select `main` branch, `/ (root)` folder
   - Click Save
4. **Wait ~1 minute** for deployment
5. **Share the link** with your partner! 💕

### File Structure

```
HubbyGift/
├── index.html      # Game screens & structure
├── styles.css      # Pixel art styling & animations
├── script.js       # Game logic & Wordle mechanics
└── README.md       # This file
```

### Customizing

#### Change Names
In `index.html`, find and replace:
```html
<h1 class="pixel-title">THENUKI AND KUKI</h1>
```

#### Change Clues & Answers
In `script.js`, edit the `chapters` array:
```javascript
const chapters = [
    {
        number: 1,
        title: "THE BEGINNING",
        puzzles: [
            { clue: "Your clue here", answer: "ANSWER", special: null },
            // special: index of letter to highlight (0-based), or null
        ]
    },
    // ...
];
```

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Pixel art theme, animations, responsive
- **Vanilla JavaScript** — No dependencies
- **Press Start 2P** — Pixel font from Google Fonts
- **GitHub Pages** — Free hosting

---

## 🎨 Design Features

- 👾 Retro pixel art aesthetic
- 🧸 Bouncing animated elements
- ⌨️ Full keyboard support (on-screen + physical)
- 📱 Mobile-friendly with touch support
- 🎵 Smooth transitions between screens
- 🏆 Wordle-style feedback system

---

## 💖 Made With Love

*For Thenuki, from Kuki — 2026*

---
