// Listen to content.js events
let backgroundDataMessages = {}

chrome.action.setBadgeText({ text: "0" });

/*chrome.storage.local.onChanged.addListener(
    function(result) {
        console.log('BACK - Le local storage a changé')
        if(result.messages && result.messages.newValue) {
            backgroundDataMessages = result.messages.newValue
            console.log(backgroundDataMessages)
        }
    }
);*/

chrome.runtime.onMessage.addListener(
    async function (request, sender, sendResponse) {
        // get from content.js
        if (request.count || request.count === 0) {
            chrome.action.setBadgeText({ text: request.count.toString() });
        }
        if (request.messages) {
            backgroundDataMessages = request.messages
        }
        // get from popup.js
        if (request.command && request.command === 'getMessages') {
            sendResponse(backgroundDataMessages)
        }
    }
);
