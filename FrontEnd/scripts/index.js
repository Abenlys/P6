
// Etape 1.1 gallery à jour avec Backend


// fetch pour récupérer les données de l'API
async function communiquer() {
    const reponse = await fetch(`${baseUrl}works`)
    const data = await reponse.json()
    return data
}

// fonction pr retirer du HTML les travaux de la gallery mis en dur dans le fichier index.html
function suppressionHtmlGallery() {
    document.querySelector(".gallery").innerHTML = ""
}


// Récupération des images + title qu'il faudra mettre dans une balise figcaption à l'interieur des balises figures
function recupImageTitle(data) {
    for (i = 0; i < data.length; i++) {
        const article = data[i]
        // Récupération du conteneur ou l'on va générer les figures
        const containerGallery = document.querySelector(".gallery")
        // Création des figures à l'intérieur de gallery
        const figureDynamique = document.createElement("figure")
        // Création des img dans les figures
        const figureImage = document.createElement("img")
        figureImage.src = article.imageUrl
        // Création des figcaption dans les figures
        const figureCaption = document.createElement("figcaption")
        figureCaption.innerText = article.title
        // On rattache les balises figures à la gallery
        containerGallery.appendChild(figureDynamique)
        figureDynamique.appendChild(figureImage)
        figureDynamique.appendChild(figureCaption)
    }
}

// fin Etape 1.1, les fonctions sont passées dans la fonction init


// Etape 1.2 création du filtre, le but récupérer les catégories du backend et en faire une liste dynamique permettant de faire un filtre sur les projets

// Récupération des catégories avec fetch
async function getCategoryId() {
    const reponseId = await fetch(`${baseUrl}categories`)
    const dataId = await reponseId.json()
    return dataId
}


// fonction pour insérer les filtres
function listeButtonDynamique(dataId) {
    // Récupération du conteneur
    const sectionPortFolio = document.querySelector("#portfolio")
    // Création de la div accueillant les filtres
    const divFiltre = document.createElement("div")
    divFiltre.classList.add("flexButton")
    // Insérer la divFiltre entre h2 et div.gallery soit avant div.gallery, pas d'insertAfter, normal, par défaut créé l'élément à la fin
    const divGallery = sectionPortFolio.querySelector("div")
    sectionPortFolio.insertBefore(divFiltre, divGallery)
    for (let i = -1; i < dataId.length; i++) {
        const buttonElement = document.createElement("button")
        if (i === -1) {
            buttonElement.innerText = "Tous"
        } else {
            buttonElement.innerText = dataId[i].name
        }
        divFiltre.appendChild(buttonElement)
    }
}


// fonction qui fait la mise en forme des boutons et applique le filter sur les gallery
function miseEnFormeButtonEtFilterGallery() {
    const buttons = document.querySelectorAll("button");
  
    for (let i = 0; i < buttons.length; i++) {
        buttons[i].addEventListener("click", function(event) {
            buttons.forEach(button => {
                if (button.classList.contains('button_selected')) {
                    button.classList.remove('button_selected');
                }
            });
            // récupération de l'index sur le bouton que l'on clique de l'array buttonIndex
            const buttonIndex = Array.from(buttons).indexOf(event.target)
            // buttons[buttonIndex].classList.toggle('button_selected')
            if (!buttons[buttonIndex].classList.contains('button_selected')) {
                buttons[buttonIndex].classList.add('button_selected');
            }
            console.log(buttonIndex)
            suppressionHtmlGallery()
            communiquer().then(data => {
                let filteredData
                if (buttonIndex === 0) {
                    filteredData = data
                } else {
                    filteredData = data.filter(work => work.categoryId === (buttonIndex))
                }
                recupImageTitle(filteredData)
            })
      })
    }
}

// fonction permettant de passer toute les fonctions à cause de l'asynchrone
async function init() {
    const data = await communiquer()
    suppressionHtmlGallery()
    recupImageTitle(data)
    const dataId = await getCategoryId()
    listeButtonDynamique(dataId)
    miseEnFormeButtonEtFilterGallery()
    const divFiltre = document.querySelector(".flexButton")
    console.log(divFiltre)

}
init()

// const lesFiltres = document.querySelector("flexButton")
// console.log(lesFiltres)



// Après la connexion reussie via le login, on récupère le userId et token qui a été stocker dans localstorage
const dataString = localStorage.getItem("data")
if (dataString) {
    const data = JSON.parse(dataString)
    const userId = data.userId
    console.log(userId)
    const token = data.token
    console.log(token)
    console.log(dataString)
    // Faire toute les étapes du mode édition
    if ( token ) {
    // 1. bandeau noir en haut de la page
        const BodyDynamique = document.querySelector("body")
        const divEdition = document.createElement("div")
        divEdition.classList.add("bandeau")
        const header = document.querySelector("header")
        BodyDynamique.insertBefore(divEdition, header)
        const iconeHeader = document.createElement("i")
        iconeHeader.classList.add("far",  "fa-pen-to-square")
        const paragrapheHeader = document.createElement("p")
        paragrapheHeader.innerText = "Mode Edition"
        const divPublier = document.createElement("div")
        divPublier.classList.add("bulle")
        const pDansBulleBlanche = document.createElement("p")
        pDansBulleBlanche.innerText = "Publier les changements"
        divEdition.appendChild(iconeHeader)
        divEdition.appendChild(paragrapheHeader)
        divEdition.appendChild(divPublier)
        divPublier.appendChild(pDansBulleBlanche)
        // 2. ajouter l'icone + paragraphe modifier en dessous de l'image
        // 3. ajouter l'icone + paragraphe modfier à coté de projet
        // 4. suppression de la divFiltre
        const divFiltre = document.querySelector(".flexButton")
        console.log(divFiltre)



    }
}









