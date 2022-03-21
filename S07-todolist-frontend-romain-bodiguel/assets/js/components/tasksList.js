
// Module tasksList
const tasksList = {

  // Je récupère mes taches de l'API désormais, je dois donc passer par l'initialisation
  // de mon module afin d'envoyer la requete initiale de récupération des taches existantes
  init: function()
  {
    // On va créer un objet de configuration pour fetch
    const fetchOptions = {
      method : "GET",
      mode   : "cors",
      cache  : "no-cache"
    };

    // On va charger les taches depuis l'API
    fetch(app.apiRootUrl+"/tasks", fetchOptions)
    .then(function( response ) { return response.json() })
    .then(tasksList.handleTasksJSON);
  },

  //============================================
  // AJAX
  //============================================

  // Création de la liste des taches à partir du JSON reçue de l'API
  handleTasksJSON: function(json) {

    // Tout est déjà prêt ici ! On va réutiliser le code du formulaire d'ajout
    // mais cette fois les données viennent de l'API et non du formulaire ;)
    
    // Pour chaque tache retournée par l'API
    for(const singleTask of json)
    {
      // On créé l'élement du DOM
      const newTaskElement = task.createTaskElement(singleTask.title, singleTask.category.name);

      // On ajoute l'id dans le dataset.id de l'élément fraichement créé
      newTaskElement.dataset.id = singleTask.id;

      // On l'insère dans le DOM
      tasksList.insertTaskIntoTasksList(newTaskElement);
    }
  },

  //============================================
  // EVENTS
  //============================================

  insertTaskIntoTasksList: function(taskElement) {

    // je sélectionne ma première div au-dessus de laquelle je vais cloner ma nouvelle div
    const divElement = document.querySelector(".tasks");
    divElement.prepend(taskElement);
  }
};