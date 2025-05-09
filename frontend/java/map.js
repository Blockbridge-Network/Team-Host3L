// Debug flag
const DEBUG = true;

// Debug logging function
function debugLog(message) {
    if (DEBUG) {
        console.log(`[Map Debug] ${message}`);
    }
}

// Map initialization
let map;
let markers = [];
let directionsService;
let directionsRenderer;

// Hostel locations data
const hostelLocations = [
    {
        id: 1,
        name: "Downtown Hostel",
        lat: 40.7128,
        lng: -74.0060,
        address: "123 Main St, New York, NY"
    },
    {
        id: 2,
        name: "Beachside Hostel",
        lat: 34.0522,
        lng: -118.2437,
        address: "456 Ocean Dr, Los Angeles, CA"
    },
    {
        id: 3,
        name: "Mountain View Hostel",
        lat: 37.7749,
        lng: -122.4194,
        address: "789 Hill Rd, San Francisco, CA"
    }
];

// Error handling
function handleMapError(error) {
    debugLog(`Map Error: ${error.message}`);
    const mapContainer = document.getElementById('map');
    const loadingElement = document.getElementById('map-loading');
    
    if (mapContainer && loadingElement) {
        mapContainer.innerHTML = `
            <div class="error-message">
                <i class="fas fa-exclamation-circle"></i>
                <p>Error loading map: ${error.message}</p>
                <button onclick="retryMapInitialization()" class="retry-btn">Retry</button>
            </div>
        `;
        loadingElement.style.display = 'none';
    }
}

// Retry map initialization
function retryMapInitialization() {
    debugLog('Retrying map initialization...');
    const mapContainer = document.getElementById('map');
    const loadingElement = document.getElementById('map-loading');
    
    if (mapContainer && loadingElement) {
        mapContainer.innerHTML = '';
        loadingElement.style.display = 'flex';
        initMap();
    }
}

// Initialize the map
function initMap() {
    try {
        debugLog('Initializing map...');
        
        // Check if Google Maps is loaded
        if (typeof google === 'undefined' || !google.maps) {
            throw new Error('Google Maps API not loaded');
        }

        // Create map centered at KNUST
        map = new google.maps.Map(document.getElementById('map'), {
            center: { lat: 6.6731, lng: -1.5711 }, // KNUST Campus
            zoom: 15,
            styles: [
                {
                    "featureType": "all",
                    "elementType": "geometry",
                    "stylers": [{"color": "#f5f5f5"}]
                },
                {
                    "featureType": "water",
                    "elementType": "geometry",
                    "stylers": [{"color": "#e9e9e9"}]
                },
                {
                    "featureType": "water",
                    "elementType": "labels.text.fill",
                    "stylers": [{"color": "#9e9e9e"}]
                }
            ]
        });

        debugLog('Map created successfully');

        // Initialize directions service
        directionsService = new google.maps.DirectionsService();
        directionsRenderer = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: true
        });

        // Add markers for each hostel
        hostelLocations.forEach(hostel => {
            addMarker(hostel);
        });

        // Add user's location button
        addUserLocationButton();

        // Hide loading state
        const loadingElement = document.getElementById('map-loading');
        if (loadingElement) {
            loadingElement.style.display = 'none';
        }

        debugLog('Map initialization completed');
    } catch (error) {
        handleMapError(error);
    }
}

// Add a marker for a hostel
function addMarker(hostel) {
    const marker = new google.maps.Marker({
        position: { lat: hostel.lat, lng: hostel.lng },
        map: map,
        title: hostel.name,
        animation: google.maps.Animation.DROP
    });

    // Create info window content
    const contentString = `
        <div class="map-info-window">
            <h3>${hostel.name}</h3>
            <p>${hostel.address}</p>
            <button onclick="viewHostel(${hostel.id})" class="btn btn-primary">View Details</button>
        </div>
    `;

    const infoWindow = new google.maps.InfoWindow({
        content: contentString
    });

    // Add click listener to marker
    marker.addListener('click', () => {
        // Close any open info windows
        markers.forEach(m => m.infoWindow.close());
        
        // Open this marker's info window
        infoWindow.open(map, marker);
    });

    // Store marker and info window
    marker.infoWindow = infoWindow;
    markers.push(marker);
}

// View hostel details
function viewHostel(hostelId) {
    // Find the hostel card and scroll to it
    const hostelCard = document.querySelector(`[data-hostel-id="${hostelId}"]`);
    if (hostelCard) {
        hostelCard.scrollIntoView({ behavior: 'smooth' });
        hostelCard.classList.add('highlight');
        setTimeout(() => {
            hostelCard.classList.remove('highlight');
        }, 2000);
    }
}

// Search locations on map
function searchLocations(query) {
    const geocoder = new google.maps.Geocoder();
    
    geocoder.geocode({ address: query }, (results, status) => {
        if (status === 'OK') {
            const location = results[0].geometry.location;
            map.setCenter(location);
            map.setZoom(12);
        }
    });
}

// Add map styles
const mapStyles = `
    #map {
        height: 400px;
        width: 100%;
        border-radius: 8px;
        margin: 20px 0;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }

    .map-info-window {
        padding: 10px;
        max-width: 200px;
    }

    .map-info-window h3 {
        margin: 0 0 5px 0;
        font-size: 16px;
        color: #333;
    }

    .map-info-window p {
        margin: 0 0 10px 0;
        font-size: 14px;
        color: #666;
    }

    .map-info-window button {
        width: 100%;
        padding: 8px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: background 0.3s ease;
    }

    .map-info-window button:hover {
        background: var(--primary-dark);
    }

    .hostel-card.highlight {
        animation: highlight 2s ease;
    }

    @keyframes highlight {
        0% { transform: scale(1); }
        50% { transform: scale(1.02); }
        100% { transform: scale(1); }
    }
`;

// Add styles to document
const styleSheet = document.createElement("style");
styleSheet.textContent = mapStyles;
document.head.appendChild(styleSheet);

// Add error message styles
const errorStyles = `
    .error-message {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        padding: 20px;
        text-align: center;
        color: var(--text);
    }

    .error-message i {
        font-size: 48px;
        color: #dc2626;
        margin-bottom: 15px;
    }

    .error-message p {
        margin-bottom: 15px;
        font-size: 16px;
    }

    .retry-btn {
        padding: 8px 16px;
        background: var(--primary-color);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .retry-btn:hover {
        background: var(--primary-dark);
        transform: translateY(-2px);
    }
`;

// Add error styles to document
const errorStyleSheet = document.createElement("style");
errorStyleSheet.textContent = errorStyles;
document.head.appendChild(errorStyleSheet); 