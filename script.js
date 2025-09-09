// Theme Management
class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem('theme') || 'dark';
    this.init();
  }

  init() {
    document.documentElement.setAttribute('data-theme', this.theme);
    this.updateThemeIcons();
    this.bindEvents();
  }

  toggle() {
    this.theme = this.theme === 'light' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', this.theme);
    localStorage.setItem('theme', this.theme);
    this.updateThemeIcons();
  }

  updateThemeIcons() {
    const icons = document.querySelectorAll('.theme-toggle i, .theme-toggle-nav i');
    icons.forEach(icon => {
      icon.className = this.theme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
    });
  }

  bindEvents() {
    document.querySelectorAll('.theme-toggle, .theme-toggle-nav').forEach(btn => {
      btn.addEventListener('click', () => this.toggle());
    });
  }
}

// Navigation Manager
class NavigationManager {
  constructor() {
    this.navbar = document.querySelector('.navbar');
    this.hamburger = document.getElementById('hamburger');
    this.navMenu = document.querySelector('.nav-menu');
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    // Hamburger menu toggle
    this.hamburger.addEventListener('click', () => this.toggleMenu());

    // Close menu when clicking on links
    document.querySelectorAll('.nav-menu a').forEach(link => {
      link.addEventListener('click', () => this.closeMenu());
    });

    // Scroll events
    window.addEventListener('scroll', () => this.handleScroll());

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(link => {
      link.addEventListener('click', (e) => this.smoothScroll(e));
    });
  }

  toggleMenu() {
    this.hamburger.classList.toggle('active');
    this.navMenu.classList.toggle('active');
  }

  closeMenu() {
    this.hamburger.classList.remove('active');
    this.navMenu.classList.remove('active');
  }

  handleScroll() {
    const scrolled = window.scrollY > 50;
    this.navbar.style.background = scrolled 
      ? 'rgba(255, 255, 255, 0.95)' 
      : 'rgba(134, 130, 130, 0.95)';
    
    if (document.documentElement.getAttribute('data-theme') === 'dark') {
      this.navbar.style.background = scrolled 
        ? 'rgba(17, 24, 39, 0.95)' 
        : 'rgba(17, 24, 39, 0.95)';
    }
  }

  smoothScroll(e) {
    e.preventDefault();
    const target = document.querySelector(e.target.getAttribute('href'));
    if (target) {
      const offsetTop = target.offsetTop - 70;
      window.scrollTo({
        top: offsetTop,
        behavior: 'smooth'
      });
    }
  }
}

// Scroll Manager
class ScrollManager {
  constructor() {
    this.scrollTopBtn = document.getElementById('scrollTop');
    this.init();
  }

  init() {
    this.bindEvents();
    this.handleScroll();
  }

  bindEvents() {
    window.addEventListener('scroll', () => this.handleScroll());
    this.scrollTopBtn.addEventListener('click', () => this.scrollToTop());
  }

  handleScroll() {
    const scrolled = window.scrollY > 300;
    this.scrollTopBtn.classList.toggle('visible', scrolled);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}

// Animation Manager
class AnimationManager {
  constructor() {
    this.observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };
    this.init();
  }

  init() {
    this.createObserver();
    this.observeElements();
  }

  createObserver() {
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('fade-in');
          this.observer.unobserve(entry.target);
        }
      });
    }, this.observerOptions);
  }

  observeElements() {
    const elements = document.querySelectorAll('.skill-category, .project-card, .stat');
    elements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      this.observer.observe(el);
    });
  }
}

