let myShops = [
  {
    id: 1,
    name: "Pol Athu Kade",
    address: "Mihindu gama",
    lat: 6.349482,
    lng: 81.057259,
    status: "Pending",
  },
  {
    id: 2,
    name: "Damayanthi Ranmuduwewa",
    address: "Ranmuduwewa",
    lat: 6.354068,
    lng: 81.076485,
    status: "Pending",
  },
  {
    id: 3,
    name: "Senu Stores",
    address: "Ranmuduwewa",
    lat: 6.415811,
    lng: 81.088676,
    status: "Pending",
  },
];

let userPos = { lat: null, lng: null };
function resetDay() {
    // 1. Ask for Password
    const password = prompt("Enter Admin Password to Reset Day:");
    
    // 2. Check Password (Change '1234' to whatever you like)
    if (password === "2705N") {
        if (confirm("Password Correct. Clear all delivery statuses?")) {
            myShops.forEach(shop => {
                shop.status = "Pending";
            });
            saveData();
            render();
            alert("Success: App ready for a new day!");
        }
    } else {
        alert("Wrong Password! Access Denied.");
    }
}

function loadData() {
  const saved = localStorage.getItem("deliveryAppData");
  if (saved) {
    myShops = JSON.parse(saved);
  }
}

function saveData() {
  localStorage.setItem("deliveryAppData", JSON.stringify(myShops));
}

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function updateStatus(id, newStatus) {
  if (confirm(`Are you sure you want to mark this as ${newStatus}?`)) {
    const shop = myShops.find((s) => s.id === id);
    if (shop) {
      shop.status = newStatus;
      saveData();
      render();
    }
  }
}

function getSummary() {
  const stats = myShops.reduce(
    (acc, s) => {
      acc[s.status]++;
      return acc;
    },
    { Pending: 0, Delivered: 0, Closed: 0, Cancelled: 0 },
  );
  alert(
    `📊 SUMMARY\n\n✅ Delivered: ${stats.Delivered}\n🚧 Closed: ${stats.Closed}\n❌ Cancelled: ${stats.Cancelled}`,
  );
}

function render() {
  const container = document.getElementById("shop-list");
  container.innerHTML = "";

  if (userPos.lat) {
    myShops.forEach(
      (s) => (s.dist = getDistance(userPos.lat, userPos.lng, s.lat, s.lng)),
    );
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
                
                ${
                  !isDone
                    ? `
                <button class="map-arrow-btn" onclick="window.open('http://maps.google.com/?daddr=${shop.lat},${shop.lng}')">
                    ↗
                </button>`
                    : ""
                }
            </div>
            
            ${
              !isDone
                ? `
            <div class="btn-group">
                <button class="action-btn btn-del" onclick="updateStatus(${shop.id}, 'Delivered')">Delivered</button>
                <button class="action-btn btn-close" onclick="updateStatus(${shop.id}, 'Closed')">Closed</button>
                <button class="action-btn btn-can" onclick="updateStatus(${shop.id}, 'Cancelled')">Cancel</button>
            </div>`
                : ""
            }
        `;
    container.appendChild(div);
  });
  const bottomBtn = document.createElement("button");
    bottomBtn.innerText = "🔄 Start Next Day (Admin Only)";
    bottomBtn.className = "reset-btn";
    bottomBtn.onclick = resetDay;
    container.appendChild(bottomBtn);
}

window.onload = () => {
  loadData();
  navigator.geolocation.getCurrentPosition(
    (p) => {
      userPos = { lat: p.coords.latitude, lng: p.coords.longitude };
      render();
    },
    () => render(),
  );
};
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js")
      .then(reg => console.log("Service Worker Registered"))
      .catch(err => console.log("Service Worker Failed", err));
  });
}




