// TaxiPinIcon.jsx
const TaxiPinIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      {/* road */}
      <rect x="3" y="44" width="42" height="5" rx="2.5" fill="#5B4B47" opacity="0.9" />
  
      {/* taxi body */}
      <path
        fill="#FFD53A"
        d="M6 36c0-2.2 1.1-3.7 3.3-4.8l7.2-3.9c2.2-1.2 4.8-1.9 7.3-1.9h15.8c3 0 5.7.8 7.8 2.3l6.4 4.3v8.7c0 2.1-1.7 3.8-3.8 3.8H9.8C7.7 44.5 6 42.8 6 40.7V36z"
      />
      {/* roof light */}
      <rect x="28.5" y="19" width="8.8" height="4.6" rx="1.2" fill="#FFA928" />
      {/* window */}
      <path
        fill="#2E3A46"
        d="M22.5 25.4h16.6c1.9 0 3.8.6 5.3 1.8l4 3.2H18.6l2.9-2.7c.3-.3.7-.5 1-.7.8-.6 2-1.6 0-1.6z"
        opacity=".95"
      />
      {/* doors dots */}
      <rect x="25" y="33" width="3.6" height="2.2" rx="1.1" fill="#2E3A46" />
      <rect x="31" y="33" width="3.6" height="2.2" rx="1.1" fill="#2E3A46" />
      <rect x="23" y="36.8" width="4.6" height="2.2" rx="1.1" fill="#2E3A46" />
      {/* wheels */}
      <circle cx="17" cy="41" r="5.5" fill="#2E3A46" />
      <circle cx="17" cy="41" r="2.6" fill="#C9CDD3" />
      <circle cx="42" cy="41" r="5.5" fill="#2E3A46" />
      <circle cx="42" cy="41" r="2.6" fill="#C9CDD3" />
  
      {/* location pin (front) */}
      <g transform="translate(44 -2)">
        {/* shadow puddle */}
        <ellipse cx="12" cy="55" rx="13" ry="4" fill="#8FE7FF" opacity=".55" />
        {/* pin body */}
        <path
          fill="#FF5A72"
          d="M12 17c6.6 0 12 5.4 12 12 0 9.2-12 20-12 20S0 38.2 0 29c0-6.6 5.4-12 12-12z"
        />
        {/* pin inner */}
        <circle cx="12" cy="29" r="7.2" fill="#FFFFFF" />
        <circle cx="12" cy="29" r="3.8" fill="#F0F0F0" opacity=".7" />
      </g>
    </svg>
  );
  
  export default TaxiPinIcon;
  