// Form Manager
class FormManager {
  constructor() {
    this.form = document.getElementById('contactForm');
    this.modal = document.getElementById('successModal');
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    
    // Real-time validation
    this.form.querySelectorAll('input, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });

    // Modal close events
    document.querySelector('.modal-close').addEventListener('click', () => this.closeModal());
    this.modal.addEventListener('click', (e) => {
      if (e.target === this.modal) this.closeModal();
    });
  }

  async handleSubmit(e) {
    e.preventDefault();
    
    if (!this.validateForm()) return;

    const submitBtn = this.form.querySelector('button[type="submit"]');
    submitBtn.classList.add('loading');

    // Simulate form submission
    setTimeout(() => {
      submitBtn.classList.remove('loading');
      this.showSuccess();
      this.form.reset();
    }, 1500);
  }

  validateForm() {
    let isValid = true;
    const fields = this.form.querySelectorAll('input, textarea');
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const errorElement = field.parentNode.querySelector('.form-error');
    let error = '';

    switch (field.type) {
      case 'email':
        if (!value) {
          error = 'Email is required';
        } else if (!this.isValidEmail(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'text':
        if (!value) {
          error = `${field.placeholder} is required`;
        } else if (value.length < 2) {
          error = `${field.placeholder} must be at least 2 characters`;
        }
        break;
      default:
        if (!value) {
          error = `${field.placeholder} is required`;
        } else if (value.length < 10) {
          error = 'Message must be at least 10 characters';
        }
    }

    errorElement.textContent = error;
    field.style.borderColor = error ? '#ef4444' : '';
    
    return !error;
  }

  clearError(field) {
    const errorElement = field.parentNode.querySelector('.form-error');
    errorElement.textContent = '';
    field.style.borderColor = '';
  }

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  simulateSubmission() {
    return new Promise((resolve) => {
      setTimeout(resolve, 2000);
    });
  }

  showSuccess() {
    this.modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  showError(message) {
    alert(message); // In a real app, use a proper notification system
  }

  closeModal() {
    this.modal.style.display = 'none';
    document.body.style.overflow = '';
  }
}

// Typing Animation
class TypingAnimation {
  constructor(element, texts, speed = 100) {
    this.element = element;
    this.texts = texts;
    this.speed = speed;
    this.textIndex = 0;
    this.charIndex = 0;
    this.isDeleting = false;
    this.init();
  }

  init() {
    this.type();
  }

  type() {
    const currentText = this.texts[this.textIndex];
    
    if (this.isDeleting) {
      this.element.textContent = currentText.substring(0, this.charIndex - 1);
      this.charIndex--;
    } else {
      this.element.textContent = currentText.substring(0, this.charIndex + 1);
      this.charIndex++;
    }

    let typeSpeed = this.speed;

    if (this.isDeleting) {
      typeSpeed /= 2;
    }

    if (!this.isDeleting && this.charIndex === currentText.length) {
      typeSpeed = 2000;
      this.isDeleting = true;
    } else if (this.isDeleting && this.charIndex === 0) {
      this.isDeleting = false;
      this.textIndex = (this.textIndex + 1) % this.texts.length;
      typeSpeed = 500;
    }

    setTimeout(() => this.type(), typeSpeed);
  }
}

// Performance Monitor
class PerformanceMonitor {
  constructor() {
    this.init();
  }

  init() {
    this.preloadImages();
    this.optimizeAnimations();
  }

  preloadImages() {
    // Preload critical images
    const imageUrls = [
      // Add any image URLs here
    ];

    imageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  }

  optimizeAnimations() {
    // Reduce animations on low-end devices
    if (navigator.hardwareConcurrency < 4) {
      document.documentElement.style.setProperty('--animation-duration', '0.1s');
    }
  }
}

// Simple AWS Services Animation
class AWSServicesAnimation {
  constructor() {
    this.init();
  }

  init() {
    // Add mouse interaction to existing AWS services
    const awsServices = document.querySelectorAll('.aws-service');
    
    document.addEventListener('mousemove', (e) => {
      awsServices.forEach(service => {
        const rect = service.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) / 100;
        const deltaY = (e.clientY - centerY) / 100;
        
        service.style.transform = `translate(${deltaX}px, ${deltaY}px) scale(1.1)`;
      });
    });
    
    // Reset on mouse leave
    document.addEventListener('mouseleave', () => {
      awsServices.forEach(service => {
        service.style.transform = 'translate(0, 0) scale(1)';
      });
    });
  }
}

// Counter Animation
class CounterAnimation {
  constructor() {
    this.counters = document.querySelectorAll('.stat-number');
    this.init();
  }

  init() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    });

    this.counters.forEach(counter => observer.observe(counter));
  }

  animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const start = performance.now();

    const animate = (currentTime) => {
      const elapsed = currentTime - start;
      const progress = Math.min(elapsed / duration, 1);
      const current = Math.floor(progress * target);
      
      element.textContent = current + (target === 100 ? '%' : '+');
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }
}

