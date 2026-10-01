export const portrait = {
  src: '/photos/eik.webp',
  srcSet: '/photos/eik-200.webp 200w, /photos/eik.webp 400w, /photos/eik-600.webp 600w',
  sizes: '(max-width: 768px) 128px, 168px',
  width: 400,
  height: 460,
};

export const cat = {
  src: '/photos/arya.webp',
  srcSet: '/photos/arya-160.webp 160w, /photos/arya.webp 320w, /photos/arya-480.webp 480w',
  // The existing crop scales the 120px cat photo by 1.15; allow for its tilt too.
  sizes: '142px',
  width: 320,
  height: 349,
};

export const sometimeBackground = {
  srcSet: '/projects/sometime/Sometime_BG-640.webp 640w, /projects/sometime/Sometime_BG-960.webp 960w, /projects/sometime/Sometime_BG.webp 1280w, /projects/sometime/Sometime_BG-1640.webp 1640w, /projects/sometime/Sometime_BG-2460.webp 2460w',
  sizes: '(max-width: 359px) calc(100vw - 40px), (max-width: 768px) calc(100vw - 52px), clamp(650px, 43vw, 820px)',
  width: 1280,
  height: 720,
};
