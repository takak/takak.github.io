// Timeline Control

class Timeline {
  constructor(engine, daysList) {
    this.engine = engine;
    this.days = daysList;
    this.currentIndex = daysList.length - 1;
    this.isPlaying = false;
    this.playInterval = null;
    
    this.setupControls();
  }
  
  setupControls() {
    this.slider = document.getElementById('slider');
    this.currentDayDisplay = document.getElementById('current-day');
    
    document.getElementById('first').addEventListener('click', () => this.goToFirst());
    document.getElementById('prev').addEventListener('click', () => this.prev());
    document.getElementById('play').addEventListener('click', () => this.togglePlay());
    document.getElementById('next').addEventListener('click', () => this.next());
    document.getElementById('latest').addEventListener('click', () => this.goToLatest());
    
    this.slider.addEventListener('input', (e) => {
      this.currentIndex = parseInt(e.target.value) - 1;
      this.loadDay(this.currentIndex);
    });
  }
  
  async loadDay(index) {
    if (index < 0 || index >= this.days.length) return;
    
    const day = this.days[index];
    const response = await fetch(`days/${day}/scene.json`);
    const scene = await response.json();
    
    this.engine.stop();
    this.engine.loadScene(scene);
    this.engine.start();
    
    this.currentIndex = index;
    this.slider.value = index + 1;
    this.currentDayDisplay.textContent = `Day ${scene.metadata.dayNumber}`;
  }
  
  goToFirst() {
    this.loadDay(0);
  }
  
  goToLatest() {
    this.loadDay(this.days.length - 1);
  }
  
  prev() {
    if (this.currentIndex > 0) {
      this.loadDay(this.currentIndex - 1);
    }
  }
  
  next() {
    if (this.currentIndex < this.days.length - 1) {
      this.loadDay(this.currentIndex + 1);
    }
  }
  
  togglePlay() {
    const playButton = document.getElementById('play');
    
    if (this.isPlaying) {
      this.stop();
      playButton.textContent = '▶️ 再生';
    } else {
      this.play();
      playButton.textContent = '⏸️ 停止';
    }
  }
  
  play() {
    this.isPlaying = true;
    this.playInterval = setInterval(() => {
      if (this.currentIndex < this.days.length - 1) {
        this.next();
      } else {
        this.stop();
        document.getElementById('play').textContent = '▶️ 再生';
      }
    }, 1000);
  }
  
  stop() {
    this.isPlaying = false;
    if (this.playInterval) {
      clearInterval(this.playInterval);
      this.playInterval = null;
    }
  }
}
