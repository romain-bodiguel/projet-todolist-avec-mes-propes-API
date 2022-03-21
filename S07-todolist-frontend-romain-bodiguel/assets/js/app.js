
// Notre module app est objet Javascript, on le déclare avec des accolades
const app = {

  apiRootUrl : "http://localhost:8080",

  init: function()
  {
    // J'appelle, dans l'initialisation de mon app, l'ajout de tout
    // les écouteurs d'événements via la méthode du module tasksList
    tasksList.init();
    newTaskForm.init();
    categoriesList.init();
  }
  
};
  
  // On ajoute un écouteur d'événement pour pouvoir lancer l'application une fois le DOM chargé
  document.addEventListener( "DOMContentLoaded", app.init );
  