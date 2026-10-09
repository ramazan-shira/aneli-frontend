import { useEffect, useRef, useState } from 'react';
export default function CountUp({ text }) {
  const m = text.match(/[\d.]+/), end = m ? parseFloat(m[0]) : 0, dec = m ? (m[0].split('.')[1] || '').length : 0, start = end > 1000 ? end - 90 : 0;
  const [v, setV] = useState(start), ref = useRef();
  useEffect(() => {
    if (!m) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (now) => { const p = Math.min(1, (now - t0) / 1700); setV(start + (end - start) * (1 - Math.pow(1 - p, 3))); if (p < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    });
    io.observe(ref.current); return () => io.disconnect();
  }, [text]);
  return <span ref={ref}>{m ? text.replace(m[0], v.toFixed(dec)) : text}</span>;
}
