const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";
const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" };

async function loadGallery(sort = 'new') {
    // UI Tab Handling
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${sort}`).classList.add('active');

    // Supabase Fetch
    let fetchUrl = URL + "?select=*";
    if (sort === 'popular') fetchUrl += "&order=likes.desc";
    else fetchUrl += "&order=created_at.desc";

    const res = await fetch(fetchUrl, { headers });
    const data = await res.json();
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    data.forEach(p => {
        // LOGIC: Use the first stolen decal as the cover image
        const firstDecalId = p.decals[0];
        const coverImageUrl = `https://www.roblox.com/asset-thumbnail/image?assetId=${firstDecalId}&width=420&height=420&format=png`;
        
        grid.innerHTML += `
            <div class="card">
                <div class="card-display" onclick="location.href='player.html?user=${p.username}'">
                    <img src="${coverImageUrl}" alt="Decal Cover">
                </div>
                <div class="card-title">${p.username}</div>
                <div class="like-stats">
                    <div onclick="like('${p.username}', ${p.likes})" style="cursor:pointer; display:flex; align-items:center; gap:5px;">
                        <i data-lucide="heart" size="16"></i> <span id="l-${p.username}">${p.likes}</span>
                    </div>
                    <span style="color:#222; font-size:10px;">${p.decals.length} DECALS</span>
                </div>
                <button class="btn-enter" onclick="location.href='player.html?user=${p.username}'">
                    ENTER GALLERY
                </button>
            </div>`;
    });
    lucide.createIcons();
}

async function like(user, count) {
    const newCount = count + 1;
    await fetch(`${URL}?username=eq.${user}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ likes: newCount })
    });
    document.getElementById(`l-${user}`).innerText = newCount;
}

// Search Functionality
function searchLibrary() {
    const term = document.getElementById('pSearch').value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        const name = card.querySelector('.card-title').innerText.toLowerCase();
        card.style.display = name.includes(term) ? "block" : "none";
    });
}

// Player Page Load (player.html)
if (document.getElementById('decal-grid')) {
    const user = new URLSearchParams(window.location.search).get('user');
    document.getElementById('p-name').innerText = user;

    fetch(`${URL}?username=eq.${user}`, { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('decal-grid');
        if(data[0]) {
            data[0].decals.forEach(id => {
                grid.innerHTML += `
                    <div class="card">
                        <div class="card-display">
                            <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        </div>
                        <button class="btn-enter" onclick="copyId('${id}')">COPY ID</button>
                    </div>`;
            });
            lucide.createIcons();
        }
    });
}

function copyId(id) {
    navigator.clipboard.writeText(id);
    alert('Decal ID: ' + id + ' Copied!');
}

loadGallery();
