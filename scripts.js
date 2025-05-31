const GITHUB_USERNAME = 'bhushanaditya';
const GITHUB_API_URL = `https://api.github.com/users/${GITHUB_USERNAME}`;

// Elements
const avatarEl = document.getElementById('avatar');
const nameEl = document.getElementById('name');
const bioEl = document.getElementById('bio');
const reposEl = document.querySelector('#repos .stat-number');
const followersEl = document.querySelector('#followers .stat-number');
const followingEl = document.querySelector('#following .stat-number');
const socialLinksEl = document.getElementById('social-links');

// Fetch GitHub profile data
async function fetchGitHubProfile() {
    try {
        const response = await fetch(GITHUB_API_URL);
        if (!response.ok) {
            throw new Error('Failed to fetch GitHub profile');
        }
        const data = await response.json();
        updateProfile(data);
    } catch (error) {
        console.error('Error:', error);
        showError();
    }
}

// Update profile information
function updateProfile(data) {
    // Update avatar
    avatarEl.src = data.avatar_url;
    
    // Update name and bio
    nameEl.textContent = data.name || GITHUB_USERNAME;
    bioEl.textContent = data.bio || 'Software Developer';
    
    // Update stats with animation
    animateNumber(reposEl, data.public_repos);
    animateNumber(followersEl, data.followers);
    animateNumber(followingEl, data.following);
    
    // Add social links
    if (data.blog) addSocialLink('Website', data.blog);
    if (data.html_url) addSocialLink('GitHub', data.html_url);
    if (data.twitter_username) addSocialLink('Twitter', `https://twitter.com/${data.twitter_username}`);
}

// Animate number counting
function animateNumber(element, final) {
    let start = 0;
    const duration = 1000;
    const step = (timestamp) => {
        if (!start) start = timestamp;
        const progress = Math.min((timestamp - start) / duration, 1);
        const current = Math.floor(progress * final);
        element.textContent = current;
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    window.requestAnimationFrame(step);
}

// Add social link
function addSocialLink(platform, url) {
    const link = document.createElement('a');
    link.href = url;
    link.className = 'social-link';
    link.textContent = platform;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    socialLinksEl.appendChild(link);
}

// Show error message
function showError() {
    nameEl.textContent = 'Error loading profile';
    bioEl.textContent = 'Please try again later';
}

// Initialize
document.addEventListener('DOMContentLoaded', fetchGitHubProfile);

// Matrix rain effect
const canvas = document.getElementById('matrixCanvas');
const ctx = canvas.getContext('2d');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Matrix rain characters
const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
const drops = [];
const fontSize = 14;
const columns = canvas.width / fontSize;

// Initialize drops
for (let i = 0; i < columns; i++) {
    drops[i] = 1;
}

// Draw matrix rain
function drawMatrix() {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#0F0';
    ctx.font = fontSize + 'px monospace';

    for (let i = 0; i < drops.length; i++) {
        const text = characters.charAt(Math.floor(Math.random() * characters.length));
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

// Game variables
let gameActive = false;
let score = 0;
let player = null;
let coins = [];
let gameLoop = null;

// Initialize game
function initGame() {
    const container = document.getElementById('game-container');
    container.classList.remove('hidden');
    
    // Create player
    player = document.createElement('div');
    player.className = 'player';
    container.appendChild(player);
    
    // Player position
    let playerX = 250;
    let playerY = 250;
    
    // Update player position
    function updatePlayer() {
        player.style.transform = `translate(${playerX}px, ${playerY}px)`;
    }
    
    // Movement
    const keys = {};
    window.addEventListener('keydown', (e) => {
        keys[e.key] = true;
    });
    window.addEventListener('keyup', (e) => {
        keys[e.key] = false;
    });
    
    // Spawn coin
    function spawnCoin() {
        const coin = document.createElement('div');
        coin.className = 'coin';
        const x = Math.random() * (container.clientWidth - 20);
        const y = Math.random() * (container.clientHeight - 20);
        coin.style.transform = `translate(${x}px, ${y}px)`;
        container.appendChild(coin);
        coins.push({ element: coin, x, y });
    }
    
    // Game loop
    function gameUpdate() {
        // Move player
        if (keys['ArrowLeft']) playerX = Math.max(0, playerX - 5);
        if (keys['ArrowRight']) playerX = Math.min(container.clientWidth - 20, playerX + 5);
        if (keys['ArrowUp']) playerY = Math.max(0, playerY - 5);
        if (keys['ArrowDown']) playerY = Math.min(container.clientHeight - 20, playerY + 5);
        
        updatePlayer();
        
        // Check coin collisions
        coins.forEach((coin, index) => {
            const dx = playerX - coin.x;
            const dy = playerY - coin.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 20) {
                coin.element.remove();
                coins.splice(index, 1);
                score += 10;
                document.getElementById('score').textContent = score;
                spawnCoin();
            }
        });
    }
    
    // Start game
    score = 0;
    document.getElementById('score').textContent = score;
    spawnCoin();
    spawnCoin();
    gameLoop = setInterval(gameUpdate, 16);
    gameActive = true;
}

// Easter eggs and event listeners
let konami = '';
const konamiCode = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';

window.addEventListener('keydown', (e) => {
    konami += e.key;
    if (konami.length > konamiCode.length) {
        konami = konami.substring(1);
    }
    if (konami.includes(konamiCode)) {
        document.body.style.transform = 'rotate(180deg)';
        setTimeout(() => {
            document.body.style.transform = 'none';
        }, 3000);
        konami = '';
    }
    
    if (e.key === 'k' && !gameActive) {
        document.getElementById('easter-egg-overlay').classList.add('hidden');
        initGame();
    }
});

// Profile image easter egg
document.getElementById('avatar').addEventListener('click', () => {
    if (!gameActive) {
        document.getElementById('easter-egg-overlay').classList.remove('hidden');
    }
});

// Start matrix animation
setInterval(drawMatrix, 33);
