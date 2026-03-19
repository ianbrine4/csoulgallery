const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";

const headers = {
    "apikey": KEY,
    "Authorization": `Bearer ${KEY}`,
    "Content-Type": "application/json"
};

function searchPlayer() {
    const name = document.getElementById('searchInput').value;
    if (name) location.href = `player.html?user=${name}`;
}

// Load Index Gallery
if (document.getElementById('player-grid')) {
    fetch(URL + "?select=*", { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('player-grid');
        data.forEach(item => {
            grid.innerHTML += `
                <div class="card">
                    <img src="https://www.roblox.com/headshot-thumbnail/image?keyword=${item.username}&width=420&height=420&format=png">
                    <h3>${item.username}</h3>
                    <button onclick="location.href='player.html?user=${item.username}'">ENTER GALLERY</button>
                </div>`;
        });
    });
}

// Load Specific Player
if (document.getElementById('decal-grid')) {
    const params = new URLSearchParams(window.location.search);
    const user = params.get('user');
    document.getElementById('player-name').innerText = user;
    document.getElementById('player-avatar').src = `https://www.roblox.com/headshot-thumbnail/image?keyword=${user}&width=420&height=420&format=png`;

    fetch(`${URL}?username=eq.${user}`, { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('decal-grid');
        if (data[0] && data[0].decals) {
            data[0].decals.forEach(id => {
                grid.innerHTML += `
                    <div class="card">
                        <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        <p>ID: ${id}</p>
                        <button onclick="navigator.clipboard.writeText('${id}'); alert('Copied ID!')">COPY ID</button>
                    </div>`;
            });
        } else {
            grid.innerHTML = "<h1>No Stickers Stolen Yet.</h1>";
        }
    });
}
