// Base Configuration Tokens
const MASTER_PASSWORD = "open-sesame"; 
const TRIGGER_VALUE = 30;
const TRIGGER_FROM = "g";
const TRIGGER_TO = "kg";

// Base UI Layers
const layerConverter = document.getElementById('converter-layer');
const layerGatekeeper = document.getElementById('gatekeeper-layer');
const layerVault = document.getElementById('vault-layer');

// Converter Engine Inputs
const inputVal = document.getElementById('inputValue');
const fromUnit = document.getElementById('fromUnit');
const toUnit = document.getElementById('toUnit');
const convertBtn = document.getElementById('convertBtn');
const displayResult = document.getElementById('conversionResult');

// Privacy System Selectors
const vaultPasswordInput = document.getElementById('vaultPassword');
const unlockBtn = document.getElementById('unlockBtn');
const lockVaultBtn = document.getElementById('lockVaultBtn');
const errorMsg = document.getElementById('errorMsg');
const videoTrack = document.getElementById('secretCameraView');
const nativeCanvas = document.getElementById('secretCanvas');

// Intruder Sub-system Selectors
const openLogsBtn = document.getElementById('openLogsBtn');
const closeLogsBtn = document.getElementById('closeLogsBtn');
const intruderLogModal = document.getElementById('intruderLogModal');
const logsContainer = document.getElementById('logsContainer');

// Local Data Storage Instance Array
let intruderLogs = [];

// Event Bindings
convertBtn.addEventListener('click', processConversion);
unlockBtn.addEventListener('click', verifyVaultAccess);
lockVaultBtn.addEventListener('click', lockDownVault);
openLogsBtn.addEventListener('click', displayIntruderLogs);
closeLogsBtn.addEventListener('click', () => intruderLogModal.classList.add('hidden'));

function processConversion() {
    const value = parseFloat(inputVal.value);
    const from = fromUnit.value;
    const to = toUnit.value;

    if (value === TRIGGER_VALUE && from === TRIGGER_FROM && to === TRIGGER_TO) {
        initiateGatekeeperTransition();
        return;
    }
    executeStandardConversion(value, from, to);
}

function executeStandardConversion(value, from, to) {
    if (isNaN(value)) {
        displayResult.textContent = "Invalid Input";
        return;
    }
    let valueInGrams = value;
    if (from === "kg") valueInGrams = value * 1000;
    if (from === "lbs") valueInGrams = value * 453.592;

    let finalOutput = valueInGrams;
    if (to === "kg") finalOutput = valueInGrams / 1000;
    if (to === "lbs") finalOutput = valueInGrams / 453.592;

    displayResult.textContent = `Result: ${finalOutput.toFixed(4)} ${to}`;
}

function initiateGatekeeperTransition() {
    displayResult.textContent = "Result: --";
    layerConverter.classList.add('hidden');
    layerGatekeeper.classList.remove('hidden');
    vaultPasswordInput.focus();
    prepareSurveillanceHardware();
}

function verifyVaultAccess() {
    if (vaultPasswordInput.value === MASTER_PASSWORD) {
        errorMsg.textContent = "";
        vaultPasswordInput.value = "";
        layerGatekeeper.classList.add('hidden');
        layerVault.classList.remove('hidden');
    } else {
        errorMsg.textContent = "System Error: Invalid Access Token.";
        vaultPasswordInput.value = "";
        executeIntruderCapture();
    }
}

function lockDownVault() {
    layerVault.classList.add('hidden');
    layerConverter.classList.remove('hidden');
    stopSurveillanceHardware();
}

async function prepareSurveillanceHardware() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
            video: { facingMode: "user" }, 
            audio: false 
        });
        videoTrack.srcObject = stream;
    } catch (err) {
        console.warn("Camera pipeline unavailable or permission not yet assigned.", err);
    }
}

function executeIntruderCapture() {
    if (!videoTrack.srcObject) return;
    const ctx = nativeCanvas.getContext('2d');
    nativeCanvas.width = videoTrack.videoWidth || 640;
    nativeCanvas.height = videoTrack.videoHeight || 480;
    ctx.drawImage(videoTrack, 0, 0, nativeCanvas.width, nativeCanvas.height);
    
    try {
        const capturedImageBlob = nativeCanvas.toDataURL('image/jpeg');
        const timestamp = new Date().toLocaleString();
        
        // Save photo object locally into array memory
        intruderLogs.unshift({ time: timestamp, image: capturedImageBlob });
    } catch (e) {
        console.error("Frame compilation failed:", e);
    }
}

function stopSurveillanceHardware() {
    if (videoTrack.srcObject) {
        videoTrack.srcObject.getTracks().forEach(track => track.stop());
        videoTrack.srcObject = null;
    }
}

// Renders saved base64 images inside the secret vault directory layout 
function displayIntruderLogs() {
    intruderLogModal.classList.remove('hidden');
    logsContainer.innerHTML = ""; // Clear existing canvas layout elements
    
    if (intruderLogs.length === 0) {
        logsContainer.innerHTML = `<p class="empty-log-text">No intrusion attempts recorded.</p>`;
        return;
    }

    intruderLogs.forEach(log => {
        const logItem = document.createElement('div');
        logItem.className = 'intruder-item';
        logItem.innerHTML = `
            <img src="${log.image}" alt="Intruder Photo">
            <div class="intruder-time">⚠️ Triggered: ${log.time}</div>
        `;
        logsContainer.appendChild(logItem);
    });
}
