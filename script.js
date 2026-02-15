let myShops = [
  { id: 1, name: "Pol Athu Kade", address: "Mihindu gama", lat: 6.349482, lng: 81.057259, status: "Pending" },
  { id: 2, name: "Damayanthi Ranmuduwewa", address: "Ranmuduwewa", lat: 6.354068, lng: 81.076485, status: "Pending" },
  { id: 3, name: "Senu Stores", address: "Ranmuduwewa", lat: 6.415811, lng: 81.088676, status: "Pending" }
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

    // This creates a link showing all pins at once
    let mapUrl = "https://www.google.com/maps/dir/";
    if(userPos.lat) mapUrl += `${userPos.lat},${userPos.lng}/`; // Start from you
    
    pendingShops.forEach(shop => {
        mapUrl += `${shop.lat},${shop.lng}/`;
    });

    window.open(mapUrl, '_blank');
}

// --- 3. ADMIN ACTIONS ---

function addShopManually() {
    const password = prompt("Enter Admin Password:");
    if (password !== "2705N") return alert("Wrong Password!");

    const name = prompt("Enter Shop Name:");
    const coords = prompt("Paste Coordinates (lat, lng):"); 
    
    if (name && coords) {
        const parts = coords.split(",");
        const lat = parseFloat(parts[0].trim());
        const lng = parseFloat(parts[1].trim());

        if (isNaN(lat) || isNaN(lng)) return alert("Invalid format!");

        myShops.push({ id: Date.now(), name: name, address: "WhatsApp Added", lat: lat, lng: lng, status: "Pending" });
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

function copyDataForGithub() {
    navigator.clipboard.writeText(JSON.stringify(myShops, null, 2)).then(() => alert("Data Copied!"));
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
  if (confirm(`Mark as ${newStatus}?`)) {
    const shop = myShops.find((s) => s.id === id);
    if (shop) {
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

  // TOP BUTTON: View All
  const routeBtn = document.createElement("button");
  routeBtn.innerHTML = "🗺️ VIEW ALL PENDING STOPS";
  routeBtn.className = "reset-btn";
  routeBtn.style.background = "#34C759";
  routeBtn.style.marginBottom = "20px";
  routeBtn.onclick = viewAllShopsOnMap;
  container.appendChild(routeBtn);

  if (userPos.lat) {
    myShops.forEach(s => s.dist = getDistance(userPos.lat, userPos.lng, s.lat, s.lng));
    myShops.sort((a, b) => a.dist - b.dist);
  }

  myShops.forEach((shop) => {
    const isDone = shop.status !== "Pending";
    const div = document.createElement("div");
    div.className = `shop-card ${isDone ? "completed" : ""}`;

    div.innerHTML = `
        <div class="card-main">
            <div class="shop-info">
                <div class="title-row">
                    <h3 class="shop-name">${shop.name}</h3>
                    ${shop.dist ? `<span class="distance-tag">${shop.dist.toFixed(1)} km</span>` : ""}
                </div>
                <p class="address">${shop.address}</p>
                <div class="status-label" style="color:${isDone ? "#34C759" : "#999"}">
                    STATUS: ${shop.status}
                </div>
            </div>
            ${!isDone ? `<button class="map-arrow-btn" onclick="window.open('https://www.google.com/maps?q=${shop.lat},${shop.lng}')">↗</button>` : ""}
        </div>
        ${!isDone ? `
        <div class="btn-group">
            <button class="action-btn btn-del" onclick="updateStatus(${shop.id}, 'Delivered')">Delivered</button>
            <button class="action-btn btn-close" onclick="updateStatus(${shop.id}, 'Closed')">Closed</button>
            <button class="action-btn btn-can" onclick="updateStatus(${shop.id}, 'Cancelled')">Cancel</button>
        </div>` : ""}
    `;
    container.appendChild(div);
  });

  const controls = document.createElement("div");
  controls.style.padding = "20px";

  const manualBtn = document.createElement("button");
  manualBtn.innerText = "➕ Add Shop from WhatsApp";
  manualBtn.className = "reset-btn";
  manualBtn.style.border = "2px solid #007AFF";
  manualBtn.onclick = addShopManually;
  controls.appendChild(manualBtn);

  const resetBtn = document.createElement("button");
  resetBtn.innerText = "🔄 Start Next Day";
  resetBtn.className = "reset-btn";
  resetBtn.onclick = resetDay;
  controls.appendChild(resetBtn);

  const copyBtn = document.createElement("button");
  copyBtn.innerText = "📋 Copy All Data for GitHub";
  copyBtn.className = "reset-btn";
  copyBtn.style.border = "1px dashed #fff";
  copyBtn.onclick = copyDataForGithub;
  controls.appendChild(copyBtn);

  container.appendChild(controls);
}

window.onload = () => {
  loadData();
  navigator.geolocation.getCurrentPosition(
    (p) => {
      userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      render();
    },
    () => render()
  );
};
