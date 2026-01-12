// AnimatedNetwork.jsx
import { useEffect, useRef } from 'react';
import animationData from '../assets/20322.json';

export default function AnimatedNetwork() {
  const containerRef = useRef(null);

  useEffect(() => {
    const loadAnimation = () => {
      if (customElements.get('lottie-player') && containerRef.current) {
        const player = containerRef.current.querySelector('lottie-player');
        if (player) {
          // Carregar directament l'objecte JSON importat
          player.load(animationData);
        }
      }
    };

    if (!customElements.get('lottie-player')) {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js';
      script.onload = loadAnimation;
      document.head.appendChild(script);
    } else {
      loadAnimation();
    }
  }, []);

  return (
    <div ref={containerRef} style={styles.container}>
      <lottie-player
        background="transparent"
        speed="1"
        style={styles.player}
        loop
        autoplay
      />
    </div>
  );
}

const styles = {
  container: {
    position: 'absolute',
    top: '-500px',
    left: '50px',
    width: '651px',
    height: '1157px',
    opacity: 1,
    pointerEvents: 'none',
  },
  player: {
    width: '100%',
    height: '100%',
  },
};