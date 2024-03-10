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

    getState((state) => {
        console.log(state);
        const isDarkMode = state.isDarkMode;
        darkModeToggle.checked = isDarkMode;
        darkModeStrength.disabled = !isDarkMode;
        darkModeStrength.value = Math.round(state.strength * darkModeStrength.max);
        darkModeStrengthDisplay.textContent = Math.round((darkModeStrength.value * 100) / darkModeStrength.max ) + "%";
        contrastStrength.value = state.contrast;
        contrastStrengthDisplay.textContent = contrastStrength.value + "%";
        
    });

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


document.addEventListener("DOMContentLoaded", () => {
    const resetButton = document.getElementById("resetButton");
    resetButton.onclick = triggerReset;

    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeStrength = document.getElementById("darkModeStrength");
    const darkModeStrengthDisplay = document.getElementById("darkModeStrengthDisplay");

    const contrastStrength = document.getElementById("contrastStrength");
    const contrastStrengthDisplay = document.getElementById("contrastStrengthDisplay");

    const brightnessStrength = document.getElementById("brightnessStrength");
    const brightnessStrengthDisplay = document.getElementById("brightnessStrengthDisplay");

    darkModeToggle.addEventListener("change", () => {
        darkModeStrength.disabled = !darkModeToggle.checked;
        triggerValueUpdate("isDarkMode", darkModeToggle.checked);
    });

    darkModeStrength.addEventListener("input", () => {
        darkModeStrengthDisplay.textContent = Math.round((darkModeStrength.value * 100) / darkModeStrength.max ) + "%";
        triggerValueUpdate("strength", darkModeStrength.value / darkModeStrength.max);
    });
    darkModeStrength.addEventListener("change", () => {
        darkModeStrengthDisplay.textContent = Math.round((darkModeStrength.value * 100) / darkModeStrength.max ) + "%";
        triggerValueUpdate("strength", darkModeStrength.value / darkModeStrength.max);
        triggerStateSave();
    });

    contrastStrength.addEventListener("input", () => {
        triggerValueUpdate("contrast", contrastStrength.value);
        contrastStrengthDisplay.textContent = contrastStrength.value + "%";
    });
    contrastStrength.addEventListener("change", () => {
        triggerValueUpdate("contrast", contrastStrength.value);
        contrastStrengthDisplay.textContent = contrastStrength.value + "%";
        triggerStateSave
    });

    brightnessStrength.addEventListener("input", () => {
        triggerValueUpdate("brightness", brightnessStrength.value);
        brightnessStrengthDisplay.textContent = brightnessStrength.value + "%";
    });
    brightnessStrength.addEventListener("change", () => {
        triggerValueUpdate("brightness", brightnessStrength.value);
        brightnessStrengthDisplay.textContent = brightnessStrength.value + "%";
        triggerStateSave();
    });

    getState((state) => {
        const isDarkMode = state.isDarkMode;
        darkModeToggle.checked = isDarkMode;
        darkModeStrength.disabled = !isDarkMode;
        darkModeStrength.value = Math.round(state.strength * darkModeStrength.max);
    });
});