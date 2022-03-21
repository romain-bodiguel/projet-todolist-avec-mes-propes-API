
// Module task
const task = {

    //============================================
    // EVENTS
    //============================================
  
    /**
     * Ajout tous les évènements liés à une tâche
     * @param {HTMLElement} taskElement L'élément du DOM correspondant à la tâche
     */
    bindSingleTaskEvents: function( taskElement )
    {
      //------------------------------------------------------------------------
      // EL (click) sur le titre de la tache
      //------------------------------------------------------------------------
    
      // Je récupère le label (la balise <p>) de la tache fournie en paramètre
      // Je peux utiliser pour cela querySelector sur taskElement pour chercher
      // uniquement dans les enfants de l'élément
      const taskTitleLabelElement = taskElement.querySelector( ".task__title-label" );
      // J'ajoute un premier écouteur d'événement, au clic de la souris
      taskTitleLabelElement.addEventListener( "click", task.handleEnableTaskTitleEditMode );  
  
      // J'ai besoin maintenant de gérer le passage du mode "édition" au mode "normal"
      // Pour ça, je récupère l'input du titre de la tache
      const taskTitleInputElement = taskElement.querySelector( ".task__title-field" ); 
  
      // Et je lui ajoute un event listener sur "blur" => quand l'élément perd le focus
      // Au passage on ajoute également l'événement keydown pour valider avec Entrer
      taskTitleInputElement.addEventListener( "blur", task.handleValidateNewTaskTitle );
      taskTitleInputElement.addEventListener( "keydown", task.handleValideNewTaskTitleOnEnterKey );

      //------------------------------------------------------------------------
      // EL (click) sur le bouton (dé)compléter la tache
      //------------------------------------------------------------------------

      // J'ajoute un écouteur d'évenement sur mes boutons de validations
      const validateButtonElements = taskElement.querySelector(".task__button--validate");
      validateButtonElements.addEventListener('click', task.handleCompleteTask); 

      const undoButtonElements = taskElement.querySelector(".task__button--incomplete");
      undoButtonElements.addEventListener('click', task.handleUndoTask);

      //------------------------------------------------------------------------
      // EL (click) sur le bouton modifier la tache
      //------------------------------------------------------------------------

      // J'ajoute un écouteur d'évenement sur mes boutons de modifications
      const modifyButtonElements = taskElement.querySelector(".task__button--modify");
      modifyButtonElements.addEventListener('click', task.handleEnableTaskTitleEditMode);

    },
    
    //============================================
    // METHODS
    //============================================

    /**
     * Méthode permettant de créer un nouvel élément tâche
     * sans l'ajouter dans le DOM
     * @param {String} newTaskTitle 
     * @param {String} newTaskCategory 
     * @return {Element} taskElement 
     */

    createTaskElement: function(taskTitle, taskOption) {

      // j'appelle mon template puis je le clone
      const templateElement = document.querySelector("#task__template");
      const taskCloneElement = templateElement.content.cloneNode(true);

      // Ici, ma variable est de type DocumentFragment
      // Inutile de s'attarder dessus, nous on veut "juste" récupérer l'élement div.task qui se trouve dedans grace a .firstElementChild
      // Plus d'infos pour les curieux : https://developer.mozilla.org/fr/docs/Web/API/DocumentFragment
      // Ici, on préfère travailler avec des Element "habituels"
      // on récupère donc la div avec la classe task uniquement
      const newTaskElement = taskCloneElement.firstElementChild;

      //----------------------------------------------------------------
      // Mise à jour avec les données de la nouvelle tache
      //----------------------------------------------------------------

      // Modification du titre de la tache
      task.updateTaskTitle(newTaskElement, taskTitle);
      task.updateTaskCategory(newTaskElement, taskOption);

      // TODO : Modification de la completion d'une tache au chargement depuis l'API
      // TODO : Modification du status d'une tache au chargement depuis l'API

      //----------------------------------------------------------------
      // Ajout des écouteurs d'événements
      //----------------------------------------------------------------
      task.bindSingleTaskEvents(newTaskElement);

      //----------------------------------------------------------------
      // On retourne l'élement
      // ATTENTION : à ce stade, nous n'avons pas encore ajouté
      // ce nouvel élément au DOM, il n'apparait donc pas !
      //----------------------------------------------------------------
      return newTaskElement;
    },
  
    //============================================
    // HANDLERS
    //============================================
  
    /**
     * Méthode gérant le passage en mode édition du titre de la tâche
     * @param {Event} evt 
     */
    handleEnableTaskTitleEditMode : function( evt )
    {
      // Pour passer visuellement en mode édition du titre de la tâche, on va devoir
      // ajouter une classe task-edit sur l'élément
      // On récupère pour celà le titre (sur lequel on vient de cliquer)
      const taskTitleDisplayElement = evt.currentTarget;
  
      // Ensuite, on chercher dans les parents de l'élément titre, le premier
      // élément du DOM qui possède la class 'task'
      // https://developer.mozilla.org/fr/docs/Web/API/Element/closest
      const taskElement = taskTitleDisplayElement.closest( ".task" );
  
      // On a la task toute entière, il ne reste plus qu'à lui ajouter la classe task--edit
      // pour faire apparaitre le champ <input> et masquer le <p>
      // Ici, pas besoin de toggle/replace/remove car le CSS est déjà prévu pour
      // marcher correctement même si on a task--todo et task--edit en même temps
      taskElement.classList.add( "task--edit" );
  
      // Bonus UX : on met le focus dans le champ input pour modifier directement le nom
      // et épargner un clic supplémentaire à l'utilisateur
      taskElement.querySelector( ".task__title-field" ).focus();
    },
  
    /**
     * Méthode gérant la validation de la modification du titre de la tâche
     * @param {Event} evt 
     */
    handleValidateNewTaskTitle: function( evt )
    {    
      // On récupère l'élement input depuis evt
      const taskTitleFieldElement = evt.currentTarget;
  
      // On récupère également la task toute entière (pour lui retirer .task--edit)
      const taskElement = taskTitleFieldElement.closest( ".task" );
  
      // On récupère enfin la balise <p> (pour la modifier et y mettre la value de l'input)
      const taskTitleLabelElement = taskElement.querySelector( ".task__title-label" );
  
      // Je remplace le texte de la balise <p> par la value de l'<input>
      taskTitleLabelElement.textContent = taskTitleFieldElement.value;
  
      // Une fois que c'est fait, on "quitte le mode édition"
      taskElement.classList.remove( "task--edit" );
    },
  
    /**
     * Méthode gérant la validation du nouveau titre de la tâche sur l'évènement 'keydown'
     * (c'est la touche Entrée qui permettra de valider la modification)
     * @param {Event} evt 
     */
    handleValideNewTaskTitleOnEnterKey: function( evt )
    {
      // On ne veut valider la saisie QUE si on a appuyé sur la touche entrée, et aucune autre
      if( evt.key === "Enter" )
      {
        task.handleValidateNewTaskTitle(evt);
      }
    },

    handleCompleteTask: function(evt) {
      // Récupération du bouton à l'origine de l'event
      const clickedButtonElement = evt.currentTarget;

      // Récupération de la div parent correspondant à la tache entière
      const taskElement = clickedButtonElement.closest( ".task" );

      // Ensuite, j'envoi une requête Ajax à l'API pour indiquer la modification de la tache
      // Ici, je modifie sa completion

      // On stocke les données à transférer à l'API
      // On a géré la méthode PATCH dans le backend, donc
      // on ne fournit QUE les données à modifier
      const data = { completion : 100 };

      // On prépare les entêtes HTTP (headers) de la requête
      // afin de spécifier que les données sont en JSON
      const httpHeaders = new Headers();
      httpHeaders.append("Content-Type", "application/json");

      // On va créer un objet de configuration pour fetch
      const fetchOptions = {
        method  : "PATCH",
        mode    : "cors",
        cache   : "no-cache",      
        headers : httpHeaders, // On ajoute les headers dans les options      
        body    : JSON.stringify(data) // On ajoute les données, encodées en JSON, dans le corps de la requête
      };

      // On va charger les taches depuis l'API
      fetch(app.apiRootUrl + "/tasks/" + taskElement.dataset.id, fetchOptions)
      .then(function(response) { 
        console.log(response);

        // Si l'API m'indique que la requete est un succès
        // On peut utiliser la propriété "ok" de Response plutot que vérifier
        // s'il s'agit d'un code 2xx
        // Si tout est bon, on modifie le DOM
        if(response.ok === true)
        {
          // On modifie la classe task--todo en task--complete
          // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
          taskElement.classList.replace( "task--todo", "task--complete" );

          // Récupérer la barre de prograssion
          const progressBarElement = taskElement.querySelector( ".progress-bar__level" );
          // Modifier son attribut style, plus exactement la propriété width
          progressBarElement.style.width = "100%";
        }
        else // Sinon, j'affiche l'erreur en alert (et je ne modifie donc PAS le DOM)
        {
          // On se contente de retourner le code d'erreur indiqué par l'API
          alert( response.status + " : " + response.statusText );
        }
      });
    },

    handleUndoTask: function(evt) {
        
      // je récuèpre l'élément courant
      const completeElements = evt.currentTarget;

      // je récupère la div parente la plus proche (qui contient la classe task) et également la barre de progression
      const taskElement = completeElements.closest( ".task" );

      const data = { completion : 0 };

      // On prépare les entêtes HTTP (headers) de la requête
      // afin de spécifier que les données sont en JSON
      const httpHeaders = new Headers();
      httpHeaders.append("Content-Type", "application/json");

      // On va créer un objet de configuration pour fetch
      const fetchOptions = {
        method  : "PATCH",
        mode    : "cors",
        cache   : "no-cache",      
        headers : httpHeaders, // On ajoute les headers dans les options      
        body    : JSON.stringify(data) // On ajoute les données, encodées en JSON, dans le corps de la requête
      };

      // On va charger les taches depuis l'API
      fetch(app.apiRootUrl + "/tasks/" + taskElement.dataset.id, fetchOptions)
      .then(function(response) { 
        console.log(response);

        // Si l'API m'indique que la requete est un succès
        // On peut utiliser la propriété "ok" de Response plutot que vérifier
        // s'il s'agit d'un code 2xx
        // Si tout est bon, on modifie le DOM
        if(response.ok === true)
        {
          // On modifie la classe task--todo en task--complete
          // https://developer.mozilla.org/fr/docs/Web/API/Element/classList
          taskElement.classList.replace( "task--complete", "task--todo" );

          // Récupérer la barre de prograssion
          const progressBarElement = taskElement.querySelector( ".progress-bar__level" );
          // Modifier son attribut style, plus exactement la propriété width
          progressBarElement.style.width = "0%";
        }
        else // Sinon, j'affiche l'erreur en alert (et je ne modifie donc PAS le DOM)
        {
          // On se contente de retourner le code d'erreur indiqué par l'API
          alert( response.status + " : " + response.statusText );
        }
      });
    },

  updateTaskTitle: function(taskElement, taskTitle) {

    // On récupère la balise <p> (pour la modifier et y mettre le nouveau titre)
    const taskTitleLabelElement = taskElement.querySelector( ".task__title-label" );

    // Je remplace le texte de la balise <p> par la value de l'<input>
    taskTitleLabelElement.textContent = taskTitle;
    
    // On doit également gérer la valeur par défaut du champ input 
    // qui servira à l'édition de cette nouvelle tache, donc je le récupère
    const taskTitleFieldElement = taskElement.querySelector( ".task__title-field" );

    // Puis je modifie sa valeur
    taskTitleFieldElement.value = taskTitle;
  },

  updateTaskCategory: function(taskElement, taskCategory) {

    // Mise à jour de l'attribut data-category
    taskElement.dataset.category = taskCategory;

    // Récupération de l'élément p content le nom de la catégorie
    const taskCategoryNameElement = taskElement.querySelector('.task__category > p');

    // Mise à jour de sa valeur
    taskCategoryNameElement.textContent = taskCategory;
  },
};