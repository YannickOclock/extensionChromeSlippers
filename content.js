(function() {
    // LANCER LE SCRIPT QUAND LE CHAT CHANGE
    getMessages()
    chrome.storage.local.set({messages: new Object()})
    chrome.runtime.sendMessage({count: 0})

    window.addEventListener('load', async function() {
        // attendre que le targetNode soit disponible sur la page (React)
        // -> A cause notamment des autorisations de caméras / et autorisations de login
        console.log('Chargement du script content - On attend que le chat soit disponible ...')
        const targetNode = await waitForElm('div[data-test-id="virtuoso-item-list"]')
        const config = { childList: true };

        // LANCER LE CALLBACK A CHAQUE FOIS QU'UN NOUVEAU MESSAGE APPARAIT
        const callback = function (mutationsList) {
            for (const mutation of mutationsList) {
                if (mutation.type == "childList") {
                    getMessages()
                    //chrome.storage.local.set({messages: dataMessages})
                    chrome.runtime.sendMessage({count: getCountMessages(), messages: dataMessages})
                }
            }
        };
        const observer = new MutationObserver(callback);
        observer.observe(targetNode, config);
    })
})();