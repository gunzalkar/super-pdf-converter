# IMG_to_PDF 📄

> Convert multiple images to a single PDF document — fully on-device, no uploads, no limits.

![Platform](https://img.shields.io/badge/platform-Android-green?style=flat-square&logo=android)
![License](https://img.shields.io/badge/license-MIT-orange?style=flat-square)
![Built With](https://img.shields.io/badge/built_with-Expo%20%2B%20React%20Native-blue?style=flat-square&logo=expo)
![Version](https://img.shields.io/badge/version-1.0.0-orange?style=flat-square)

<div align="center">
  <img src="assets/icon.png" width="120" alt="IMG_to_PDF Icon" />
</div>

---

## ✨ Features

- 📷 **Select any image type** — PNG, JPG, JPEG, BMP, WEBP, GIF, TIFF, HEIC, SVG, ICO and more
- 📑 **Multi-image support** — combine unlimited images into one PDF
- 🔀 **Drag to reorder** — long-press any image to rearrange pages
- ⚙️ **Full controls** — Page Size (A4/A3/A5/Letter/Legal/Tabloid), Orientation, Margin, Image Quality
- 📱 **100% on-device** — no internet connection required, no uploads to any server
- 💾 **Save & Share** — save to Downloads or share via any app
- 🌑 **Dark hacker UI** — monospace fonts, orange accents, premium feel

---

## 📲 Download

Grab the latest APK from the [Releases page](../../releases/latest).

Install on any Android device (Android 6.0+):
1. Download the `.apk` file
2. Enable **Install from Unknown Sources** in Settings
3. Open the APK to install

---

## 🛠 Build from Source

### Prerequisites
- Node.js 18+
- [Expo account](https://expo.dev) (free)
- EAS CLI: `npm install -g eas-cli`

### Steps

```bash
# Clone the repo
git clone https://github.com/gunzalkar/img-to-pdf.git
cd img-to-pdf

# Install dependencies
npm install

# Login to EAS
eas login

# Build APK
eas build --platform android --profile preview
```

### Development (Expo Go)
```bash
npx expo start
```
Scan the QR code with [Expo Go](https://expo.dev/go) on your Android device.

---

## 🏗 Tech Stack

| Layer | Technology |
|---|---|
| Framework | React Native + Expo |
| PDF Engine | expo-print (on-device HTML→PDF) |
| Image Picker | expo-image-picker + expo-document-picker |
| Drag & Drop | react-native-draggable-flatlist |
| File System | expo-file-system |
| Sharing | expo-sharing + expo-media-library |
| Font | Space Mono (Google Fonts) |
| Build | EAS Build (Expo Application Services) |

---

## 📂 Project Structure

```
img-to-pdf/
├── App.js                      # Root component & state management
├── app.json                    # Expo configuration
├── eas.json                    # EAS build profiles
├── assets/
│   ├── icon.png                # App icon
│   └── fonts/
│       └── SpaceMono-Regular.ttf
└── src/
    ├── components/
    │   ├── DropZone.js          # Image picker UI
    │   ├── ImageGrid.js         # Draggable image list
    │   ├── ImageCard.js         # Individual image card
    │   ├── ControlPanel.js      # Settings controls
    │   └── ConvertButton.js     # Convert CTA button
    ├── utils/
    │   └── pdfGenerator.js      # PDF generation logic
    └── styles/
        └── theme.js             # Design tokens
```

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes
4. Push and open a PR

---

## 📄 License

MIT © [Kshitij Gunjalkar](https://kshitijgunjalkar.com)

---

<div align="center">
  Made with ❤️ by <a href="https://kshitijgunjalkar.com">Kshitij Gunjalkar</a>
</div>
