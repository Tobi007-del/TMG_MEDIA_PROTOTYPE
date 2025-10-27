# TMG Media Player - Custom Video Controls

> A feature-rich, vanilla JavaScript video player implementation for [THE_MOVIE_GARDEN](https://tobi007-del.github.io/TMG.com/) initiative

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

[Live Demo](https://tmg-media-prototype.vercel.app) | [Prototype 1](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/prototype-1/prototype-1.html) | [Prototype 2](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2.html)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Usage](#usage)
- [Configuration](#configuration)
- [Browser Support](#browser-support)
- [Development](#development)
- [Contributing](#contributing)

---

## 🎯 Overview

**TMG Media Player** is a sophisticated, zero-dependency video player built with vanilla JavaScript. It provides a modern, feature-rich playback experience with advanced controls, gesture support, playlist management, and extensive customization options.

### Why TMG Media Player?

- ✅ **Zero Dependencies** - Pure vanilla JavaScript, no frameworks required
- ✅ **Feature-Rich** - 30+ keyboard shortcuts, gesture controls, playlist support
- ✅ **Highly Customizable** - Extensive configuration via HTML attributes, JSON, or JavaScript API
- ✅ **Modern APIs** - Leverages latest web standards (PiP, Media Session, Web Audio)
- ✅ **Accessible** - Full keyboard navigation and ARIA support
- ✅ **Performance Optimized** - RAF loops, throttling, efficient DOM updates
- ✅ **Mobile-Friendly** - Touch gestures and responsive design

---

## 🎬 Demo & Screenshots

### Live Demos

Try the player in action:
- **[Main Demo](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/)** - Landing page with all prototypes
- **[Prototype 1](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/prototype-1/prototype-1.html)** - Basic initial implementation
- **[Prototype 2](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/prototype-2/prototype-2.html)** - Full-featured player
- **[Library Comparison](https://tobi007-del.github.io/TMG_MEDIA_PROTOTYPE/video-libs-test/index.html)** - Compare with other players

### Key Features in Action

**Timeline with Preview Thumbnails**
- Hover over the timeline to see video previews
- Supports image sprites or real-time canvas rendering
- Configurable preview intervals

**Multiple Display Modes**
- Fullscreen mode with orientation lock
- Theater mode for expanded viewing
- Picture-in-Picture for multitasking
- Mini-player that follows scroll
- Floating player (Document PiP)

**Gesture Controls**
- Swipe left/right for timeline scrubbing
- Swipe up/down on left side for brightness
- Swipe up/down on right side for volume
- Pinch to zoom (if enabled)

**Playlist Management**
- Auto-play next video with countdown
- Swipeable toast notifications
- Per-video metadata and settings
- Smooth transitions between videos

---

## ✨ Features

### 🎮 Playback Controls
- Play/pause with multiple trigger methods
- Frame-by-frame stepping (forward/backward)
- Variable playback rate (0.25x - 8x)
- Fast forward and rewind (beta)
- Skip forward/backward with customizable intervals
- Replay functionality
- Auto-play next video in playlist

### 🖼️ Display Modes
- **Fullscreen** - Native fullscreen with orientation lock
- **Theater Mode** - Expanded view without fullscreen
- **Picture-in-Picture** - Standard and Document PiP
- **Mini Player** - Sticky player that follows scroll
- **Floating Player** - Beta feature using Document PiP API

### ⏱️ Timeline & Scrubbing
- Interactive timeline with hover preview
- Image sprite-based thumbnail previews
- Real-time canvas rendering for previews
- Gesture-based timeline control (touch/wheel)
- Keyboard navigation with percentage jumps

### 🔊 Audio & Visual Controls
- Volume control (0-300% with boost capability)
- Brightness adjustment (0-150%)
- Web Audio API integration for advanced processing
- Object-fit rotation (contain, cover, fill)
- Dark mode toggle

### 📝 Captions & Subtitles
- Full WebVTT support
- Extensive customization:
  - Font family, size, color, opacity, weight, variant
  - Background color and opacity
  - Window color and opacity
  - Character edge styles (drop-shadow, raised, depressed, outline)
- Draggable caption positioning
- Auto-captions option

### 👆 Gesture Controls (Beta)
- Touch gestures for timeline scrubbing
- Swipe gestures for volume/brightness adjustment
- Wheel/trackpad support for precise control
- Multi-finger detection and cancellation
- Zone-based gesture recognition

### 📚 Playlist Management
- Sequential playlist playback
- Auto-next with countdown toast notification
- Per-video settings (start time, end time, previews)
- Playlist navigation (previous/next)
- Media metadata per video (title, artist, artwork)

### 🚀 Advanced Features
- Screen capture/screenshot with monochrome option
- Frame statistics (FPS, dropped frames, processing duration)
- Drag-and-drop control panel customization
- Ripple effects on interactions
- Settings persistence via localStorage
- Media Session API integration for OS-level controls
- Intersection/Resize observers for responsive behavior

---

## 🛠️ Tech Stack

### Core Technologies
- **Vanilla JavaScript (ES6+)** - No framework dependencies
- **HTML5** - Semantic markup with custom data attributes
- **CSS3** - Custom properties, animations, modern layouts
- **TypeScript** - Type definitions (build.ts)

---

## 🚀 Getting Started

### Prerequisites
- Modern browser with ES6+ support
- Static file server (for local development)
- No build tools or dependencies required

### Installation

1. **Clone the repository**:
```bash
git clone https://github.com/Tobi007-del/TMG_MEDIA_PROTOTYPE.git
cd TMG_MEDIA_PROTOTYPE
```

2. **Serve locally** (choose one):
```bash
# Python
python -m http.server 8000

# Node.js
npx serve

# PHP
php -S localhost:8000
```

3. **Open in browser**:
```
http://localhost:8000
```

### Quick Test

Open any of these URLs to see the player in action or just grab the files you need and move to your project setup:
- **Landing Page**: `http://localhost:8000/`
- **Prototype 1**: `http://localhost:8000/prototype-1/prototype-1.html`
- **Prototype 2**: `http://localhost:8000/prototype-2/prototype-2.html`
- **Library Tests**: `http://localhost:8000/video-libs-test/index.html`

---

## 💻 Usage

### Method 1: HTML Attributes (Simplest)

```html
<!DOCTYPE html>
<html>
<head>
  <script src="prototype-2/prototype-2.js" defer></script>
</head>
<body>
  <video 
    tmgcontrols
    tmg--media--title="My Video Title"
    tmg--media--artist="Artist Name"
    tmg--settings--time--previews--address="previews/preview$.jpg"
    tmg--settings--time--previews--spf="10"
    muted 
    src="video.mp4"
    poster="poster.jpg">
    <track kind="subtitles" srclang="en" src="subtitles.vtt" label="English" />
  </video>
  <!-- tmgcontrols replaces default controls attribute -->
</body>
</html>
```

### Method 2: JSON Configuration

**config.json**:
```json
{
  "media": {
    "title": "Justice League Teaser",
    "artist": "TMG MEDIA PROTOTYPE",
    "artwork": [{ "src": "poster.jpg" }]
  },
  "settings": {
    "time": {
      "previews": {
        "address": "previews/preview$.jpg",
        "spf": 10
      }
    },
    "volume": { "muted": true, "max": 200 },
    "brightness": { "max": 150 }
  },
  "src": "video.mp4"
}
```

**HTML**:
```html
<video tmg="config.json"></video>
```

### Method 3: JavaScript API (Most Flexible)

```javascript
// Create player instance
const player = new tmg.Player();

// Configure
player.configure({
  debug: true,
  initialState: false, // Start paused with beating play button
  settings: {
    volume: { max: 200, value: 80 },
    brightness: { max: 150, value: 100 },
    beta: { 
      gestureControls: true,
      floatingPlayer: true 
    },
    time: {
      previews: {
        address: "previews/preview$.jpg",
        spf: 10
      }
    }
  },
  playlist: [
    {
      src: "video1.mp4",
      media: { 
        title: "Video 1", 
        artist: "Artist Name",
        artwork: [{ src: "poster1.jpg" }] 
      },
      tracks: [
        {
          kind: "subtitles",
          srclang: "en",
          src: "subtitles1.vtt",
          label: "English",
          default: true
        }
      ]
    },
    {
      src: "video2.mp4",
      media: { title: "Video 2" }
    }
  ]
});

// Attach to video element
await player.attach(document.querySelector('video'));

// Or detach
player.detach();
```

---

## ⚙️ Configuration

### Configuration Priority (Highest to Lowest)
1. Runtime API (`player.configure()`)
2. User Settings (localStorage)
3. HTML Attributes (`tmg--*`)
4. JSON File (via `tmg` attribute)
5. Default Build

### HTML Attribute Syntax

Use double dashes (`--`) for nested properties and a single dash (`-`) for word spacing:
```html
tmg--settings--time--previews--address="path/to/preview$.jpg"
tmg--settings--volume--max="200"
tmg--settings--beta--gesture-controls="true"
```

### Key Configuration Options

#### Media Metadata
```javascript
media: {
  title: "Video Title",
  artist: "Artist Name",
  artwork: [
    { src: "poster-96.jpg", sizes: "96x96", type: "image/jpeg" },
    { src: "poster-512.jpg", sizes: "512x512", type: "image/jpeg" }
  ]
}
```

#### Volume Settings
```javascript
volume: {
  min: 0,
  max: 300,        // 300% max volume
  value: 100,      // Initial volume
  skip: 5,         // Volume change increment
  muted: false
}
```

#### Brightness Settings
```javascript
brightness: {
  min: 0,
  max: 150,        // 150% max brightness
  value: 100,      // Initial brightness
  skip: 5          // Brightness change increment
}
```

#### Timeline Previews
```javascript
time: {
  previews: {
    address: "previews/preview$.jpg",  // $ replaced with frame number
    spf: 10                             // Seconds per frame
  },
  // OR
  previews: true,  // Use canvas rendering
  // OR
  previews: false  // Disable previews
}
```

#### Keyboard Shortcuts
```javascript
keys: {
  disabled: false,
  strictMatches: true,
  shortcuts: {
    playPause: ["k", " "],
    skipFwd: ["l", "ArrowRight"],
    skipBwd: ["j", "ArrowLeft"],
    volumeUp: "ArrowUp",
    volumeDown: "ArrowDown",
    fullScreen: "f",
    mute: "m"
    // ... 15+ shortcuts available
  }
}
```

#### Beta Features
```javascript
beta: {
  rewind: true,              // Enable rewind functionality
  gestureControls: true,     // Touch/wheel gestures
  floatingPlayer: true       // Document PiP floating player
}
```

#### Control Panel Customization
```javascript
controlPanel: {
  bottom: [
    "prev", "playpause", "next", 
    "brightness", "volume", "duration", 
    "spacer", 
    "playbackrate", "captions", "settings", 
    "objectfit", "pictureinpicture", 
    "theater", "fullscreen"
  ],
  top: false  // Disable top controls
}
```

### Custom Error Messages

```javascript
player.configure({
  settings: {
    errorMessages: {
      1: "Playback aborted by user",
      2: "Network error occurred",
      3: "Video decoding failed",
      4: "Video format not supported",
      5: "Unknown error occurred"
    }
  }
});
```

### ⌨️ Keyboard Shortcuts

### Playback Controls
| Key | Action |
|-----|--------|
| `k` or `Space` | Play/Pause |
| `l` or `→` | Skip forward (5s default) |
| `j` or `←` | Skip backward (5s default) |
| `Shift + →` | Skip forward (10s) |
| `Shift + ←` | Skip backward (10s) |
| `.` | Step forward one frame when paused |
| `,` | Step backward one frame when paused |
| `Shift + p` | Replay video |

### Volume & Audio
| Key | Action |
|-----|--------|
| `↑` | Volume up |
| `↓` | Volume down |
| `m` | Toggle mute |

### Brightness
| Key | Action |
|-----|--------|
| `y` | Brightness up |
| `h` | Brightness down |

### Playback Speed
| Key | Action |
|-----|--------|
| `>` or `Shift + .` | Increase playback rate |
| `<` or `Shift + ,` | Decrease playback rate |

### Display Modes
| Key | Action |
|-----|--------|
| `f` | Toggle fullscreen |
| `t` | Toggle theater mode |
| `i` | Toggle picture-in-picture |
| `e` | Expand mini-player |
| `Escape` | Exit fullscreen/theater |

### Timeline Navigation
| Key | Action |
|-----|--------|
| `0-9` | Jump to 0%-90% of video |
| `Home` | Jump to start |
| `End` | Jump to end |

### Captions
| Key | Action |
|-----|--------|
| `c` | Toggle captions |
| `+` | Increase caption font size |
| `-` | Decrease caption font size |
| `v` | Rotate caption font variant |
| `g` | Rotate caption font weight |
| `u` | Rotate caption font style |
| `o` | Rotate caption opacity |
| `b` | Rotate caption background opacity |
| `w` | Rotate caption window opacity |

### Other
| Key | Action |
|-----|--------|
| `s` | Take screenshot |
| `d` | Toggle dark mode |
| `o` | Rotate object-fit modes |
| `?` | Show settings view |

### Playlist
| Key | Action |
|-----|--------|
| `Shift + n` | Next video |
| `Shift + p` | Previous video |

---

## 🌐 Browser Support

| Browser | Version | Support Level |
|---------|---------|---------------|
| Chrome | 90+ | ✅ Full Support |
| Edge | 90+ | ✅ Full Support |
| Firefox | 88+ | ✅ Full Support |
| Safari | 14+ | ⚠️ Most Features* |
| Opera | 76+ | ✅ Full Support |
| Mobile Chrome | Latest | ✅ Full Support |
| Mobile Safari | 14+ | ⚠️ Most Features* |
| IE 11 | - | ❌ Not Supported |

*Safari limitations:
- Document Picture-in-Picture not supported
- Some gesture controls may behave differently
- Web Audio API has some restrictions

### Required Browser Features
- ES6+ JavaScript support
- HTML5 Video API
- CSS Custom Properties
- Intersection Observer API
- Resize Observer API
- requestAnimationFrame

---

### CDN Usage Coming Soon

Player files will be hosted on a CDN so you include in your project:

```html
<!-- Replace with your CDN URL -->
<script src="https://cdn.example.com/tmg-media-player.js"></script>
```

---

### Testing

Currently, testing is manual. To test:

1. Open `prototype-2/prototype-2.html` or your html file in browser
2. Test all keyboard shortcuts
3. Test on different browsers
4. Test on mobile devices
5. Check console for errors

### Debugging

Enable debug mode:

```javascript
const player = new tmg.Player();
player.configure({
  debug: true  // Enables console logging
});
```

Or via HTML:
```html
<video tmgcontrols tmg--debug="true" src="video.mp4"></video>
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

### Reporting Bugs

1. Check existing issues first
2. Create a new issue with:
   - Clear description
   - Steps to reproduce
   - Expected vs actual behavior
   - Browser/OS information
   - Console errors (if any)

### Suggesting Features

1. Check existing feature requests
2. Create a new issue with:
   - Clear use case
   - Proposed implementation (optional)
   - Examples from other players (if applicable)

### Pull Requests

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Format code with Prettier
5. Test thoroughly
6. Commit with descriptive message
7. Push to your fork
8. Open a Pull Request

**PR Guidelines**:
- Keep changes focused and atomic
- Update documentation if needed
- Maintain existing code style
- Test on multiple browsers
- Add comments for complex logic

### Reporting Issues
Found a bug? [Report it here](https://github.com/Tobi007-del/TMG_MEDIA_PROTOTYPE/issues)

---

## 📖 Examples

### Basic Video Player

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TMG Player Demo</title>
  <script src="prototype-2/prototype-2.js" defer></script>
</head>
<body>
  <video 
    tmgcontrols 
    src="video.mp4" 
    poster="poster.jpg">
  </video>
</body>
</html>
```

### Player with Previews

```html
<video 
  tmgcontrols 
  tmg--media--title="My Video"
  tmg--settings--time--previews--address="previews/frame$.jpg"
  tmg--settings--time--previews--spf="10"
  src="video.mp4">
</video>
```

### Playlist Player

```javascript
const player = new tmg.Player();

player.configure({
  settings: {
    auto: { next: true },  // Auto-play next video
    time: { previews: true }
  },
  playlist: [
    {
      src: "video1.mp4",
      media: { 
        title: "Episode 1",
        artwork: [{ src: "poster1.jpg" }]
      }
    },
    {
      src: "video2.mp4",
      media: { 
        title: "Episode 2",
        artwork: [{ src: "poster2.jpg" }]
      }
    }
  ]
});

await player.attach(document.querySelector('video'));
```

### Custom Keyboard Shortcuts

```javascript
player.configure({
  settings: {
    keys: {
      shortcuts: {
        playPause: ["p", "Space"],      // p or Space
        skipFwd: ["l", "ArrowRight"],   // l or Right Arrow
        skipBwd: ["j", "ArrowLeft"],    // j or Left Arrow
        fullScreen: "f",       // f 
        volumeUp: ["ArrowUp", "+"],     // Up Arrow or +
        volumeDown: ["ArrowDown", "-"]  // Down Arrow or -
      }
    }
  }
});
```

### Programmatic Control

```javascript
const video = document.querySelector('video');
const controller = video.tmgController;

// Play/Pause
controller.togglePlay(true);
setTimeout(() => controller.togglePlay(false), 5000);

// Seek to 30 seconds
controller.currentTime = 30;

// Set volume to 150%
controller.volume = 150;

// Take screenshot
controller.exportVideoFrame();

// Toggle fullscreen
controller.toggleFullScreen();

// Load next video in playlist
controller.nextVideo();

// check the js file in the repository for more
```

### Event Handling

```javascript
const video = document.querySelector('video');

video.addEventListener('tmgready', (e) => {
  console.log('Player initialized', e.detail);
});

video.addEventListener('play', () => {
  console.log('Video started playing');
});

video.addEventListener('pause', () => {
  console.log('Video paused');
});

// use all video events like normal
```

---

## 🎨 Customization

### Custom Styling

Override CSS variables:

```css
:root {
  --T_M_G-video-brand-color: #ff6b6b;
  --T_M_G-video-brand-complement-color: #ff6b6b77;
  --T_M_G-video-font-family: 'Roboto', sans-serif;
  // check the css file in the repository for more
}
```

---

## 🙏 Acknowledgments

- Inspired by modern video players like Plyr, Video.js, and YouTube
- Built for [THE_MOVIE_GARDEN](https://tobi007-del.github.io/TMG.com/) initiative
- Demo video: Justice League (Warner Bros.)

## 📈 Stats

- **Lines of Code**: ~4,200 (prototype-2.js)
- **File Size**: ~150KB (unminified)
- **Dependencies**: 0
- **Browser APIs Used**: 14+
- **Keyboard Shortcuts**: 30+
- **Configuration Options**: 100+

---

## 🎓 Learning Resources

### Understanding the Codebase

1. **Start Simple**: Review `prototype-1/prototype-1.js` (751 lines)
2. **Type Definitions**: Study `prototype-2/build.ts` for structure
3. **Main Implementation**: Dive into `prototype-2/prototype-2.js`
4. **Configuration**: Check `prototype-2/test.js` for examples

---

## 🔍 Comparison with Other Players

| Feature | TMG Player | Plyr | Video.js | Shaka |
|---------|-----------|------|----------|-------|
| Dependencies | 0 | 0 | 0 | 0 |
| File Size | ~150KB | ~50KB | ~250KB | ~500KB |
| Gesture Controls | ✅ | ❌ | ❌ | ❌ |
| Floating Player | ✅ | ❌ | ❌ | ❌ |
| Brightness Control | ✅ | ❌ | ❌ | ❌ |
| Frame Stepping | ✅ | ❌ | ❌ | ❌ |
| Playlist Support | ✅ | ❌ | ✅ | ❌ |
| HLS/DASH | ❌ | ❌ | ✅ | ✅ |
| Customization | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

---

## 💡 Tips & Tricks

### Disable Specific Features

```javascript
player.configure({
  settings: {
    modes: {
      fullScreen: false,      // Disable fullscreen
      pictureInPicture: false // Disable PiP
    },
    keys: {
      disabled: true          // Disable all keyboard shortcuts
    },
    notifiers: false          // Disable visual notifications
  }
});
```

### Custom Preview Generation

```javascript
// Use canvas rendering instead of image sprites
player.configure({
  settings: {
    time: {
      previews: true  // Auto-generates previews from video
    }
  }
});
```

### Persist User Settings

```javascript
player.configure({
  settings: {
    persist: true,  // Save settings to localStorage
    allowOverride: true  // Allow all settings to be overridden
  }
});
```

### Mobile Optimization

```javascript
player.configure({
  settings: {
    playsInline: true,  // Prevent fullscreen on iOS
    beta: {
      gestureControls: true  // Enable touch gestures
    }
  }
});
```

---

## 🔮 Future Enhancements

### Short Term (v2.0)
- [ ] Minified production build
- [ ] Source maps for debugging
- [ ] Automated test suite (Jest/Playwright)
- [ ] Accessibility audit and improvements
- [ ] Performance profiling and optimization

### Medium Term (v3.0)
- [ ] HLS streaming support (via hls.js integration)
- [ ] DASH streaming support (via dash.js integration)
- [ ] Quality selector for adaptive streaming
- [ ] Subtitle editor/creator
- [ ] Advanced analytics dashboard

### Long Term (v4.0)
- [ ] 360° video support
- [ ] VR mode with WebXR
- [ ] Live streaming support
- [ ] Chromecast integration
- [ ] AirPlay integration
- [ ] Multi-audio track support
- [ ] Multi-angle video support

---

## 📚 Additional Resources

### Documentation
- [HTML5 Video API](https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)
- [Picture-in-Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API)
- [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/Media_Session_API)

### Related Projects
- [THE_MOVIE_GARDEN](https://tobi007-del.github.io/TMG.com/) - Main project
- [Plyr](https://github.com/sampotts/plyr) - Simple HTML5 media player
- [Video.js](https://github.com/videojs/video.js) - Open source HTML5 video player
- [Shaka Player](https://github.com/shaka-project/shaka-player) - JavaScript player for adaptive media

### Community
- [GitHub Discussions](https://github.com/Tobi007-del/TMG_MEDIA_PROTOTYPE/discussions) - Ask questions, share ideas
- [GitHub Issues](https://github.com/Tobi007-del/TMG_MEDIA_PROTOTYPE/issues) - Report bugs, request features

---

## 📄 Changelog

### Version 2.0 (Current - Prototype 2)
- ✅ Complete rewrite with class-based architecture
- ✅ Playlist support with auto-next
- ✅ Gesture controls (beta)
- ✅ Floating player (Document PiP)
- ✅ Brightness control
- ✅ Frame stepping
- ✅ Advanced caption customization
- ✅ Settings persistence
- ✅ Media Session API integration
- ✅ Performance monitoring

### Version 1.0 (Prototype 1)
- ✅ Basic video controls
- ✅ Timeline scrubbing
- ✅ Volume control
- ✅ Fullscreen support
- ✅ Keyboard shortcuts
- ✅ Caption support
- ✅ Mini-player mode

---

## 🏆 Credits

### Developer
- **Tobi007-del** - [GitHub](https://github.com/Tobi007-del)

### Inspiration
- YouTube Player - UI/UX inspiration
- VLC Player - Gesture controls inspiration
- Shaka Player - Clean API design inspiration
- Video.js - Plugin architecture inspiration

### Special Thanks
- Open source contributors
- Beta testers and early adopters
- A couple of school friends

---

## 📊 Project Stats

![GitHub stars](https://img.shields.io/github/stars/Tobi007-del/TMG_MEDIA_PROTOTYPE?style=social)
![GitHub forks](https://img.shields.io/github/forks/Tobi007-del/TMG_MEDIA_PROTOTYPE?style=social)
![GitHub watchers](https://img.shields.io/github/watchers/Tobi007-del/TMG_MEDIA_PROTOTYPE?style=social)

![GitHub last commit](https://img.shields.io/github/last-commit/Tobi007-del/TMG_MEDIA_PROTOTYPE)
![GitHub issues](https://img.shields.io/github/issues/Tobi007-del/TMG_MEDIA_PROTOTYPE)
![GitHub pull requests](https://img.shields.io/github/issues-pr/Tobi007-del/TMG_MEDIA_PROTOTYPE)

---

## 💬 FAQ

### Q: Can I use this in production?
**A:** Yes! The player is stable and feature-complete. However, test thoroughly in your environment first.

### Q: Does it work with React/Vue/Angular?
**A:** Yes! It's vanilla JavaScript, so it works with any framework. Just attach the player to a video element.

### Q: Can I customize the UI?
**A:** Absolutely! Override CSS variables or modify the CSS file directly.

### Q: Does it support streaming (HLS/DASH)?
**A:** Not natively, but you can integrate hls.js or dash.js for streaming support.

### Q: Is it mobile-friendly?
**A:** Yes! Includes touch gestures and responsive design.

### Q: Can I disable certain features?
**A:** Yes! All features can be disabled via configuration.

### Q: Does it track users?
**A:** No! Zero tracking, zero analytics, zero external requests.

### Q: What's the file size?
**A:** ~150KB unminified, ~50KB minified (estimated).

### Q: Can I contribute?
**A:** Yes! Pull requests are welcome. See [Contributing](#contributing) section.

### Q: Is there a React wrapper?
**A:** Not yet, but it's on the roadmap. You can easily wrap it yourself.

---

## 🌟 Star History

If you find this project useful, please consider giving it a star! ⭐

[![Star History Chart](https://api.star-history.com/svg?repos=Tobi007-del/TMG_MEDIA_PROTOTYPE&type=Date)](https://star-history.com/#Tobi007-del/TMG_MEDIA_PROTOTYPE&Date)

---

**Made with ❤️ for THE_MOVIE_GARDEN initiative**

**[⬆ Back to Top](#tmg-media-player---custom-video-controls-prototype)**
