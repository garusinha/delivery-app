let myShops = [
  // --- Shops from First File (1.xlsx) ---
  { "id": 100, "name": "Umayanga St", "address": "Added from List", "lat": 6.338066, "lng": 81.005943, "status": "Pending" },
  { "id": 101, "name": "Bulath Kade", "address": "Added from List", "lat": 6.340764, "lng": 81.021153, "status": "Pending" },
  { "id": 102, "name": "Samarasinha St", "address": "Added from List", "lat": 6.352201, "lng": 81.030211, "status": "Pending" },
  { "id": 103, "name": "Chathuranga St", "address": "Added from List", "lat": 6.393334, "lng": 81.030759, "status": "Pending" },
  { "id": 104, "name": "Elagawa Elawalu Migahajadura", "address": "Added from List", "lat": 6.356427, "lng": 81.033858, "status": "Pending" },
  { "id": 105, "name": "Athula", "address": "Added from List", "lat": 6.359589, "lng": 81.034074, "status": "Pending" },
  { "id": 106, "name": "Didula St", "address": "Added from List", "lat": 6.369619, "lng": 81.034854, "status": "Pending" },
  { "id": 107, "name": "Mahinda St", "address": "Added from List", "lat": 6.382172, "lng": 81.030929, "status": "Pending" },
  { "id": 108, "name": "senali st", "address": "Added from List", "lat": 6.392884, "lng": 81.029185, "status": "Pending" },
  { "id": 109, "name": "Pathika", "address": "Added from List", "lat": 6.419595, "lng": 81.023324, "status": "Pending" },
  { "id": 110, "name": "Bagya St", "address": "Added from List", "lat": 6.430601, "lng": 81.016185, "status": "Pending" },
  { "id": 111, "name": "Randila Wale kade Kumaragama", "address": "Added from List", "lat": 6.430216, "lng": 81.014711, "status": "Pending" },
  { "id": 112, "name": "kawishan St", "address": "Added from List", "lat": 6.429519, "lng": 81.012225, "status": "Pending" },
  { "id": 113, "name": "Rukshan St Kumaragama", "address": "Added from List", "lat": 6.427643, "lng": 81.007161, "status": "Pending" },
  { "id": 114, "name": "Anupa Bufe", "address": "Added from List", "lat": 6.364221, "lng": 80.96288, "status": "Pending" },
  { "id": 115, "name": "Ajith St", "address": "Added from List", "lat": 6.366562, "lng": 80.971577, "status": "Pending" },
  { "id": 116, "name": "Jayamanthi St", "address": "Added from List", "lat": 6.366341, "lng": 80.971382, "status": "Pending" },
  { "id": 117, "name": "sayas St", "address": "Added from List", "lat": 6.350903, "lng": 80.964787, "status": "Pending" },
  { "id": 118, "name": "Sudath Weladasala", "address": "Added from List", "lat": 6.348447, "lng": 80.971, "status": "Pending" },
  { "id": 119, "name": "parakrma St", "address": "Added from List", "lat": 6.347989, "lng": 80.971418, "status": "Pending" },
  { "id": 120, "name": "Premasiri", "address": "Added from List", "lat": 6.317672, "lng": 80.970448, "status": "Pending" },

  // --- New Shops from Second File (rohan routes 6.xlsx) ---
  { "id": 201, "name": "GNS", "address": "Added from List 2", "lat": 6.524582, "lng": 81.003571, "status": "Pending" },
  { "id": 202, "name": "Prabath St", "address": "Added from List 2", "lat": 6.534878, "lng": 80.959015, "status": "Pending" },
  { "id": 203, "name": "Suranga St", "address": "Added from List 2", "lat": 6.541237, "lng": 80.948491, "status": "Pending" },
  { "id": 204, "name": "Wasana St", "address": "Added from List 2", "lat": 6.541457, "lng": 80.94916, "status": "Pending" },
  { "id": 205, "name": "Tissa St", "address": "Added from List 2", "lat": 6.540475, "lng": 80.948846, "status": "Pending" },
  { "id": 206, "name": "Shanika St", "address": "Added from List 2", "lat": 6.46148, "lng": 81.018992, "status": "Pending" }
];

let userPos = { lat: null, lng: null };

// --- 1. DATA MANAGEMENT ---
function loadData() {
  const saved = localStorage.getItem("deliveryAppData");
  if (saved) { 
      const localData = JSON.parse(saved);
      myShops = myShops.map(permanentShop => {
          const savedVersion = localData.find(s => s.lat === permanentShop.lat && s.lng === permanentShop.lng);
          return savedVersion ? savedVersion : permanentShop;
      });
  }
}

function saveData() {
  localStorage.setItem("deliveryAppData", JSON.stringify(myShops));
}

