// disable tab key
document.querySelectorAll('.disable-tab').forEach(input => {
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
          e.preventDefault();
        }
    });
} );

// ==========================================
// 1. EmailJS Initialization
// ==========================================
emailjs.init("OpnO-Q38LDoO1IxY8");

document.getElementById('verification-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;

  const verificationCode = Math.floor(100000 + Math.random() * 900000);
  const formattedTime = new Date(Date.now() + 3 * 60 * 1000).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit'
  });

  sessionStorage.setItem('sentCode', verificationCode);

  // Show the boxes/numbers section now that a code has been sent
  document.getElementById('drag-section').style.display = 'block';
  // Store the code in the boxes as a guide (split digits)
  window.expectedCode = String(verificationCode);

  const templateParams = {
    name:     username,
    to_email: email,
    passcode: verificationCode,
    time:     formattedTime
  };

  console.log("What JS is sending to EmailJS:", templateParams);

  emailjs.send('service_vsor7t5', 'template_we9ahji', templateParams)
    .then(function() {
      alert('Verification code sent!');
    }, function(error) {
      alert('Failed to send code. Please try again.');
      console.error('EmailJS Error:', error);
    });
});

// ==========================================
// 2. Verification Layout Randomizer
// ==========================================
function randomizeLayout() {
    const elements = document.querySelectorAll('#verification-form input, #verification-form button');

    elements.forEach(el => {
        const randomMarginLeft = Math.random() * 300;
        const randomWidth = 150 + Math.random() * 200;
        const randomTop = Math.random() * 100;

        el.style.marginLeft = `${randomMarginLeft}px`;
        el.style.width = `${randomWidth}px`;
        el.style.marginTop = `${randomTop}px`;
    });
}

//randomizeLayout(); // run once immediately on load
//setInterval(randomizeLayout,500); // changes layout periodically

// ==========================================
// 3. Drag & Drop Functional Logic
// ==========================================
let dragging = null;
let offsetX = 0, offsetY = 0;
const boxPositions = {};
let willFail = false;
let startX = 0, startY = 0;
let hasFailed = false;

document.querySelectorAll('.box').forEach(box => {
  box.addEventListener('mousedown', (e) => {
    dragging = box;
    willFail = Math.random() < 0.30;
    hasFailed = false;

    if (boxPositions[box.id]) {
      boxPositions[box.id].classList.remove('has-box');
      boxPositions[box.id] = null;
    }

    const rect = box.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    startX = rect.left;
    startY = rect.top;

    box.classList.add('dragging');
    box.style.left   = rect.left + 'px';
    box.style.top    = rect.top  + 'px';
    box.style.width  = '35px';
    box.style.height = '35px';
    document.body.appendChild(box);
    e.preventDefault();
  });
});

document.addEventListener('mousemove', (e) => {
  if (!dragging || hasFailed) return;

  const currentX = e.clientX - offsetX;
  const currentY = e.clientY - offsetY;

  dragging.style.left = currentX + 'px';
  dragging.style.top  = currentY + 'px';

  if (willFail) {
    const distTraveled = Math.hypot(currentX - startX, currentY - startY);
    if (distTraveled > 80) {
      hasFailed = true;
      const snapBack = dragging;
      snapBack.style.transition = 'left 0.3s ease, top 0.3s ease';
      snapBack.style.left = startX + 'px';
      snapBack.style.top  = startY + 'px';

      setTimeout(() => {
        snapBack.style.transition = '';
        snapBack.classList.remove('dragging');
        snapBack.style.cssText = '';
        document.getElementById('box-tray').appendChild(snapBack);
        dragging = null;
      }, 300);
    }
  }
});

document.addEventListener('mouseup', (e) => {
  if (!dragging || hasFailed) return;

  const numbers = document.querySelectorAll('.numbers span');
  let nearest = null;
  let minDist = Infinity;

  numbers.forEach(num => {
    const rect = num.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
    if (dist < minDist) { minDist = dist; nearest = num; }
  });

  if (nearest && minDist < 80) {
    const rect = nearest.getBoundingClientRect();
    dragging.style.left = rect.left + 'px';
    dragging.style.top  = rect.top  + 'px';
    nearest.classList.add('has-box');
    boxPositions[dragging.id] = nearest;
  } else {
    dragging.classList.remove('dragging');
    dragging.style.cssText = '';
    document.getElementById('box-tray').appendChild(dragging);
  }

  dragging.classList.remove('dragging');
  dragging = null;
});

// ==========================================
// 4. Verification Code Processing
// ==========================================
document.getElementById('verify-btn').addEventListener('click', () => {
  const sentCode = sessionStorage.getItem('sentCode');
  if (!sentCode) {
    alert('Please request a code first!');
    return;
  }

  let entered = '';
  for (let i = 0; i < 6; i++) {
    const snap = boxPositions['box-' + i];
    entered += snap ? snap.dataset.num : '_';
  }

  if (entered === sentCode) {
    alert('Code verified! Welcome.');
  } else {
    alert(`Wrong code. You entered: ${entered}`);
  }
});

// ==========================================
// 5.  Ad Spawn
// ==========================================
const adsMap = {
  'ads/ad_1.png': 'https://www.mcdonalds.com/ca/en-ca.html',
  'ads/ad_2.png': 'https://www.timhortons.ca/',
  'ads/ad_3.jpg': 'https://www.kfc.ca/',
};

const adContainer = document.getElementById('ad-container');

// Spawns ads on generic page background clicks
document.addEventListener('click', (event) => {
    if (!event.target.closest('.ad-link-wrapper')) {
        createAd();
    }
});

function createAd() {
    const imagePaths = Object.keys(adsMap);
    const randomIndex = Math.floor(Math.random() * imagePaths.length);
    const chosenImagePath = imagePaths[randomIndex];
    const targetUrl = adsMap[chosenImagePath];

    // Create link wrapper
    const adLink = document.createElement('a');
    adLink.href = targetUrl;
    adLink.target = '_blank'; 
    adLink.classList.add('ad-link-wrapper');

    // Create image
    const adImage = document.createElement('img');
    adImage.src = chosenImagePath;
    adImage.classList.add('pop-up-ad');
    adLink.appendChild(adImage);

    // Dynamic Viewport Math
    const maxX = window.innerWidth - 300;
    const maxY = window.innerHeight - 250;
    const randomX = Math.max(0, Math.floor(Math.random() * maxX));
    const randomY = Math.max(0, Math.floor(Math.random() * maxY));

    adLink.style.position = 'fixed';
    adLink.style.left = `${randomX}px`;
    adLink.style.top = `${randomY}px`;
    adLink.style.zIndex = '9999';

    // Click handler for replacement loops
    adLink.addEventListener('click', (event) => {
        event.stopPropagation();
        createAd();
        adLink.remove(); 
    });

    adContainer.appendChild(adLink);
}