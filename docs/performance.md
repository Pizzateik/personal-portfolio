# Performance check

Measured on 1 October 2026 using the production Vite build in Chromium. Each value below is the median of three cold loads at 1440 × 900, with a 1.6 Mbps download limit, 150 ms latency, and 4× CPU slowdown. These are controlled local measurements, not field data or a Lighthouse score.

The baseline already includes the quality-85 WebP photo conversion. The optimized build keeps the existing typography and layout.

| Measurement | Before | After |
| --- | ---: | ---: |
| First contentful paint | 1.124 s | 1.256 s |
| Largest contentful paint | 22.340 s | 17.512 s |
| Default scene and fonts ready | 22.290 s | 17.448 s |
| Cumulative layout shift | 0.00078 | 0 |
| Initial JavaScript, gzip | 81.31 KB | 82.00 KB |
| Resource Timing bytes received by scene readiness | 4.22 MB | 3.34 MB |

The default scene becomes ready about 22% sooner. Font preloads slightly increase first paint in this constrained test, while eliminating the external stylesheet/font dependency and measured font-related layout shift. Resource Timing can omit cross-origin transfer sizes, so the byte figures should be read as reported browser values rather than a complete network accounting.

## Loading behavior

- Project 3 onward uses native lazy loading, with an intersection gate to avoid browsers prefetching the distant horizontal cards too early.
- The portrait and initial project remain eager. The cat photo loads near its viewport position.
- Sometime renders its two foreground phones first. After they decode and paint, an idle callback preloads supporting screens and widgets at low priority. They appear only after decoding, keeping a warmed first hover free of new requests.
- Touch devices skip the hover-only media. Browsers without `requestIdleCallback` use a short timer.
- A restrained skeleton appears only when an active image has remained pending for 900 ms. It disappears after loading and respects reduced motion.
- Great Vibes and Lora contain only their wordmark characters. Manrope contains Latin glyphs and punctuation, with its weight range limited to 500–700. All three are WOFF2, preloaded, and use `font-display: swap`; together they total about 37.5 KB. Their license notices are included; the Lora subset has a separate internal name while retaining the original outlines.

## Interaction checks

Verified raster favicon resolution in both themes, skeleton dismissal, keyboard/modal behavior, translated cursor labels, and desktop/touch loading. Cursor morphing uses transforms and opacity. Cursor, ship, and photo motion continue to update DOM styles through refs rather than React state on each animation frame. The existing social-button width expansion remains by request.

The large hero background and full-resolution photos still account for most of the constrained-network load time. Their image dimensions were preserved.
