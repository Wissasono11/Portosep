// ===== OPTIMIZED AND CLEANED PORTFOLIO SCRIPT =====
// All functionality consolidated into a single DOMContentLoaded event

document.addEventListener("DOMContentLoaded", function () {
  
  // ===== GLOBAL VARIABLES =====
  const hamburger = document.getElementById("hamburger-menu");
  const menuLeft = document.querySelector(".navbar-menu-left");
  const menuRight = document.querySelector(".navbar-menu-right");
  const navbar = document.querySelector(".navbar");
  const tabs = document.querySelectorAll(".tab");
  const sections = document.querySelectorAll('section[id]');
  
  // Mobile navigation elements
  const mobileNavMenu = document.querySelector('.mobile-nav-menu');
  const mobileNavOverlay = document.querySelector('.mobile-nav-overlay');
  const mobileNavLinks = document.querySelectorAll('.mobile-nav-menu .tab a');
  const mobileNavClose = document.getElementById('mobile-nav-close');
  
  // Slider elements
  const projectsSlider = document.getElementById('projectsSlider');
  const projectSlides = document.querySelectorAll('.project-card');
  const certificateSlider = document.getElementById('certificateSlider');
  const certificateCards = document.querySelectorAll('.certificate-card');
  const servicesContainer = document.querySelector('.services-cards-container');
  const serviceCards = document.querySelectorAll('.service-card');
  
  // Button elements
  const portfolioBtn = document.querySelector('.portfolio-btn');
  const hireBtn = document.querySelector('.hire-btn');
  const emailInput = document.getElementById('emailInput');
  
  // Hero section elements
  const heroSection = document.querySelector('.hero-section');
  const trailContainer = document.querySelector('.mouse-trail-container');
  
  // Slider state variables
  let currentProjectSlide = 0;
  let currentCertificateSlide = 0;
  let currentServiceSlide = 0;
  let autoSlideInterval;
  let certificateAutoSlideInterval;
  
  // ===== UTILITY FUNCTIONS =====
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }
  
  function isMobileView() {
    return window.innerWidth <= 768;
  }
  
  function isTabletView() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
  }
  
  // ===== MOBILE NAVIGATION =====
  function openMobileSidebar() {
    if (mobileNavMenu && mobileNavOverlay) {
      mobileNavMenu.classList.add('active');
      mobileNavOverlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeMobileSidebar() {
    if (mobileNavMenu && mobileNavOverlay) {
      mobileNavMenu.classList.remove('active');
      mobileNavOverlay.classList.remove('active');
      document.body.style.overflow = '';
    }
    
    if (hamburger) {
      hamburger.classList.remove('opened');
      hamburger.setAttribute('aria-expanded', 'false');
    }
  }

  // Mobile navigation event listeners
  if (mobileNavLinks) {
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        closeMobileSidebar();
        
        const href = this.getAttribute('href');
        if (href.startsWith('#')) {
          const targetSection = document.getElementById(href.substring(1));
          if (targetSection) {
            targetSection.scrollIntoView({ behavior: 'smooth' });
          }
        }
        
        // Update active states
        document.querySelectorAll('.mobile-nav-menu .tab, .navbar .tab').forEach(t => t.classList.remove('active'));
        this.parentElement.classList.add('active');
        const mainNavLink = document.querySelector(`.navbar .tab a[href="${href}"]`);
        if (mainNavLink) {
          mainNavLink.parentElement.classList.add('active');
        }
      });
    });
  }

  // Hamburger menu functionality
  if (hamburger) {
    hamburger.onclick = null;
    hamburger.removeAttribute('onclick');
    
    hamburger.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();
      
      if (window.innerWidth <= 991) {
        this.classList.toggle('opened');
        const isOpened = this.classList.contains('opened');
        this.setAttribute('aria-expanded', isOpened);
        
        if (isOpened) {
          openMobileSidebar();
        } else {
          closeMobileSidebar();
        }
      }
    });
  }

  // Mobile navigation additional events
  if (mobileNavOverlay) {
    mobileNavOverlay.addEventListener('click', closeMobileSidebar);
  }
  
  if (mobileNavClose) {
    mobileNavClose.addEventListener('click', closeMobileSidebar);
  }

  // ===== NAVBAR ACTIVE INDICATOR =====
  function updateActiveIndicator(activeTab) {
    if (window.innerWidth >= 1024 && navbar) {
      const tabRect = activeTab.getBoundingClientRect();
      const navbarRect = navbar.getBoundingClientRect();
      
      const left = tabRect.left - navbarRect.left;
      const width = tabRect.width;
      
      navbar.style.setProperty('--indicator-left', left + 'px');
      navbar.style.setProperty('--indicator-width', width + 'px');
      navbar.classList.add('indicator-active');
    } else if (navbar) {
      navbar.classList.remove('indicator-active');
    }
  }

  function setActiveMenu(targetTab) {
    tabs.forEach(tab => tab.classList.remove("active"));
    targetTab.classList.add("active");
    updateActiveIndicator(targetTab);
  }

  // Tab click events
  tabs.forEach(tab => {
    tab.addEventListener("click", function(e) {
      e.preventDefault();
      setActiveMenu(this);
      
      const link = this.querySelector('a');
      if (link && link.getAttribute('href').startsWith('#')) {
        const targetSection = document.getElementById(link.getAttribute('href').substring(1));
        if (targetSection) {
          targetSection.scrollIntoView({ behavior: 'smooth' });
        }
      }
    });
  });

  // Scroll-based active menu update
  function updateActiveOnScroll() {
    const scrollPos = window.scrollY + 150;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        const sectionId = section.getAttribute('id');
        const correspondingTab = document.querySelector(`.tab a[href="#${sectionId}"]`)?.parentElement;
        
        if (correspondingTab && !correspondingTab.classList.contains('active')) {
          setActiveMenu(correspondingTab);
        }
      }
    });
  }

  // ===== PROJECTS SLIDER =====
  function getCardsPerView() {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 768) return 2;
    return 1;
  }

  function updateProjectsSlider() {
    if (!projectsSlider || !projectSlides.length) return;
    
    const cardsPerView = getCardsPerView();
    const cardWidth = projectSlides[0]?.offsetWidth || 380;
    const gap = 30;
    const moveDistance = -(currentProjectSlide * (cardWidth + gap));
    
    projectsSlider.style.transform = `translateX(${moveDistance}px)`;
    
    // Update indicators
    const indicators = document.querySelectorAll('.indicator');
    indicators.forEach((indicator, index) => {
      indicator.classList.toggle('active', index === currentProjectSlide);
    });
  }

  function slideProjects(direction) {
    const cardsPerView = getCardsPerView();
    const maxSlide = Math.max(0, projectSlides.length - cardsPerView);
    
    if (direction === 'next') {
      currentProjectSlide = currentProjectSlide >= maxSlide ? 0 : currentProjectSlide + 1;
    } else {
      currentProjectSlide = currentProjectSlide <= 0 ? maxSlide : currentProjectSlide - 1;
    }
    
    updateProjectsSlider();
  }

  function startProjectAutoSlide() {
    autoSlideInterval = setInterval(() => {
      slideProjects('next');
    }, 5000);
  }

  function stopProjectAutoSlide() {
    if (autoSlideInterval) {
      clearInterval(autoSlideInterval);
    }
  }

  // ===== CERTIFICATE SLIDER =====
  function getCertificateCardsPerView() {
    if (window.innerWidth >= 1200) return 3;
    if (window.innerWidth >= 1025) return 2;
    return 1;
  }

  function updateCertificateSlider() {
    if (!certificateSlider || !certificateCards.length) return;
    
    const cardsPerView = getCertificateCardsPerView();
    
    if (window.innerWidth <= 1024) {
      const containerWidth = certificateSlider.parentElement.offsetWidth;
      const offset = currentCertificateSlide * containerWidth;
      certificateSlider.style.transform = `translateX(-${offset}px)`;
    } else {
      const cardWidth = 350;
      const gap = 30;
      const offset = currentCertificateSlide * (cardWidth + gap);
      certificateSlider.style.transform = `translateX(-${offset}px)`;
    }
    
    // Update certificate indicators
    const indicators = document.querySelectorAll('.certificate-indicator');
    const maxSlide = Math.max(0, certificateCards.length - cardsPerView);
    
    indicators.forEach((indicator, index) => {
      indicator.classList.remove('active');
      if (index <= maxSlide) {
        indicator.style.display = 'block';
        if (index === currentCertificateSlide) {
          indicator.classList.add('active');
        }
      } else {
        indicator.style.display = 'none';
      }
    });
  }

  function slideCertificates(direction) {
    const cardsPerView = getCertificateCardsPerView();
    const maxSlide = Math.max(0, certificateCards.length - cardsPerView);
    
    if (direction === 'next') {
      currentCertificateSlide = currentCertificateSlide >= maxSlide ? 0 : currentCertificateSlide + 1;
    } else {
      currentCertificateSlide = currentCertificateSlide <= 0 ? maxSlide : currentCertificateSlide - 1;
    }
    
    updateCertificateSlider();
  }

  function startCertificateAutoSlide() {
    certificateAutoSlideInterval = setInterval(() => {
      slideCertificates('next');
    }, 6000);
  }

  function stopCertificateAutoSlide() {
    if (certificateAutoSlideInterval) {
      clearInterval(certificateAutoSlideInterval);
    }
  }

  // ===== TOUCH/SWIPE HANDLERS =====
  function addSwipeSupport(element, slideFunction) {
    let startX = 0;
    let isDragging = false;
    
    element.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
      isDragging = true;
    });
    
    element.addEventListener('touchmove', (e) => {
      if (!isDragging) return;
      e.preventDefault();
    });
    
    element.addEventListener('touchend', (e) => {
      if (!isDragging) return;
      
      const endX = e.changedTouches[0].clientX;
      const diffX = startX - endX;
      
      if (Math.abs(diffX) > 50) {
        slideFunction(diffX > 0 ? 'next' : 'prev');
      }
      
      isDragging = false;
    });
  }

  // ===== HERO SECTION EFFECTS =====
  class MouseTrailEffect {
    constructor() {
      this.isActive = false;
      this.lastX = 0;
      this.lastY = 0;
      this.cursorGlow = null;
      
      if (heroSection && trailContainer && window.matchMedia('(pointer: fine)').matches) {
        this.init();
      }
    }

    init() {
      this.createCursorGlow();
      this.addEventListeners();
    }

    createCursorGlow() {
      this.cursorGlow = document.createElement('div');
      this.cursorGlow.className = 'cursor-glow';
      this.cursorGlow.style.display = 'none';
      trailContainer.appendChild(this.cursorGlow);
    }

    addEventListeners() {
      heroSection.addEventListener('mouseenter', (e) => {
        this.isActive = true;
        this.cursorGlow.style.display = 'block';
        this.updateCursorGlow(e);
      });

      heroSection.addEventListener('mouseleave', () => {
        this.isActive = false;
        this.cursorGlow.style.display = 'none';
      });

      heroSection.addEventListener('mousemove', (e) => {
        if (!this.isActive) return;
        this.updateCursorGlow(e);
        this.createTrailParticle(e);
      });
    }

    updateCursorGlow(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      this.cursorGlow.style.left = x + 'px';
      this.cursorGlow.style.top = y + 'px';
    }

    createTrailParticle(e) {
      const rect = heroSection.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const distance = Math.sqrt(Math.pow(x - this.lastX, 2) + Math.pow(y - this.lastY, 2));
      if (distance < 10) return;
      
      this.lastX = x;
      this.lastY = y;

      const particle = document.createElement('div');
      particle.className = 'trail-particle';
      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      
      trailContainer.appendChild(particle);
      
      setTimeout(() => {
        if (particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 1500);
    }
  }

  // ===== BUTTON INTERACTIONS =====
  function addRippleEffect(button, e) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 600);
  }

  // ===== CONTACT FORM =====
  function handleContactForm() {
    if (!emailInput) return;
    
    const userEmail = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!userEmail) {
      alert('Please enter your email address');
      emailInput.focus();
      return;
    }
    
    if (!emailRegex.test(userEmail)) {
      alert('Please enter a valid email address');
      emailInput.focus();
      return;
    }
    
    const recipientEmail = 'bayuwicaksono782@gmail.com';
    const subject = encodeURIComponent('Contact from Portfolio Website');
    const body = encodeURIComponent(`Hello,\n\nI would like to get in touch with you.\n\nBest regards,\n${userEmail}`);
    
    window.location.href = `mailto:${recipientEmail}?subject=${subject}&body=${body}`;
    alert('Opening your email client...');
    emailInput.value = '';
  }

  // ===== EVENT LISTENERS SETUP =====
  
  // Initialize sliders
  setTimeout(() => {
    updateProjectsSlider();
    updateCertificateSlider();
    startProjectAutoSlide();
    startCertificateAutoSlide();
    
    // Initialize active indicator
    const initialActive = document.querySelector(".tab.active");
    if (initialActive && window.innerWidth >= 1024) {
      updateActiveIndicator(initialActive);
    }
  }, 100);

  // Scroll events
  window.addEventListener('scroll', debounce(updateActiveOnScroll, 10));

  // Resize events
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 991) {
      closeMobileSidebar();
    }
    
    updateProjectsSlider();
    updateCertificateSlider();
    
    const activeTab = document.querySelector(".tab.active");
    if (activeTab && window.innerWidth >= 1024) {
      updateActiveIndicator(activeTab);
    } else if (navbar) {
      navbar.classList.remove('indicator-active');
    }
  }, 100));

  // Global click events
  document.addEventListener('click', function(e) {
    // Close mobile sidebar when clicking outside
    if (window.innerWidth <= 991 && 
        mobileNavMenu && 
        mobileNavMenu.classList.contains('active') &&
        !mobileNavMenu.contains(e.target) && 
        !hamburger.contains(e.target)) {
      closeMobileSidebar();
    }
  });

  // Keyboard events
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeMobileSidebar();
    }
    
    // Certificate slider keyboard navigation
    const certificateSection = document.querySelector('.certificate');
    if (certificateSection) {
      const rect = certificateSection.getBoundingClientRect();
      const isInView = rect.top < window.innerHeight && rect.bottom > 0;
      
      if (isInView) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          slideCertificates('prev');
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          slideCertificates('next');
        }
      }
    }
  });

  // Button click events
  if (portfolioBtn) {
    portfolioBtn.addEventListener('click', function() {
      const projectSection = document.getElementById('work') || document.getElementById('project');
      if (projectSection) {
        projectSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  if (hireBtn) {
    hireBtn.addEventListener('click', function() {
      const contactSection = document.getElementById('contact');
      if (contactSection) {
        contactSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.open('https://api.whatsapp.com/send/?phone=%2B6285252171114&text&type=phone_number&app_absent=0', '_blank');
      }
    });
  }

  if (emailInput) {
    emailInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleContactForm();
      }
    });
  }

  // Glass button ripple effects
  const glassButtons = document.querySelectorAll('.btn-glass-orange, .btn-glass-transparent');
  glassButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      addRippleEffect(this, e);
    });
  });

  // Hover pause for sliders
  const projectsSection = document.querySelector('.projects-section');
  const certificateSection = document.querySelector('.certificate');
  
  if (projectsSection) {
    projectsSection.addEventListener('mouseenter', stopProjectAutoSlide);
    projectsSection.addEventListener('mouseleave', startProjectAutoSlide);
  }
  
  if (certificateSection) {
    certificateSection.addEventListener('mouseenter', stopCertificateAutoSlide);
    certificateSection.addEventListener('mouseleave', startCertificateAutoSlide);
  }

  // Add swipe support for sliders
  if (projectsSlider) {
    addSwipeSupport(projectsSlider, slideProjects);
  }
  
  if (certificateSlider) {
    addSwipeSupport(certificateSlider, slideCertificates);
  }

  // 3D Tilt Effect for elements
  const tiltElements = document.querySelectorAll('[data-tilt]');
  tiltElements.forEach(element => {
    const innerElement = element.querySelector('.hero-image-inner, .service-card-inner');
    if (!innerElement) return;
    
    element.addEventListener('mousemove', (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const sensitivity = element.classList.contains('hero-image-center') ? 15 : 25;
      const rotateX = (y - centerY) / sensitivity;
      const rotateY = (centerX - x) / sensitivity;
      
      innerElement.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    element.addEventListener('mouseleave', () => {
      innerElement.style.transform = 'rotateX(0deg) rotateY(0deg)';
    });
  });

  // Initialize mouse trail effect
  new MouseTrailEffect();

  // Make functions globally available for HTML onclick attributes
  window.slideProjects = slideProjects;
  window.slideCertificates = slideCertificates;
  window.goToCertificateSlide = (index) => {
    const cardsPerView = getCertificateCardsPerView();
    const maxSlide = Math.max(0, certificateCards.length - cardsPerView);
    currentCertificateSlide = Math.min(index, maxSlide);
    updateCertificateSlider();
  };
  window.handleContactForm = handleContactForm;
});

// ===== CSS ANIMATIONS FOR RIPPLE EFFECT =====
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    from {
      transform: scale(0);
      opacity: 1;
    }
    to {
      transform: scale(2);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);
