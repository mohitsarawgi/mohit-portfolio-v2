import React, { useState, useEffect } from "react";
import { initAudio, playTap, toggleMute } from "./audio";
import { createRoot } from "react-dom/client";
import { AnimatePresence, motion } from "framer-motion";
import "./styles.css";

const choices = [
  {
  id: "skills",
  label: "Skills",
  sublabel: "What I build with",
  icon: "⚙",
  color: "mint",
  steps: [
    {
      text: "Let's start with the tools I like to build with.",
      emotion: "pointing"
    },
    {
      text: "Ummm okay... here's basically everything.",
      emotion: "overwhelmed",
      tags: ["Docker", "Kubernetes", "GitHub", "AWS", "Servers", "Database", "Java", "Spring Boot", "PostgreSQL", "Git", "Cloud"]
    },
    {
      text: "With Claude 😅",
      emotion: "embarrassed-turn"
    },
    {
      text: "But I don't need the Premium Version — I can do anything just with the Basic plan.",
      emotion: "confident-laugh"
    }
  ]
},
  {
    id: "projects",
    label: "Projects",
    sublabel: "Things I've built",
    icon: "⌘",
    color: "blue",
    lines: [
      "Projects are where all the theory becomes real.",
      "I like building complete systems — APIs, databases, AI services, and deployment.",
      "This portfolio is going to become one of those projects too."
    ]
  },
  {
    id: "education",
    label: "Education",
    sublabel: "Where it started",
    icon: "✦",
    color: "peach",
    lines: [
      "I studied Artificial Intelligence and Machine Learning.",
      "That gave me the foundation — but building things taught me how the pieces actually fit together.",
      "And I am still learning every day."
    ]
  },
  {
    id: "experience",
    label: "Work Experience",
    sublabel: "Where I work",
    icon: "▣",
    color: "lavender",
    lines: [
      "I work as a Software Development Engineer.",
      "My work has pushed me toward backend systems, secure APIs, databases, and real-world applications.",
      "Now I'm focused on becoming the person who can design the whole system."
    ]
  }
];

const introScenes = [
  {
    id: "intro",
    text: "Hey, My name is Mohit.",
    emotion: "confident"
  },
  {
    id: "question",
    text: "So... what do you want to know about me?",
    emotion: "curious"
  }
];


function getSteps(choice) {
  return choice.steps || choice.lines.map((text) => ({ text }));
}



