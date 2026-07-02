const WORDS = [
  'Formschluss',
  'Aluminiumguss',
  'Vier Millimeter Souveränität',
  'Schattenfuge wird Lichtfuge',
  'Entwickelt & gefertigt in Deutschland',
];

function Row() {
  return (
    <span className="marquee-row" aria-hidden="true">
      {WORDS.map((w, i) => (
        <span key={i} className="marquee-item">
          <em className="font-serif">{w}</em>
          <span className="marquee-sep">·</span>
        </span>
      ))}
    </span>
  );
}

export default function Marquee() {
  return (
    <div
      className="marquee"
      role="presentation"
      style={{
        borderTop: '1px solid var(--color-hairline)',
        borderBottom: '1px solid var(--color-hairline)',
        background: 'var(--color-base)',
      }}
    >
      <div className="marquee-track">
        <Row />
        <Row />
      </div>
    </div>
  );
}
