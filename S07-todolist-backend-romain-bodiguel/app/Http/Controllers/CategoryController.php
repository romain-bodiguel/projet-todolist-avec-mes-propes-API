<?php

namespace App\Http\Controllers;

use App\Models\Category;

class CategoryController extends CoreController
{
    public function list()
    {
        $categoriesList = Category::all();

        // On retourne une réponse, au format JSON, donc le contenu
        // est notre tableau converti en JSON par Lumen automatiquement
        return response()->json($categoriesList);
    }

    public function item($id)
    {
        // $category = Category::findOrFail($id);
        // return response()->json($category[$id]);

        // Pour la gloire, on le fait en une seule ligne cette fois
        // On utilise findOrFail() au lieu de find() pour laisser Lumen gérer tout seul la 404
        // dans le cas où il ne trouverait pas la Catégorie demandée :o

        return response()->json(Category::findOrFail($id)->load("tasks"));
    }
}
