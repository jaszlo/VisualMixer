function triggerDarkModeToggle(strength) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggleDarkMode", strength: strength }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (!response || !response.success) {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
}


function triggerDarkModeStrengthUpdate(strength) {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "updateDarkModeStrength", strength: strength }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (!response || !response.success) {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
}

function triggerDarkModeStateSave() {
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


document.addEventListener("DOMContentLoaded", () => {
    const darkModeToggle = document.getElementById("darkModeToggle");
    const darkModeStrength = document.getElementById("darkModeStrength");
    const darkModeStrengthDisplay = document.getElementById("darkModeStrengthDisplay");

    darkModeToggle.addEventListener("change", () => {
        triggerDarkModeToggle(darkModeStrength.value / darkModeStrength.max);
        darkModeStrength.disabled = !darkModeToggle.checked;
    });

    darkModeStrength.addEventListener("input", () => {
        triggerDarkModeStrengthUpdate(darkModeStrength.value / darkModeStrength.max);
        darkModeStrengthDisplay.textContent = Math.round((darkModeStrength.value * 100) / darkModeStrength.max ) + "%";
    });

    darkModeStrength.addEventListener("change", () => {
        triggerDarkModeStrengthUpdate(darkModeStrength.value / darkModeStrength.max);
        triggerDarkModeStateSave();
    });

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, response => {
            console.log("popup received state");
            console.log(response);
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (response && response.success) {
                const isDarkMode = response.state.isDarkMode;
                darkModeToggle.checked = isDarkMode;
                darkModeStrength.disabled = !isDarkMode;
                darkModeStrength.value = Math.round(response.state.strength * darkModeStrength.max);
            } else {
                console.log(`Unexpected response: ${response}`);
            }
        });
    });

});