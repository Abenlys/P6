let trashIndex

async function deleteObjects(trashIndex) {
    try {
        const data = JSON.parse(localStorage.getItem('data'))
        console.log(data)
        const token = data ? JSON.stringify(data.token) : undefined
        console.log(data.token)
        console.log(token)
        if (!token) {
            throw new Error('Aucun token trouvé dans le localStorage')
        }
        const response = await fetch(`${baseUrl}works/${trashIndex}`, {
            method: 'DELETE',
            headers: {
                'Authorization' : `Bearer ${token}`,
                'content-Type' : 'application/json;charset=utf-8'
                
            }
        })
        console.log(`${baseUrl}works/${trashIndex}`)
        if (!response.ok) {
            throw new Error(`la suppression de l'objet a échoué`)
        }
        const result = await response.json()
        console.log(result)
    } catch (error) {
        console.error(`une erreur est survenue :`, error.message)
    }
}


// Fonction pour créer un array des icones trash et en récupérer l'index
function getIndexFromTrash() {
    const trashs = document.querySelectorAll('.fa-trash-can')
    console.log(trashs.length)
    for (let i = 0; i < trashs.length ; i++) {
        trashs[i].addEventListener('click', function(event) {
            // Récupération de l'index
            trashIndex = Array.from(trashs).indexOf(event.target) + 1
            console.log(trashIndex)
            deleteObjects(trashIndex)
        })
    } 
}



function manageModal() {
    let modal = null
    const focusableSelector = 'button, a, input, textarea'
    let focusables = []
    let previouslyFocusedElement = null

    const openModal = async function (e) {
        e.preventDefault()
        modal = document.querySelector('#modal1')
        focusables = Array.from(modal.querySelectorAll(focusableSelector))
        previouslyFocusedElement =  document.querySelector(`:focus`)
        focusables[0].focus()
        modal.style.display = null
        modal.removeAttribute('aria-hidden')
        modal.setAttribute('aria-modal', 'true')
        modal.addEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
        document.querySelector('.modal-gallery').innerHTML = ""
        const data = await communiquer()
        recupImageTitle(data, ".modal-gallery")
        getIndexFromTrash()
        
    }

    const closeModal = function (e) {
        if (modal === null) return
        if (previouslyFocusedElement !== null) {
            previouslyFocusedElement.focus()
        }
        e.preventDefault()
        window.setTimeout(function () {
            modal.style.display = "none"
            modal = null
        }, 400)
        modal.setAttribute('aria-hidden', 'true')
        modal.removeAttribute('aria-modal')
        modal.removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
        modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
        
       
    }

    const stopPropagation = function (e) {
        e.stopPropagation()
    }

    const focusInModal = function (e) {
        e.preventDefault()
        let index = focusables.findIndex(f => f === modal.querySelector(`:focus`))
        if (e.shiftKey === true) {
            index--
        } else {
            index++
        }
        if (index >= focusables.length) {
            index = 0
        }
        if (index < 0) {
            index = focusables.length - 1
        }
        focusables[index].focus()
        
    }

    document.querySelectorAll(".js-modal").forEach(a => {
        a.addEventListener('click', openModal)
        
    })
    window.addEventListener('keydown', function (e){
        if (e.key === `Escape` || e.key === `Esc`) {
        closeModal(e)
        }
        if (e.key === `Tab` && modal !== null) {
            focusInModal(e)
        }
    })
    
}