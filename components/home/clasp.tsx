type ClaspProps = {
  id: string;
};

export function Clasp({ id }: ClaspProps) {
  const metal = `${id}-metal`;
  const shade = `${id}-shade`;
  const rivet = `${id}-rivet`;
  return (
    <svg className="lanyard-clasp" viewBox="0 0 48 120" aria-hidden="true">
      <defs>
        <linearGradient id={metal} x1="0" y1="0" x2="1" y2="0.2">
          <stop offset="0" stopColor="#6e777f" />
          <stop offset="0.22" stopColor="#f7f8f9" />
          <stop offset="0.48" stopColor="#b7c0c6" />
          <stop offset="0.72" stopColor="#fbfcfd" />
          <stop offset="1" stopColor="#636c74" />
        </linearGradient>
        <linearGradient id={shade} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.45" stopColor="#d5dde2" />
          <stop offset="1" stopColor="#8d969e" />
        </linearGradient>
        <radialGradient id={rivet} cx="0.35" cy="0.32" r="0.7">
          <stop offset="0" stopColor="#ffffff" />
          <stop offset="0.55" stopColor="#c5ced4" />
          <stop offset="1" stopColor="#747d85" />
        </radialGradient>
      </defs>
      <circle cx="24" cy="16" r="11.5" fill="none" stroke={`url(#${metal})`} strokeWidth="3.6" />
      <ellipse cx="24" cy="31" rx="5.2" ry="3.1" fill={`url(#${shade})`} />
      <rect x="21.2" y="33" width="5.6" height="8" rx="2" fill={`url(#${metal})`} />
      <rect x="15.5" y="40" width="17" height="6" rx="2.2" fill={`url(#${shade})`} />
      <rect
        x="13.5"
        y="47"
        width="21"
        height="22"
        rx="3"
        fill={`url(#${shade})`}
        stroke={`url(#${metal})`}
        strokeWidth="0.7"
      />
      <circle cx="24" cy="58" r="3.3" fill={`url(#${rivet})`} stroke="#9aa3ab" strokeWidth="0.6" />
      <rect x="34.5" y="53.2" width="8" height="3.1" rx="0.8" fill={`url(#${metal})`} />
      <path
        d="M20 69C11 76 9 92 13 104C17 116 30 118 36 108C42 98 40 84 33 77"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="3.7"
        strokeLinecap="round"
      />
      <path
        d="M27 69C31 76 34 83 35 90"
        fill="none"
        stroke={`url(#${metal})`}
        strokeWidth="2.4"
        strokeLinecap="round"
      />
    </svg>
  );
}
