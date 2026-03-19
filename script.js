const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";
const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}`, "Content-Type": "application/json" };

async function loadGallery(sort = 'new') {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`tab-${sort}`).classList.add('active');

    let fetchUrl = URL + "?select=*";
    if (sort === 'popular') fetchUrl += "&order=likes.desc";
    else fetchUrl += "&order=created_at.desc";

    const res = await fetch(fetchUrl, { headers });
    const data = await res.json();
    const grid = document.getElementById('main-grid');
    if (!grid) return;
    
    grid.innerHTML = "";
    data.forEach(p => {
        // Use the first decal as the cover image
        const coverImg = p.decals[0] ? `https://www.roblox.com/asset-thumbnail/image?assetId=${p.decals[0]}&width=420&height=420&format=png` : '';
        grid.innerHTML += `
            <div class="card">
                <div class="card-img" onclick="location.href='player.html?user=${p.username}'">
                    <img src="${coverImg}">
                </div>
                <div class="card-name">${p.username}</div>
                <div class="card-footer">
                    <div class="like-box" onclick="like('${p.username}', ${p.likes})">
                        <i data-lucide="heart"></i> <span id="l-${p.username}">${p.likes}</span>
                    </div>
                    <div style="color:#444; font-size:0.8rem">${p.decals.length} Items</div>
                </div>
                <button class="copy-btn" onclick="location.href='player.html?user=${p.username}'">OPEN COLLECTION</button>
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
                        <div class="card-img">
                            <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        </div>
                        <button class="copy-btn" onclick="copyId('${id}')">COPY ID</button>
                    </div>`;
            });
            lucide.createIcons();
        }
    });
}

function copyId(id) {
    navigator.clipboard.writeText(id);
    alert('ID Copied!');
}

loadGallery();
