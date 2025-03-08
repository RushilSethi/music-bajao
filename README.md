# Bajao Music Player

This is an API-based online music player that uses a 3rd party Saavn API to stream music without ads and on different quality bitrates to save internet data. The music player is built using React (JSX), CSS3, and Bootstrap, allowing users to search, play, pause, skip, and shuffle songs from various genres, languages, and artists. The music player also displays the song title, artist, album art, and lyrics.

Live Demo: https://music-bajao.vercel.app/ 

## Disclaimer

Please note that this project has not been maintained since its creation in June 2023. Due to changes and updates in the Saavn API, the functionality of this music player may no longer work as intended. Use it at your own discretion and be aware that certain features, such as song downloads, have been disabled due to the API shutdown.

## Features

- API-based music streaming using Saavn API
- No ads or interruptions
- Save your favorite songs and they stay there when you come back!
- Different quality bitrates to choose from 
- Search, play, pause, and skip songs
- Display song title, artist, album art, and lyrics
- Download songs (feature disabled due to API shutdown)
- **Optimized for low bandwidth:** Music can load and play without buffering on 3G networks, with adaptive streaming features for varying connection speeds, though performance on 2G networks may be limited.

## How to Run

- Download or clone the repository
- Install the dependencies using npm install(you will need node.js for this)
- Create a .env file in the root directory and add your API key there(REACT_APP_API_KEY=your_api_key_here).
- use npm start to run the app.

## Technologies Used

- React (JSX)
- CSS3
- Bootstrap
- 3rd party Saavn API 

Here's a refined **Purpose & Inspiration** section for your GitHub README that smoothly merges both while also mentioning your next step:  

---

### **Purpose & Inspiration**  
This project originally started as a report for my college subject **Web Development**, where I built a simple music player using **HTML, CSS, and JavaScript**. I took inspiration from a **Traversy Media** tutorial ([video link](https://www.youtube.com/watch?v=QTHRWGn_sJw)) to learn the basics of creating a music player. My goal was to optimize it for **lower-end devices and slow internet connections**, ensuring smooth playback even on **2G and 3G networks**. I tested it on my old iPad Mini 1, and it worked flawlessly. This version, initially called **Music Guru**, later became **Bajao Lite** (accessible at [Bajao Lite](https://bajao-lite.netlify.app)).  

Building on that foundation, I wanted to create a **more polished music player** with a focus on **quality UI/UX** rather than just compatibility with older devices. That's when I developed **Bajao**, using **React, Bootstrap, and the same Saavn API**. While the goal shifted toward enhancing the user experience, I retained the **bitrate selection feature** to ensure smooth streaming on mobile data.  

Later, to maintain consistency, I renamed the **older Saavn music player to Bajao Lite**, aligning it with the main player while keeping it as a lightweight alternative.  

### **What's Next?**  
The next step for Bajao is to introduce a **recommendation system** that can **autoplay relevant songs** based on user preferences, eliminating the need to manually add them to a playlist. This will further enhance the user experience by providing seamless, intelligent music playback.  

Through this project, I have gained valuable experience in **web development, music streaming, API integration, and responsive design**. I hope you find it useful and interesting!  

---

## Copyright & Credits

Developed by @RushilSethi featuring API made by @sumitkolhe.
