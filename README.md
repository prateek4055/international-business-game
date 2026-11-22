# International Business — Board Game 🎲🌍

A modern, responsive, gamified digital adaptation of the classic **International Business** board game, designed for mobile, tablet, and desktop. Built with **React 18**, **TypeScript**, **Tailwind CSS**, and **Three.js**, with native Android support via **Capacitor** and **100% Lifetime-Free Multiplayer**!

---

## ✨ Key Features

- **🎮 Hybrid Multiplayer Engine (100% Free Forever):**
  - **2 Players (1 vs 1):** Direct phone-to-phone WebRTC Peer-to-Peer data channel via `peerjs` — **0ms server lag, completely serverless, zero ongoing costs forever**.
  - **3 or 4 Players:** Google Cloud Firebase Realtime Database synced rooms on the permanent free Spark plan.
  - **Pass & Play / AI Bots:** Play locally on one phone or challenge trained AI bots.

- **🎲 Cryptographically Secure, Zero-Bias Dice Engine:**
  - Powered by OS hardware entropy pool (`crypto.getRandomValues`) with strict **Rejection Sampling** to mathematically eliminate modulo bias.
  - Uniform probability: exactly 16.67% chance per face, provable by Chi-Square ($\chi^2$) statistical tests.
  - Realistic 3D WebGL tumbling dice with physics dampening and smooth face settling.

- **📱 Mobile-First Gamified UI:**
  - Tactile physical-feel claymorphic cards, glassmorphic HUDs, gold-foil gradients, and responsive perimeter board layout.
  - Center-top transaction badges for immediate profit, loss, and card notifications.
  - Dynamic responsive scaling tailored for Android & iOS smartphone screens.

- **🃏 Authentic Game Rules & Mechanics:**
  - **36 Perimeter Tiles:** 22 Countries across 8 color groups + 4 Utilities (Airways, Railways, Roadways, Waterways) + 2 Duty spaces + Party House + Resort + Jail + Start.
  - **Uno & Chance:** Card selection and outcomes driven by collective dice roll totals.
  - **Banking & Credit Cards:** Borrow emergency capital with structured pass-Start installment repayments.
  - **Passport & Customs:** Loss of passport waives rent collection until 6 rounds are completed.
  - **Houses & Hotels:** Full property upgrades with progressive rent scaling.

- **🚀 Multi-Platform:**
  - **Web & iOS:** Progressive Web App (PWA) — iPhone users can "Add to Home Screen" from Safari for a native fullscreen experience without App Store fees.
  - **Android:** Native APK and Play Store App Bundle (`.aab`) generated with Capacitor.

---

## 🛠️ Tech Stack

- **Core:** React 18, TypeScript, Vite
- **Styling:** Tailwind CSS, Custom Gamified UI theme
- **3D Graphics:** Three.js (WebGL 3D dice physics & pips)
- **Audio:** Web Audio API synth sounds & vibration haptics
- **Multiplayer:** WebRTC (`peerjs`), Google Firebase Realtime Database
- **Mobile Native:** Capacitor 7 (`@capacitor/android`)

---

## 🚀 Quick Start (Local Development)

```bash
# Clone the repository
git clone https://github.com/prateek4055/international-business-game.git
cd international-business-game

# Install dependencies
npm install

# Start local dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Deploy to Vercel (100% Free Web Hosting)

1. Push your repository to GitHub.
2. Go to [Vercel](https://vercel.com) and click **"Add New Project"**.
3. Select your GitHub repository `international-business-game`.
4. Vercel automatically detects **Vite** — click **Deploy**!

---

## 📱 Android Build & Google Play Store

### Run on Connected Android Phone:
```bash
npm run build
npx cap sync android
cd android
./gradlew assembleDebug
adb install -r app/build/outputs/apk/debug/app-debug.apk
```

### Build Production Bundle for Google Play Console:
```bash
cd android
./gradlew bundleRelease
```
The release bundle will be created at `android/app/build/outputs/bundle/release/app-release.aab`.

---

## 📄 License
MIT License. Open source and free for personal & community play.