const EMOTIONS = {
  confident: {
    body: { y: [0, -2, 0] },
    head: { rotate: [-1, 1, -1] },
    duration: 3.2,
    mouth: { scaleX: [1, 1.05, 1], scaleY: 1 },
    browL: { rotate: -7, y: 0 },
    browR: { rotate: 7, y: 0 },
    eyeScale: 1
  },
  "confident-laugh": {
    body: { y: [0, -6, 0] },
    head: { rotate: [-1, 1, -1] },
    duration: 2.4,
    mouth: { scaleX: [1, 1.25, 1], scaleY: [1, 1.4, 1] },
    browL: { rotate: -10, y: -3 },
    browR: { rotate: 10, y: -3 },
    eyeScale: 1
  },
  curious: {
    body: { y: [0, -2, 0] },
    head: { rotate: [0, 2, -2, 0] },
    duration: 3,
    mouth: { scaleX: [1, 0.92, 1], scaleY: 1 },
    browL: { rotate: -3, y: -2 },
    browR: { rotate: 12, y: -4 },
    eyeScale: 1
  },
  pointing: {
    body: { y: [0, -2, 0] },
    head: { rotate: [0, 2, -2, 0] },
    duration: 3,
    mouth: { scaleX: 1, scaleY: 1 },
    browL: { rotate: -5, y: 0 },
    browR: { rotate: 5, y: 0 },
    eyeScale: 1
  },
  excited: {
    body: { y: [0, -8, 0] },
    head: { rotate: [-3, 3, -3] },
    duration: 1.6,
    mouth: { scaleX: [1, 1.2, 1], scaleY: [1, 1.3, 1] },
    browL: { rotate: -12, y: -4 },
    browR: { rotate: 12, y: -4 },
    eyeScale: 1.15
  },
  happy: {
    body: { y: [0, -4, 0] },
    head: { rotate: [-2, 2, -2] },
    duration: 2.2,
    mouth: { scaleX: [1, 1.15, 1], scaleY: [1, 1.2, 1] },
    browL: { rotate: -6, y: -2 },
    browR: { rotate: 6, y: -2 },
    eyeScale: 1.05
  },
  sad: {
    body: { y: [0, 2, 0] },
    head: { rotate: [0, -3, 0] },
    duration: 4,
    mouth: { scaleX: 0.75, scaleY: -1 },
    browL: { rotate: 14, y: 4 },
    browR: { rotate: -14, y: 4 },
    eyeScale: 0.85
  },
  angry: {
    body: { y: [0, -1, 0], x: [0, -1, 1, 0] },
    head: { rotate: [-2, 2, -2] },
    duration: 0.9,
    mouth: { scaleX: 0.7, scaleY: -0.6 },
    browL: { rotate: 22, y: 6 },
    browR: { rotate: -22, y: 6 },
    eyeScale: 0.8
  },
  embarrassed: {
    body: { y: [0, -2, 0] },
    head: { rotate: [0, 4, 7, 4, 0] },
    duration: 2,
    mouth: { scaleX: [0.8, 0.65, 0.8], scaleY: 1 },
    browL: { rotate: -4, y: -4 },
    browR: { rotate: 4, y: -4 },
    eyeScale: 0.9
  },
  "embarrassed-turn": {
    body: { y: [0, -2, 0] },
    head: { rotate: [0, 4, 7, 4, 0] },
    duration: 2,
    mouth: { scaleX: [0.8, 0.65, 0.8], scaleY: 1 },
    browL: { rotate: -4, y: -4 },
    browR: { rotate: 4, y: -4 },
    eyeScale: 0.9
  },
  overwhelmed: {
    body: { y: [0, -2, 0], x: [0, -2, 2, 0] },
    head: { rotate: [-3, 3, -3, 3, 0] },
    duration: 1.2,
    mouth: { scaleX: [0.9, 1.1, 0.9], scaleY: 1 },
    browL: { rotate: -14, y: -5 },
    browR: { rotate: 14, y: -5 },
    eyeScale: 1.2
  },
  surprised: {
    body: { y: [0, -3, 0] },
    head: { rotate: [0, 1, -1, 0] },
    duration: 1,
    mouth: { scaleX: 0.55, scaleY: 1.8 },
    browL: { rotate: -18, y: -8 },
    browR: { rotate: 18, y: -8 },
    eyeScale: 1.3
  },
  shy: {
    body: { y: [0, -1, 0] },
    head: { rotate: [0, 3, 5, 3, 0] },
    duration: 2.6,
    mouth: { scaleX: 0.7, scaleY: 0.7 },
    browL: { rotate: -2, y: -2 },
    browR: { rotate: 2, y: -2 },
    eyeScale: 0.8
  },
  sleepy: {
    body: { y: [0, 2, 0] },
    head: { rotate: [0, -1, 0] },
    duration: 4.5,
    mouth: { scaleX: 0.6, scaleY: 0.5 },
    browL: { rotate: 6, y: 3 },
    browR: { rotate: -6, y: 3 },
    eyeScale: 0.35
  },
  love: {
    body: { y: [0, -3, 0] },
    head: { rotate: [-2, 2, -2] },
    duration: 2,
    mouth: { scaleX: [1, 1.1, 1], scaleY: [1, 1.2, 1] },
    browL: { rotate: -8, y: -3 },
    browR: { rotate: 8, y: -3 },
    eyeScale: 1.1
  },
  thinking: {
    body: { y: [0, -2, 0] },
    head: { rotate: [0, -4, -2, -4, 0] },
    duration: 3,
    mouth: { scaleX: 0.85, scaleY: 0.6 },
    browL: { rotate: -3, y: -3 },
    browR: { rotate: 10, y: -6 },
    eyeScale: 0.9
  }
};

function getEmotion(name) {
  return EMOTIONS[name] || EMOTIONS.confident;
}

