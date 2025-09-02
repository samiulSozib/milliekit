// FlightIcon.jsx — 30×18, slightly blue by default
const FlightIcon = ({ style, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 30 18"
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
    // default light blue, but let callers override
    style={{ color: '#4A6EE0', ...style }}
    {...props}
  >
    <path
      d="M 434 69 L 407 64 L 375 76 L 312 135 L 287 130 L 288 114 L 275 102 L 263 103 L 245 120 L 215 114 L 220 94 L 206 81 L 192 84 L 171 105 L 99 90 L 76 110 L 78 130 L 235 217 L 157 303 L 78 307 L 64 322 L 68 336 L 146 367 L 178 446 L 189 447 L 204 433 L 208 354 L 293 276 L 381 433 L 398 436 L 417 419 L 421 405 L 406 340 L 427 319 L 430 305 L 417 291 L 397 296 L 391 266 L 408 248 L 409 236 L 397 223 L 381 224 L 376 199 L 440 127 L 447 89 Z"
      transform="translate(2.992 -3.008) scale(0.047)"
    />
  </svg>
);
export default FlightIcon;
