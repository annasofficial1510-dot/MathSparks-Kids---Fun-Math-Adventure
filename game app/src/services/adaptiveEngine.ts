import { DifficultyLevel, DifficultyMode, GameType, MathQuestion, SkillProficiency, SkillStreaks } from '../types/math';

const FRUITS_AND_OBJECTS = [
  { emoji: '🍎', name: 'Apples' },
  { emoji: '⭐', name: 'Stars' },
  { emoji: '🦆', name: 'Ducklings' },
  { emoji: '🧁', name: 'Cupcakes' },
  { emoji: '🐸', name: 'Frogs' },
  { emoji: '🚀', name: 'Rockets' },
  { emoji: '🍪', name: 'Cookies' },
  { emoji: '🐠', name: 'Fishies' },
  { emoji: '🎈', name: 'Balloons' },
  { emoji: '🥕', name: 'Carrots' },
];

export function determineEffectiveLevel(
  mode: DifficultyMode,
  skill: keyof SkillProficiency,
  proficiencies: SkillProficiency,
  streaks: SkillStreaks
): DifficultyLevel {
  if (mode === 'level1') return 1;
  if (mode === 'level2') return 2;
  if (mode === 'level3') return 3;

  // Adaptive Mode
  const score = proficiencies[skill] ?? 20;
  const streak = streaks[skill] ?? 0;

  // Dynamic thresholding
  if (score < 35 && streak < 4) {
    return 1;
  } else if (score < 70) {
    // If on a high streak, temporarily nudge to level 3 challenge
    if (streak >= 5) return 3;
    return 2;
  } else {
    // If struggling recently on level 3, fall back to 2
    if (streak <= -2) return 2;
    return 3;
  }
}

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function generateOptions(correct: number, count: number = 4, min: number = 0, max: number = 20): number[] {
  const opts = new Set<number>();
  opts.add(correct);

  let attempts = 0;
  while (opts.size < count && attempts < 40) {
    attempts++;
    // Generate distractors close to correct answer
    const offset = Math.floor(Math.random() * 5) - 2; // -2, -1, 0, 1, 2
    const candidate = correct + (offset === 0 ? (Math.random() > 0.5 ? 1 : -1) : offset);
    if (candidate >= min && candidate <= max && candidate !== correct) {
      opts.add(candidate);
    }
  }

  // Fill in if still not enough
  while (opts.size < count) {
    const rand = Math.floor(Math.random() * (max - min + 1)) + min;
    opts.add(rand);
  }

  return shuffle(Array.from(opts));
}

export function generateCountingQuestion(level: DifficultyLevel): MathQuestion {
  const item = FRUITS_AND_OBJECTS[Math.floor(Math.random() * FRUITS_AND_OBJECTS.length)];
  let targetCount: number;

  if (level === 1) {
    targetCount = Math.floor(Math.random() * 5) + 1; // 1 to 5
  } else if (level === 2) {
    targetCount = Math.floor(Math.random() * 7) + 4; // 4 to 10
  } else {
    targetCount = Math.floor(Math.random() * 9) + 7; // 7 to 15
  }

  const itemsArray = Array.from({ length: targetCount }, (_, i) => ({
    id: `item-${i}`,
    emoji: item.emoji,
  }));

  const options = generateOptions(targetCount, 4, 1, Math.max(15, targetCount + 3));

  return {
    id: `cnt-${Date.now()}-${Math.random()}`,
    type: 'counting',
    prompt: `How many ${item.name.toLowerCase()} do you see?`,
    subPrompt: 'Tap each item to count aloud!',
    visualData: {
      items: itemsArray,
      itemEmoji: item.emoji,
      itemName: item.name,
      layout: targetCount > 10 ? 'grid-ten-frame' : 'flex-wrap',
    },
    options,
    correctAnswer: targetCount,
    hint: `Try touching each ${item.emoji} one by one from left to right!`,
    level,
  };
}

