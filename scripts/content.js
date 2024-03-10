
// Local representation of the state
var state = {
    "isDarkMode": false,
    "inverse": 95,
    "contrast": 100,
    "brightness": 100,
    "saturation": 100
};

const defaultState = () => {
    return {
        "isDarkMode": false,
        "inverse": 95,
        "contrast": 100,
        "brightness": 100,
        "saturation": 100
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



// Helper functions
const elementExceptions = ["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME", "EMBED", "OBJECT"];
var elementColorDict = {};

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


function clientUpdateDarkMode(darkMode, inverse) {
    document.querySelectorAll("*").forEach(element => {
        elementColorDict[element] = getComputedStyle(element).backgroundColor;
    });
    document.body.style.filter = darkMode ? `invert(${inverse}%)` : "invert(0%)";
    // Reverse the filter for all exceptions
    document.querySelectorAll(elementExceptions).forEach(element => {
        element.style.filter = !darkMode ? "invert(0%)" : `invert(${inverse}%)`;
    });
}

function invertColor(color) {
    rgbArray = color.match(/\d+/g);
    return 'rgb(' + (255 - rgbArray[0]) + ', ' + (255 - rgbArray[1]) + ', ' + (255 - rgbArray[2]) + ')';
}