// Skills Tab Manager
class SkillsTabManager {
  constructor() {
    this.tabs = document.querySelectorAll('.tab-btn');
    this.contents = document.querySelectorAll('.tab-content');
    this.init();
  }

  init() {
    this.tabs.forEach(tab => {
      tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
    });
    
    // Animate skill bars when visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateSkillBars();
        }
      });
    });
    
    const skillsSection = document.getElementById('skills');
    if (skillsSection) observer.observe(skillsSection);
  }

  switchTab(tabId) {
    this.tabs.forEach(tab => tab.classList.remove('active'));
    this.contents.forEach(content => content.classList.remove('active'));
    
    document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');
    document.getElementById(tabId).classList.add('active');
  }

  animateSkillBars() {
    document.querySelectorAll('.skill-fill').forEach(bar => {
      const width = bar.dataset.width;
      setTimeout(() => {
        bar.style.width = width + '%';
      }, 500);
    });
  }
}

// Testimonials Slider
class TestimonialsSlider {
  constructor() {
    this.slides = document.querySelectorAll('.testimonial-card');
    this.dots = document.querySelectorAll('.nav-dot');
    this.currentSlide = 0;
    this.init();
  }

  init() {
    this.dots.forEach((dot, index) => {
      dot.addEventListener('click', () => this.goToSlide(index));
    });
    
    setInterval(() => this.nextSlide(), 5000);
  }

  goToSlide(index) {
    this.slides[this.currentSlide].classList.remove('active');
    this.dots[this.currentSlide].classList.remove('active');
    
    this.currentSlide = index;
    
    this.slides[this.currentSlide].classList.add('active');
    this.dots[this.currentSlide].classList.add('active');
  }

  nextSlide() {
    const next = (this.currentSlide + 1) % this.slides.length;
    this.goToSlide(next);
  }
}

// Loading Screen Manager
class LoadingManager {
  constructor() {
    this.loadingScreen = document.getElementById('loadingScreen');
    this.init();
  }

  init() {
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.loadingScreen.style.opacity = '0';
        setTimeout(() => {
          this.loadingScreen.style.display = 'none';
        }, 500);
      }, 1000);
    });
  }
}

// Music Player
class MusicPlayer {
  constructor() {
    this.player = document.getElementById('musicPlayer');
    this.toggle = document.getElementById('musicToggle');
    this.isPlaying = false;
    this.init();
  }

  init() {
    this.toggle.addEventListener('click', () => this.toggleMusic());
  }

  toggleMusic() {
    this.isPlaying = !this.isPlaying;
    const icon = this.toggle.querySelector('i');
    
    if (this.isPlaying) {
      icon.className = 'fas fa-pause';
      this.player.style.background = '#10b981';
    } else {
      icon.className = 'fas fa-music';
      this.player.style.background = 'var(--primary)';
    }
  }
}

// CV Download
class CVDownloader {
  constructor() {
    this.downloadBtn = document.getElementById('downloadCV');
    this.init();
  }

  init() {
    this.downloadBtn.addEventListener('click', () => this.downloadCV());
  }

  downloadCV() {
    // Create a simple CV content
    const cvContent = `
JULIE - FULL STACK DEVELOPER

CONTACT:
Email: julie@example.com
Phone: +1 (555) 123-4567
Location: San Francisco, CA

SKILLS:
• JavaScript (95%)
• React (90%)
• Node.js (85%)
• Python (80%)

EXPERIENCE:
• Senior Full Stack Developer - Tech Innovations Inc. (2022-Present)
• Frontend Developer - Digital Solutions Ltd. (2021-2022)
• Junior Developer - StartUp Ventures (2020-2021)

PROJECTS:
• E-Commerce Platform
• Task Management App
• Analytics Dashboard
    `;
    
    const blob = new Blob([cvContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Julie_CV.txt';
    a.click();
    URL.revokeObjectURL(url);
  }
}

// 3D Mouse Tracking
class MouseTracker {
  constructor() {
    this.init();
  }

  init() {
    document.addEventListener('mousemove', (e) => this.handleMouseMove(e));
  }

  handleMouseMove(e) {
    const mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    const mouseY = (e.clientY / window.innerHeight) * 2 - 1;
    
    // Apply 3D tilt to cards based on mouse position
    document.querySelectorAll('.project-card, .skill-category, .stat').forEach(card => {
      const rect = card.getBoundingClientRect();
      const cardCenterX = rect.left + rect.width / 2;
      const cardCenterY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - cardCenterX) / rect.width;
      const deltaY = (e.clientY - cardCenterY) / rect.height;
      
      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) {
        const rotateX = deltaY * 10;
        const rotateY = deltaX * 10;
        
        card.style.transform = `perspective(1000px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) translateZ(20px)`;
      }
    });
  }
}

