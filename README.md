# 🧇 Waffles Cookie Toggle - Chrome Extension

A simple Chrome extension to toggle the `waffles=true` cookie on any website with visual indicators.

## 🎨 Features

- ✅ One-click cookie toggle for any website
- ✅ Visual status indicator with colored borders:
  - 🟢 **Green border** = Cookie is ON (`waffles=true`)
  - 🔴 **Red border** = Cookie is OFF
- ✅ Automatic page reload after toggling
- ✅ Per-tab state tracking
- ✅ Works on all websites

## 📦 Installation

### Method 1: Load Unpacked (Recommended)

1. **Clone or download this repository**
   ```bash
   git clone https://github.com/Amirq17/waffles-cookie-toggler.git
   ```

2. **Open Chrome Extensions page**
   - Navigate to `chrome://extensions/`
   - Or: Menu → More Tools → Extensions

3. **Enable Developer Mode**
   - Toggle the switch in the top-right corner

4. **Load the extension**
   - Click "Load unpacked"
   - Select the downloaded folder
   - Done! 🎉

### Method 2: Download ZIP

1. Click "Code" → "Download ZIP" on GitHub
2. Extract the ZIP file
3. Follow steps 2-4 from Method 1

## 🚀 Usage

1. Navigate to any website
2. Click the Waffles extension icon in your toolbar
3. Click "Enable Waffles" to set the cookie (icon turns green 🟢)
4. Click "Disable Waffles" to remove the cookie (icon turns red 🔴)
5. The page will automatically reload with the new cookie state

## 📂 Files Structure

```
chrome-extension/
├── manifest.json           # Extension configuration
├── popup.html             # Extension popup UI
├── popup.js               # Popup logic and cookie handling
├── background.js          # Background service worker for icon updates
├── icon-16.png            # Original icon (16x16)
├── icon-48.png            # Original icon (48x48)
├── icon-128.png           # Original icon (128x128)
├── icon-green-16.png      # Green border icon (cookie ON)
├── icon-green-48.png      # Green border icon (cookie ON)
├── icon-green-128.png     # Green border icon (cookie ON)
├── icon-red-16.png        # Red border icon (cookie OFF)
├── icon-red-48.png        # Red border icon (cookie OFF)
├── icon-red-128.png       # Red border icon (cookie OFF)
└── wafflesIcon.svg        # Source icon file
```

## 🔧 Technical Details

- **Manifest Version:** 3
- **Permissions:**
  - `cookies` - To read/write cookies
  - `activeTab` - To access current tab
  - `tabs` - To track tab state
  - `<all_urls>` - To work on any website

## 🎯 How It Works

1. **Cookie Management**: Sets/removes `waffles=true` cookie for the current domain
2. **Visual Feedback**: Background service worker monitors cookie state and updates icon
3. **Auto-reload**: Page automatically refreshes after toggling to apply changes
4. **Per-tab State**: Each tab maintains its own cookie state independently

## 🐛 Troubleshooting

### Icons not loading
- Reload the extension at `chrome://extensions/`
- Make sure all icon files are present in the folder

### Cookie not persisting
- Check if the website allows cookies
- Some sites may clear cookies on reload

### Extension not appearing
- Make sure Developer Mode is enabled
- Reload the extension page

## 📝 Development

### Building Icons
Icons are generated from `wafflesIcon.svg` with colored borders:
- Green border: Cookie enabled state
- Red border: Cookie disabled state

### Updating
1. Make your changes
2. Go to `chrome://extensions/`
3. Click the reload icon ↻ on the extension card

## 📄 License

This is a development tool for internal use.

## 🤝 Contributing

This is a private repository for internal use.

## 📧 Support

For issues or questions, please open an issue in this repository.

---

**Made with ❤️ for easier cookie testing**
