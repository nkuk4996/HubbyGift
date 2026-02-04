# 💝 HubbyGift - A Valentine's Crossword Love Story

> *"Every word led here."*

A personalized Valentine's Day crossword puzzle game that walks your partner through your relationship story, one clue at a time. The final reveal? A hidden message spelled out by special letters: **I LOVE YOU**.

🔗 **[Play the Game](https://YOUR_USERNAME.github.io/HubbyGift/)**

---

## 🎬 Opening Experience

The game opens with a custom animated logo reveal, complete with floating hearts and a starry background. Add your own logo by replacing `logo.png` in the root folder.

---

## 💌 The Storyline: "How We Got Here"

This isn't a random crossword — **each clue is a moment, habit, or feeling from your relationship**. Solving it slowly walks them through your story, and the final reveal lands emotionally.

---

## 🧩 Puzzle Structure

- Most answers are **single words or short phrases**
- Each section represents a **"chapter"** of your relationship
- Certain letters (highlighted in gold ✨) spell **I LOVE YOU** when read in order
- Progress is tracked visually at the top
- The final clue is locked until all others are solved

---

## 📖 Chapters & Clues

### 🕯️ Chapter 1: The Beginning
*Theme: First impressions, early moments*

| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Where we first met | UNI | **I** |
| Your first impression of me | PUZZLED | **L** |
| The first thing I noticed about you | SMILE | — |

---

### 🌱 Chapter 2: The Little Things
*Theme: Everyday intimacy*

| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Our go-to snack | BOBA | **O** |
| What we always forget to decide | DINNER | — |
| Your most-used emoji with me | TURTLE | **U** |
| Our unspoken routine | COFFEE | — |

---

### 🔥 Chapter 3: Us Being Us
*Theme: Inside jokes + quirks*

| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| Our most said word | BOMBOCLAAT | — |
| What we laugh at way too much | REELS | — |
| My favourite thing you do without realising | CARE | — |

---

### 🧲 Chapter 4: How You Make Me Feel
*Theme: Emotions, safety, affection*

| Clue | Answer | Hidden Letter |
|------|--------|---------------|
| One word that describes you | LOVELY | **V** and **Y** |
| You make me feel… | HOME | **E** |
| What I feel when you walk in | CALM | — |
| What I never feel with you | ALONE | **O** |

---

## ✨ The Hidden Message

As clues are solved, special highlighted letters reveal the secret message:

```
I  L  O  V  E  Y  O  U
↓  ↓  ↓  ↓  ↓  ↓  ↓  ↓
UNI PUZZLED BOBA LOVELY HOME LOVELY ALONE TURTLE
```

---

## 🎉 Final Reveal

Once all 14 clues are solved:
1. The final chapter **unlocks**
2. They type the answer: **I LOVE YOU**
3. The celebration screen appears with:
   - Confetti animation 🎊
   - The big reveal: "I Love You"
   - *"Every word led here."* 🥹
   - *"Thank you for solving this with me. I hope we keep solving life together."*

---

## 🚀 Setup & Deployment

### Quick Start

1. **Fork or clone** this repository
2. **Add your logo** (optional): Replace `logo.png` with your own image
3. **Enable GitHub Pages**:
   - Go to Settings → Pages
   - Set Source to "Deploy from a branch"
   - Select `main` branch, `/ (root)` folder
   - Click Save
4. **Share the link** with your partner! 💕

### File Structure

```
HubbyGift/
├── index.html      # Main game structure
├── styles.css      # Romantic styling & animations
├── script.js       # Game logic & interactivity
├── logo.png        # Your custom logo (optional)
└── README.md       # This file
```

### Customizing Clues

To change the clues and answers, edit `index.html`:
1. Find each `<div class="clue-card">` element
2. Update the `data-answer` attribute
3. Update the `.clue-text` paragraph
4. Adjust the `.letter-box` elements to match your answer

If changing answers with hidden letters, also update the `specialLetters` mapping in `script.js`.

---

## 🛠️ Tech Stack

- **HTML5** — Semantic structure
- **CSS3** — Animations, gradients, responsive design
- **Vanilla JavaScript** — No dependencies needed
- **GitHub Pages** — Free hosting

---

## 🎨 Design Features

- 🌙 Deep romantic color palette (rose, gold, purple)
- ✨ Smooth animations throughout
- 📱 Fully responsive (mobile-friendly)
- ♿ Accessible (keyboard navigation, reduced motion support)
- 🔊 Subtle success sounds (Web Audio API)

---

## 💖 Made With Love

*A personalized gift from me to you.*

---

## 📝 License

This project is open source and available for personal use. Feel free to customize it for your own Valentine! 💕
