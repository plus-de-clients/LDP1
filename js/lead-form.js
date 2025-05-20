document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('lead-form');
  if (!form) return;
  
  const optionButtons = document.querySelectorAll('.option-btn');
  const formSteps = document.querySelectorAll('.form-step');
  
  // Store form data
  const formData = {
    step1Answer: '',
    step2Answer: '',
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    entreprise: ''
  };

  // Validate phone number
  function isValidPhone(phone) {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
    return phoneRegex.test(phone);
  }

  // Validate email
  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Function to scroll form into view
  function scrollFormIntoView() {
    const formContainer = document.querySelector('.form-container');
    if (formContainer) {
      formContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

  // Function to transition between steps
  function transitionToStep(currentStep, nextStep) {
    currentStep.style.opacity = '0';
    setTimeout(() => {
      currentStep.classList.remove('active');
      if (nextStep) {
        nextStep.classList.add('active');
        nextStep.style.opacity = '0';
        requestAnimationFrame(() => {
          nextStep.style.opacity = '1';
          scrollFormIntoView();
        });
      }
    }, 300);
  }
  
  // Handle option button clicks
  optionButtons.forEach(button => {
    button.addEventListener('click', function() {
      const currentStep = this.closest('.form-step');
      const currentStepNum = parseInt(currentStep.dataset.step);
      const value = this.dataset.value;
      
      // Remove active class from all buttons in current step
      currentStep.querySelectorAll('.option-btn').forEach(btn => {
        btn.classList.remove('active');
      });
      
      // Add active class to clicked button
      this.classList.add('active');
      
      // Store answer
      if (currentStepNum === 1) {
        formData.step1Answer = value;
        
        // Determine next step based on answer
        let nextStep;
        if (value === 'Oui') {
          nextStep = document.querySelector('.form-step[data-step="2"]');
        } else if (value === 'Non') {
          nextStep = document.querySelector('.form-step[data-step="non"]');
        } else {
          nextStep = document.querySelector('.form-step[data-step="explanation"]');
        }
        
        transitionToStep(currentStep, nextStep);
      } else if (currentStepNum === 2) {
        formData.step2Answer = value;
        const nextStep = document.querySelector('.form-step[data-step="3"]');
        transitionToStep(currentStep, nextStep);
      }
    });
  });

  // Handle "Next" button in explanation step
  const explanationNextBtns = document.querySelectorAll('.explanation-next');
  if (explanationNextBtns) {
    explanationNextBtns.forEach(btn => {
      btn.addEventListener('click', function() {
        const currentStep = this.closest('.form-step');
        const firstStep = document.querySelector('.form-step[data-step="1"]');
        transitionToStep(currentStep, firstStep);
      });
    });
  }
  
  // Handle form submission
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form input values
    const nom = document.getElementById('nom').value.trim();
    const prenom = document.getElementById('prenom').value.trim();
    const email = document.getElementById('email').value.trim();
    const telephone = document.getElementById('telephone').value.trim();
    const entreprise = document.getElementById('entreprise').value.trim();
    const secteur = formData.step2Answer;

    // Validate inputs
    let hasError = false;
    const inputs = form.querySelectorAll('input[required]');
    inputs.forEach(input => {
      input.classList.remove('error');
      if (!input.value.trim()) {
        input.classList.add('error');
        hasError = true;
      }
    });

    // Specific validations
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('telephone');

    if (!isValidEmail(email)) {
      emailInput.classList.add('error');
      hasError = true;
    }

    if (!isValidPhone(telephone)) {
      phoneInput.classList.add('error');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    // Update form data
    Object.assign(formData, { nom, prenom, email, telephone, entreprise });
    
    try {
      // Add loading state
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Envoi en cours...';
      
      // Send data to webhook
      const response = await fetch('https://hook.eu1.make.com/nxf5opb0999i0u2xyx9lt1uabldb3znw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          nom,
          prenom,
          email,
          telephone,
          entreprise,
          secteur
        })
      });

      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      // Show success message with smooth scroll
      const step3 = document.querySelector('.form-step[data-step="3"]');
      step3.style.opacity = '0';
      setTimeout(() => {
        step3.classList.remove('active');
        
        const successStep = document.querySelector('.form-step[data-step="success"]');
        successStep.classList.add('active');
        successStep.style.opacity = '0';
        
        // Scroll the form into view
        scrollFormIntoView();
        
        requestAnimationFrame(() => {
          successStep.style.opacity = '1';
        });
      }, 300);
      
      // Reset form after delay
      setTimeout(() => {
        // Reset form data
        Object.keys(formData).forEach(key => {
          formData[key] = '';
        });
        
        // Reset form inputs
        form.reset();
        
        // Reset button state
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
        
        // Remove all active classes from option buttons
        optionButtons.forEach(btn => btn.classList.remove('active'));
        
        // Hide success message with fade out
        const successStep = document.querySelector('.form-step[data-step="success"]');
        successStep.style.opacity = '0';
        setTimeout(() => {
          successStep.classList.remove('active');
          
          // Show first step with fade in
          const firstStep = document.querySelector('.form-step[data-step="1"]');
          firstStep.classList.add('active');
          firstStep.style.opacity = '0';
          requestAnimationFrame(() => {
            firstStep.style.opacity = '1';
          });
        }, 300);
      }, 5000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      alert('Une erreur est survenue. Veuillez réessayer plus tard.');
      
      // Reset button state
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
  
  // Add validation for required fields
  const requiredInputs = form.querySelectorAll('input[required]');
  requiredInputs.forEach(input => {
    input.addEventListener('invalid', function(e) {
      e.preventDefault();
      this.classList.add('error');
    });
    
    input.addEventListener('input', function() {
      this.classList.remove('error');
      
      // Validate specific fields on input
      if (this.type === 'email') {
        if (!isValidEmail(this.value)) {
          this.classList.add('error');
        }
      } else if (this.id === 'telephone') {
        if (!isValidPhone(this.value)) {
          this.classList.add('error');
        }
      }
    });
  });
});