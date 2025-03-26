document.addEventListener('DOMContentLoaded', function() {
  // Global state
  const state = {
    services: [],
    currentUser: null,
    selectedService: null,
    bookingDate: null,
    bookingTime: null
  };

  // DOM Elements
  const navLinks = document.querySelectorAll('nav ul li a');
  const pages = document.querySelectorAll('.page');
  const loginBtn = document.getElementById('login-btn');
  const signupBtn = document.getElementById('signup-btn');
  const profileLink = document.getElementById('profile-link');
  const userInfo = document.getElementById('user-info');
  const userName = document.getElementById('user-name');
  const starsCount = document.getElementById('stars-count');
  const heroBookBtn = document.getElementById('hero-book-btn');
  const loginModal = document.getElementById('login-modal');
  const signupModal = document.getElementById('signup-modal');
  const paymentModal = document.getElementById('payment-modal');
  const successModal = document.getElementById('success-modal');
  const closeButtons = document.querySelectorAll('.close');
  const switchToSignup = document.getElementById('switch-to-signup');
  const switchToLogin = document.getElementById('switch-to-login');
  const loginForm = document.getElementById('login-form');
  const signupForm = document.getElementById('signup-form');
  const paymentForm = document.getElementById('payment-form');
  const serviceSelect = document.getElementById('service-select');
  const bookingDate = document.getElementById('booking-date');
  const bookingTime = document.getElementById('booking-time');
  const serviceDetails = document.getElementById('service-details');
  const detailName = document.getElementById('detail-name');
  const detailDescription = document.getElementById('detail-description');
  const detailDuration = document.getElementById('detail-duration');
  const detailPrice = document.getElementById('detail-price');
  const detailStars = document.getElementById('detail-stars');
  const bookServiceBtn = document.getElementById('book-service-btn');
  const paymentService = document.getElementById('payment-service');
  const paymentDate = document.getElementById('payment-date');
  const paymentTime = document.getElementById('payment-time');
  const paymentPrice = document.getElementById('payment-price');
  const paymentStars = document.getElementById('payment-stars');
  const viewProfileBtn = document.getElementById('view-profile-btn');
  const profileName = document.getElementById('profile-name');
  const profileEmail = document.getElementById('profile-email');
  const profileStarsCount = document.getElementById('profile-stars-count');
  const appointmentsList = document.getElementById('appointments-list');
  const noAppointments = document.getElementById('no-appointments');
  const servicesContainer = document.querySelector('.services-container');

  // Set min date for booking to today
  const today = new Date();
  const formattedDate = today.toISOString().split('T')[0];
  bookingDate.min = formattedDate;

  // Navigation
  function navigateTo(pageId) {
    pages.forEach(page => {
      page.classList.remove('active');
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('data-page') === pageId) {
        link.classList.add('active');
      }
    });
    
    document.getElementById(pageId).classList.add('active');
  }

  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      const pageId = this.getAttribute('data-page');
      navigateTo(pageId);
    });
  });

  // Modal functionality
  function openModal(modal) {
    modal.style.display = 'block';
  }

  function closeModal(modal) {
    modal.style.display = 'none';
  }

  function closeAllModals() {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
      closeModal(modal);
    });
  }

  loginBtn.addEventListener('click', () => openModal(loginModal));
  signupBtn.addEventListener('click', () => openModal(signupModal));
  heroBookBtn.addEventListener('click', () => {
    navigateTo('booking');
    window.scrollTo(0, 0);
  });

  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      closeAllModals();
    });
  });

  window.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeAllModals();
    }
  });

  switchToSignup.addEventListener('click', function(e) {
    e.preventDefault();
    closeModal(loginModal);
    openModal(signupModal);
  });

  switchToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    closeModal(signupModal);
    openModal(loginModal);
  });

  viewProfileBtn.addEventListener('click', function() {
    closeAllModals();
    navigateTo('profile');
  });

  // Fetch services from API
  async function fetchServices() {
    try {
      const response = await fetch('/api/services');
      const data = await response.json();
      state.services = data;
      populateServices();
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  }

  // Populate services on the services page
  function populateServices() {
    // Clear existing services
    servicesContainer.innerHTML = '';
    
    // Create service cards
    state.services.forEach(service => {
      const serviceCard = document.createElement('div');
      serviceCard.classList.add('service-card');
      
      // Set image based on tier
      let imageUrl;
      if (service.tier === 'Basic') {
        imageUrl = 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'; // Economy car
      } else if (service.tier === 'Premium') {
        imageUrl = 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'; // Luxury sedan
      } else {
        imageUrl = 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80'; // Sports car
      }
      
      serviceCard.innerHTML = `
        <div class="service-image" style="background-image: url('${imageUrl}')"></div>
        <div class="service-content">
          <span class="service-tier tier-${service.tier}">${service.tier}</span>
          <h3 class="service-title">${service.name}</h3>
          <p class="service-description">${service.description}</p>
          <div class="service-details-row">
            <span class="service-price">$${service.price.toFixed(2)}</span>
            <span class="service-duration">${service.duration}</span>
          </div>
          <button class="btn btn-primary book-now-btn" data-service-id="${service.id}">Book Now</button>
        </div>
      `;
      
      servicesContainer.appendChild(serviceCard);
    });
    
    // Add event listeners to book now buttons
    const bookNowButtons = document.querySelectorAll('.book-now-btn');
    bookNowButtons.forEach(button => {
      button.addEventListener('click', function() {
        const serviceId = parseInt(this.getAttribute('data-service-id'));
        const service = state.services.find(s => s.id === serviceId);
        
        // Select the service in the booking form
        serviceSelect.value = serviceId;
        updateServiceDetails(service);
        
        // Navigate to booking page
        navigateTo('booking');
        window.scrollTo(0, 0);
      });
    });
    
    // Populate service select dropdown
    serviceSelect.innerHTML = '<option value="">-- Select a Service --</option>';
    state.services.forEach(service => {
      const option = document.createElement('option');
      option.value = service.id;
      option.textContent = `${service.name} - $${service.price.toFixed(2)}`;
      serviceSelect.appendChild(option);
    });
  }

  // Update service details in booking form
  function updateServiceDetails(service) {
    if (service) {
      state.selectedService = service;
      serviceDetails.classList.remove('hidden');
      detailName.textContent = service.name;
      detailDescription.textContent = service.description;
      detailDuration.textContent = service.duration;
      detailPrice.textContent = service.price.toFixed(2);
      detailStars.textContent = Math.floor(service.price * 10); // 10 stars per dollar
    } else {
      state.selectedService = null;
      serviceDetails.classList.add('hidden');
    }
  }

  // Service select change handler
  serviceSelect.addEventListener('change', function() {
    const serviceId = parseInt(this.value);
    const service = state.services.find(s => s.id === serviceId);
    updateServiceDetails(service);
  });

  // Booking date and time change handlers
  bookingDate.addEventListener('change', function() {
    state.bookingDate = this.value;
  });

  bookingTime.addEventListener('change', function() {
    state.bookingTime = this.value;
  });

  // Book service button click handler
  bookServiceBtn.addEventListener('click', function() {
    if (!state.selectedService) {
      alert('Please select a service');
      return;
    }
    
    if (!state.bookingDate) {
      alert('Please select a date');
      return;
    }
    
    if (!state.bookingTime) {
      alert('Please select a time');
      return;
    }
    
    if (!state.currentUser) {
      alert('Please login to book a service');
      openModal(loginModal);
      return;
    }
    
    // Show payment modal
    paymentService.textContent = state.selectedService.name;
    paymentDate.textContent = formatDate(state.bookingDate);
    paymentTime.textContent = formatTime(state.bookingTime);
    paymentPrice.textContent = state.selectedService.price.toFixed(2);
    paymentStars.textContent = Math.floor(state.selectedService.price * 10); // 10 stars per dollar
    
    openModal(paymentModal);
  });

  // Payment form submit handler
  paymentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // In a real app, we would process payment here
    
    // Create appointment
    createAppointment();
  });

  // Create appointment
  async function createAppointment() {
    try {
      const appointmentData = {
        userId: state.currentUser.id,
        serviceId: state.selectedService.id,
        date: `${state.bookingDate}T${state.bookingTime}:00`
      };
      
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(appointmentData)
      });
      
      const data = await response.json();
      
      if (data.success) {
        // Update user stars (10 stars per dollar)
        state.currentUser.stars += Math.floor(state.selectedService.price * 10);
        updateUserInfo();
        
        // Show success modal
        closeModal(paymentModal);
        openModal(successModal);
        
        // Reset booking form
        serviceSelect.value = '';
        bookingDate.value = '';
        bookingTime.value = '';
        updateServiceDetails(null);
        
        // Fetch user data to update appointments
        fetchUserData();
      } else {
        alert('Error creating appointment');
      }
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Error creating appointment');
    }
  }

  // Login form submit handler
  loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    login(email, password);
  });

  // Signup form submit handler
  signupForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const confirm = document.getElementById('signup-confirm').value;
    
    if (password !== confirm) {
      alert('Passwords do not match');
      return;
    }
    
    signup(name, email, password);
  });

  // Login function
  async function login(email, password) {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        state.currentUser = data.user;
        updateUserInfo();
        closeModal(loginModal);
        
        // Clear login form
        loginForm.reset();
        
        // Fetch user data
        fetchUserData();
      } else {
        alert('Invalid credentials');
      }
    } catch (error) {
      console.error('Error logging in:', error);
      alert('Error logging in');
    }
  }

  // Signup function
  async function signup(name, email, password) {
    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (data.success) {
        state.currentUser = data.user;
        updateUserInfo();
        closeModal(signupModal);
        
        // Clear signup form
        signupForm.reset();
        
        // Show welcome message
        alert(`Welcome to ShineTime, ${name}! Your account has been created successfully.`);
        
        // Fetch user data
        fetchUserData();
      } else {
        alert(data.message || 'Error signing up');
      }
    } catch (error) {
      console.error('Error signing up:', error);
      alert('Error signing up');
    }
  }

  // Update user info in header
  function updateUserInfo() {
    if (state.currentUser) {
      loginBtn.classList.add('hidden');
      signupBtn.classList.add('hidden');
      userInfo.classList.remove('hidden');
      userName.textContent = state.currentUser.name;
      starsCount.textContent = state.currentUser.stars;
    } else {
      loginBtn.classList.remove('hidden');
      signupBtn.classList.remove('hidden');
      userInfo.classList.add('hidden');
    }
  }

  // Fetch user data
  async function fetchUserData() {
    if (!state.currentUser) return;
    
    try {
      const response = await fetch(`/api/user/${state.currentUser.id}`);
      const userData = await response.json();
      
      // Update profile page
      profileName.textContent = userData.name;
      profileEmail.textContent = userData.email;
      profileStarsCount.textContent = userData.stars;
      
      // Update appointments list
      updateAppointmentsList(userData.appointments);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }

  // Update appointments list
  function updateAppointmentsList(appointments) {
    if (!appointments || appointments.length === 0) {
      noAppointments.classList.remove('hidden');
      return;
    }
    
    noAppointments.classList.add('hidden');
    appointmentsList.innerHTML = '';
    
    appointments.forEach(appointment => {
      const service = state.services.find(s => s.id === appointment.serviceId);
      if (!service) return;
      
      const appointmentDate = new Date(appointment.date);
      
      const appointmentCard = document.createElement('div');
      appointmentCard.classList.add('appointment-card');
      appointmentCard.innerHTML = `
        <div class="appointment-header">
          <span class="appointment-service">${service.name}</span>
          <span class="appointment-status">${appointment.status}</span>
        </div>
        <div class="appointment-details">
          <span class="appointment-date">${formatDate(appointmentDate.toISOString().split('T')[0])}</span>
          <span class="appointment-time">${formatTime(appointmentDate.toTimeString().split(' ')[0].substring(0, 5))}</span>
        </div>
      `;
      
      appointmentsList.appendChild(appointmentCard);
    });
  }

  // Helper functions
  function formatDate(dateString) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }

  function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${minutes} ${ampm}`;
  }

  // Initialize app
  fetchServices();

  // For testing purposes, we'll comment out the auto-login
  // setTimeout(() => {
  //   login('demo@example.com', 'password123');
  // }, 1000);
});
