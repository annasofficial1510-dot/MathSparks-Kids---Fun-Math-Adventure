import confetti from 'canvas-confetti';

export function fireConfetti(intensity: 'small' | 'medium' | 'big' = 'medium') {
  if (intensity === 'small') {
    confetti({
      particleCount: 35,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FBBF24', '#34D399', '#60A5FA', '#F472B6', '#A78BFA'],
    });
  } else if (intensity === 'medium') {
    confetti({
      particleCount: 70,
      spread: 90,
      origin: { y: 0.65 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6', '#F97316'],
    });
  } else {
    // Big celebration
    const end = Date.now() + 1000;
    const colors = ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  }
}

export function fireStarBurst(x?: number, y?: number) {
  confetti({
    particleCount: 25,
    spread: 360,
    startVelocity: 15,
    origin: {
      x: x !== undefined ? x / window.innerWidth : 0.5,
      y: y !== undefined ? y / window.innerHeight : 0.5,
    },
    shapes: ['star'],
    colors: ['#FBBF24', '#F59E0B', '#FDE047'],
  });
}
