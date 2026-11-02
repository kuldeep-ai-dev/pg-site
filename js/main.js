/**
 * VIDYA RESIDENCY AND PG - MAIN JAVASCRIPT
 * Interactive controls for Splash screen, Weekly Menu switcher, Modal, and WhatsApp integration.
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. SPLASH SCREEN LOGIC
     ========================================================================== */
  const splashScreen = document.getElementById('splash-screen');
  const skipSplashBtn = document.getElementById('skip-splash-btn');
  const replaySplashBtn = document.getElementById('replay-splash-btn');

  function dismissSplash() {
    if (!splashScreen) return;
    splashScreen.classList.add('fade-out');
    setTimeout(() => {
      splashScreen.style.display = 'none';
    }, 600);
  }

  // Auto dismiss after 2.0 seconds
  const splashTimeout = setTimeout(() => {
    dismissSplash();
  }, 2000);

  // Skip button click
  if (skipSplashBtn) {
    skipSplashBtn.addEventListener('click', () => {
      clearTimeout(splashTimeout);
      dismissSplash();
    });
  }

  // Replay splash screen (from footer)
  if (replaySplashBtn) {
    replaySplashBtn.addEventListener('click', () => {
      if (!splashScreen) return;
      splashScreen.style.display = 'flex';
      splashScreen.classList.remove('fade-out');
      
      // Re-trigger animation
      const progressBar = splashScreen.querySelector('.splash-progress');
      if (progressBar) {
        progressBar.style.animation = 'none';
        void progressBar.offsetWidth; // trigger reflow
        progressBar.style.animation = 'progressFill 1.8s ease-in-out forwards';
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });

      setTimeout(() => {
        dismissSplash();
      }, 2200);
    });
  }

  /* ==========================================================================
     2. WEEKLY MESS MENU DATA & SWITCHER
     ========================================================================== */
  const weeklyMenu = {
    monday: {
      dayName: "Monday",
      tagline: "Start the week with high-energy nutrition",
      breakfast: "Hot Stuffed Aloo Paratha, Fresh Curd, Mixed Pickle & Steaming Milk Tea / Black Tea",
      lunch: "Steamed Rice, Yellow Dal Tadka, Seasonal Mixed Vegetable Sabji, Crispy Papad & Fresh Salad",
      snack: "Special Ginger Chai / Black Tea served with Fresh Crunchy Biscuits & Light Evening Snack",
      dinner: "Fresh Soft Tawa Rotis, Paneer Butter Masala (Veg) / Egg Curry Option, Jeera Rice & Dal Fry",
      isSpecial: false
    },
    tuesday: {
      dayName: "Tuesday",
      tagline: "Healthy grains, protein-rich lentils & fresh greens",
      breakfast: "Vegetable Poha with roasted peanuts, fresh lemon, green chillies & Hot Tea",
      lunch: "Steamed Rice, Punjabi Rajma Masala, Aloo Gobi Bhaji, Fresh Cucumber Salad & Lemon",
      snack: "Cardamom Masala Tea with Crispy Roasted Namkeen / Murmura Mixture",
      dinner: "Soft Whole-Wheat Rotis, Matar Mushroom / Egg Bhurji, Dal Tadka & Steamed Rice",
      isSpecial: false
    },
    wednesday: {
      dayName: "Wednesday",
      tagline: "Midweek student feast with non-veg / special paneer options",
      breakfast: "Puri Sabji with spicy Chana Masala / Halwa + Fresh Hot Milk Tea",
      lunch: "Steamed Basmati Rice, Masoor Dal, Begun Bhaja (Eggplant Fry) & Seasonal Mixed Greens",
      snack: "Hot Spiced Tea with fresh butter biscuits or bakery rusks",
      dinner: "Special Chicken Curry / Shahi Paneer (Pure Veg), Soft Tawa Rotis, Jeera Rice & Dal",
      isSpecial: true
    },
    thursday: {
      dayName: "Thursday",
      tagline: "Light, digestible & comforting preparation for long study sessions",
      breakfast: "Vegetable Suji Upma / Cheela with Mint Coriander Chutney & Hot Tea",
      lunch: "Steamed Rice, Chana Dal with coconut tadka, Aloo Potol / Karela Crispy Fry, Salad",
      snack: "Hot Tea with healthy roasted chana or sweet biscuits",
      dinner: "Soft Phulkas, Dal Makhani style slow-cooked lentils, Jeera Aloo & Steamed Rice",
      isSpecial: false
    },
    friday: {
      dayName: "Friday",
      tagline: "Assam freshwater fish special / rich paneer curry",
      breakfast: "Steamed Idli with Sambar / Toasted Bread with butter & Hot Tea",
      lunch: "Steamed Rice, Fresh Local Fish Curry (Assam river fish) / Kadhai Paneer (Veg), Mixed Dal & Salad",
      snack: "Refreshing Lemon Tea / Milk Chai with crunchy tea-time snacks",
      dinner: "Soft Rotis, Soybean Badi Masala Curry, Steamed Rice & Dal Fry",
      isSpecial: true
    },
    saturday: {
      dayName: "Saturday",
      tagline: "Weekend flavors to relax and recharge after weekly tests",
      breakfast: "Spiced Masala Puri with Aloo Curry + Hot Tea",
      lunch: "Steamed Rice, Roasted Moong Dal, Seasonal Green Saag & Aloo Posto / Fry",
      snack: "Masala Chai with fresh savory snacks",
      dinner: "Fragrant Vegetable Pulao / Fried Rice, Dal Tadka, Soft Rotis & Paneer/Egg Masala",
      isSpecial: false
    },
    sunday: {
      dayName: "Sunday (Grand Feast)",
      tagline: "Grand Weekend Feast: Special royal meal & sweet dish",
      breakfast: "Chole Bhature / Stuffed Kachoris with Sweet & Special Masala Tea",
      lunch: "Grand Sunday Feast: Special Dum Biryani / Khichdi, Chicken Masala / Rich Shahi Paneer, Cooling Raita, Papad & Gulab Jamun Sweet",
      snack: "Special Filter Coffee / Tea with Crispy Hot Samosa or Pakora",
      dinner: "Soft Tawa Rotis, Rich Mixed Vegetable Sabzi, Dal Tadka, Steamed Rice & Homemade Kheer",
      isSpecial: true
    }
  };

  const dayTabs = document.querySelectorAll('.day-tab');
  const currentDayLabel = document.getElementById('current-day-label');
  const currentDayTitle = document.getElementById('current-day-title');
  const breakfastText = document.getElementById('meal-breakfast-text');
  const lunchText = document.getElementById('meal-lunch-text');
  const snackText = document.getElementById('meal-snack-text');
  const dinnerText = document.getElementById('meal-dinner-text');

  function renderDayMenu(dayKey) {
    const data = weeklyMenu[dayKey];
    if (!data) return;

    // Update active tab styles
    dayTabs.forEach(tab => {
      if (tab.dataset.day === dayKey) {
        tab.classList.add('active');
        tab.setAttribute('aria-selected', 'true');
      } else {
        tab.classList.remove('active');
        tab.setAttribute('aria-selected', 'false');
      }
    });

    // Update Text
    if (currentDayLabel) currentDayLabel.textContent = data.isSpecial ? `${data.dayName} • Special Menu` : `${data.dayName}'s Menu`;
    if (currentDayTitle) currentDayTitle.textContent = `${data.dayName} Menu — ${data.tagline}`;
    if (breakfastText) breakfastText.textContent = data.breakfast;
    if (lunchText) lunchText.textContent = data.lunch;
    if (snackText) snackText.textContent = data.snack;
    if (dinnerText) dinnerText.textContent = data.dinner;

    // Subtle re-fade animation
    const card = document.getElementById('day-menu-card');
    if (card) {
      card.style.animation = 'none';
      void card.offsetWidth;
      card.style.animation = 'fadeInMenu 0.3s ease-out';
    }
  }

  // Determine today's day of the week
  const daysMap = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayIndex = new Date().getDay();
  const currentDayKey = daysMap[todayIndex];

  // Initialize with today's day (or default to monday)
  renderDayMenu(currentDayKey || 'monday');

  // Add click listeners to day tabs
  dayTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      renderDayMenu(tab.dataset.day);
    });
  });

  // Toggle Full 7-Day Table View
  const toggleTableBtn = document.getElementById('toggle-full-table-btn');
  const fullMenuTable = document.getElementById('full-menu-table');
  const fullTableBtnText = document.getElementById('full-table-btn-text');

  if (toggleTableBtn && fullMenuTable) {
    toggleTableBtn.addEventListener('click', () => {
      const isHidden = fullMenuTable.style.display === 'none';
      if (isHidden) {
        fullMenuTable.style.display = 'block';
        fullTableBtnText.textContent = 'Hide 7-Day Menu Schedule';
      } else {
        fullMenuTable.style.display = 'none';
        fullTableBtnText.textContent = 'View Full 7-Day Menu Schedule';
      }
    });
  }

  /* ==========================================================================
     3. MOBILE NAVBAR TOGGLE
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      navMenu.classList.toggle('open');
    });

    // Close when clicking nav links
    const navLinks = navMenu.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
      });
    });
  }

  /* ==========================================================================
     4. FAQ ACCORDION
     ========================================================================== */
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    const toggleIcon = item.querySelector('.faq-toggle-icon');

    if (questionBtn) {
      questionBtn.addEventListener('click', () => {
        const isActive = item.classList.contains('active');

        // Close other items
        faqItems.forEach(otherItem => {
          otherItem.classList.remove('active');
          const otherBtn = otherItem.querySelector('.faq-question');
          const otherIcon = otherItem.querySelector('.faq-toggle-icon');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherIcon) otherIcon.textContent = '+';
        });

        // Toggle current
        if (!isActive) {
          item.classList.add('active');
          questionBtn.setAttribute('aria-expanded', 'true');
          if (toggleIcon) toggleIcon.textContent = '−';
        } else {
          item.classList.remove('active');
          questionBtn.setAttribute('aria-expanded', 'false');
          if (toggleIcon) toggleIcon.textContent = '+';
        }
      });
    }
  });

  /* ==========================================================================
     5. MODAL LOGIC (BOOKING / INQUIRY)
     ========================================================================== */
  const modal = document.getElementById('enquiry-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const openModalButtons = document.querySelectorAll('.open-modal-btn');
  const modalForm = document.getElementById('modal-form');

  function openModal() {
    if (!modal) return;
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  openModalButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openModal();
    });
  });

  if (modalCloseBtn) {
    modalCloseBtn.addEventListener('click', closeModal);
  }

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.style.display === 'flex') {
        closeModal();
      }
    });
  }

  // Handle Modal Form Submission to WhatsApp
  if (modalForm) {
    modalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('m-name')?.value.trim();
      const phone = document.getElementById('m-phone')?.value.trim();
      const school = document.getElementById('m-school')?.value;
      const room = document.getElementById('m-room')?.value;

      const message = `Hello Vidya Residency and PG! I would like to inquire about admission:
• Student Name: ${name}
• Phone: ${phone}
• Institution: ${school}
• Room Preference: ${room}
Please let me know room availability and fee details.`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/919954507356?text=${encodedMessage}`;
      
      closeModal();
      window.open(waUrl, '_blank');
    });
  }

  /* ==========================================================================
     6. MAIN LANDING ENQUIRY FORM TO WHATSAPP
     ========================================================================== */
  const landingForm = document.getElementById('landing-enquiry-form');
  if (landingForm) {
    landingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('student-name')?.value.trim();
      const phone = document.getElementById('student-phone')?.value.trim();
      const school = document.getElementById('student-institution')?.value;
      const room = document.getElementById('room-preference')?.value;
      const moveIn = document.getElementById('move-in-date')?.value.trim();
      const notes = document.getElementById('enquiry-notes')?.value.trim();

      const message = `Hello Vidya Residency and PG!
I would like to inquire about hostel admission:
• Student Name: ${name}
• Phone: ${phone}
• School / College: ${school}
• Preferred Sharing: ${room}
• Joining Timeline: ${moveIn || 'Immediate'}
${notes ? `• Additional Note: ${notes}` : ''}

Please share room availability, monthly charges, and admission procedure.`;

      const encodedMessage = encodeURIComponent(message);
      const waUrl = `https://wa.me/919954507356?text=${encodedMessage}`;

      window.open(waUrl, '_blank');
    });
  }

  // Update current year dynamically in footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

});
