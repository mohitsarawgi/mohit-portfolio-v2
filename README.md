# Mohit — Interactive Portfolio

Minimal first-stage interactive portfolio.

## Current experience

1. Mohit appears: **"Hey, My name is Mohit."**
2. Tap anywhere.
3. Mohit asks: **"So... what do you want to know about me?"**
4. Four interactive objects appear:
   - Skills
   - Projects
   - Education
   - Work Experience
5. Tap an object to enter a small story branch.
6. Tap through the branch, then the experience returns to the four choices.

## Run

```bash
npm install
npm run dev
```

## Structure

- `src/main.jsx` — story state, choice objects, character, interaction flow
- `src/styles.css` — scene, character illustration, cards, animations, responsive layout
- `index.html` — app shell
- `package.json` — Vite / React / Framer Motion setup

The character is deliberately CSS-based for now so it is easy to replace later with a custom illustrated or Rive character.
