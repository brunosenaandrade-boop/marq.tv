/* ============================================
   MARQUES.TV - Modern JavaScript
   ============================================ */

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initThemeToggle();
  initParticles();
  initNavbar();
  initMobileMenu();
  initScrollAnimations();
  initSmoothScroll();
  initCounterAnimation();
  initGalleryFilters();
  initLightbox();
  initTestimonialsCarousel();
  initFAQAccordion();
  initBackToTop();
  initParallax();
  initContactForm();
});

/* ============================================
   PRELOADER
   ============================================ */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  if (!preloader) return;

  window.addEventListener('load', () => {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.remove();
      }, 500);
    }, 1000);
  });

  // Fallback - hide preloader after 5 seconds max
  setTimeout(() => {
    if (preloader && preloader.parentNode) {
      preloader.classList.add('hidden');
      setTimeout(() => {
        if (preloader.parentNode) preloader.remove();
      }, 500);
    }
  }, 5000);
}

/* ============================================
   THEME TOGGLE (Light/Dark Mode)
   ============================================ */
function initThemeToggle() {
  const themeToggle = document.getElementById('themeToggle');
  if (!themeToggle) return;

  const sunIcon = themeToggle.querySelector('.sun-icon');
  const moonIcon = themeToggle.querySelector('.moon-icon');

  // Check for saved theme preference or default to dark
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcons(savedTheme);

  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcons(newTheme);
  });

  function updateThemeIcons(theme) {
    if (sunIcon && moonIcon) {
      if (theme === 'dark') {
        sunIcon.style.opacity = '1';
        moonIcon.style.opacity = '0';
      } else {
        sunIcon.style.opacity = '0';
        moonIcon.style.opacity = '1';
      }
    }
  }
}

