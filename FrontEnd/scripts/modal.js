const titre = document.querySelector("#titre");
const category = document.querySelector("#category");
const validPicture = document.querySelector(".add-picture-valid");
const imgByDefault = document.querySelector(".fa-image");
const imagePreview = document.getElementById("preview");
const inputValueImg = document.getElementById("file-upload");
const gestionDisplay = document.querySelector(".gestion-display");
const arrowLeft = document.querySelector(".fa-arrow-left");

// Fonction delete pour supprimer un objet de l'API
async function deleteObjects(trashIdFigure) {
  try {
    const data = JSON.parse(localStorage.getItem("data"));
    let token;
    if (data) {
      token = data.token;
    }
    if (!token) {
      throw new Error("Aucun token trouvé dans le localStorage");
    }
    const response = await fetch(`${baseUrl}works/${trashIdFigure}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`la suppression de l'objet a échoué`);
    }
  } catch (error) {
    console.error(`une erreur est survenue :`, error.message);
  }
  document.querySelector(".modal-gallery").innerHTML = "";
  const data2 = await communiquer();
  recupImageTitle(data2, ".modal-gallery");
  getIdFigureTrash();
  suppressionHtmlGallery();
  recupImageTitle(data2, ".gallery");
}

// Fonction pour récupérer l'id de l'icone trash (correspondant à l'id de l'image récupérer dans la fonction recupImageTitle)
function getIdFigureTrash() {
  const trashs = document.querySelectorAll(".fa-trash-can");
  for (let i = 0; i < trashs.length; i++) {
    trashs[i].addEventListener("click", function (event) {
      // Récupération de l'index
      const trashIdFigure = event.target.id;
      deleteObjects(trashIdFigure);
    });
  }
}

// Prévisualisation des images que l'on veut ajouter aux backend + test format + test poids
function getPicture() {
  let file = inputValueImg.files[0];
  if (file) {
    const regex = /\.(png|jpe?g)$/i;
    if (regex.test(file.name)) {
      if (file.size > 4 * 1024 * 1024) {
        alert(`l'image est trop volumineuse`);
      } else {
        let fileReader = new FileReader();
        fileReader.onload = function (event) {
          imagePreview.setAttribute("src", event.target.result);
          if (imagePreview.getAttribute("src") !== null) {
            imagePreview.style.display = "block";
            gestionDisplay.style.display = "none";
          }
        };
        fileReader.readAsDataURL(file);
        suggestTitle();
      }
    } else {
      alert("le fichier doit être au format png, jpg ou jpeg");
    }
  }
}

// Retraitement de la chaine de caractère de file.name pour suggerer le nom dans l'input titre
function suggestTitle() {
  let str = inputValueImg.files[0].name;
  let leftPart = str.substring(0, str.indexOf("."));
  let leftPartWithoutHyphen = leftPart.replace(/-/g, " ");
  capitalizeFirstLetter(leftPartWithoutHyphen);
  titre.value = finalString;
}

function capitalizeFirstLetter(string) {
  return (finalString = string.charAt(0).toUpperCase() + string.slice(1));
}

// Vérification de l'alimentation des champs avec mise en forme du bouton valider de la modale 2
inputValueImg.addEventListener("input", checkform);
titre.addEventListener("input", checkform);
category.addEventListener("input", checkform);

function checkform() {
  if (
    inputValueImg.value !== "" &&
    titre.value.length > 4 &&
    category.value !== ""
  ) {
    validPicture.style.backgroundColor = "#1D6154";
    return true;
  } else {
    validPicture.style.backgroundColor = "#A7A7A7";
    return false;
  }
}

// On teste que tous les champs sont correctement rempli, la fonction doit renvoyé true
function fieldRegularity() {
  if (checkform() == false) {
    alert("les champs du formulaire sont mal remplis");
    return false;
  } else {
    return true;
  }
}


// push de l'objet formData dans l'API au click du bouton valider
validPicture.addEventListener("click", function (e) {
  e.preventDefault();
  if (fieldRegularity() === true) {
    const fileForPost = inputValueImg.files[0];
    const titleForPost = titre.value;
    const categoryForPost = category.value;
    const categoryValues = {
      Objets: "1",
      Appartements: "2",
      "Hotels & restaurants": "3",
    };
    const categoryValue = categoryValues[categoryForPost];
    const postwork = {
      image: fileForPost,
      title: titleForPost,
      category: categoryValue,
    };
    sendNewWork(postwork);
  }
});