export function generateAdditionQuestion(level: DifficultyLevel): MathQuestion {
  const item = FRUITS_AND_OBJECTS[Math.floor(Math.random() * FRUITS_AND_OBJECTS.length)];
  let a: number;
  let b: number;
  let missingAddend = false;

  if (level === 1) {
    a = Math.floor(Math.random() * 3) + 1;
    b = Math.floor(Math.random() * 3) + 1;
  } else if (level === 2) {
    a = Math.floor(Math.random() * 6) + 2;
    b = Math.floor(Math.random() * 5) + 1;
  } else {
    // Level 3: larger sums or missing addend
    if (Math.random() > 0.4) {
      missingAddend = true;
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 7) + 2;
    } else {
      a = Math.floor(Math.random() * 9) + 5;
      b = Math.floor(Math.random() * 8) + 3;
    }
  }

  const sum = a + b;

  if (missingAddend) {
    const options = generateOptions(b, 4, 1, 15);
    return {
      id: `add-${Date.now()}-${Math.random()}`,
      type: 'addition',
      prompt: `${a} + __ = ${sum}`,
      subPrompt: `What number goes in the mystery blank?`,
      visualData: {
        numA: a,
        numB: b,
        sum,
        itemEmoji: item.emoji,
        missing: 'b',
      },
      options,
      correctAnswer: b,
      hint: `Start at ${a} and count up until you reach ${sum}!`,
      level,
    };
  } else {
    const options = generateOptions(sum, 4, 1, Math.max(12, sum + 3));
    return {
      id: `add-${Date.now()}-${Math.random()}`,
      type: 'addition',
      prompt: `${a} + ${b} = ?`,
      subPrompt: `Add the two groups together!`,
      visualData: {
        numA: a,
        numB: b,
        sum,
        itemEmoji: item.emoji,
        missing: 'sum',
      },
      options,
      correctAnswer: sum,
      hint: `Count ${a} ${item.emoji}, then keep counting ${b} more!`,
      level,
    };
  }
}

export function generateSubtractionQuestion(level: DifficultyLevel): MathQuestion {
  const item = FRUITS_AND_OBJECTS[Math.floor(Math.random() * FRUITS_AND_OBJECTS.length)];
  let total: number;
  let eaten: number;

  if (level === 1) {
    total = Math.floor(Math.random() * 4) + 2; // 2 to 5
    eaten = Math.floor(Math.random() * (total - 1)) + 1;
  } else if (level === 2) {
    total = Math.floor(Math.random() * 6) + 4; // 4 to 9
    eaten = Math.floor(Math.random() * (total - 1)) + 1;
  } else {
    total = Math.floor(Math.random() * 8) + 8; // 8 to 15
    eaten = Math.floor(Math.random() * (total - 2)) + 1;
  }

  const remainder = total - eaten;
  const options = generateOptions(remainder, 4, 0, Math.max(10, total));

  return {
    id: `sub-${Date.now()}-${Math.random()}`,
    type: 'subtraction',
    prompt: `Dino ate ${eaten} ${item.name.toLowerCase()} out of ${total}!`,
    subPrompt: `How many ${item.name.toLowerCase()} are left?`,
    visualData: {
      total,
      eaten,
      remainder,
      itemEmoji: item.emoji,
      itemName: item.name,
    },
    options,
    correctAnswer: remainder,
    hint: `Tap the snacks to feed Dino and see how many remain!`,
    level,
  };
}

export function generateComparisonQuestion(level: DifficultyLevel): MathQuestion {
  const itemLeft = FRUITS_AND_OBJECTS[Math.floor(Math.random() * FRUITS_AND_OBJECTS.length)];
  const itemRight = FRUITS_AND_OBJECTS[Math.floor(Math.random() * FRUITS_AND_OBJECTS.length)];

  let valLeft: number;
  let valRight: number;
  let exprLeft = '';
  let exprRight = '';

  if (level === 1) {
    // Simple small numbers with visual items
    valLeft = Math.floor(Math.random() * 6) + 1;
    valRight = Math.floor(Math.random() * 6) + 1;
    // ensure not always equal
    if (Math.random() > 0.25 && valLeft === valRight) {
      valRight = valLeft + 1;
    }
    exprLeft = `${valLeft}`;
    exprRight = `${valRight}`;
  } else if (level === 2) {
    valLeft = Math.floor(Math.random() * 15) + 3;
    valRight = Math.floor(Math.random() * 15) + 3;
    if (Math.random() > 0.3 && valLeft === valRight) {
      valRight = valLeft + 2;
    }
    exprLeft = `${valLeft}`;
    exprRight = `${valRight}`;
  } else {
    // Level 3: Expressions! e.g. 3 + 4 vs 8
    if (Math.random() > 0.5) {
      const a = Math.floor(Math.random() * 6) + 2;
      const b = Math.floor(Math.random() * 5) + 1;
      valLeft = a + b;
      exprLeft = `${a} + ${b}`;

      valRight = Math.floor(Math.random() * 12) + 3;
      exprRight = `${valRight}`;
    } else {
      valLeft = Math.floor(Math.random() * 30) + 10;
      valRight = Math.floor(Math.random() * 30) + 10;
      exprLeft = `${valLeft}`;
      exprRight = `${valRight}`;
    }
  }

  let correctSign: string;
  if (valLeft > valRight) {
    correctSign = '>';
  } else if (valLeft < valRight) {
    correctSign = '<';
  } else {
    correctSign = '=';
  }

  return {
    id: `comp-${Date.now()}-${Math.random()}`,
    type: 'comparison',
    prompt: `Which sign balances the seesaw?`,
    subPrompt: `Compare: ${exprLeft}  [ ? ]  ${exprRight}`,
    visualData: {
      valLeft,
      valRight,
      exprLeft,
      exprRight,
      itemLeftEmoji: itemLeft.emoji,
      itemRightEmoji: itemRight.emoji,
    },
    options: ['>', '=', '<'],
    correctAnswer: correctSign,
    hint: `Remember: The hungry alligator mouth opens towards the BIGGER number!`,
    level,
  };
}

