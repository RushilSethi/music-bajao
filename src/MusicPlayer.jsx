import React, { useEffect, useState } from 'react';
import { useAppContext } from './AppContext';
import { FaPlay, FaPause, FaVolumeUp, FaStepBackward, FaStepForward } from 'react-icons/fa';

const MusicPlayer = ({ currentIndex, setCurrentIndex }) => {
  const { favorites, nowPlaying, handlePlay, selectedBitrate, audioRef } = useAppContext();
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(1);

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      isPlaying ? audio.play() : audio.pause();

      const updateProgress = () => {
        setProgress((audio.currentTime / audio.duration) * 100);
      };
      audio.addEventListener('timeupdate', updateProgress);

      return () => audio.removeEventListener('timeupdate', updateProgress);
    }
  }, [isPlaying, audioRef]);

  useEffect(() => {
      handlePlay(favorites[currentIndex]);
      setIsPlaying(true);
  }, [currentIndex]);

  const handlePlayPause = () => setIsPlaying(!isPlaying);

  const handlePrevSong = () => {
    const newIndex = currentIndex === 0 ? favorites.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
  };

  const handleNextSong = () => {
    const newIndex = (currentIndex + 1) % favorites.length;
    setCurrentIndex(newIndex);
  };

  const handleVolumeChange = (event) => {
    const newVolume = event.target.value;
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const audioSource = nowPlaying?.downloadUrl?.[selectedBitrate]?.link;

  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center bg-dark rounded shadow-lg"
      style={{ width: '50vw', height: '80vh', margin: '20px auto' }} // Set dimensions
    >
      {nowPlaying ? (
        <div className="text-center" style={{ overflowY: 'auto', height: '100%' }}>
          <img
            src={nowPlaying.image[2].link}
            alt="cover"
            className="img-fluid rounded mb-3"
            style={{ maxHeight: '250px' }} // Controlled height for the image
          />
          <h4 className="text-light font-weight-bold mb-1">{nowPlaying.name}</h4>
          <p className="text-muted mb-4">{nowPlaying.primaryArtists}</p>

          <div className="d-flex justify-content-center mb-3">
            <button className="btn btn-secondary mx-2" onClick={handlePrevSong}>
              <FaStepBackward />
            </button>
            <button className="btn btn-success mx-2" onClick={handlePlayPause}>
              {isPlaying ? <FaPause /> : <FaPlay />}
            </button>
            <button className="btn btn-secondary mx-2" onClick={handleNextSong}>
              <FaStepForward />
            </button>
          </div>

          <div className="mb-3">
            <input
              type="range"
              min="0"
              max="100"
              value={progress}
              onChange={(e) => {
                const newTime = (audioRef.current.duration / 100) * e.target.value;
                audioRef.current.currentTime = newTime;
                setProgress(e.target.value);
              }}
              className="form-range"
            />
            <div className="d-flex justify-content-between text-muted">
              <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : '0:00'}</span>
              <span>{audioRef.current ? formatTime(audioRef.current.duration) : '0:00'}</span>
            </div>
          </div>

          <div className="d-flex align-items-center">
            <FaVolumeUp className="text-light me-2" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="form-range"
              style={{ width: '120px' }}
            />
          </div>

          <audio ref={audioRef} autoPlay>
            {audioSource ? (
              <source src={audioSource} type="audio/mpeg" />
            ) : (
              <p className="text-muted">Your browser does not support the audio element or the source is unavailable.</p>
            )}
          </audio>
        </div>
      ) : (
        <p className="text-muted text-center">Please select a song to play.</p>
      )}
    </div>
  );

};

export default MusicPlayer;
