document.addEventListener('DOMContentLoaded', function() {
  const countdownElements = document.querySelectorAll('.countdown');
  
  if (countdownElements.length) {
    countdownElements.forEach(countdown => {
      const endDate = countdown.dataset.endDate;
      if (!endDate) return;
      
      const endDateObj = new Date(endDate);
      
      function updateCountdown() {
        const now = new Date();
        const timeLeft = endDateObj - now;
        
        if (timeLeft <= 0) {
          // Countdown is over
          countdown.innerHTML = `<div class="countdown-ended">Offre terminée</div>`;
          return;
        }
        
        // Calculate time units
        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        // Update days
        const daysElement = countdown.querySelector('.days');
        if (daysElement) {
          daysElement.textContent = days.toString().padStart(2, '0');
        }
        
        // Update hours
        const hoursElement = countdown.querySelector('.hours');
        if (hoursElement) {
          hoursElement.textContent = hours.toString().padStart(2, '0');
        }
        
        // Update minutes
        const minutesElement = countdown.querySelector('.minutes');
        if (minutesElement) {
          minutesElement.textContent = minutes.toString().padStart(2, '0');
        }
        
        // Update seconds
        const secondsElement = countdown.querySelector('.seconds');
        if (secondsElement) {
          secondsElement.textContent = seconds.toString().padStart(2, '0');
        }
      }
      
      // Initialize countdown
      updateCountdown();
      
      // Update every second
      setInterval(updateCountdown, 1000);
    });
  }
});