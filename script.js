let myShops = [
  { id: 1, name: "Shop 1", address: "Wijedasa St", lat: 6.342416, lng: 81.011681, status: "Pending" }
];

let userPos = { lat: null, lng: null };

// --- 1. DATA MANAGEMENT ---
function loadData() {
  const saved = localStorage.getItem("deliveryAppData");
  if (saved) { myShops = JSON.parse(saved); }
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

// --- 3. BULK IMPORT & ACTIONS ---
function importShops() {
    const data = prompt("Paste all Google Maps links here (separated by spaces or new lines):");
    if (!data) return;

    // Use Regex to find all lat/lng pairs in the text
    const regex = /q=([-\d.]+),([-\d.]+)/g;
    let match;
    let count = 0;
    const startIndex = myShops.length + 1;

    while ((match = regex.exec(data)) !== null) {
        myShops.push({
            id: Date.now() + Math.random(),
            name: `Shop ${startIndex + count}`,
            address: "Bulk Imported",
            lat: parseFloat(match[1]),
            lng: parseFloat(match[2]),
            status: "Pending"
        });
        count++;
    }

    if (count > 0) {
        saveData();
        render();
        alert(`Successfully added ${count} shops!`);
    } else {
        alert("No coordinates found. Make sure you paste the full links!");
    }
}

function deleteShop(id) {
    if (confirm("Delete this shop from your list?")) {
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

  // View All Button
  const pendingCount = myShops.filter(s => s.status === "Pending").length;
  const routeBtn = document.createElement("button");
  routeBtn.innerHTML = `<span>📍</span> VIEW OPTIMIZED ROUTE (${pendingCount})`;
  Object.assign(routeBtn.style, {
      background: "linear-gradient(135deg, #34C759 0%, #28a745 100%)",
      color: "white", border: "none", borderRadius: "12px", padding: "18px",
      fontSize: "16px", fontWeight: "bold", boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
      marginBottom: "20px", width: "100%", cursor: "pointer"
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

    div.innerHTML = `
        <div class="card-main" style="display:flex; justify-content:space-between; align-items:center;">
            <div class="shop-info">
                <h3 style="margin:0;">#${index + 1} - ${shop.name}</h3>
                <p style="font-size:12px; color:#666; margin:4px 0;">${shop.dist ? shop.dist.toFixed(1) + ' km away' : 'Calculating...'}</p>
            </div>
            <div style="display:flex; gap:10px;">
                <button onclick="window.open('https://www.google.com/maps/search/?api=1&query=${shop.lat},${shop.lng}')" style="background:#eee; border:none; padding:10px; border-radius:8px;">↗</button>
                <button onclick="deleteShop(${shop.id})" style="background:#ff3b30; color:white; border:none; padding:10px; border-radius:8px;">🗑️</button>
            </div>
        </div>
        ${!isDone ? `
        <div class="btn-group" style="display:flex; gap:5px; margin-top:10px;">
            <button class="action-btn" style="flex:1; background:#34C759; color:white;" onclick="updateStatus(${shop.id}, 'Delivered')">Delivered</button>
            <button class="action-btn" style="flex:1; background:#ff9500; color:white;" onclick="updateStatus(${shop.id}, 'Closed')">Closed</button>
        </div>` : `<div style="margin-top:10px; color:#34C759; font-weight:bold;">✓ ${shop.status}</div>`}
    `;
    container.appendChild(div);
  });

  // Footer Actions
  const footer = document.createElement("div");
  footer.style.padding = "20px 0";

  const bulkBtn = document.createElement("button");
  bulkBtn.innerText = "📥 Bulk Import Links";
  bulkBtn.className = "reset-btn";
  bulkBtn.style.background = "#007AFF";
  bulkBtn.style.color = "white";
  bulkBtn.onclick = importShops;
  footer.appendChild(bulkBtn);

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🔄 Reset Day";
  resetBtn.className = "reset-btn";
  resetBtn.style.marginTop = "10px";
  resetBtn.onclick = resetDay;
  footer.appendChild(resetBtn);

  container.appendChild(footer);
}

window.onload = () => {
  loadData();
  navigator.geolocation.getCurrentPosition((p) => {
      userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      render();
    }, () => render()
  );
};
