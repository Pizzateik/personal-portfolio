interface WordmarkProps { className?: string }

export default function Wordmark({ className = '' }: WordmarkProps) {
  return (
    <span className={`wordmark ${className}`} aria-label="Eik Rose.">
      <span className="name-eik" aria-hidden="true">Eik</span>
      <span className="name-rose" aria-hidden="true">Rose.</span>
    </span>
  );
}