//requete post pour ajouter un travail
async function sendNewWork(myObject) {
  const formData = new FormData();
  formData.append("image", myObject.image);
  formData.append("title", myObject.title);
  formData.append("category", myObject.category);
  try {
    const data = JSON.parse(localStorage.getItem("data"));
    let token;
    if (data) {
      token = data.token;
    }
    if (!token) {
      throw new Error("Aucun token trouvé dans le localStorage");
    }
    const response = await fetch(`${baseUrl}works`, {
      method: "POST",
      headers: {
        accept: `application/json`,
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    if (!response.ok) {
      throw new Error(`la création de l'objet a échoué`);
    }
    const result = await response.json();
  } catch (error) {
    console.error(`une erreur est survenue :`, error.message);
  }
  document.querySelector(".modal-gallery").innerHTML = "";
  const data = await communiquer();
  recupImageTitle(data, ".modal-gallery");
  suppressionHtmlGallery();
  recupImageTitle(data, ".gallery");
}

// Gestion du comportement de arrow left de la modale 2

arrowLeft.addEventListener("click", function () {
  if (
    imagePreview.getAttribute("src") !== "" ||
    titre.value !== "" ||
    category.value !== ""
  ) {
    imagePreview.setAttribute("src", "");
    imagePreview.style.display = "none";
    gestionDisplay.style.display = "flex";
    inputValueImg.value = "";
    titre.value = "";
    category.value = "";
    validPicture.style.backgroundColor = "#A7A7A7";
  } else if (imagePreview.getAttribute("src") === "") {
    document.querySelector("#modal2").style.display = "none";
    document.querySelector(".modal-premier").style.display = "block";
    getIdFigureTrash();
  }
});

// Comportement de la modal (grafikart dans guide étape clé)
function manageModal() {
  let modal = null;
  const focusableSelector = "button, a, input, textarea";
  let focusables = [];
  let previouslyFocusedElement = null;

  const openModal = async function (e) {
    e.preventDefault();
    modal = document.querySelector("#modal1");
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    previouslyFocusedElement = document.querySelector(`:focus`);
    focusables[0].focus();
    modal.style.display = null;
    modal.removeAttribute("aria-hidden");
    modal.setAttribute("aria-modal", "true");
    modal.addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .addEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .addEventListener("click", stopPropagation);
    modal.querySelector(".add-picture").addEventListener("click", function (e) {
      modal.querySelector(".modal-premier").style.display = "none";
      modal.querySelector("#modal2").style.display = "block";
      modal.querySelector("#modal2").addEventListener("click", (e) => {
        e.stopPropagation();
      });
    });
    const crossModal2 = document
      .querySelector("#modal2")
      .querySelector(".fa-xmark");
    crossModal2.addEventListener("click", closeModal);

    document.querySelector(".modal-gallery").innerHTML = "";
    const data = await communiquer();
    recupImageTitle(data, ".modal-gallery");
    getIdFigureTrash();
  };

  const closeModal = function (e) {
    if (modal === null) return;
    if (previouslyFocusedElement !== null) {
      previouslyFocusedElement.focus();
    }
    e.preventDefault();
    window.setTimeout(function () {
      modal.querySelector(".modal-premier").style.display = "block";
      modal.querySelector("#modal2").style.display = "none";
      modal.style.display = "none";
      modal = null;
    }, 400);
    modal.setAttribute("aria-hidden", "true");
    modal.removeAttribute("aria-modal");
    modal.removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-close")
      .removeEventListener("click", closeModal);
    modal
      .querySelector(".js-modal-stop")
      .removeEventListener("click", stopPropagation);
  };

  const stopPropagation = function (e) {
    e.stopPropagation();
  };

  const focusInModal = function (e) {
    e.preventDefault();
    let index = focusables.findIndex(
      (f) => f === modal.querySelector(`:focus`)
    );
    if (e.shiftKey === true) {
      index--;
    } else {
      index++;
    }
    if (index >= focusables.length) {
      index = 0;
    }
    if (index < 0) {
      index = focusables.length - 1;
    }
    focusables[index].focus();
  };

  document.querySelectorAll(".js-modal").forEach((a) => {
    a.addEventListener("click", openModal);
  });
  window.addEventListener("keydown", function (e) {
    if (e.key === `Escape` || e.key === `Esc`) {
      closeModal(e);
    }
    if (e.key === `Tab` && modal !== null) {
      focusInModal(e);
    }
  });
}
