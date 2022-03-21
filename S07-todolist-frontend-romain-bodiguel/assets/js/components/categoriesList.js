const categoriesList = {

    init: function() {
        categoriesList.loadCategoriesFromAPI();
    },

    loadCategoriesFromAPI: function() {

        const fetchOptions = {
            // --- Toujours défini :  
            // La méthode HTTP (GET, POST, etc.)
            method: 'GET',
          
            // --- Bonus (exemples) :
          
            // On utilisera souvent Cross Origin Resource Sharing qui apporte
            // une sécurité pour les requêtes HTTP effectuée avec XHR entre 2
            // domaines différents.
            mode: 'cors',
            // Veut-on que la réponse puisse être mise en cache par le navigateur ?
            // Non durant le développement, oui en production.
            cache: 'no-cache'
            
            // Si on veut envoyer des données avec la requête => décommenter et remplacer data par le tableau de données
            // , body : JSON.stringify(data)
        };
        
        // Version courte du code ci-dessous
        fetch(app.apiRootUrl+"/categories", fetchOptions) // J'envoie la requete
        .then(function(response) {return response.json()} ) // Je traduit en JSON la réponse une fois reçue
        .then(categoriesList.handleCategoriesJson); // Que je donne à la méthode handleCategoriesJSON

        return;

        // On déclenche l'envoi de la requête HTTP vers l'API
        // On oublie pas de fournir les options qu'on vient de créer ;)
        const responsePromise = fetch("https://benoclock.github.io/S07-todolist/categories.json", fetchOptions);
        
        // Arrivé ici, je n'ai pas ma Réponse ! J'ai juste envoyé la Requête !
        // Je vais indiquer a mon code ce qu'il doit faire lorsque la Réponse arrivera
        // Ici, j'indique que je veux récupérer la réponse en JSON
        const jsonPromise = responsePromise.then( function(response) {return response.json()} );

        // J'indique maintenant a JS ce qu'il doit faire une fois la lecture du JSON terminée
        jsonPromise.then(categoriesList.handleCategoriesJson);
    },

    handleCategoriesJson: function(json) {

        // je récupère la div dans laquelle je veux créer un select
        const divForHeaderSelectElement = document.querySelector(".filters__task--category");
        const divForSelectElement = document.querySelector(".task__category > .select");

        categoriesList.addSelectElement(json, divForHeaderSelectElement);
        categoriesList.addSelectElement(json, divForSelectElement);
    },

    addSelectElement: function(json, elementPosition) {
        // je crée mon nouvel élément select, et lui ajoute une classe
        const selectElement = document.createElement("select");
        selectElement.classList.add("category__select");
        elementPosition.prepend(selectElement);

        // je boucle sur toutes les entrées de json
        for (const category of json) {
            const optionElement = document.createElement("option");
            optionElement.value = category.id;
            optionElement.textContent = category.name;
            selectElement.append(optionElement);
        }
    },
}