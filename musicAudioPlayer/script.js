class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('audio');
        this.playBtn = document.getElementById('play');
        this.prevBtn = document.getElementById('prev');
        this.nextBtn = document.getElementById('next');
        this.shuffleBtn = document.getElementById('shuffle');
        this.repeatBtn = document.getElementById('repeat');
        this.titleEl = document.getElementById('title');
        this.artistEl = document.getElementById('artist');
        this.albumImage = document.getElementById('album-image');
        this.progressBar = document.getElementById('progress-bar');
        this.progressContainer = document.getElementById('progress-bar-container');
        this.currentTimeEl = document.getElementById('current-time');
        this.durationEl = document.getElementById('duration');
        this.volumeSlider = document.getElementById('volume-slider');
        this.playlistEl = document.getElementById('playlist');
        this.searchPlaylist = document.getElementById('search-playlist');
        this.playlistCount = document.getElementById('playlist-count');
        this.albumArt = document.querySelector('.album-art');
        
        // Playlist with actual audio URLs
        this.playlist = [
            { 
                title: 'Beyond the Horizon', 
                artist: 'Zenith', 
                src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                duration: '0:05',
                image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            { 
                title: 'The Code Master', 
                artist: 'Syntactic', 
                src: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
                duration: '0:04',
                image: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            { 
                title: 'A New Dawn', 
                artist: 'Aurora', 
                src: 'https://www.soundjay.com/buttons/sounds/button-10.mp3',
                duration: '0:03',
                image: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            { 
                title: 'Digital Dreams', 
                artist: 'Neon Pulse', 
                src: 'https://www.soundjay.com/buttons/sounds/button-09.mp3',
                duration: '0:04',
                image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            },
            { 
                title: 'Midnight Coding', 
                artist: 'Binary Beats', 
                src: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
                duration: '0:05',
                image: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80'
            }
        ];
        
        this.songIndex = 0;
        this.isPlaying = false;
        this.isShuffled = false;
        this.repeatMode = 0; // 0: no repeat, 1: repeat all, 2: repeat one
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadSong(this.playlist[this.songIndex]);
        this.renderPlaylist();
        this.updatePlaylistCount();
        
        // Set initial volume
        this.audio.volume = this.volumeSlider.value;
    }
    
    setupEventListeners() {
        // Control buttons
        this.playBtn.addEventListener('click', () => this.togglePlayPause());
        this.prevBtn.addEventListener('click', () => this.prevSong());
        this.nextBtn.addEventListener('click', () => this.nextSong());
        this.shuffleBtn.addEventListener('click', () => this.toggleShuffle());
        this.repeatBtn.addEventListener('click', () => this.toggleRepeat());
        
        // Progress bar
        this.progressContainer.addEventListener('click', (e) => this.setProgress(e));
        
        // Time update
        this.audio.addEventListener('timeupdate', () => this.updateProgress());
        
        // Song ended
        this.audio.addEventListener('ended', () => this.songEnded());
        
        // Volume control
        this.volumeSlider.addEventListener('input', () => {
            this.audio.volume = this.volumeSlider.value;
        });
        
        // Search playlist
        this.searchPlaylist.addEventListener('input', () => this.filterPlaylist());
        
        // Load metadata
        this.audio.addEventListener('loadedmetadata', () => {
            if (!isNaN(this.audio.duration)) {
                this.durationEl.textContent = this.formatTime(this.audio.duration);
            }
        });
    }
    
    loadSong(song) {
        this.audio.src = song.src;
        this.titleEl.textContent = song.title;
        this.artistEl.textContent = song.artist;
        this.albumImage.src = song.image;
        
        // Update playlist UI
        this.updatePlaylistUI();
        
        // If already playing, continue playing the new song
        if (this.isPlaying) {
            this.audio.play().catch(e => {
                console.log("Auto-play prevented:", e);
                this.isPlaying = false;
                this.updatePlayPauseIcon();
            });
        }
    }
    
    togglePlayPause() {
        if (this.isPlaying) {
            this.audio.pause();
            this.albumArt.classList.remove('playing');
        } else {
            this.audio.play().then(() => {
                this.albumArt.classList.add('playing');
            }).catch(e => {
                console.log("Play failed:", e);
            });
        }
        this.isPlaying = !this.isPlaying;
        this.updatePlayPauseIcon();
    }
    
    updatePlayPauseIcon() {
        const icon = this.playBtn.querySelector('i');
        icon.classList.toggle('fa-play', !this.isPlaying);
        icon.classList.toggle('fa-pause', this.isPlaying);
    }
    
    nextSong() {
        if (this.repeatMode === 2) {
            // Repeat one - just restart current song
            this.audio.currentTime = 0;
            if (this.isPlaying) this.audio.play();
            return;
        }
        
        if (this.isShuffled) {
            this.songIndex = this.getRandomIndex();
        } else {
            this.songIndex = (this.songIndex + 1) % this.playlist.length;
        }
        
        this.loadSong(this.playlist[this.songIndex]);
        if (this.isPlaying) {
            this.audio.play().then(() => {
                this.albumArt.classList.add('playing');
            });
        }
    }
    
    prevSong() {
        if (this.repeatMode === 2) {
            // Repeat one - just restart current song
            this.audio.currentTime = 0;
            if (this.isPlaying) this.audio.play();
            return;
        }
        
        if (this.isShuffled) {
            this.songIndex = this.getRandomIndex();
        } else {
            this.songIndex = (this.songIndex - 1 + this.playlist.length) % this.playlist.length;
        }
        
        this.loadSong(this.playlist[this.songIndex]);
        if (this.isPlaying) {
            this.audio.play().then(() => {
                this.albumArt.classList.add('playing');
            });
        }
    }
    
    getRandomIndex() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * this.playlist.length);
        } while (newIndex === this.songIndex && this.playlist.length > 1);
        return newIndex;
    }
    
    toggleShuffle() {
        this.isShuffled = !this.isShuffled;
        this.shuffleBtn.classList.toggle('active', this.isShuffled);
    }
    
    toggleRepeat() {
        this.repeatMode = (this.repeatMode + 1) % 3;
        
        // Update repeat button icon and tooltip
        const icon = this.repeatBtn.querySelector('i');
        switch(this.repeatMode) {
            case 0: // No repeat
                icon.className = 'fas fa-redo';
                this.repeatBtn.title = 'Repeat Off';
                this.repeatBtn.classList.remove('active');
                break;
            case 1: // Repeat all
                icon.className = 'fas fa-redo';
                this.repeatBtn.title = 'Repeat All';
                this.repeatBtn.classList.add('active');
                break;
            case 2: // Repeat one
                icon.className = 'fas fa-redo-alt';
                this.repeatBtn.title = 'Repeat One';
                this.repeatBtn.classList.add('active');
                break;
        }
    }
    
    songEnded() {
        if (this.repeatMode === 2) {
            // Repeat one - restart current song
            this.audio.currentTime = 0;
            if (this.isPlaying) this.audio.play();
        } else if (this.repeatMode === 1 || this.isShuffled) {
            // Repeat all or shuffle - play next song
            this.nextSong();
        } else if (this.songIndex === this.playlist.length - 1) {
            // Last song, stop playing
            this.isPlaying = false;
            this.updatePlayPauseIcon();
            this.albumArt.classList.remove('playing');
        } else {
            // Play next song
            this.nextSong();
        }
    }
    
    updateProgress() {
        const { duration, currentTime } = this.audio;
        const progressPercent = (currentTime / duration) * 100;
        this.progressBar.style.width = `${progressPercent}%`;
        
        // Update time display
        this.currentTimeEl.textContent = this.formatTime(currentTime);
        
        if (!isNaN(duration)) {
            this.durationEl.textContent = this.formatTime(duration);
        }
    }
    
    setProgress(e) {
        const width = this.progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = this.audio.duration;
        
        if (!isNaN(duration)) {
            this.audio.currentTime = (clickX / width) * duration;
        }
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }
    
    renderPlaylist() {
        this.playlistEl.innerHTML = '';
        
        this.playlist.forEach((song, index) => {
            const li = document.createElement('li');
            li.setAttribute('data-index', index);
            
            li.innerHTML = `
                <span class="song-number">${index + 1}</span>
                <div class="song-details">
                    <div class="song-title">${song.title}</div>
                    <div class="song-artist">${song.artist}</div>
                </div>
                <span class="song-duration">${song.duration}</span>
            `;
            
            li.addEventListener('click', () => {
                this.songIndex = index;
                this.loadSong(this.playlist[this.songIndex]);
                if (!this.isPlaying) this.togglePlayPause();
            });
            
            this.playlistEl.appendChild(li);
        });
        
        this.updatePlaylistUI();
    }
    
    updatePlaylistUI() {
        const listItems = this.playlistEl.querySelectorAll('li');
        listItems.forEach((li, index) => {
            li.classList.remove('active');
            if (index === this.songIndex) {
                li.classList.add('active');
                
                // Scroll to active song
                li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }
        });
    }
    
    filterPlaylist() {
        const searchTerm = this.searchPlaylist.value.toLowerCase();
        const listItems = this.playlistEl.querySelectorAll('li');
        
        listItems.forEach((li, index) => {
            const song = this.playlist[index];
            const songText = `${song.title} ${song.artist}`.toLowerCase();
            
            if (songText.includes(searchTerm)) {
                li.style.display = 'flex';
            } else {
                li.style.display = 'none';
            }
        });
    }
    
    updatePlaylistCount() {
        this.playlistCount.textContent = `(${this.playlist.length} songs)`;
    }
}

// Initialize the music player when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new MusicPlayer();
});