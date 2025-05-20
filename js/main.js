document.addEventListener('DOMContentLoaded', function() {
  // Initialize AOS animation library
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true
  });

  // Mobile menu toggle
  const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
  const navList = document.querySelector('.nav-list');

  if (mobileMenuToggle && navList) {
    mobileMenuToggle.addEventListener('click', function() {
      navList.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });
  }

  // Testimonial slider
  const testimonialsSlider = document.querySelector('.testimonials-slider');
  const testimonials = document.querySelectorAll('.testimonial');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.testimonial-prev');
  const nextBtn = document.querySelector('.testimonial-next');

  if (testimonialsSlider && testimonials.length) {
    let currentSlide = 0;
    const slideCount = testimonials.length;
    
    function goToSlide(index) {
      if (index < 0) {
        currentSlide = slideCount - 1;
      } else if (index >= slideCount) {
        currentSlide = 0;
      } else {
        currentSlide = index;
      }
      
      testimonialsSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
      
      // Update dots
      if (dots.length) {
        dots.forEach((dot, i) => {
          dot.classList.toggle('active', i === currentSlide);
        });
      }
    }
    
    // Add event listeners for navigation
    if (prevBtn) {
      prevBtn.addEventListener('click', () => {
        goToSlide(currentSlide - 1);
      });
    }
    
    if (nextBtn) {
      nextBtn.addEventListener('click', () => {
        goToSlide(currentSlide + 1);
      });
    }
    
    // Add event listeners for dots
    if (dots.length) {
      dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
          goToSlide(i);
        });
      });
    }
    
    // Auto-scroll
    let interval = setInterval(() => {
      goToSlide(currentSlide + 1);
    }, 5000);
    
    // Pause auto-scroll on hover
    testimonialsSlider.addEventListener('mouseenter', () => {
      clearInterval(interval);
    });
    
    testimonialsSlider.addEventListener('mouseleave', () => {
      interval = setInterval(() => {
        goToSlide(currentSlide + 1);
      }, 5000);
    });
  }

  // FAQ toggles
  const faqQuestions = document.querySelectorAll('.faq-question');
  
  if (faqQuestions.length) {
    faqQuestions.forEach(question => {
      question.addEventListener('click', () => {
        const faqItem = question.parentElement;
        const isActive = faqItem.classList.contains('active');
        
        // Close all FAQs
        document.querySelectorAll('.faq-item').forEach(item => {
          item.classList.remove('active');
        });
        
        // If the clicked item wasn't active, make it active
        if (!isActive) {
          faqItem.classList.add('active');
        }
        
        // Toggle the plus/minus icon
        const icon = question.querySelector('.faq-toggle i');
        document.querySelectorAll('.faq-toggle i').forEach(i => {
          i.classList.remove('fa-minus');
          i.classList.add('fa-plus');
        });
        
        if (!isActive) {
          icon.classList.remove('fa-plus');
          icon.classList.add('fa-minus');
        }
      });
    });
  }

  // Smooth scroll for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      if (this.getAttribute('href') !== '#') {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
          // Close mobile menu if open
          if (navList && navList.classList.contains('active')) {
            navList.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
          
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Adjust for header height
            behavior: 'smooth'
          });
        }
      }
    });
  });
});