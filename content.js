let isDarkMode = false;

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "toggleDarkMode") {
        toggleDarkMode();
        sendResponse({ success: true });
    }
});

const elementExceptions = ["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME", "EMBED", "OBJECT"];
var elementColorDict = {};

function toggleDarkMode() {
    elementColorDict = {};
    document.querySelectorAll("*").forEach(element => {
        elementColorDict[element] = getComputedStyle(element).backgroundColor;
    });

    isDarkMode = !isDarkMode;
    document.body.style.filter = isDarkMode ? "invert(0.95)" : "invert(0)";

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
        element.style.filter = !isDarkMode ? "invert(0)" : "invert(0.95)";
    });
}

function invertColor(color) {
    rgbArray = color.match(/\d+/g);
    return 'rgb(' + (255 - rgbArray[0]) + ', ' + (255 - rgbArray[1]) + ', ' + (255 - rgbArray[2]) + ')';
}