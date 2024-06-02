let popupDataMessages = {}
const spanElement = document.querySelector('p span')
console.log('Ouverture de la popup, récupération des messages !')
chrome.runtime.sendMessage({command: 'getMessages'}, function(backgroundDataMessages) {
    if(backgroundDataMessages) {
        // on récupère les messages du service worker (background)
        spanElement.textContent = Object.keys(backgroundDataMessages).length
        popupDataMessages = backgroundDataMessages
    }
})

// On peut modifier ici le séparateur à utiliser dans
// le fichier CSV (vous pouvez le changer comme bon vous semble)
const csvSeparator = '£'

const button = document.querySelector('button')
button.addEventListener('click', async() => {
    // Quand on veut exporter les données ...
    let csvContent = ''

    for(const messageId of Object.keys(popupDataMessages)) {
        const popupDataMessage = popupDataMessages[messageId]
        /* reconstituer les data manquantes (messages envoyés dans la même minute par la même personne) */
        if(!popupDataMessage.time && !popupDataMessage.author && popupDataMessages[parseInt(messageId)-1]) {
            const precDataMessage = popupDataMessages[parseInt(messageId)-1]
            popupDataMessage.time = precDataMessage.time
            popupDataMessage.author = precDataMessage.author
            popupDataMessage.role = precDataMessage.role
        } 
        /* si toutes les données sont complètes, on peut extraire */
        if(popupDataMessage.message && popupDataMessage.time && popupDataMessage.author && popupDataMessage.role) {

            // On modifie les doubles quotes dans le message avant de le mettre dans le fichier
            popupDataMessage.message = popupDataMessage.message.replaceAll('"', "'")

            csvContent += `${popupDataMessage.author}${csvSeparator}${popupDataMessage.time}${csvSeparator}${popupDataMessage.message}${csvSeparator}${popupDataMessage.role}` + '\n'
        }
    }
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8,' })
    const objUrl = URL.createObjectURL(blob)
    window.location.assign(objUrl);
    URL.revokeObjectURL(objUrl);
})