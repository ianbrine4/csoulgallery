const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";
const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}` };

function search() {
    const n = document.getElementById('pSearch').value;
    if(n) location.href = `player.html?user=${n}`;
}

// Index Grid
if (document.getElementById('player-grid')) {
    fetch(URL + "?select=*", { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('player-grid');
        data.forEach(p => {
            grid.innerHTML += `
                <div class="card">
                    <img src="https://www.roblox.com/headshot-thumbnail/image?keyword=${p.username}&width=420&height=420&format=png">
                    <h3>${p.username}</h3>
                    <button onclick="location.href='player.html?user=${p.username}'">VIEW 🌙</button>
                </div>`;
        });
    });
}

// Player Grid
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
                        <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        <p style="color: #888;">ID: ${id}</p>
                        <button onclick="navigator.clipboard.writeText('${id}'); alert('Copied!')">COPY ID</button>
                    </div>`;
            });
        }
    });
}
