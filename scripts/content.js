
// Local representation of the state
var state = {
    "isDarkMode": false,
    "strength": 0.95
};

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
        const pageState = data[currentURL] || {"isDarkMode": false, "strength": 0.95};
        callback(pageState);
    });
}



chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "toggleDarkMode") {
        state.isDarkMode = !state.isDarkMode;
        state.strength = request.strength;
        saveCurrentState();
        clientUpdateDarkMode(state.isDarkMode, state.strength);
        sendResponse({ success: true });

    } else if (request.action === "updateDarkModeStrength") {
        clientUpdateDarkMode(state.isDarkMode, request.strength);
        sendResponse({ success: true });

    } else if (request.action === "saveState") {
        saveCurrentState();
        sendResponse({ success: true });

    } else if (request.action === "getState") {
        sendResponse({ success: true, state: state});
    }
     else {
        sendResponse({ success: false });
    }
});


document.onreadystatechange = () => {
    getCurrentState((currentState) => {
        state = currentState;
        clientUpdateDarkMode(state.isDarkMode, state.strength);
    });
};



// Helper functions
const elementExceptions = ["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME", "EMBED", "OBJECT"];
var elementColorDict = {};

function clientUpdateDarkMode(darkMode, strength) {
    elementColorDict = {};
    document.querySelectorAll("*").forEach(element => {
        elementColorDict[element] = getComputedStyle(element).backgroundColor;
    });
    document.body.style.filter = darkMode ? `invert(${strength})` : "invert(0)";

    document.querySelectorAll("*").forEach(element => {
        let currentColor = getComputedStyle(element).backgroundColor;
        if (elementColorDict[element] !== currentColor) {
            return;
        }
        let invertedColor = invertColor(currentColor);
        //element.style.backgroundColor = invertedColor;
    });

    // Reverse the filter for all exceptions
    document.querySelectorAll(elementExceptions).forEach(element => {
        element.style.filter = !darkMode ? "invert(0)" : `invert(${strength})`;
    });
}

function invertColor(color) {
    rgbArray = color.match(/\d+/g);
    return 'rgb(' + (255 - rgbArray[0]) + ', ' + (255 - rgbArray[1]) + ', ' + (255 - rgbArray[2]) + ')';
}