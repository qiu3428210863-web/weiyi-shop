import React from 'react';

interface WLogoProps {
  className?: string; // Tailwind overrides
  color?: 'white' | 'brand';
}

export const WLogo: React.FC<WLogoProps> = ({ className = 'w-10 h-10', color = 'brand' }) => {
  // Slate-purple color code from the user image: #5c62b5
  const primaryColor = '#5c62b5';
  
  return (
    <svg 
      viewBox="0 0 500 320" 
      className={`${className} transition-all duration-300`} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background container just for reference in vector pathing */}
      <g>
        {/* The main stylized "W" body */}
        <path 
          d="M 50 120 
             C 50 80, 110 80, 115 120 
             L 170 240 
             C 175 270, 225 270, 230 240 
             L 270 140 
             C 275 110, 325 110, 330 140 
             L 375 230 
             C 380 260, 430 265, 435 230 
             L 350 125" 
          stroke={color === 'white' ? 'white' : primaryColor} 
          strokeWidth="0" 
          fill="none"
        />
        
        {/* Highly precise stylized bold letter W connected to circular badge */}
        <path
          d="M 120 70 
             C 70 70, 70 140, 70 150 
             L 115 240 
             C 130 270, 175 270, 190 240 
             L 245 130 
             C 255 110, 285 110, 295 130 
             L 350 240 
             C 365 270, 410 270, 425 240 
             L 470 150 
             O"
          fill="none"
        />

        {/* Real Bezier Path tracing the double-u curve and speed circles */}
        <g>
          {/* Main shape body */}
          <path
            d="M 90 90 
               C 60 90, 45 120, 45 150 
               L 85 235 
               C 105 275, 155 275, 175 235 
               L 230 125 
               C 240 105, 270 105, 280 125 
               L 335 235 
               C 355 275, 405 275, 425 235 
               L 440 205
               L 380 150
               C 335 150, 310 180, 295 210
               L 260 140
               C 240 105, 210 105, 195 120
               L 150 210
               L 110 120
               C 105 100, 100 90, 90 90 Z"
            fill={color === 'white' ? 'white' : primaryColor}
          />

          {/* Corrected fluid connector to upper-right circle */}
          <path
            d="M 335 235 
               L 410 115 
               C 405 105, 400 95, 400 90
               C 390 70, 410 50, 430 45
               C 455 40, 480 55, 485 80
               C 490 105, 475 125, 450 130
               L 375 250
               C 355 280, 310 275, 295 245 
               C 295 245, 320 255, 335 235 Z"
            fill={color === 'white' ? 'white' : primaryColor}
          />
          
          {/* Upper Right Circle Wrapper badge background */}
          <circle 
            cx="445" 
            cy="85" 
            r="45" 
            fill={color === 'white' ? 'white' : primaryColor} 
          />

          {/* Inner Badge Background: white when brand is used; brand colored when logo group is white */}
          <circle 
            cx="445" 
            cy="85" 
            r="38" 
            fill={color === 'white' ? primaryColor : 'white'} 
          />

          {/* Inner Custom wing element (represents the F/E wings inside the circle) */}
          <path 
            d="M 425 80 
               C 425 70, 445 68, 465 68 
               C 458 75, 445 76, 438 78
               C 442 82, 458 80, 468 80
               C 455 86, 445 87, 438 88
               C 440 93, 455 92, 465 92
               C 450 97, 435 97, 430 90 Z" 
            fill={color === 'white' ? 'white' : primaryColor}
          />
        </g>
      </g>
    </svg>
  );
};
