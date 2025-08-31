/**
 * CountdownLive is a custom HTML element that displays a countdown timer
 * and creates a starry animation effect around the timer.
 * 
 * @class
 * @extends HTMLElement
 * 
 * @example
 * <countdown-live start-date="2023-12-31T23:59:59"></countdown-live>
 * 
 * @attribute {string} start-date - The target date and time for the countdown in ISO format.
 * 
 * @method connectedCallback - Invoked when the element is added to the DOM. Initializes the countdown and animations.
 * @method disconnectedCallback - Invoked when the element is removed from the DOM. Cleans up intervals.
 * @method attributeChangedCallback - Invoked when an observed attribute changes. Restarts the countdown if `start-date` changes.
 * @method startCountdown - Starts the countdown timer and updates the display every second.
 * @method startAnimation - Starts the starry animation effect at regular intervals.
 * @method createStars - Creates multiple stars at random positions around the element.
 * @method createStar - Creates a single star at a specified position with a sparkle animation.
 * @method injectAnimationStyles - Injects the CSS styles for the sparkle animation into the document.
 * @method render - Updates the countdown display with the remaining days, hours, minutes, and seconds.
 * 
 * @csspart countdown - The container for the countdown timer.
 * @csspart countdown div - The individual time unit containers (days, hours, minutes, seconds).
 * @csspart countdown span - The labels for the time units.
 */
class CountdownLive extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this.countdownInterval = null;
    this.animationInterval = null;
  }

  static get observedAttributes() {
    return ['start-date'];
  }

  connectedCallback() {
    this.render(0, 0, 0, 0);
    this.startCountdown();
    this.injectAnimationStyles();
    this.startAnimation();
  }

  disconnectedCallback() {
    clearInterval(this.countdownInterval);
    clearInterval(this.animationInterval);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === 'start-date') {
      clearInterval(this.countdownInterval);
      this.startCountdown();
    }
  }

  startCountdown() {
    this.countdownInterval = setInterval(() => {
      const target = new Date(this.getAttribute('start-date'));
      const now = new Date();
      let diff = Math.floor((target - now) / 1000);
      // If target date has passed, set diff to zero
      if (diff < 0) {
        diff = 0;
        this.dispatchEvent(new CustomEvent('countdown-ended', {
          detail: { message: 'Countdown has ended' },
          bubbles: true,
          composed: true
        }));
      }
      const days = Math.floor(diff / 86400);
      const hours = Math.floor((diff % 86400) / 3600);
      const minutes = Math.floor((diff % 3600) / 60);
      const seconds = diff % 60;

      this.render(days, hours, minutes, seconds);
    }, 1000);
  }

  startAnimation() {
    // Create stars at regular intervals
    this.animationInterval = setInterval(() => {
      this.createStars();
    }, 800);
  }

  createStars() {
    const rect = this.getBoundingClientRect();
    const starCount = Math.floor(Math.random() * 6) + 5;
    for (let i = 0; i < starCount; i++) {
      const margin = 20;
      const x = rect.left + window.scrollX + Math.random() * (rect.width + margin * 2) - margin;
      const y = rect.top + window.scrollY + Math.random() * (rect.height + margin * 2) - margin;
      this.createStar(x, y);
    }
  }

  createStar(x, y) {
    const star = document.createElement('div');
    const size = Math.random() * 3 + 1;
    const delay = Math.random();
    Object.assign(star.style, {
      position: 'absolute',
      left: `${x}px`,
      top: `${y}px`,
      width: `${size}px`,
      height: `${size}px`,
      background: 'white',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      animation: `sparkle-animation 3s ${delay}s forwards`
    });
    star.addEventListener('animationend', () => {
      star.remove();
    });
    document.body.appendChild(star);
  }

  injectAnimationStyles() {
    if (document.getElementById('star-animation-styles')) return;

    const style = document.createElement('style');
    style.id = 'star-animation-styles';
    style.textContent = `
      @keyframes sparkle-animation {
        0% {
          opacity: 0;
          transform: scale(1) rotate(0deg);
          filter: drop-shadow(0 0 3px rgba(255, 255, 255, 0.8));
        }
        50% {
          opacity: 1;
          transform: scale(1.5) rotate(180deg);
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        75% {
          opacity: 0.8;
          transform: scale(1) rotate(270deg);
          filter: drop-shadow(0 0 3px rgba(255,255,255,0.8));
        }
        100% {
          opacity: 0;
          transform: scale(0.5) rotate(360deg);
          filter: drop-shadow(0 0 1px rgba(255,255,255,0));
        }
      }
    `;
    document.head.appendChild(style);
  }

  render(days, hours, minutes, seconds) {
    this.shadowRoot.innerHTML = `
      <style>
      .countdown {
        position: relative;
        display: flex;
        justify-content: center;
        gap: 15px;
        font-family: Arial, sans-serif;
        font-size: 1.5rem;
        color: #fff;
        background: linear-gradient(45deg, rgb(126, 84, 7), rgb(244, 186, 13));
        padding: 10px 20px;
        border-radius: 10px;
        overflow: visible;
      }
      .countdown div {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .countdown span {
        font-size: 0.8rem;
        color: #ddd;
      }
      </style>
      <div class="countdown">
      <div>
        <div>${days}</div>
        <span>Өдөр</span>
      </div>
      <div>
        <div>${hours}</div>
        <span>Цаг</span>
      </div>
      <div>
        <div>${minutes}</div>
        <span>Минут</span>
      </div>
      <div>
        <div>${String(seconds).padStart(2, '0')}</div>
        <span>Секунд</span>
      </div>
      </div>
    `;
  }
}

customElements.define('countdown-live', CountdownLive);
