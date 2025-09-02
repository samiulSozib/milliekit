// SimTopupIcon.jsx
const SimTopupIcon = (props) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 64 64"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* PHONE */}
      <rect x="8" y="6" width="28" height="48" rx="4" fill="#12BBD3" stroke="#0B0B0B" strokeWidth="2.2"/>
      <rect x="12" y="10" width="20" height="30" rx="2.5" fill="#1FD5E9" stroke="#0B0B0B" strokeWidth="2"/>
      <rect x="18" y="44" width="12" height="4" rx="1.5" fill="#8A8F98" stroke="#0B0B0B" strokeWidth="2"/>
      {/* notch */}
      <rect x="20.5" y="12.5" width="7" height="2.5" rx="1.2" fill="#0B0B0B" opacity=".25"/>
  
      {/* ARROW (curved) */}
      <path d="M34 18c10-2 17 3.5 19 12" stroke="#FFC928" strokeWidth="8" fill="none"/>
      <path d="M34 18c10-2 17 3.5 19 12" stroke="#0B0B0B" strokeWidth="2.2" fill="none"/>
      <path d="M50.5 27.5 L59 26 L56 35 Z" fill="#FFC928" stroke="#0B0B0B" strokeWidth="2"/>
  
      {/* SIM CARD */}
      <g transform="translate(34,25)">
        {/* body with folded corner */}
        <path d="M2 4h16l4 4v21a3 3 0 0 1-3 3H5a3 3 0 0 1-3-3V7a3 3 0 0 1 3-3Z" fill="#3B37B5" stroke="#0B0B0B" strokeWidth="2.2"/>
        <path d="M18 4v4h4" fill="#5853E6" stroke="#0B0B0B" strokeWidth="2"/>
  
        {/* chip */}
        <rect x="6.5" y="12" width="13" height="12" rx="2" fill="#FFD43B" stroke="#0B0B0B" strokeWidth="2"/>
        <path d="M6.5 18h13M13 12v12M6.5 12c2.5 1.5 3.5 3.5 3.5 6s-1 4.5-3.5 6M19.5 12c-2.5 1.5-3.5 3.5-3.5 6s1 4.5 3.5 6"
              stroke="#0B0B0B" strokeWidth="2" fill="none"/>
        <circle cx="13" cy="18" r="1.3" fill="#0B0B0B" />
      </g>
    </svg>
  );
  
  export default SimTopupIcon;
  