// --- 2. MAP LOGIC ---
function viewAllShopsOnMap() {
    const pendingShops = myShops.filter(s => s.status === "Pending");
    if (pendingShops.length === 0) return alert("No pending deliveries!");

    if (userPos.lat) {
        pendingShops.sort((a, b) => {
            const distA = getDistance(userPos.lat, userPos.lng, a.lat, a.lng);
            const distB = getDistance(userPos.lat, userPos.lng, b.lat, b.lng);
            return distA - distB;
        });
    }

    let mapUrl = "https://www.google.com/maps/dir/";
    if(userPos.lat) mapUrl += `${userPos.lat},${userPos.lng}/`;
    
    pendingShops.forEach(shop => {
        mapUrl += `${shop.lat},${shop.lng}/`;
    });

    window.open(mapUrl, '_blank');
}

// --- 3. ACTIONS ---
function deleteShop(id) {
    if (confirm("Delete this shop?")) {
        myShops = myShops.filter(s => s.id !== id);
        saveData();
        render();
    }
}

function resetDay() {
    if (prompt("Password:") === "2705N") {
        myShops.forEach(shop => shop.status = "Pending");
        saveData();
        render();
    }
}

// --- 4. MATH ---
function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function updateStatus(id, newStatus) {
  const shop = myShops.find((s) => s.id === id);
  if (shop) {
    shop.status = newStatus;
    saveData();
    render();
  }
}

// --- 5. UI RENDER ---
function render() {
  const container = document.getElementById("shop-list");
  if (!container) return; 
  container.innerHTML = "";

  const pendingCount = myShops.filter(s => s.status === "Pending").length;
  const routeBtn = document.createElement("button");
  routeBtn.innerHTML = `<span>📍</span> VIEW OPTIMIZED ROUTE (${pendingCount})`;
  
  Object.assign(routeBtn.style, {
      background: "linear-gradient(135deg, #34C759 0%, #28a745 100%)",
      color: "white", border: "none", borderRadius: "15px", padding: "20px",
      fontSize: "16px", fontWeight: "bold", boxShadow: "0 6px 20px rgba(52, 199, 89, 0.4)",
      marginBottom: "25px", width: "100%", cursor: "pointer", display: "flex",
      alignItems: "center", justifyContent: "center", gap: "10px"
  });
  routeBtn.onclick = viewAllShopsOnMap;
  container.appendChild(routeBtn);

  if (userPos.lat) {
    myShops.forEach(s => s.dist = getDistance(userPos.lat, userPos.lng, s.lat, s.lng));
    myShops.sort((a, b) => a.dist - b.dist);
  }

  myShops.forEach((shop, index) => {
    const isDone = shop.status !== "Pending";
    const div = document.createElement("div");
    div.className = `shop-card ${isDone ? "completed" : ""}`;
    div.style.borderBottom = "1px solid #eee";
    div.style.padding = "15px 0";

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start;">
            <div>
                <h3 style="margin:0;">#${index + 1} - ${shop.name}</h3>
                <p style="margin:5px 0; color:#666; font-size:14px;">${shop.address}</p>
                <p style="margin:0; font-size:12px; font-weight:bold; color:${isDone ? "#34C759" : "#999"}">
                    ${isDone ? '✓ ' + shop.status : '● PENDING'}
                </p>
            </div>
            <div style="display:flex; gap:8px;">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}')" 
                        style="background:#007AFF; color:white; border:none; padding:10px; border-radius:8px;">🗺️</button>
                <button onclick="deleteShop(${shop.id})" 
                        style="background:#FF3B30; color:white; border:none; padding:10px; border-radius:8px;">🗑️</button>
            </div>
        </div>
        ${!isDone ? `
        <div style="display:flex; gap:10px; margin-top:12px;">
            <button onclick="updateStatus(${shop.id}, 'Delivered')" style="flex:1; padding:10px; background:#34C759; color:white; border:none; border-radius:8px; font-weight:bold;">Delivered</button>
            <button onclick="updateStatus(${shop.id}, 'Closed')" style="flex:1; padding:10px; background:#FF9500; color:white; border:none; border-radius:8px; font-weight:bold;">Closed</button>
        </div>` : ""}
    `;
    container.appendChild(div);
  });

  const footer = document.createElement("div");
  footer.style.marginTop = "30px";
  
  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🔄 RESET FOR NEW DAY";
  resetBtn.className = "reset-btn";
  resetBtn.style.width = "100%";
  resetBtn.onclick = resetDay;
  footer.appendChild(resetBtn);
  
  container.appendChild(footer);
}

window.onload = () => {
  loadData();
  navigator.geolocation.getCurrentPosition(
    (p) => {
      userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      render();
    },
    () => render(),
    { enableHighAccuracy: true }
  );
};