export function generatePatternQuestion(level: DifficultyLevel): MathQuestion {
  let sequence: (number | string)[] = [];
  let missingIndex = 3;
  let correctAnswer: number;

  if (level === 1) {
    // Simple counting up: e.g. 1, 2, 3, [4], 5
    const start = Math.floor(Math.random() * 5) + 1;
    sequence = [start, start + 1, start + 2, start + 3];
    missingIndex = Math.floor(Math.random() * 2) + 2; // index 2 or 3
    correctAnswer = sequence[missingIndex] as number;
    sequence[missingIndex] = '?';
  } else if (level === 2) {
    // Step by 1 backwards or step by 2 forwards
    if (Math.random() > 0.5) {
      // Step by 2: 2, 4, 6, 8, 10
      const start = (Math.floor(Math.random() * 4) + 1) * 2;
      sequence = [start, start + 2, start + 4, start + 6];
      missingIndex = Math.floor(Math.random() * 3) + 1;
      correctAnswer = sequence[missingIndex] as number;
      sequence[missingIndex] = '?';
    } else {
      // Backwards: 10, 9, 8, 7
      const start = Math.floor(Math.random() * 5) + 6;
      sequence = [start, start - 1, start - 2, start - 3];
      missingIndex = Math.floor(Math.random() * 2) + 2;
      correctAnswer = sequence[missingIndex] as number;
      sequence[missingIndex] = '?';
    }
  } else {
    // Level 3: Skip counting by 5 or 10 or 3
    const stepChoices = [3, 5, 10];
    const step = stepChoices[Math.floor(Math.random() * stepChoices.length)];
    const start = step === 10 ? Math.floor(Math.random() * 4) * 10 + 10 : step * (Math.floor(Math.random() * 3) + 1);
    sequence = [start, start + step, start + step * 2, start + step * 3, start + step * 4];
    missingIndex = Math.floor(Math.random() * 3) + 1;
    correctAnswer = sequence[missingIndex] as number;
    sequence[missingIndex] = '?';
  }

  const options = generateOptions(correctAnswer, 4, Math.max(0, correctAnswer - 10), correctAnswer + 10);

  return {
    id: `pat-${Date.now()}-${Math.random()}`,
    type: 'patterns',
    prompt: `Which train car is missing?`,
    subPrompt: `Look at the pattern on the tracks!`,
    visualData: {
      sequence,
      missingIndex,
      correctAnswer,
    },
    options,
    correctAnswer,
    hint: `Look at the numbers before and after to see how much we jump each time!`,
    level,
  };
}

export function generateQuestionForGame(
  gameType: GameType,
  profileProficiencies: SkillProficiency,
  profileStreaks: SkillStreaks,
  mode: DifficultyMode
): MathQuestion {
  // Map gameType to skill
  const skillKey: keyof SkillProficiency = 
    gameType === 'counting' ? 'counting' :
    gameType === 'addition' ? 'addition' :
    gameType === 'subtraction' ? 'subtraction' :
    gameType === 'comparison' ? 'comparison' :
    gameType === 'patterns' ? 'patterns' : 'addition';

  const level = determineEffectiveLevel(mode, skillKey, profileProficiencies, profileStreaks);

  switch (gameType) {
    case 'counting':
      return generateCountingQuestion(level);
    case 'addition':
      return generateAdditionQuestion(level);
    case 'subtraction':
      return generateSubtractionQuestion(level);
    case 'comparison':
      return generateComparisonQuestion(level);
    case 'patterns':
      return generatePatternQuestion(level);
    case 'sprint':
      // Mixed rapid questions
      const sprintTypes: GameType[] = ['counting', 'addition', 'subtraction', 'comparison', 'patterns'];
      const chosen = sprintTypes[Math.floor(Math.random() * sprintTypes.length)];
      return generateQuestionForGame(chosen, profileProficiencies, profileStreaks, mode);
  }
}
