export {};

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }
}

declare namespace YT {
  class Player {
    constructor(elementId: string | HTMLElement, options: PlayerOptions);

    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
    loadVideoById(videoId: string): void;
    cueVideoById(videoId: string): void;
  }

  interface PlayerOptions {
    height?: string;
    width?: string;
    videoId: string;
    playerVars?: PlayerVars;
    events?: {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerEvent) => void;
      [key: string]: (event: any) => void;
    };
  }

  interface PlayerVars {
    autoplay?: number;
    controls?: number;
    modestbranding?: number;
    iv_load_policy?: number;
    rel?: number;
    showinfo?: number; // This is deprecated but may still work
  }

  interface PlayerEvent {
    target: Player;
  }
}
