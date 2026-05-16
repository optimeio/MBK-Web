export class Particle {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.W = width;
    this.H = height;
    this.reset();
  }

  reset() {
    this.x = Math.random() * this.W;
    this.y = Math.random() * this.H;
    this.size = Math.random() * 1.5 + 0.4;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    const colors = ['249,115,22', '225,29,72', '139,92,246', '255,255,255'];
    this.color = colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0 || this.x > this.W || this.y < 0 || this.y > this.H) this.reset();
  }

  draw() {
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fillStyle = `rgba(${this.color},${this.opacity})`;
    this.ctx.fill();
  }

  setBounds(width, height) {
    this.W = width;
    this.H = height;
  }
}
