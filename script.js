let myShops = [
  // --- New Shops from Image (Feb 2026) ---
  { "id": 301, "name": "Thilona St", "address": "New Route", "lat": 6.303168, "lng": 80.997814, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 302, "name": "Polagawa kade", "address": "New Route", "lat": 6.305568, "lng": 81.000403, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 303, "name": "Subhani st", "address": "New Route", "lat": 6.306828, "lng": 81.002643, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 304, "name": "Gamini St", "address": "New Route", "lat": 6.317424, "lng": 80.998439, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 305, "name": "Sunitha St", "address": "New Route", "lat": 6.320387, "lng": 81.000104, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 306, "name": "Ruhunu cake", "address": "New Route", "lat": 6.310887, "lng": 81.003179, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 307, "name": "Kanchana St", "address": "New Route", "lat": 6.294829, "lng": 80.996822, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 308, "name": "Suresh Kade", "address": "New Route", "lat": 6.294006, "lng": 80.999332, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 309, "name": "Anoma St", "address": "New Route", "lat": 6.289949, "lng": 81.000170, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 310, "name": "Tharushika St", "address": "New Route", "lat": 6.289194, "lng": 80.993953, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 311, "name": "Priyani St", "address": "New Route", "lat": 6.282486, "lng": 80.993412, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 312, "name": "Isuru St", "address": "New Route", "lat": 6.268716, "status": "Pending", "lng": 80.988962, "balance": 0, "returns": "" },
  { "id": 313, "name": "Somalatha Waweyama", "address": "New Route", "lat": 6.320841, "lng": 81.047792, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 314, "name": "Damsarani St", "address": "New Route", "lat": 6.347171, "lng": 81.040372, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 315, "name": "Siththaru St", "address": "New Route", "lat": 6.346462, "lng": 81.040845, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 316, "name": "Pathma St", "address": "New Route", "lat": 6.340843, "lng": 81.039843, "status": "Pending", "balance": 0, "returns": "" },
  { "id": 317, "name": "Kurudana St", "address": "New Route", "lat": 6.306225, "lng": 81.109436, "status": "Pending", "balance": 0, "returns": "" },

  // --- Previous Shops (Simplified for brevity) ---
  { "id": 100, "name": "Umayanga St", "address": "Added from List", "lat": 6.338066, "lng": 81.005943, "status": "Pending", "balance": 0, "returns": "" },
  // ... (Include your existing shops here)
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
    if (confirm("⚠️ Are you sure you want to DELETE this shop from the list?")) {
        myShops = myShops.filter(s => s.id !== id);
        saveData();
        render();
    }
}

function resetDay() {
    if (prompt("Enter Admin Password to Reset:") === "2705N") {
        if (confirm("This will set ALL shops back to 'Pending'. Continue?")) {
            myShops.forEach(shop => shop.status = "Pending");
            saveData();
            render();
        }
    } else {
        alert("Wrong Password!");
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

// UPDATED: Added confirmation before updating status
function updateStatus(id, newStatus) {
  const shop = myShops.find((s) => s.id === id);
  if (shop) {
    if (confirm(`Mark "${shop.name}" as ${newStatus.toUpperCase()}?`)) {
      shop.status = newStatus;
      saveData();
      render();
    }
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
      fontSize: "18px", fontWeight: "bold", boxShadow: "0 6px 20px rgba(52, 199, 89, 0.4)",
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
    div.style.backgroundColor = isDone ? "#f9f9f9" : "white";
    div.style.borderBottom = "2px solid #eee";
    div.style.padding = "20px 0";

    div.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; padding: 0 10px;">
            <div style="flex: 1;">
                <h3 style="margin:0; font-size: 18px;">#${index + 1} - ${shop.name}</h3>
                <p style="margin:5px 0; color:#666; font-size:14px;">${shop.address}</p>
                <div style="display: flex; align-items: center; gap: 8px;">
                   <span style="font-size: 12px; font-weight: bold; color: #007AFF;">${shop.dist ? shop.dist.toFixed(1) + ' km' : ''}</span>
                   <span style="font-size:12px; font-weight:bold; color:${isDone ? "#34C759" : "#FF9500"}">
                      ${isDone ? '✓ ' + shop.status : '● PENDING'}
                   </span>
                </div>
            </div>
            <div style="display:flex; gap:12px;">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}')" 
                        style="background:#007AFF; color:white; border:none; padding:12px; border-radius:10px; font-size: 18px;">🗺️</button>
                <button onclick="deleteShop(${shop.id})" 
                        style="background:#FF3B30; color:white; border:none; padding:12px; border-radius:10px; font-size: 18px;">🗑️</button>
            </div>
        </div>
        ${!isDone ? `
        <div style="display:flex; gap:12px; margin-top:15px; padding: 0 10px;">
            <button onclick="updateStatus(${shop.id}, 'Delivered')" style="flex:1; padding:15px; background:#34C759; color:white; border:none; border-radius:10px; font-weight:bold; font-size: 16px;">Delivered</button>
            <button onclick="updateStatus(${shop.id}, 'Closed')" style="flex:1; padding:15px; background:#FF9500; color:white; border:none; border-radius:10px; font-weight:bold; font-size: 16px;">Closed</button>
        </div>` : ""}
    `;
    container.appendChild(div);
  });

  const footer = document.createElement("div");
  footer.style.marginTop = "40px";
  footer.style.padding = "0 10px 50px 10px";
  
  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🔄 RESET ALL FOR NEW DAY";
  resetBtn.className = "reset-btn";
  Object.assign(resetBtn.style, {
      width: "100%", padding: "15px", borderRadius: "10px", border: "1px solid #ccc",
      background: "#eee", fontWeight: "bold", color: "#333"
  });
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

