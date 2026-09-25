/** Minimal SVG line chart of stored daily lowest asking prices. Renders only real points. */
export function PriceChart({ points }: { points: { day: string; minPrice: number; currency: string }[] }) {
  if (points.length < 2) return null;
  const W = 520, H = 140, P = 28;
  const ys = points.map((p) => p.minPrice);
  const lo = Math.min(...ys), hi = Math.max(...ys);
  const span = hi - lo || 1;
  const x = (i: number) => P + (i * (W - 2 * P)) / (points.length - 1);
  const y = (v: number) => H - P - ((v - lo) / span) * (H - 2 * P);
  const d = points.map((p, i) => `${i ? "L" : "M"}${x(i).toFixed(1)},${y(p.minPrice).toFixed(1)}`).join(" ");
  const cur = points[0].currency;
  return (
    <figure className="price-chart">
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`Lowest daily asking price from ${points[0].day} to ${points.at(-1)!.day}: ${lo} to ${hi} ${cur}`}>
        <line x1={P} x2={W - P} y1={H - P} y2={H - P} className="price-chart__axis" />
        <path d={d} className="price-chart__line" />
        <text x={P} y={H - 8} className="price-chart__label">{points[0].day}</text>
        <text x={W - P} y={H - 8} textAnchor="end" className="price-chart__label">{points.at(-1)!.day}</text>
        <text x={P} y={y(hi) - 6} className="price-chart__label">{hi} {cur}</text>
        <text x={W - P} y={y(lo) - 8} textAnchor="end" className="price-chart__label">{lo} {cur}</text>
      </svg>
      <figcaption className="small muted">Lowest daily asking price (stored observations only).</figcaption>
    </figure>
  );
}
