export class TwinklingStars {
  constructor(canvasId, starCount = 100, maxStarSize = 1.5, twinkleFrequency = 1000, twinkleSpeed = 0.02) {
      this.canvas = document.getElementById(canvasId);
      this.ctx = this.canvas.getContext('2d');
      this.stars = [];
      this.starCount = starCount;
      this.maxStarSize = maxStarSize;
      this.twinkleFrequency = twinkleFrequency;
      this.twinkleSpeed = twinkleSpeed; // Rate of opacity change per frame

      this.initializeCanvas();
      this.createStars();
      this.animate();
  }

  initializeCanvas() {
      this.canvas.width = window.innerWidth;
      this.canvas.height = window.innerHeight;
      window.addEventListener('resize', () => {
          this.canvas.width = window.innerWidth;
          this.canvas.height = window.innerHeight;
          this.createStars();
      });
  }

  createStars() {
      this.stars = [];
      for (let i = 0; i < this.starCount; i++) {
          const x = Math.random() * this.canvas.width;
          const y = Math.random() * this.canvas.height;
          const size = Math.random() * this.maxStarSize;
          const opacity = Math.random();
          const targetOpacity = Math.random();
          this.stars.push({ x, y, size, opacity, targetOpacity });
      }
  }

  animate() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      this.drawStars();
      this.updateStars();
      requestAnimationFrame(() => this.animate());
  }

  drawStars() {
      this.stars.forEach(star => {
          this.ctx.beginPath();
          this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          this.ctx.fill();
      });
  }

  updateStars() {
      this.stars = this.stars.map(star => {
          if (Math.abs(star.opacity - star.targetOpacity) < 0.05) {
              star.targetOpacity = Math.random(); // Set a new target opacity when close to current
          }
          // Interpolate opacity
          star.opacity += (star.targetOpacity - star.opacity) * this.twinkleSpeed;
          return star;
      });
  }
}
