# Bajao Music Player

Bajao is an **API-based online music player** focused on clean UI, smooth playback, and practical discovery features. It streams music using a third-party Saavn API, offering **ad-free playback**, **multiple bitrate options**, and a progressively improving listening experience.

Live Demo: [https://music-bajao.vercel.app/](https://music-bajao.vercel.app/)

---

## ⚠️ Disclaimer

This project depends on a third-party Saavn API. Changes or downtime in the API may affect functionality. Certain features (such as downloads) have been disabled due to API limitations or shutdowns.

---

## ✨ What’s New in v2

Version 2 is a **major iteration** focused on UI/UX improvements and smarter playback behavior.

### v2 Highlights

* **Modern glassmorphic UI** with a cleaner, more polished look
* **New playlist search pages**

  * Artist-based playlists
  * Album-based playlist results
* **Signal-driven recommendation system**

  * Tracks meaningful listening behavior (e.g. listen duration)
  * Prioritizes relevant songs automatically
  * Introduces controlled randomness to avoid repetition
  * Uses an AI-based fallback only when signals are insufficient
* Improved overall navigation and playback flow

> The recommendation system is intentionally **pragmatic**, relying on interpretable signals rather than heavy machine learning.

---

## 📌 Planned for v3

* **Radio streaming page**

  * Location-aware popular stations
  * Curated discovery experience
  * Will be released separately in v3

---

## 🎵 Core Features

* API-based music streaming (Saavn)
* No ads or interruptions
* Save favorite songs (persistent across sessions)
* Multiple quality bitrates to optimize data usage
* Search, play, pause, skip, shuffle
* Artist, album art, and lyrics display
* Optimized for low bandwidth networks (3G-friendly playback)

---

## 🧠 Recommendation System (Overview)

Bajao uses a **simple, signal-based approach** to improve playback continuity:

* Tracks listening duration as implicit feedback
* Builds a short-term positive playback queue
* Expands recommendations using similar artists
* Introduces randomness to support exploration
* Falls back to AI-generated suggestions during cold starts

This approach avoids overengineering while remaining flexible for future improvements.

---

## 🛠 How to Run Locally

1. Clone or download the repository
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory:

   ```env
   REACT_APP_API_KEY=your_api_key_here
   ```
4. Start the app:

   ```bash
   npm start
   ```

---

## 🧰 Technologies Used

* React (JSX)
* CSS3
* Bootstrap
* Third-party Saavn API

---

## 🎯 Purpose & Inspiration

This project started as a college Web Development assignment built using **HTML, CSS, and JavaScript**, inspired by a Traversy Media tutorial. The initial goal was to create a lightweight music player optimized for **older devices and slow internet connections** (2G/3G), which was tested on an iPad Mini 1.

That early version evolved into **Bajao Lite**, a lightweight player focused on compatibility. Bajao, the main project, was later built using **React and Bootstrap**, shifting focus toward **better UI/UX** while retaining practical features like bitrate control.

Over time, Bajao has become a space to experiment with **real-world product decisions**, such as balancing simplicity, performance, and discovery without unnecessary complexity.

---

## © Copyright & Credits

Developed by **@RushilSethi**
API credits: **@sumitkolhe**
