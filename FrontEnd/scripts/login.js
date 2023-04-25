

async function communiquerlogin(user) {
    const response = await fetch(`${baseUrl}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(user)
      });
      return response
}

function getForms() {
    const email = document.querySelector('#email').value
    const mdp = document.querySelector('#mdp').value
    return {'email' : email, 'password' : mdp}
    
}

async function installEvent() {
const seConnecter = document.querySelector("#seconnecter")
seConnecter.addEventListener('click', async (event) => {
    event.preventDefault()
    const user = getForms()
    const reponseIdToken = await communiquerlogin(user)
    if (reponseIdToken.status === 200) {
        const data = await reponseIdToken.json()
        console.log(data)
        // stockage du résultat dans le localStorage au cas ou
        const dataString = JSON.stringify(data)
        window.localStorage.setItem("data", dataString)
        window.location.href = "index.html"
    } else {
        // Afficher un message d'erreur
        let errorElement = document.querySelector('#erreur_login')
        if (!errorElement) {
            errorElement = document.createElement("p")
            errorElement.id = "erreur_login"
            document.querySelector("#contact").appendChild(errorElement)
        }
        errorElement.innerText = "la combinaison de l'email et mot de passe est fausse"
    }
})
}


async function init() {
    await installEvent()
    
}
init()