export default function PirateShip({ className = '' }: { className?: string }) {
  return (
    <svg className={`scroll-sea ${className}`} width="40" height="28" viewBox="0 0 48 32" fill="none" aria-hidden="true">
      <g className="ship-wake" stroke="currentColor" strokeWidth=".65" strokeLinecap="round">
        <g className="sea-waves">
          <path d="M2 25c4-2 7 2 11 0l7-1" />
          <path d="M6 28c4-1.5 7 1.5 11 0l7-1" />
        </g>
      </g>
      <g className="pirate-ship" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" strokeLinecap="round">
        <path d="M17 22h19l7-4-3.5 8H22z" fill="currentColor" fillOpacity=".16" />
        <path d="M28 4v18M28 4l7 2-7 2" />
        <path d="M31 9c5 3 7 7 8 10h-8c1-3 1-6 0-10z" fill="currentColor" fillOpacity=".1" />
      </g>
    </svg>
  );
}
