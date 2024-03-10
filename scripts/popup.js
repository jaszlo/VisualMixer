function triggerValueUpdate(name, value) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateValue", name: name, value: value }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (!response || !response.success) {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
}

function triggerStateSave() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "saveState" }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (!response || !response.success) {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
}

function setHUD(state) {
    const isDarkMode = state.isDarkMode;
    document.getElementById("darkModeToggle").checked = isDarkMode;
    slider["inverse"].element.disabled = !isDarkMode;
    sliderNames.forEach((name) => {
        slider[name].element.value = state[name];
        slider[name].display.textContent = state[name] + "%";
    });
}

function triggerReset() {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "reset" }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (!response || !response.success) {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
    // Reset POP-UP HUD to reflect the new state
    getState(setHUD);
}

function getState(callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (response && response.success) {
                callback(response.state);
            } else {
                console.log(`Unexpected response: ${response}`);
            }
        });
    });
}


const sliderNames = ["inverse", "contrast", "brightness", "saturation"];
let slider = {};

document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("resetButton");
    resetButton.onclick = triggerReset;

    const darkModeToggle = document.getElementById("darkModeToggle");
    darkModeToggle.addEventListener("change", () => {
        inverseStrength.disabled = !darkModeToggle.checked;
        triggerValueUpdate("isDarkMode", darkModeToggle.checked);
        triggerStateSave();
    });

    sliderNames.forEach((name) => {
        const sliderElement = document.getElementById(name + "Strength");
        const displayElement = document.getElementById(name + "StrengthDisplay");
        slider[name] = {element: sliderElement, display: displayElement};

        sliderElement.addEventListener("input", () => {
            triggerValueUpdate(name, sliderElement.value);
            displayElement.textContent = sliderElement.value + "%";
        });
        sliderElement.addEventListener("change", () => {
            triggerValueUpdate(name, sliderElement.value);
            displayElement.textContent = sliderElement.value + "%";
            triggerStateSave();
        });
    });

    getState(setHUD);
});