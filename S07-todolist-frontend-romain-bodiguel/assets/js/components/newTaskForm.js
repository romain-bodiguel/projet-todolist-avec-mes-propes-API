
// Notre module app est objet Javascript, on le déclare avec des accolades
const newTaskForm = {

    init: function()
    {
        const submitElement = document.querySelector(".task--add > form");
        submitElement.addEventListener("submit", newTaskForm.handleNewTaskFormSubmit);
    },

    handleNewTaskFormSubmit: function(event) {
        event.preventDefault();

        // récupération du formulaire soumis
        const formElement = event.currentTarget;

        // je sélectionne mon input pour récupérer sa value, que je vais trasmettre comme textContent
        const titleFieldElementValue = formElement.querySelector(".task__title-field").value;
        // je récupère le texte de l'option sélectionnée de mon select
        const taskOptionValue = formElement.querySelector(".category__select");
        const categoryFieldElementText = taskOptionValue.options[taskOptionValue.selectedIndex].text;
        const categoryFieldElementValue = formElement.querySelector(".task__category select option").value;

        // TODO : Maintenant que categoryFieldElementValue contient l'id de la catégorie
        // il faut que je récupère le nom de cette dernière autrement...
    
        // Création de la nouvelle tache a partir du <template>
        const newTaskElement = task.createTaskElement(titleFieldElementValue, categoryFieldElementText);
    
        // Avant d'ajouter ma Task dans le DOM, j'envoi la requete d'ajout à l'API
        // On fournit les données obligatoires (hors valeurs par défaut)
        const data = {
        title      : titleFieldElementValue,
        categoryId : categoryFieldElementValue
        };

        console.log(data);

        // On prépare les entêtes HTTP (headers) de la requête
        // afin de spécifier que les données sont en JSON
        const httpHeaders = new Headers();
        httpHeaders.append("Content-Type", "application/json");

        // On va créer un objet de configuration pour fetch
        const fetchOptions = {
            method  : "POST",
            mode    : "cors",
            cache   : "no-cache",      
            headers : httpHeaders, // On ajoute les headers dans les options      
            body    : JSON.stringify(data) // On ajoute les données, encodées en JSON, dans le corps de la requête
        };

        // On va charger les taches depuis l'API
        fetch(app.apiRootUrl + "/tasks", fetchOptions)
        .then(function(response) {
            // Bonus : Vérification d'erreur
            // On vérifie le code réponse
            if(response.status == 201) {
                // Je renvoie une promesse d'interprétation du JSON (au prochain then())
                return response.json();
            } else {
                // J'affiche une alert si l'API me dit que ça merdouille
                alert(response.status + " : " + response.statusText);
            }
        })
        .then(function(json) { 
            // J'ai besoin de récupérer l'id autoincrémenté en base de la tache créée
            // Ici, json correspond à l'objet Task créé en base
            newTaskElement.dataset.id = json.id;

            // Ajout de la tache fraichement créée à la liste des taches (et donc au DOM)
            tasksList.insertTaskIntoTasksList(newTaskElement);
        });
    },
};
