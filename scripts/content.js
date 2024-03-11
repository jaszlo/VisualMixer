
// Local representation of the state
var state = {
    "isDarkMode": false,
    "inverse": 95,
    "contrast": 100,
    "brightness": 100,
    "saturation": 100,
    "hueRotation": 0
};

const defaultState = () => {
    return {
        "isDarkMode": false,
        "inverse": 95,
        "contrast": 100,
        "brightness": 100,
        "saturation": 100,
        "hueRotation": 0
    };
}

// State management
function saveCurrentState() {
    const currentURL = document.location.host;
    chrome.storage.sync.get((data) => {
        const allStates = data || {};
        allStates[currentURL] = state;
        chrome.storage.sync.set(allStates);
    });
}


function getCurrentState(callback) {
    const currentURL = document.location.host;
    chrome.storage.sync.get(currentURL, (data) => {
        const pageState = data[currentURL] || defaultState();
        callback(pageState);
    });
}



chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
     if (request.action === "updateValue") {
        state[request.name] = request.value;
        switch (request.name) {
            case "isDarkMode": 
                clientUpdateDarkMode(state.isDarkMode, state.inverse);
                break;
            case "inverse":
                clientUpdateDarkMode(state.isDarkMode, state.inverse);
                break;
            case "contrast":
                clientUpdateContrast(state.contrast);
                break;
            case "brightness":
                clientUpdateBrightness(state.brightness);
                break;
            case "saturation":
                clientUpdateSaturation(state.saturation);
                break;
            case "hueRotation":
                clientUpdateHueRotation(state.hueRotation);
                break;
            default:
                break;
        }
        sendResponse({ success: true });

    } else if (request.action === "saveState") {
        saveCurrentState();
        sendResponse({ success: true });

    } else if (request.action === "getState") {
        sendResponse({ success: true, state: state});
    } else if (request.action === "reset") {
        state = defaultState();
        clientUpdateDarkMode(state.isDarkMode, state.inverse);
        clientUpdateContrast(state.contrast);
        clientUpdateBrightness(state.brightness);
        clientUpdateSaturation(state.saturation);
        clientUpdateHueRotation(state.hueRotation);
        saveCurrentState();
        sendResponse({ success: true });

    } else {
        sendResponse({ success: false });
    }
});


document.onreadystatechange = () => {
    getCurrentState((currentState) => {
        state = currentState;
        clientUpdateDarkMode(state.isDarkMode, state.inverse);
    });
};

function clientUpdateContrast(contrast) {
    let currentFilter = document.body.style.filter;
    if (currentFilter.includes("contrast")) {
        document.body.style.filter = currentFilter.replace(/contrast\(\d+%\)/, `contrast(${contrast}%)`);
    } else {
        document.body.style.filter += `contrast(${contrast}%)`;
    }
}

function clientUpdateBrightness(brightness) {
    let currentFilter = document.body.style.filter;
    if (currentFilter.includes("brightness")) {
        document.body.style.filter = currentFilter.replace(/brightness\(\d+%\)/, `brightness(${brightness}%)`);
    } else {
        document.body.style.filter += `brightness(${brightness}%)`;
    }
}

function clientUpdateSaturation(saturation) {
    let currentFilter = document.body.style.filter;
    if (currentFilter.includes("saturate")) {
        document.body.style.filter = currentFilter.replace(/saturate\(\d+%\)/, `saturate(${saturation}%)`);
    } else {
        document.body.style.filter += `saturate(${saturation}%)`;
    }
}
const elementExceptions = ["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME", "EMBED", "OBJECT"];

function clientUpdateHueRotation(hueRotation) {
    let currentFilter = document.body.style.filter;
    if (currentFilter.includes("hue-rotate")) {
        document.body.style.filter = currentFilter.replace(/hue-rotate\(\d+deg\)/, `hue-rotate(${hueRotation}deg)`);
    } else {
        document.body.style.filter += `hue-rotate(${hueRotation}deg)`;
        console.log(document.body.style.filter)
    }

    // Remove hue rotation for all exceptions
    document.querySelectorAll(elementExceptions).forEach(element => {
        let currentFilter = element.style.filter;
        element.style.filter = currentFilter.replace(/hue-rotate\(\d+deg\)/, `hue-rotate(${0}deg)`);
    });
}

// Helper functions
function clientUpdateDarkMode(darkMode, inverse) {
    document.body.style.filter = darkMode ? `invert(${inverse}%)` : "invert(0%)";
    // Reverse the filter for all exceptions
    document.querySelectorAll(elementExceptions).forEach(element => {
        element.style.filter = !darkMode ? "invert(0%)" : `invert(${inverse}%)`;
    });
}