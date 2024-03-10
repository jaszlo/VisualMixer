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

    darkModeToggle.addEventListener("change", () => {
        triggerDarkModeToggle(darkModeStrength.value / darkModeStrength.max);
        darkModeStrength.disabled = !darkModeToggle.checked;
    });

    darkModeStrength.addEventListener("input", () => {
        triggerDarkModeStrengthUpdate(darkModeStrength.value / darkModeStrength.max);
    });

    darkModeStrength.addEventListener("change", () => {
        triggerDarkModeStrengthUpdate(darkModeStrength.value / darkModeStrength.max);
    });


    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "getState" }, response => {
            if (chrome.runtime.lastError) {
                console.log(`Error: ${chrome.runtime.lastError.message}`);
            } else

            if (response && response.success) {
                const isDarkMode = state.darkMode;
                darkModeToggle.checked = isDarkMode;
                darkModeStrength.disabled = !isDarkMode;
                darkModeStrength.value = Math.round(state.strength * darkModeStrength.max);
            } else {
                console.log(`Unexpected response: ${response}`)
            }
        });
    });
});