// 3D Floating Elements
class FloatingElements {
  constructor() {
    this.createFloatingShapes();
  }

  createFloatingShapes() {
    const shapes = ['cube', 'sphere', 'pyramid'];
    
    for (let i = 0; i < 5; i++) {
      const shape = document.createElement('div');
      shape.className = `floating-shape-3d ${shapes[i % shapes.length]}`;
      shape.style.cssText = `
        position: fixed;
        width: ${20 + Math.random() * 30}px;
        height: ${20 + Math.random() * 30}px;
        background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(251, 191, 36, 0.1));
        border-radius: ${Math.random() > 0.5 ? '50%' : '10px'};
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float3D ${6 + Math.random() * 4}s ease-in-out infinite;
        animation-delay: ${Math.random() * 2}s;
        pointer-events: none;
        z-index: -1;
        transform-style: preserve-3d;
      `;
      document.body.appendChild(shape);
    }
  }
}

// Description Rotation Manager
class DescriptionRotation {
  constructor() {
    this.items = document.querySelectorAll('.detail-item');
    this.currentIndex = 0;
    this.init();
  }

  init() {
    if (this.items.length === 0) return;
    
    // Show first item immediately
    this.showItem(0);
    
    // Rotate every 3 seconds
    setInterval(() => this.nextItem(), 3000);
  }

  showItem(index) {
    // Hide all items
    this.items.forEach(item => item.classList.remove('active'));
    
    // Show current item
    this.items[index].classList.add('active');
  }

  nextItem() {
    this.currentIndex = (this.currentIndex + 1) % this.items.length;
    this.showItem(this.currentIndex);
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Initialize all managers
  new ThemeManager();
  new NavigationManager();
  new ScrollManager();
  new AnimationManager();
  new FormManager();
  new PerformanceMonitor();
  new AWSServicesAnimation();
  new CounterAnimation();
  new SkillsTabManager();
  new TestimonialsSlider();
  new LoadingManager();
  new MusicPlayer();
  new CVDownloader();
  new MouseTracker();
  new FloatingElements();
  new DescriptionRotation();

  // Initialize typing animation for rotating text
  const rotatingText = document.querySelector('.rotating-text');
  if (rotatingText) {
    new TypingAnimation(rotatingText, [
      'Security Engineer',
      'Cloud Specialist',
      'AWS Expert',
      'Cybersecurity Analyst',
      'Network Administrator'
    ]);
  }

  // Initialize professional brief animation
  const professionalBrief = document.querySelector('.professional-brief');
  if (professionalBrief) {
    setTimeout(() => {
      new TypingAnimation(professionalBrief, [
        'Dedicated security engineer with AWS and Azure expertise, passionate about building resilient cloud infrastructures and advancing cybersecurity practices.',
        'Focused on implementing zero-trust architectures and automated threat detection systems to protect digital assets in modern cloud environments.',
        'Committed to continuous learning and innovation in cybersecurity, aiming to become a leading expert in cloud security and network defense strategies.'
      ], 50);
    }, 1000);
  }

  // Add loading animation
  window.addEventListener('load', () => {
    document.body.classList.add('loaded');
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      // Close modal if open
      const modal = document.getElementById('successModal');
      if (modal.style.display === 'block') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }
      
      // Close mobile menu if open
      const navMenu = document.querySelector('.nav-menu');
      const hamburger = document.getElementById('hamburger');
      if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
      }
    }
  });

  // Add focus management for accessibility
  document.querySelectorAll('a, button, input, textarea').forEach(element => {
    element.addEventListener('focus', () => {
      element.style.outline = '2px solid var(--primary)';
      element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
      element.style.outline = '';
      element.style.outlineOffset = '';
    });
  });
});