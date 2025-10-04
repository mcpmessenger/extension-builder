"use client"

import React from "react";

interface AnimatedGradientBackgroundProps {
  className?: string;
}

/**
 * AnimatedGradientBackground - A dynamic animated gradient background
 * Uses CSS animations for smooth color transitions
 */
const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  className = "",
}) => {
  return (
    <div 
      className={`absolute inset-0 overflow-hidden ${className}`}
      style={{
        background: `
          radial-gradient(125% 125% at 50% 20%, 
            #0A0A0A 35%, 
            #2979FF 50%, 
            #FF80AB 60%, 
            #FF6D00 70%, 
            #FFD600 80%, 
            #00E676 90%, 
            #3D5AFE 100%
          )
        `,
      }}
    />
  );
};

export default AnimatedGradientBackground;