/* ============================================
   PARTICLES SYSTEM
   ============================================ */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  let mouse = { x: null, y: null, radius: 150 };

  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }

  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // Track mouse position
  window.addEventListener('mousemove', (e) => {
    mouse.x = e.x;
    mouse.y = e.y;
  });

  window.addEventListener('mouseout', () => {
    mouse.x = null;
    mouse.y = null;
  });

  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.size = Math.random() * 3 + 1;
      this.baseX = this.x;
      this.baseY = this.y;
      this.density = Math.random() * 30 + 1;
      this.speedX = (Math.random() - 0.5) * 0.5;
      this.speedY = (Math.random() - 0.5) * 0.5;

      // Color variations based on theme
      const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
      const colors = isDark ? [
        'rgba(0, 212, 170, 0.6)',
        'rgba(124, 58, 237, 0.6)',
        'rgba(255, 255, 255, 0.4)',
        'rgba(0, 212, 170, 0.3)',
        'rgba(124, 58, 237, 0.3)'
      ] : [
        'rgba(0, 180, 150, 0.5)',
        'rgba(100, 40, 200, 0.5)',
        'rgba(0, 0, 0, 0.2)',
        'rgba(0, 180, 150, 0.3)',
        'rgba(100, 40, 200, 0.3)'
      ];
      this.color = colors[Math.floor(Math.random() * colors.length)];
    }

    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.fill();
    }

    update() {
      // Mouse interaction
      if (mouse.x !== null && mouse.y !== null) {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < mouse.radius) {
          const forceDirectionX = dx / distance;
          const forceDirectionY = dy / distance;
          const maxDistance = mouse.radius;
          const force = (maxDistance - distance) / maxDistance;
          const directionX = forceDirectionX * force * this.density * 0.5;
          const directionY = forceDirectionY * force * this.density * 0.5;

          this.x -= directionX;
          this.y -= directionY;
        }
      }

      // Slow return to original position
      const dx = this.baseX - this.x;
      const dy = this.baseY - this.y;
      this.x += dx * 0.03;
      this.y += dy * 0.03;

      // Gentle floating movement
      this.baseX += this.speedX;
      this.baseY += this.speedY;

      // Wrap around edges
      if (this.baseX < 0) this.baseX = canvas.width;
      if (this.baseX > canvas.width) this.baseX = 0;
      if (this.baseY < 0) this.baseY = canvas.height;
      if (this.baseY > canvas.height) this.baseY = 0;

      this.draw();
    }
  }

  // Initialize particles
  function init() {
    particles = [];
    const numberOfParticles = Math.min((canvas.width * canvas.height) / 12000, 150);

    for (let i = 0; i < numberOfParticles; i++) {
      particles.push(new Particle());
    }
  }

  // Connect particles with lines
  function connectParticles() {
    const isDark = document.documentElement.getAttribute('data-theme') !== 'light';
    const lineColor = isDark ? '0, 212, 170' : '0, 150, 130';

    for (let a = 0; a < particles.length; a++) {
      for (let b = a + 1; b < particles.length; b++) {
        const dx = particles[a].x - particles[b].x;
        const dy = particles[a].y - particles[b].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          const opacity = (120 - distance) / 120 * 0.3;
          ctx.strokeStyle = `rgba(${lineColor}, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(particles[a].x, particles[a].y);
          ctx.lineTo(particles[b].x, particles[b].y);
          ctx.stroke();
        }
      }
    }
  }

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(particle => particle.update());
    connectParticles();

    animationId = requestAnimationFrame(animate);
  }

  init();
  animate();

  // Reinitialize on resize
  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationId);
    init();
    animate();
  });
}

/* ============================================
   NAVBAR SCROLL EFFECT
   ============================================ */
function initNavbar() {
  const navbar = document.querySelector('.navbar');
  if (!navbar) return;

  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Add/remove scrolled class
    if (currentScroll > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    lastScroll = currentScroll;
  });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
  const toggle = document.querySelector('.nav-toggle');
  const menu = document.querySelector('.nav-menu');

  if (!toggle || !menu) return;

  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
  });

  // Close menu when clicking a link
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!toggle.contains(e.target) && !menu.contains(e.target) && menu.classList.contains('active')) {
      toggle.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, observerOptions);

  // Observe all animated elements
  const animatedElements = document.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right, .stagger-children');
  animatedElements.forEach(el => observer.observe(el));
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');

      if (targetId === '#') return;

      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-number');

  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        animateCounter(entry.target);
        entry.target.classList.add('counted');
      }
    });
  }, observerOptions);

  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.getAttribute('data-target')) || parseInt(element.textContent);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;

  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target + '+';
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current) + '+';
    }
  }, 16);
}

/* ============================================
   GALLERY FILTERS
   ============================================ */
function initGalleryFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (!filterButtons.length || !galleryItems.length) return;

  filterButtons.forEach(button => {
    button.addEventListener('click', () => {
      // Update active button
      filterButtons.forEach(btn => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');

      // Filter gallery items
      galleryItems.forEach(item => {
        const category = item.getAttribute('data-category');

        if (filter === 'todos' || category === filter) {
          item.style.display = 'block';
          item.style.animation = 'fadeIn 0.5s ease forwards';
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/* ============================================
   LIGHTBOX
   ============================================ */
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');

  if (!lightbox) return;

  const lightboxImg = lightbox.querySelector('.lightbox-image');
  const lightboxCaption = lightbox.querySelector('.lightbox-caption');
  const closeBtn = lightbox.querySelector('.lightbox-close');
  const prevBtn = lightbox.querySelector('.lightbox-prev');
  const nextBtn = lightbox.querySelector('.lightbox-next');

  let currentIndex = 0;
  let visibleItems = [];

  function updateVisibleItems() {
    visibleItems = Array.from(galleryItems).filter(item =>
      item.style.display !== 'none'
    );
  }

  function openLightbox(index) {
    updateVisibleItems();
    currentIndex = index;

    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay h4');

    if (img) {
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
    }

    if (overlay && lightboxCaption) {
      lightboxCaption.textContent = overlay.textContent;
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay h4');

    if (img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.style.opacity = '1';
      }, 200);
    }

    if (overlay && lightboxCaption) {
      lightboxCaption.textContent = overlay.textContent;
    }
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % visibleItems.length;
    const item = visibleItems[currentIndex];
    const img = item.querySelector('img');
    const overlay = item.querySelector('.gallery-overlay h4');

    if (img) {
      lightboxImg.style.opacity = '0';
      setTimeout(() => {
        lightboxImg.src = img.src;
        lightboxImg.style.opacity = '1';
      }, 200);
    }

    if (overlay && lightboxCaption) {
      lightboxCaption.textContent = overlay.textContent;
    }
  }

  // Event listeners
  galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
      updateVisibleItems();
      const visibleIndex = visibleItems.indexOf(item);
      if (visibleIndex !== -1) {
        openLightbox(visibleIndex);
      }
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (prevBtn) prevBtn.addEventListener('click', showPrev);
  if (nextBtn) nextBtn.addEventListener('click', showNext);

  // Close on background click
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;

    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') showPrev();
    if (e.key === 'ArrowRight') showNext();
  });
}

/* ============================================
   TESTIMONIALS CAROUSEL
   ============================================ */
function initTestimonialsCarousel() {
  const track = document.querySelector('.testimonials-track');
  const cards = document.querySelectorAll('.testimonial-card');
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.querySelector('.carousel-dots');

  if (!track || !cards.length) return;

  let currentIndex = 0;
  let cardWidth = 0;
  let cardsToShow = 1;

  function calculateDimensions() {
    const containerWidth = track.parentElement.offsetWidth;

    if (window.innerWidth >= 1024) {
      cardsToShow = 3;
    } else if (window.innerWidth >= 768) {
      cardsToShow = 2;
    } else {
      cardsToShow = 1;
    }

    cardWidth = containerWidth / cardsToShow;

    cards.forEach(card => {
      card.style.minWidth = `${cardWidth}px`;
    });
  }

  function createDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = '';
    const totalDots = Math.ceil(cards.length / cardsToShow);

    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      if (i === 0) dot.classList.add('active');

      dot.addEventListener('click', () => {
        currentIndex = i * cardsToShow;
        updateCarousel();
      });

      dotsContainer.appendChild(dot);
    }
  }

  function updateCarousel() {
    const maxIndex = cards.length - cardsToShow;
    if (currentIndex < 0) currentIndex = 0;
    if (currentIndex > maxIndex) currentIndex = maxIndex;

    track.style.transform = `translateX(-${currentIndex * cardWidth}px)`;

    // Update dots
    if (dotsContainer) {
      const dots = dotsContainer.querySelectorAll('.carousel-dot');
      const activeDotIndex = Math.floor(currentIndex / cardsToShow);

      dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === activeDotIndex);
      });
    }
  }

  function goToPrev() {
    currentIndex -= cardsToShow;
    if (currentIndex < 0) currentIndex = Math.max(0, cards.length - cardsToShow);
    updateCarousel();
  }

  function goToNext() {
    currentIndex += cardsToShow;
    if (currentIndex >= cards.length) currentIndex = 0;
    updateCarousel();
  }

  // Initialize
  calculateDimensions();
  createDots();

  // Event listeners
  if (prevBtn) prevBtn.addEventListener('click', goToPrev);
  if (nextBtn) nextBtn.addEventListener('click', goToNext);

  // Recalculate on resize
  window.addEventListener('resize', debounce(() => {
    calculateDimensions();
    createDots();
    updateCarousel();
  }, 250));

  // Auto-play (optional)
  let autoplayInterval;

  function startAutoplay() {
    autoplayInterval = setInterval(goToNext, 5000);
  }

  function stopAutoplay() {
    clearInterval(autoplayInterval);
  }

  startAutoplay();

  track.parentElement.addEventListener('mouseenter', stopAutoplay);
  track.parentElement.addEventListener('mouseleave', startAutoplay);

  // Touch/swipe support
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
    stopAutoplay();
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
    startAutoplay();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goToNext();
      } else {
        goToPrev();
      }
    }
  }
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      // Close all other items (accordion behavior)
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
          const otherAnswer = otherItem.querySelector('.faq-answer');
          if (otherAnswer) {
            otherAnswer.style.maxHeight = null;
          }
        }
      });

      // Toggle current item
      item.classList.toggle('active');

      if (!isActive) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      } else {
        answer.style.maxHeight = null;
      }
    });
  });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
  const backToTopBtn = document.getElementById('backToTop');

  if (!backToTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.pageYOffset > 500) {
      backToTopBtn.classList.add('visible');
    } else {
      backToTopBtn.classList.remove('visible');
    }
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */
function initParallax() {
  const parallaxLayers = document.querySelectorAll('.parallax-layer');

  if (!parallaxLayers.length) return;

  window.addEventListener('scroll', throttle(() => {
    const scrolled = window.pageYOffset;

    parallaxLayers.forEach(layer => {
      const speed = parseFloat(layer.getAttribute('data-speed')) || 0.5;
      const yPos = -(scrolled * speed);
      layer.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }, 16));
}

/* ============================================
   FORM HANDLING
   ============================================ */
function initContactForm() {
  const form = document.querySelector('.contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    // Create WhatsApp message
    const message = `Olá! Vim pelo site.\n\nNome: ${data.name}\nEmail: ${data.email}\nTelefone: ${data.phone || 'Não informado'}\n\nMensagem:\n${data.message}`;

    // Encode and open WhatsApp
    const whatsappUrl = `https://wa.me/5548996776089?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');

    // Reset form
    form.reset();

    // Show success message
    showNotification('Redirecionando para o WhatsApp...', 'success');
  });
}

