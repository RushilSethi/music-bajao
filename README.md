# Bajao Music Player

This is an API-based online music player that uses a 3rd party Saavn API to stream music without ads and on different quality bitrates to save internet data. The music player is built using React (JSX), CSS3, and Bootstrap, allowing users to search, play, pause, skip, and shuffle songs from various genres, languages, and artists. The music player also displays the song title, artist, album art, and lyrics.

Live Demo: https://music-bajao.vercel.app/ 

## Disclaimer

Please note that this project has not been maintained since its creation in June 2023. Due to changes and updates in the Saavn API, the functionality of this music player may no longer work as intended. Use it at your own discretion and be aware that certain features, such as song downloads, have been disabled due to the API shutdown.

## Features

- API-based music streaming using Saavn API
- No ads or interruptions
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

## Inspiration

This project was inspired by a code-along video by Web Dev Simplified on YouTube (https://www.youtube.com/watch?v=QTHRWGn_sJw). I followed the video to learn the basics of creating a music player using HTML, CSS, and JS, and then modified it to use the Saavn API instead of local files. I also added some features such as lyrics display and quality selection. I thank Web Dev Simplified for his awesome tutorial and guidance. I also took inspiration from a few projects I could find online to learn more about the optimal structure for the website.

## Purpose

This project initially started of as a report for my college subject Web Development. I learned a lot from this project about web development, music streaming, API integration, and responsive design. I hope you find this project useful and interesting.

## Copyright & Credits

Developed by @RushilSethi featuring API made by @sumitkolhe.
