//script.js
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

/* =========================================================
   LIVE LOCATION + SHUTTLE ROUTES
   ========================================================= */

let liveMap = null;
let liveUserMarker = null;
let liveAccuracyCircle = null;
let liveLocationWatchId = null;
let liveRoutePolyline = null;

let currentLiveRoute = "Dhanmondi";


/* UIU Campus */

const UIU_LOCATION = {
  lat: 23.7966,
  lng: 90.4495
};


/*
  Route coordinates.

  These are route visualization points.
  Actual bus GPS tracking requires a backend/GPS source.
*/

const liveRouteData = {

  Dhanmondi: {
    name: "ROUTE: 01 Dhanmondi",
    color: "#84cc16",
    path: [
      { lat: 23.7559, lng: 90.3744 },
      { lat: 23.7568, lng: 90.3795 },
      { lat: 23.7379, lng: 90.3867 },
      { lat: 23.7388, lng: 90.3956 },
      { lat: 23.7457, lng: 90.4120 },
      { lat: 23.7806, lng: 90.4140 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  },

  Mirpur: {
    name: "ROUTE: 02 Mirpur",
    color: "#2563eb",
    path: [
      { lat: 23.8068, lng: 90.3689 },
      { lat: 23.8160, lng: 90.3654 },
      { lat: 23.8265, lng: 90.3652 },
      { lat: 23.8223, lng: 90.4032 },
      { lat: 23.8166, lng: 90.4256 },
      { lat: 23.7908, lng: 90.4254 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  },

  Signboard: {
    name: "ROUTE: 03 Signboard",
    color: "#dc2626",
    path: [
      { lat: 23.7037, lng: 90.4307 },
      { lat: 23.7065, lng: 90.4400 },
      { lat: 23.7112, lng: 90.4590 },
      { lat: 23.7510, lng: 90.4230 },
      { lat: 23.7806, lng: 90.4140 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  },

  Jatrabari: {
    name: "ROUTE: 04 Jatrabari",
    color: "#9333ea",
    path: [
      { lat: 23.7104, lng: 90.4358 },
      { lat: 23.7200, lng: 90.4320 },
      { lat: 23.7355, lng: 90.4260 },
      { lat: 23.7540, lng: 90.4200 },
      { lat: 23.7806, lng: 90.4140 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  },

  Palashi: {
    name: "ROUTE: 05 Palashi",
    color: "#ea580c",
    path: [
      { lat: 23.7287, lng: 90.3835 },
      { lat: 23.7315, lng: 90.3890 },
      { lat: 23.7368, lng: 90.3970 },
      { lat: 23.7457, lng: 90.4120 },
      { lat: 23.7806, lng: 90.4140 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  },

  Uttara: {
    name: "ROUTE: 06 Uttara",
    color: "#0891b2",
    path: [
      { lat: 23.8759, lng: 90.3795 },
      { lat: 23.8700, lng: 90.4000 },
      { lat: 23.8510, lng: 90.4050 },
      { lat: 23.8330, lng: 90.4200 },
      { lat: 23.8170, lng: 90.4250 },
      { lat: 23.7966, lng: 90.4495 }
    ]
  }

};


/* =========================================================
   GOOGLE MAP INITIALIZATION
   ========================================================= */

function initLiveLocationMap() {

  const mapElement = document.getElementById("live-map");

  if (!mapElement || typeof google === "undefined") {
    return;
  }

  liveMap = new google.maps.Map(mapElement, {
    center: UIU_LOCATION,
    zoom: 12,
    mapTypeControl: false,
    streetViewControl: false,
    fullscreenControl: true,
    zoomControl: true
  });


  /* UIU Campus Marker */

  new google.maps.Marker({
    position: UIU_LOCATION,
    map: liveMap,
    title: "United International University"
  });


  /* Show Default Route */

  showLiveRoute("Dhanmondi");


  /* Start User Location */

  startLiveLocation();
}


/* =========================================================
   DISPLAY ROUTE
   ========================================================= */

function showLiveRoute(routeKey) {

  if (!liveMap || !liveRouteData[routeKey]) {
    return;
  }

  currentLiveRoute = routeKey;

  const route = liveRouteData[routeKey];


  /* Remove previous route */

  if (liveRoutePolyline) {
    liveRoutePolyline.setMap(null);
  }


  /* Draw selected route */

  liveRoutePolyline = new google.maps.Polyline({
    path: route.path,
    geodesic: true,
    strokeColor: route.color,
    strokeOpacity: 0.9,
    strokeWeight: 5,
    map: liveMap
  });


  /* Update route title */

  const routeName =
    document.getElementById("live-route-name");

  if (routeName) {
    routeName.innerText = route.name;
  }


  /* Active button */

  document.querySelectorAll(".live-route-btn")
    .forEach(button => {

      button.classList.remove("active");

      if (
        button.getAttribute("data-live-route") === routeKey
      ) {
        button.classList.add("active");
      }

    });


  /* Fit map to route */

  const bounds =
    new google.maps.LatLngBounds();

  route.path.forEach(point => {
    bounds.extend(point);
  });

  liveMap.fitBounds(bounds);
}


/* =========================================================
   CONNECT EXISTING DESTINATION BUTTONS
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

  /*
    IMPORTANT:
    These are ADDITIONAL listeners.
    Existing destination logic is untouched.
  */

  document.querySelectorAll(".route-select-btn")
    .forEach(button => {

      button.addEventListener("click", function () {

        const routeKey =
          this.getAttribute("data-route");

        if (liveRouteData[routeKey]) {

          showLiveRoute(routeKey);

          const liveSection =
            document.getElementById(
              "live-location-section"
            );

          if (liveSection) {

            liveSection.scrollIntoView({
              behavior: "smooth",
              block: "center"
            });

          }

        }

      });

    });


  /* Live Route Buttons */

  document.querySelectorAll(".live-route-btn")
    .forEach(button => {

      button.addEventListener("click", function () {

        const routeKey =
          this.getAttribute("data-live-route");

        showLiveRoute(routeKey);

      });

    });


  /* My Location */

  const myLocationButton =
    document.getElementById("my-location-btn");

  if (myLocationButton) {

    myLocationButton.addEventListener(
      "click",
      centerOnMyLocation
    );

  }


  /* Directions */

  const directionsButton =
    document.getElementById("get-directions-btn");

  if (directionsButton) {

    directionsButton.addEventListener(
      "click",
      getDirections
    );

  }


  /* Stop Location */

  const stopButton =
    document.getElementById("stop-location-btn");

  if (stopButton) {

    stopButton.addEventListener(
      "click",
      stopLiveLocation
    );

  }

});


/* =========================================================
   BROWSER LIVE LOCATION
   ========================================================= */

function startLiveLocation() {

  const status =
    document.getElementById(
      "live-location-status"
    );


  if (!navigator.geolocation) {

    if (status) {
      status.innerText =
        "Geolocation is not supported";
    }

    return;
  }


  if (status) {
    status.innerText =
      "Requesting location permission...";
  }


  liveLocationWatchId =
    navigator.geolocation.watchPosition(

      function (position) {

        const latitude =
          position.coords.latitude;

        const longitude =
          position.coords.longitude;

        const accuracy =
          position.coords.accuracy;


        updateLiveUserLocation(
          latitude,
          longitude,
          accuracy
        );


        if (status) {
          status.innerText =
            "Live location active";
        }

      },

      function (error) {

        if (!status) {
          return;
        }


        if (error.code === 1) {

          status.innerText =
            "Location permission denied";

        }

        else if (error.code === 2) {

          status.innerText =
            "Location unavailable";

        }

        else if (error.code === 3) {

          status.innerText =
            "Location request timed out";

        }

        else {

          status.innerText =
            "Unable to get location";

        }

      },

      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000
      }

    );
}


/* =========================================================
   UPDATE USER LOCATION
   ========================================================= */

function updateLiveUserLocation(
  latitude,
  longitude,
  accuracy
) {

  if (!liveMap) {
    return;
  }


  const position = {
    lat: latitude,
    lng: longitude
  };


  /* User Marker */

  if (!liveUserMarker) {

    liveUserMarker =
      new google.maps.Marker({
        position: position,
        map: liveMap,
        title: "My Live Location"
      });

  }

  else {

    liveUserMarker.setPosition(
      position
    );

  }


  /* Accuracy Circle */

  if (!liveAccuracyCircle) {

    liveAccuracyCircle =
      new google.maps.Circle({
        map: liveMap,
        center: position,
        radius: accuracy,
        fillOpacity: 0.12,
        strokeOpacity: 0.4,
        strokeWeight: 1
      });

  }

  else {

    liveAccuracyCircle.setCenter(
      position
    );

    liveAccuracyCircle.setRadius(
      accuracy
    );

  }

}


/* =========================================================
   CENTER ON USER
   ========================================================= */

function centerOnMyLocation() {

  if (!liveUserMarker || !liveMap) {

    startLiveLocation();

    return;
  }


  const position =
    liveUserMarker.getPosition();


  liveMap.panTo(position);

  liveMap.setZoom(16);
}


/* =========================================================
   GET DIRECTIONS
   ========================================================= */

function getDirections() {

  let url =
    "https://www.google.com/maps/dir/?api=1" +
    "&destination=" +
    encodeURIComponent(
      "United International University, Madani Avenue, Badda, Dhaka"
    );


  if (liveUserMarker) {

    const position =
      liveUserMarker.getPosition();


    url +=
      "&origin=" +
      encodeURIComponent(
        position.lat() +
        "," +
        position.lng()
      );

  }


  window.open(
    url,
    "_blank"
  );
}


/* =========================================================
   STOP LIVE LOCATION
   ========================================================= */

function stopLiveLocation() {

  if (liveLocationWatchId !== null) {

    navigator.geolocation.clearWatch(
      liveLocationWatchId
    );

    liveLocationWatchId = null;

  }


  const status =
    document.getElementById(
      "live-location-status"
    );


  if (status) {

    status.innerText =
      "Live location stopped";

  }

}