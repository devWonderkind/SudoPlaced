"use client";;
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import SplitText from "gsap/src/SplitText";

gsap.registerPlugin(SplitText);

const TextZRotate = ({
  staggerFrom = "start",
  text = "Organized",
  className
}) => {
  const containerRef = useRef(null);

  useGSAP(() => {
    if (!containerRef.current) return;
    const split = new SplitText(containerRef.current, { type: "chars" });
    gsap.from(split.chars, {
      rotateZ: 180,
      ease: "back.out",
      transformOrigin: "50% 0%",
      duration: 0.3,
      stagger: {
        each: 0.09,
        from: staggerFrom,
      },
      // repeat: -1,
      // repeatDelay: 1,
    });

    return () => {
      split.revert();
    };
  }, { scope: containerRef, dependencies: [staggerFrom, text] });

  return (
    <div
      ref={containerRef}
      className={`text-4xl perspective-distant ${className ?? ""}`}>
      {text}
    </div>
  );
};

export default TextZRotate;