/* ============================================
   NOTIFICATION SYSTEM
   ============================================ */
function showNotification(message, type = 'info') {
  // Remove existing notification
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.innerHTML = `
    <span>${message}</span>
    <button class="notification-close">&times;</button>
  `;

  notification.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 30px;
    background: ${type === 'success' ? 'var(--accent-primary)' : 'var(--accent-secondary)'};
    color: ${type === 'success' ? 'var(--bg-primary)' : 'white'};
    padding: 1rem 1.5rem;
    border-radius: 10px;
    display: flex;
    align-items: center;
    gap: 1rem;
    z-index: 10000;
    animation: slideInRight 0.3s ease;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
  `;

  document.body.appendChild(notification);

  const closeBtn = notification.querySelector('.notification-close');
  closeBtn.style.cssText = `
    background: none;
    border: none;
    color: inherit;
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0;
    line-height: 1;
  `;

  closeBtn.addEventListener('click', () => notification.remove());

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.style.animation = 'slideOutRight 0.3s ease forwards';
      setTimeout(() => notification.remove(), 300);
    }
  }, 5000);
}

/* ============================================
   UTILITY: Throttle function
   ============================================ */
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

/* ============================================
   UTILITY: Debounce function
   ============================================ */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/* ============================================
   ADD CSS ANIMATIONS DYNAMICALLY
   ============================================ */
(function addDynamicStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideInRight {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @keyframes slideOutRight {
      from {
        transform: translateX(0);
        opacity: 1;
      }
      to {
        transform: translateX(100%);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
})();
