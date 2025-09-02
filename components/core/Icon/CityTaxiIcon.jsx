// CityTaxiIcon.jsx
const CityTaxiIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      {...props}
    >
      <defs>
        <linearGradient id="wind" x1="14" y1="20" x2="50" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#D6DBE1" />
          <stop offset="1" stopColor="#B8C1CA" />
        </linearGradient>
      </defs>
  
      {/* wheels */}
      <rect x="8" y="50" width="10" height="8" rx="2" fill="#1F2328" />
      <rect x="46" y="50" width="10" height="8" rx="2" fill="#1F2328" />
  
      {/* lower bumper */}
      <rect x="6" y="43" width="52" height="8" rx="4" fill="#E3A81C" />
  
      {/* car body */}
      <path
        d="M8 42v-7.5l3.1-7.7c1.1-2.7 3.5-4.6 6.3-5.2L25 19h14l7.6 1.8c2.8.7 5.2 2.5 6.3 5.2l3.1 7.7V42c0 2.2-1.8 4-4 4H12c-2.2 0-4-1.8-4-4Z"
        fill="#FFC72C"
        stroke="#E0A400"
        strokeWidth="1.2"
      />
  
      {/* side mirrors */}
      <ellipse cx="6.5" cy="33" rx="4.5" ry="3" fill="#FFC72C" stroke="#E0A400" />
      <ellipse cx="57.5" cy="33" rx="4.5" ry="3" fill="#FFC72C" stroke="#E0A400" />
  
      {/* roof sign */}
      <rect x="22" y="10" width="20" height="8" rx="2" fill="#FFC10A" stroke="#E0A005" />
      <text
        x="32"
        y="16"
        textAnchor="middle"
        fontSize="6"
        fontWeight="700"
        fontFamily="system-ui,-apple-system,Segoe UI,Roboto,Arial"
        fill="#1F2328"
      >
        TAXI
      </text>
  
      {/* windshield */}
      <path
        d="M12 33h40l-4-7c-.8-1.3-2.1-2.2-3.6-2.5L35.4 21H28.6l-9 1.5c-1.5.3-2.8 1.2-3.6 2.5l-4 7Z"
        fill="url(#wind)"
        stroke="#B3BCC6"
        strokeWidth="1"
      />
      {/* glass shine */}
      <path d="M19 24l10 8M23 23l10 8" stroke="#FFFFFF" strokeOpacity=".35" strokeWidth="3" />
  
      {/* grille */}
      <path d="M22 36h20c1.2 0 1.8.9 1.4 2l-1.6 4H22.2l-1.6-4c-.4-1.1.3-2 .4-2Z" fill="#1F2328" />
  
      {/* headlights */}
      <circle cx="15" cy="36.5" r="4.6" fill="#D8DBE0" />
      <circle cx="49" cy="36.5" r="4.6" fill="#D8DBE0" />
      <circle cx="16.7" cy="36.5" r="2.1" fill="#C5C9D0" />
      <circle cx="50.7" cy="36.5" r="2.1" fill="#C5C9D0" />
  
      {/* fog lights */}
      <circle cx="14" cy="46.5" r="2" fill="#E9EDF2" />
      <circle cx="50" cy="46.5" r="2" fill="#E9EDF2" />
  
      {/* plate */}
      <rect x="28" y="44" width="8" height="5" rx="1.2" fill="#ECEFF3" stroke="#D4DAE2" />
    </svg>
  );
  export default CityTaxiIcon;
  