function Character({ emotion = "confident", activeChoice = null, bandaged = false }) {
  const e = getEmotion(emotion);

  return (
    <motion.div
      className={`character ${emotion} ${activeChoice ? `focus-${activeChoice}` : ""}`}
      initial={{ opacity: 0, y: 28, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      <div className="character-shadow" />
      <motion.div
        className="character-body"
        animate={e.body}
        transition={{ duration: e.duration, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="neck" />
        <div className="shirt">
          <span>M</span>
        </div>
        <motion.div className="arm left" animate={emotion === "pointing" ? { rotate: -38, x: -6 } : { rotate: 8 }} />
        <motion.div className="arm right" animate={emotion === "pointing" ? { rotate: -52, x: 16, y: -18 } : { rotate: -8 }} />
      </motion.div>

      <motion.div
        className="head"
        animate={e.head}
        transition={{ duration: e.duration, repeat: Infinity, ease: "easeInOut" }}
      >
                <div className="hair"><i /><i /><i /><i /><i /></div>
        {bandaged && (
          <motion.div
            className="bandage"
            initial={{ opacity: 0, scale: 0.6, rotate: -8 }}
            animate={{ opacity: 1, scale: 1, rotate: -8 }}
            transition={{ duration: 0.3, ease: "backOut" }}
          />
        )}
        <div className="ear left-ear" />
        <div className="ear right-ear" />
        <div className="face">
          <motion.div
            className="eyebrow left-brow"
            animate={{ rotate: e.browL.rotate, y: e.browL.y }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="eyebrow right-brow"
            animate={{ rotate: e.browR.rotate, y: e.browR.y }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="eye left-eye"
            animate={{ scale: e.eyeScale }}
            transition={{ duration: 0.4 }}
          />
          <motion.div
            className="eye right-eye"
            animate={{ scale: e.eyeScale }}
            transition={{ duration: 0.4 }}
          />
          <div className="nose" />
          <motion.div
            className="mouth"
            animate={{ scaleX: e.mouth.scaleX, scaleY: e.mouth.scaleY }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>

      <div className="leg left-leg" />
      <div className="leg right-leg" />
      <div className="shoe left-shoe" />
      <div className="shoe right-shoe" />
    </motion.div>
  );
}

function ChoiceObject({ choice, onSelect, index }) {
  return (
    <motion.button
      type="button"
      className={`choice-object ${choice.color}`}
      onClick={(event) => {
        event.stopPropagation();
        onSelect(choice);
      }}
      initial={{ opacity: 0, scale: 0.75, y: 18 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4, ease: "easeOut" }}
      whileHover={{ y: -8, scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
    >
      <span className="object-icon">{choice.icon}</span>
      <span className="object-label">{choice.label}</span>
      <span className="object-sublabel">{choice.sublabel}</span>
    </motion.button>
  );
}


function TagBurst({ tags }) {
  return (
    <div className="tag-burst">
      {tags.map((tag, i) => (
        <motion.span
          key={tag}
          className="tag-chip"
          initial={{ opacity: 0, scale: 0.4, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.05, duration: 0.3, ease: "backOut" }}
        >
          {tag}
        </motion.span>
      ))}
    </div>
  );
}



function App() {
  const [stage, setStage] = useState("intro");
  const [introIndex, setIntroIndex] = useState(0);
  const [selectedChoice, setSelectedChoice] = useState(null);
  const [branchIndex, setBranchIndex] = useState(0);
   const [muted, setMuted] = useState(false);
  const [hitCount, setHitCount] = useState(0);
  const [angryMode, setAngryMode] = useState(false);
  const [hitMessage, setHitMessage] = useState("");
  const [dodgeOffset, setDodgeOffset] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (hitCount < 2) return;
    const t = setTimeout(() => setDodgeOffset({ x: 0, y: 0 }), 320);
    return () => clearTimeout(t);
  }, [hitCount]);

  const introDone = introIndex === 1;

  function handleBackgroundTap() {
    initAudio();
    playTap();

    if (hitMessage) {
      setHitMessage("");
      setAngryMode(false);
      return;
    }

    if (stage === "intro") {
      if (introIndex < introScenes.length - 1) {
        setIntroIndex((value) => value + 1);
      } else {
        setStage("choices");
      }
      return;
    }
if (stage === "branch" && selectedChoice) {
  const steps = getSteps(selectedChoice);
  if (branchIndex < steps.length - 1) {
        setBranchIndex((value) => value + 1);
      } else {
        setStage("choices");
        setSelectedChoice(null);
        setBranchIndex(0);
      }
    }
  }

    const dodgeLines = [
    "Ha! Missed me!",
    "Too slow!",
    "Can't catch me now!",
    "Nice try though.",
    "Whoa, close one!"
  ];

  function handleCharacterHit(event) {
    event.stopPropagation();
    initAudio();
    playTap();

    if (hitCount === 0) {
      setHitCount(1);
      setAngryMode(true);
      setHitMessage("Okay... let's try me now.");
      return;
    }

    setHitCount((value) => value + 1);
    setHitMessage(dodgeLines[Math.floor(Math.random() * dodgeLines.length)]);
    setDodgeOffset({
      x: (Math.random() > 0.5 ? 1 : -1) * (70 + Math.random() * 70),
      y: -(30 + Math.random() * 50)
    });
  }

  function selectChoice(choice) {
    playTap();
    setSelectedChoice(choice);
    setBranchIndex(0);
    setStage("branch");
  }

   let dialogue = "";
  let emotion = "confident";
  let hint = "tap anywhere to continue";

  if (hitMessage) {
    dialogue = hitMessage;
    emotion = "angry";
    hint = "tap him again if you dare";
  } else if (stage === "intro") {
    dialogue = introScenes[introIndex].text;
    emotion = introScenes[introIndex].emotion;
  } else if (stage === "choices") {
    dialogue = introScenes[1].text;
    emotion = "curious";
    hint = "choose something to explore";
  } else if (stage === "branch" && selectedChoice) {
  const steps = getSteps(selectedChoice);
  const step = steps[branchIndex];
  dialogue = step.text;
  emotion = step.emotion || (branchIndex === steps.length - 1 ? "excited" : "pointing");
  hint = branchIndex === steps.length - 1 ? "tap to return to choices" : "tap anywhere to continue";
}

  return (
        <main className={`app ${angryMode ? "bg-angry" : ""}`} onClick={handleBackgroundTap}>
      <div className="grain" />
      <div className="sun" />
      <div className="top-mark">MOHIT</div>
          <div className="scene-number">
        {stage === "branch" ? "03 / ∞" : `0${introDone ? 2 : introIndex + 1} / 02`}
      </div>

      <button
        type="button"
        className="mute-toggle"
        onClick={(event) => {
          event.stopPropagation();
          setMuted(toggleMute());
        }}
      >
        {muted ? "🔇" : "🔊"}
      </button>

          <div className="dialogue">
        <AnimatePresence mode="wait">
          <motion.div
            key={`${stage}-${selectedChoice?.id ?? "none"}-${branchIndex}-${introIndex}`}
            initial={{ opacity: 0, y: 18, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -12, filter: "blur(5px)" }}
            transition={{ duration: 0.35 }}
          >
            <p>{dialogue}</p>
          </motion.div>
        </AnimatePresence>
      </div>

      {stage === "branch" && selectedChoice && getSteps(selectedChoice)[branchIndex].tags && (
        <TagBurst tags={getSteps(selectedChoice)[branchIndex].tags} />
      )}

      {stage === "choices" && (
        <div className="choice-field" onClick={(event) => event.stopPropagation()}>
          {choices.map((choice, index) => (
            <ChoiceObject key={choice.id} choice={choice} index={index} onSelect={selectChoice} />
          ))}
        </div>
      )}

           <div className={`character-wrap ${stage === "choices" ? "character-with-choices" : ""}`}>
        <motion.div
          className="character-hit-zone"
          animate={{
            x: dodgeOffset.x,
            y: dodgeOffset.y,
            scaleX: emotion === "embarrassed-turn" ? -1 : 1
          }}
          transition={{ type: "spring", stiffness: 500, damping: 14 }}
          onClick={handleCharacterHit}
        >
          <Character emotion={emotion} activeChoice={selectedChoice?.id} bandaged={hitCount > 0} />
        </motion.div>
      </div>

      <div className="tap-hint">
        <span className="tap-dot" />
        {hint}
      </div>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);
