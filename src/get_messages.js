const dataMessages = {}

function getCountMessages() {
    return Object.keys(dataMessages).length
}

function getMessages() {
    const chatContainer = document.querySelector('div[data-test-id="virtuoso-item-list"]')
    if(chatContainer) {
        const messages = chatContainer.querySelectorAll('div[data-item-index]')
        for(const message of messages) {
            const dataMessageId = message.dataset.itemIndex
            if(parseInt(dataMessageId) > 0) {
                const hasAuthorElement = message.querySelector('a')
                const messageHTMLElement = message.querySelector('.message-content span:last-child')
                if(messageHTMLElement) {
                    const messageElement = messageHTMLElement.textContent.replace(/\s+/g, ' ').trim()
                    if(hasAuthorElement) {
                        /* on a un message de type question/spoiler ou message simple */
                        dataMessages[dataMessageId] = {
                            author: message.querySelector('a').textContent.replace(/\s+/g, ' ').trim(),
                            time: message.querySelector('time').getAttribute('datetime'),
                            message: messageElement,
                            role: message.querySelector('a').getAttribute('role')
                        }
                    } else if(!messageElement.includes('Nouveau sondage')) {
                        /* il faut tester qu'on tombe pas sur un sondage */
                        /* il faut aussi récupérer les messages qui peuvent être écrit par la même
                        personne dans la même minute (pas d'info d'auteur ni de date) */
                        dataMessages[dataMessageId] = {
                            message: messageElement,
                        }
                    }
                }
            }
        }
    }
}