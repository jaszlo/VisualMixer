let isDarkMode = false;

chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
    if (request.action === "toggleDarkMode") {
        toggleDarkMode();
        sendResponse({ success: true });
    }
});

const elementExceptions = ["IMG", "VIDEO", "CANVAS", "SVG", "IFRAME", "EMBED", "OBJECT"];
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.style.filter = isDarkMode ? "invert(0.95)" : "invert(0)";

    // Reverse the filter for all exceptions
    document.querySelectorAll(elementExceptions).forEach(element => {
        element.style.filter = !isDarkMode ? "invert(0)" : "invert(0.95)";
    });
}