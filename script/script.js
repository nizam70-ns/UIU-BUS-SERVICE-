// Global State Tracking
const maxAllowedSeats = 4;
let availableSeat = 40;
let selectedSeatCount = 0;
let selectedSeatsList = [];

// Route Configuration Data
const busRoutes = {
  Dhanmondi: {
    title: "ROUTE: 01: Dhanmondi ⇄ UIU Campus",
    stops: ["Dhanmondi 27", "Kalabagan", "Science Lab", "Shahbagh", "Kakrail", "Notun Bazar", "UIU Campus"]
  },
  Mirpur: {
    title: "ROUTE: 02: Mirpur ⇄ UIU Campus",
    stops: ["Mirpur 10", "Mirpur 11", "Purobi", "ECB Chottor", "Kuril Bishwa Road", "Notun Bazar", "UIU Campus"]
  },
  Signboard: {
    title: "ROUTE: 03: Signboard ⇄ UIU Campus",
    stops: ["Signboard", "Matuail", "Kanchpur Bridge", "Demra Staff Quarter", "Rampura", "Notun Bazar", "UIU Campus"]
  },
  Jatrabari: {
    title: "ROUTE: 04: Jatrabari ⇄ UIU Campus",
    stops: ["Jatrabari", "Sayedabad", "Mugdha", "Basabo", "Maddhya Badda", "Notun Bazar", "UIU Campus"]
  },
  Palashi: {
    title: "ROUTE: 05: Palashi ⇄ UIU Campus",
    stops: ["Palashi", "BUET Campus", "Dhaka Medical", "Press Club", "Kakrail", "Notun Bazar", "UIU Campus"]
  },
  Uttara: {
    title: "ROUTE: 06: Uttara ⇄ UIU Campus",
    stops: ["Uttara House Building", "Azampur", "Airport", "Khilkhet", "Kuril Flyover", "Notun Bazar", "UIU Campus"]
  }
};

// Seat Selection Logic
const seatElements = document.getElementsByClassName('seats');

for (const seat of seatElements) {
  seat.addEventListener('click', function (e) {
    const seatId = seat.innerText.trim();

    // Prevent duplicate selection of same seat
    if (selectedSeatsList.includes(seatId)) {
      alert('You have already selected this seat.');
      return;
    }

    // Limit selection to maximum 4 seats
    if (selectedSeatCount >= maxAllowedSeats) {
      alert('You can only select a maximum of 4 seats per booking.');
      return;
    }

    // Update Counter State
    availableSeat -= 1;
    selectedSeatCount += 1;
    selectedSeatsList.push(seatId);

    // Update UI Indicators
    setInnerText('seats-left', availableSeat);
    setInnerText('selected-seat', selectedSeatCount);
    setSeatSelectedStyle(seatId);

    // Render Booking List Item
    const bookingSeatContainer = document.getElementById('booking-seat-container');
    const li = document.createElement('li');
    li.id = `booked-${seatId}`;
    
    const p1 = document.createElement('p');
    p1.innerText = seatId;
    const p2 = document.createElement('p');
    p2.innerText = 'Economy';
    const p3 = document.createElement('p');
    p3.innerText = '550';

    li.appendChild(p1);
    li.appendChild(p2);
    li.appendChild(p3);
    bookingSeatContainer.appendChild(li);

    // Update Totals
    totalCost('total-cost', 550);
    grandTotalCost();

    // Enable coupon input once 4 seats selected
    if (selectedSeatCount === 4) {
      const applyBtn = document.getElementById('apply-btn');
      if (applyBtn) applyBtn.removeAttribute('disabled');
    }
    
    // Check form inputs to enable/disable Next button
    validateNextButton();
  });
}

// DOM Events Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Input Validation Listeners
  const passengerName = document.getElementById('passenger-name');
  const passengerPhone = document.getElementById('passenger-phone');
  const passengerEmail = document.getElementById('passenger-email');

  if (passengerName) passengerName.addEventListener('input', validateNextButton);
  if (passengerPhone) passengerPhone.addEventListener('input', validateNextButton);
  if (passengerEmail) passengerEmail.addEventListener('input', validateNextButton);

  // Route Dropdown Listeners
  const routeButtons = document.querySelectorAll('.route-select-btn');
  const routeDisplaySection = document.getElementById('route-info-display');
  const routeTitle = document.getElementById('route-title');
  const routeStopsList = document.getElementById('route-stops-list');
  const closeRouteBtn = document.getElementById('close-route-info');
  const displayRouteName = document.getElementById('display-route-name');
  const displayBoardingPoints = document.getElementById('display-boarding-points');

  routeButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      e.preventDefault();
      const routeKey = button.getAttribute('data-route');
      const routeData = busRoutes[routeKey];

      if (routeData) {
        // Populate dynamic Route Info Card
        routeTitle.innerText = routeData.title;
        routeStopsList.innerHTML = '';

        routeData.stops.forEach((stop, index) => {
          const li = document.createElement('li');
          li.className = 'bg-slate-800/80 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3 text-sm';
          li.innerHTML = `<span class="bg-lime-500/20 text-lime-400 font-bold w-6 h-6 rounded-full flex items-center justify-center text-xs">${index + 1}</span> <span>${stop}</span>`;
          routeStopsList.appendChild(li);
        });

        // Show route card
        routeDisplaySection.classList.remove('hidden');
        routeDisplaySection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        // Update Shuttle Info section automatically
        if (displayRouteName) displayRouteName.innerText = routeKey;
        if (displayBoardingPoints) {
          displayBoardingPoints.innerHTML = '';
          routeData.stops.slice(0, 3).forEach(stop => {
            const div = document.createElement('div');
            div.className = 'bg-slate-200 text-xs md:text-sm p-2.5 rounded-lg font-medium text-slate-700';
            div.innerText = `Boarding Point - ${stop}`;
            displayBoardingPoints.appendChild(div);
          });
        }
      }
    });
  });

  if (closeRouteBtn) {
    closeRouteBtn.addEventListener('click', () => {
      routeDisplaySection.classList.add('hidden');
    });
  }
});

// Function to validate Seat Selection + Form Input Fields
function validateNextButton() {
  const nameValue = document.getElementById('passenger-name')?.value.trim() || "";
  const phoneValue = document.getElementById('passenger-phone')?.value.trim() || "";
  const nextBtn = document.getElementById('next-btn');

  // Next button is enabled ONLY when at least 1 seat is chosen AND Name and Phone are entered
  if (selectedSeatCount > 0 && nameValue !== "" && phoneValue !== "") {
    nextBtn.removeAttribute('disabled');
    nextBtn.classList.remove('opacity-50', 'cursor-not-allowed');
  } else if (nextBtn) {
    nextBtn.setAttribute('disabled', 'true');
    nextBtn.classList.add('opacity-50', 'cursor-not-allowed');
  }
}

// Modal Next transition
function Next() {
  const firstOne = document.getElementById('first-one');
  firstOne.classList.add('hidden');
  document.getElementById('successfull-section').classList.remove('hidden');
}