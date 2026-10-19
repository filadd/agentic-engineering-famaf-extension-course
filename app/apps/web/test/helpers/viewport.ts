declare global {
  interface Window {
    happyDOM?: { setViewport: (viewport: { width: number; height: number }) => void };
  }
}

// happy-dom evaluates media queries against its viewport, which a test sets
// through the window's happyDOM handle.
export const setViewport = (width: number, height: number) =>
  window.happyDOM?.setViewport({ width, height });

export const phoneViewport = () => setViewport(390, 844);

export const desktopViewport = () => setViewport(1024, 768);
