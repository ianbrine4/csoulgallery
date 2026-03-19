const URL = "https://uwuhkzovwjnhclzkrcsm.supabase.co/rest/v1/gallery";
const KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV3dWhrem92d2puaGNsemtyY3NtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM4OTU1NjcsImV4cCI6MjA4OTQ3MTU2N30.jdoN-TGZfSWHvyp0u_Tjfmxr1-3jqHGwt2QQTAwVMRc";
const headers = { "apikey": KEY, "Authorization": `Bearer ${KEY}` };

function search() {
    const val = document.getElementById('pSearch').value;
    if(val) location.href = `player.html?user=${val}`;
}

// Index Load
if (document.getElementById('player-grid')) {
    fetch(URL + "?select=*", { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('player-grid');
        data.forEach(p => {
            grid.innerHTML += `
                <div class="card">
                    <img src="https://www.roblox.com/headshot-thumbnail/image?keyword=${p.username}&width=420&height=420&format=png">
                    <h4 style="margin-bottom:10px">${p.username}</h4>
                    <button style="width:100%; padding: 8px; font-size: 11px;" onclick="location.href='player.html?user=${p.username}'">VIEW GALLERY</button>
                </div>`;
        });
    });
}

// Player Load
if (document.getElementById('decal-grid')) {
    const user = new URLSearchParams(window.location.search).get('user');
    document.getElementById('p-name').innerText = user.toUpperCase();
    document.getElementById('p-avatar').src = `https://www.roblox.com/headshot-thumbnail/image?keyword=${user}&width=420&height=420&format=png`;

    fetch(`${URL}?username=eq.${user}`, { headers })
    .then(r => r.json())
    .then(data => {
        const grid = document.getElementById('decal-grid');
        if(data[0] && data[0].decals) {
            data[0].decals.forEach(id => {
                grid.innerHTML += `
                    <div class="card">
                        <img src="https://www.roblox.com/asset-thumbnail/image?assetId=${id}&width=420&height=420&format=png">
                        <button style="width:100%; padding: 8px; font-size: 11px;" onclick="navigator.clipboard.writeText('${id}'); alert('Copied!')">COPY ID</button>
                    </div>`;
            });
        }
    });
}
