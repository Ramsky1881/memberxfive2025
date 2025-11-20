
document.addEventListener('DOMContentLoaded', () => {

  // --- CURSOR TRAIL LOGIC (OPTIMIZED) ---
  if (document.body.clientWidth > 768) {
      const trailCount = 20;
      const trailElements = [];
      let trailIndex = 0;

      for (let i = 0; i < trailCount; i++) {
          const el = document.createElement('div');
          el.className = 'cursor-trail';
          el.style.opacity = '0';
          document.body.appendChild(el);
          trailElements.push(el);
      }

      document.addEventListener('mousemove', (e) => {
          const trail = trailElements[trailIndex];
          trailIndex = (trailIndex + 1) % trailCount;

          trail.style.left = `${e.pageX}px`;
          trail.style.top = `${e.pageY}px`;
          trail.style.opacity = '0.8';
          trail.style.transform = 'scale(1)';

          setTimeout(() => {
              trail.style.opacity = '0';
              trail.style.transform = 'scale(0)';
          }, 100);
      });
  }

  // --- PARTICLE ANIMATION LOGIC ---
  const canvas = document.getElementById('particles-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particlesArray;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.directionX = (Math.random() * 1) - 0.5;
            this.directionY = (Math.random() * 1) - 0.5;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00ffff' : '#ff00ff';
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
        update() {
            if (this.x > canvas.width || this.x < 0) this.directionX = -this.directionX;
            if (this.y > canvas.height || this.y < 0) this.directionY = -this.directionY;
            this.x += this.directionX;
            this.y += this.directionY;
            this.draw();
        }
    }

    function initParticles() {
        particlesArray = [];
        const particleDensity = window.innerWidth < 768 ? 35000 : 25000;
        let numberOfParticles = (canvas.height * canvas.width) / particleDensity;
        if (numberOfParticles > 150) numberOfParticles = 150;

        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function animateParticles() {
        requestAnimationFrame(animateParticles);
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connectParticles();
    }

    function connectParticles() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < (canvas.width / 7) * (canvas.height / 7)) {
                    opacityValue = 1 - (distance / 20000);
                    ctx.strokeStyle = `rgba(255,255,255,${opacityValue})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    initParticles();
    animateParticles();
  }

});

// --- TYPEWRITER EFFECT ---
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function startTypewriter(element) {
    if (element.dataset.typing === 'true') return;
    element.dataset.typing = 'true';

    const text = element.dataset.text;
    const observer = new IntersectionObserver(async (entries) => {
        if (entries[0].isIntersecting) {
            // Only type out once
            for (let i = 0; i <= text.length; i++) {
                if (!document.body.contains(element)) return;
                element.textContent = text.substring(0, i);
                await sleep(100 + Math.random() * 50);
            }
            // Add a class to hide the caret and stop the animation
            element.classList.add('typing-done');
            // Disconnect the observer once the animation is done
            observer.disconnect();
            element.dataset.typing = 'false';
        }
    }, { threshold: 0.8 });

    observer.observe(element);
}
