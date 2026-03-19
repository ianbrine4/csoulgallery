const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";
const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" };

let currentData = [];

async function loadGallery(sortType = 'new') {
    let fetchUrl = URL + "?select=*";
    if (sortType === 'popular') fetchUrl += "&order=likes.desc";
    else fetchUrl += "&order=created_at.desc";

    const res = await fetch(fetchUrl, { headers });
    currentData = await res.json();
    renderGallery(currentData);
}

function renderGallery(data) {
    const grid = document.getElementById('player-grid');
    if (!grid) return;
    
    document.getElementById('total-count').innerText = `${data.length} Players in Library`;
    grid.innerHTML = "";

    data.forEach(p => {
        grid.innerHTML += `
            <div class="card">
                <div class="card-img-wrap">
                    <img src="https://www.roblox.com/headshot-thumbnail/image?keyword=${p.username}&width=420&height=420&format=png">
                </div>
                <h3 style="font-weight:800">${p.username}</h3>
                <div class="card-info">
                    <button class="like-btn" onclick="addLike('${p.username}', ${p.likes})">
                        <i data-lucide="heart"></i> <span id="like-${p.username}">${p.likes}</span>
                    </button>
                    <span style="font-size:12px; color:#555">${p.decals.length} Decals</span>
                </div>
                <button class="action-btn" onclick="location.href='player.html?user=${p.username}'">VIEW COLLECTION</button>
            </div>`;
    });
    lucide.createIcons();
}

async function addLike(user, currentLikes) {
    const newLikes = currentLikes + 1;
    await fetch(`${URL}?username=eq.${user}`, {
        method: 'PATCH',
        headers: headers,
        body: JSON.stringify({ likes: newLikes })
    });
    document.getElementById(`like-${user}`).innerText = newLikes;
}

// Player Page Load
if (document.getElementById('decal-grid')) {
    const user = new URLSearchParams(window.location.search).get('user');
    document.getElementById('p-name').innerText = user.toUpperCase();
    document.getElementById('p-avatar').src = `https://www.roblox.com/headshot-thumbnail/image?keyword=${user}&width=420&height=420&format=png`;

    fetch(`${URL}?username=eq.${user}`, { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('decal-grid');
        if(data[0]) {
            data[0].decals.forEach(id => {
                grid.innerHTML += `
                    <div class="card">
                        <div class="card-img-wrap">
                            <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        </div>
                        <button class="action-btn" onclick="copyId('${id}')">
                            <i data-lucide="copy"></i> COPY ID
                        </button>
                    </div>`;
            });
            lucide.createIcons();
        }
    });
}

function copyId(id) {
    navigator.clipboard.writeText(id);
    alert('Decal ID Copied to Clipboard!');
}

loadGallery();
