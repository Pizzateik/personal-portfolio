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
- Skeletons now appear immediately for pending media and disappear independently as each image loads. They respect reduced motion.
- Great Vibes and Lora contain only their wordmark characters. Manrope contains Latin glyphs and punctuation, with its weight range limited to 500–700. All three are WOFF2, preloaded, and use `font-display: swap`; together they total about 37.5 KB. Their license notices are included; the Lora subset has a separate internal name while retaining the original outlines.

## Interaction checks

Verified raster favicon resolution in both themes, skeleton dismissal, keyboard/modal behavior, translated cursor labels, and desktop/touch loading. Cursor morphing uses transforms and opacity. Cursor, ship, and photo motion continue to update DOM styles through refs rather than React state on each animation frame. The existing social-button width expansion remains by request.

At this stage, the large hero background and full-resolution photos accounted for most of the constrained-network load time. Their image dimensions were still preserved.

## Responsive image follow-up

The next pass replaces the full-resolution delivery described above with quality-85 WebP variants selected through `srcset` and `sizes`. Layout, photo crops, phone screens, hover behavior, and the social preview stay the same. Original WebP sources are retained in `assets/source/`, outside the public/build output. Regenerate the committed variants with `npm run images`; Sharp is used only by this development script.

- Portrait: 200, 400, and 600px wide, covering the 128px mobile and 164px desktop card through 3× density, with allowance for desktop tilt.
- Cat: 160, 320, and 480px wide, accounting for the existing 1.15× crop and tilt.
- Sometime background: 640, 960, 1280, 1640, and 2460px wide, matching the responsive card width through 3× density.
- Deferred images withhold both `src` and `srcset` until activated; otherwise `srcset` could trigger downloads before the existing intersection gate.

Measured again using the same three-run, cold-cache 1440 × 900 / 1.6 Mbps / 150 ms / 4× CPU setup, immediately before and after this change:

| Measurement | Before responsive images | After |
| --- | ---: | ---: |
| First contentful paint | 1.256 s | 1.264 s |
| Largest contentful paint | 17.508 s | 1.472 s |
| Default scene and fonts ready | 17.458 s | 2.895 s |
| Cumulative layout shift | 0 | 0 |
| Resource Timing bytes received by scene readiness | 3.34 MB | 0.44 MB |

LCP improves about 92%, and default-scene readiness about 83%, in this controlled test. The byte measurement stops at scene readiness, so it does not include every later hover download and is not the total page payload. These measurements describe the local production build, not live visitor performance.

Verified actual image selection from 320–1920px viewports at 1×/2×/3× density, one initial request per portrait/background, source exclusion from `dist`, deferred cat/project loading, skeleton behavior, warmed hover, and touch suppression. Compared before/after screenshots at desktop 2× and mobile 3×; layout dimensions are unchanged.

## Text-first loading

Responsive images reduced the network cost, but the homepage still had an empty root until JavaScript ran. The homepage and 404 now include their actual markup and inline CSS in the built HTML. A small parser-time script selects saved German/French copy and reveals loaded images independently of the main bundle; React hydrates the existing page instead of replacing it. English remains the no-JavaScript default. Fonts continue to swap in, and the native cursor remains available until the custom cursor is initialized.

All pending media has an immediate skeleton. The two foreground phones have placeholders with matching dimensions, rotation, and mobile scale, keeping the layout stable. Supporting Sometime assets now wait for the background and both foreground phones before idle preloading.

Same three-run cold-cache production benchmark as above:

| Measurement | Responsive images only | Text-first loading |
| --- | ---: | ---: |
| First contentful paint | 1.264 s | 0.528 s |
| Largest contentful paint | 1.472 s | 0.756 s |
| Default scene and fonts ready | 2.895 s | 2.602 s |
| Cumulative layout shift | 0 | 0.00083 |

First content paints about 58% sooner. The small measured layout shift occurs with early font swapping; text is no longer withheld until the app starts. The HTML includes styles and language alternatives and is about 12.5 KB gzipped; the client bundle stays about 83 KB gzipped. These are local lab measurements, not a claim about live visitor timing.

Verified readable EN/DE/FR copy with app JavaScript, fonts, and images deliberately blocked; independent image reveal while the app bundle remained blocked; hydration retaining the original text DOM without errors; immediate desktop/mobile phone placeholders; reduced motion; modal behavior; and a working English homepage without JavaScript.

### Input before hydration

The parser-time script also provides direct vertical-wheel-to-horizontal scrolling above 768px, preserving horizontal trackpad gestures, modifier keys, and mobile vertical scrolling. React removes that listener synchronously before installing its smooth scroll handler, retaining the container's current position. No extra dependency or downloaded bootstrap bundle is required.

Preboot writes directly to `scrollLeft`, with browser clamping and no target or animation frames. The handoff runs in a layout effect before paint: remove preboot input, restore the last actual visible offset if React replaced the container, then initialize both smooth-scroll coordinates from the real offset. Delayed-bundle tests in development and production checked visible content movement after each wheel event and every animation frame across initialization, including a forced container replacement. No catch-up movement or duplicate handling occurred.

The wheel listener is installed in the **document head**, resolving the container when input arrives. Installing it after the root markup left a gap when HTML streamed: visible content could paint before the listener existed. A streaming regression test reproduced zero visible movement with the old placement, then confirmed immediate movement with the head script while the remaining HTML and app bundle were blocked. Saved-language markup replacement preserves the visible offset too. Tests cover production EN/DE and development FR, followed by an unchanged React handoff and smooth continuation.

React can mount while the tab is still loading. Its wheel handler therefore continues direct updates until `document.readyState` is `complete`; the load event resets both spring coordinates to the real offset before enabling smooth input. Events timestamped before that transition also take the direct path. An image-gated regression test reproduced the old behavior after hydration (no immediate movement, an animated target queued instead), then verified direct visible movement, no catch-up, and a stable load event in development and production. A cold-cache test on `http://127.0.0.1:5173/` at 1.6 Mbps / 150 ms / 4× CPU confirmed ten real 120px wheel inputs moved from 0 to 1,200px during loading and stayed there afterward.

Individual Phosphor icon imports preserve the existing SVGs while avoiding a 6.2 MB whole-library development module. The development test confirms that module is no longer requested; production builds transform 68 modules rather than 4,595. Production tree shaking already kept only the used icons, so this specifically addresses development loading overhead.

The native cursor stays visible until a mounted custom cursor has an actual mouse position. A tiny preboot pointer tracker lets the cursor take over at the same coordinates; cursor cleanup, blur, and pointer departure restore native behavior. Touch devices never enable the custom cursor. The dialog's cursor shares readiness with the main cursor.

Verified with the main bundle held for more than three seconds: immediate text and native cursor, wheel clamping and pixel/line/page units, trackpad and zoom preservation, mobile scrolling, unchanged position through hydration, and at most one active wheel listener. Cursor takeover, stationary-pointer behavior, and the GitHub dialog also passed. The same three-run throttled benchmark measured median FCP **0.512 s**, LCP **0.728 s**, and scene/font readiness **2.595 s**; initial-content performance is preserved.
