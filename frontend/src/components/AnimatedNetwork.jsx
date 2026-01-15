import { useEffect, useRef, useState } from "react";
import animationData from "../assets/Network.json";

export default function AnimatedNetwork() {
  const containerRef = useRef(null);

  const [isMobile, setIsMobile] = useState(false);
  const [offsetTop, setOffsetTop] = useState(0);
  const [offsetLeft, setOffsetLeft] = useState(0);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const loadAnimation = () => {
      if (customElements.get("lottie-player") && containerRef.current) {
        const player = containerRef.current.querySelector("lottie-player");
        if (player) player.load(animationData);
      }
    };

    if (!customElements.get("lottie-player")) {
      const script = document.createElement("script");
      script.src =
        "https://unpkg.com/@lottiefiles/lottie-player@latest/dist/lottie-player.js";
      script.onload = loadAnimation;
      document.head.appendChild(script);
    } else {
      loadAnimation();
    }
  }, []);

  useEffect(() => {
    const updateLayout = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const mobile = w <= 768;
      setIsMobile(mobile);

      if (!mobile) {
        // Desktop
        setOffsetTop(-(h * 0.5));
        setOffsetLeft(w * 0.4);
        setScale(1);
      } else {
        // Mobile
        setOffsetTop(0);
        setOffsetLeft(0);
        // Escala entre 0.7 y 1.0
        const s = Math.max(0.7, Math.min(1.0, 0.9 / (w / 360)));
        setScale(s);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    return () => window.removeEventListener("resize", updateLayout);
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        ...styles.container,
        position: isMobile ? "relative" : "absolute",
        top: isMobile ? "auto" : offsetTop,
        left: isMobile ? "auto" : offsetLeft,

        width: isMobile ? "100%" : styles.container.width,
        maxWidth: isMobile ? "100%" : styles.container.maxWidth,
        margin: isMobile ? "0 0 -60px 0" : undefined, // ✅ Margen negativo solo abajo
        display: isMobile ? "block" : undefined,
      }}
    >
      <lottie-player
        background="transparent"
        speed="1"
        style={{
          width: "100%",
          height: "auto",

          transform: isMobile ? `scale(${scale})` : "none",
          transformOrigin: isMobile ? "center center" : "center",
          display: "block",
        }}
        loop
        autoplay
      />
    </div>
  );
}

const styles = {
  container: {
    position: "absolute",
    width: "100%",
    maxWidth: "651px",
    height: "auto",
    opacity: 1,
    pointerEvents: "none",
    overflow: "visible",
    zIndex: 0,
  },
};