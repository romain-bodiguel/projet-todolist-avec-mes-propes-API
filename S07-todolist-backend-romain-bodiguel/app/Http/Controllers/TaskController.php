<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class TaskController extends CoreController
{
    public function list()
    {
        // Je récupère toutes mes catégories grace au Model
        // et je retourne une réponse, au format JSON, dont le contenu
        // est notre tableau d'objets Task converti en JSON par Lumen
        // --
        // Pour indiquer à Eloquent de charger également les infos de la catégorie
        // de la tache, on ajoute la méthode load() avec en argument le nom de la méthode
        // qui définit la relation dans le model Task
        return response()->json(Task::all()->load("category"));
    }

    public function item($id)
    {
        $task = Task::findOrFail($id);
        return response()->json($task);
    }

    public function add(Request $request)
    {

        // Méthode 1 avec add (propriété protected $fillable insérée dans le Model Task)

        // $title       = $request->input('title');
        // $completion  = $request->input('completion');
        // $status      = $request->input('status');
        // $category_id = $request->input('categoryId');

        // $task = Task::create([
        //     $title,
        //     $completion,
        //     $status,
        //     $category_id
        // ]);

        // Méthode 2 avec save
        // TODO Bonus : Vérifications avant de créer la Task
        // filtres de validation pour demander à renseigner obligatoirement les champs
        // https://lumen.laravel.com/docs/8.x/validation

        // Je créé une nouvele tâche "vide"
        $task = new Task;

        $task->title       = $request->input('title');
        //$task->completion  = $request->input('completion');
        // Ces propriétés ont des valeurs par défaut en BDD,
        // On pourrait les omettre et Eloquent saurait quand même créer la ligne dans la table
        //$task->status      = $request->input('status');
        $task->category_id = $request->input('categoryId');

        $insertedRow = $task->save();

        if ($insertedRow) {
            return response()->json($task, Response::HTTP_CREATED);
        } else {
            return response("", Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    public function update( Request $request, $id )
  {
    // On récupère la tâche à modifier
    $taskToUpdate = Task::find($id);

    // Si la tâche existe ? (find retourne null s'il ne trouve pas la tâche)
    if( $taskToUpdate !== null )
    {
      // Est-ce que la requête est en PUT ?
      if( $request->isMethod('put') )
      {
        // On vérifie que les données à mettre à jour sont présentes
        if( $request->filled( ['title','categoryId','completion','status'] ) )
        {
          // Mise à jour de l'objet Task
          $taskToUpdate->title       = $request->input('title'); // La donnée transmise dans la requête s'appelle 'title'
          $taskToUpdate->category_id = $request->input('categoryId');
          $taskToUpdate->completion  = $request->input('completion');
          $taskToUpdate->status      = $request->input('status');
        }
        else
        {
          // sinon, il manque des informations => mauvaise requête
          return response( "", Response::HTTP_BAD_REQUEST );
        }
      }
      else
      {
        // sinon, c'est qu'on est en PATCH
        // On va stocker dans une variable le fait qu'il y ait au moins
        // une des 4 informations fournies
        $oneDataAtLeast = false; // on part du principe qu'il n'y a aucune
        // information de fournie

        // Pour chaque propriété, on regarde si l'information est fournie
        // si c'est le cas, alors on met à jour la tâche pour cette propriété
        // et on est sûr qu'il y a au moins une information mise à jour
        if( $request->filled('title') )
        {
          $taskToUpdate->title = $request->input('title');
          $oneDataAtLeast = true;
        }

        if( $request->filled('categoryId') )
        {
          $taskToUpdate->category_id = $request->input('categoryId');
          $oneDataAtLeast = true;
        }

        if( $request->filled('completion') )
        {
          $taskToUpdate->completion = $request->input('completion');
          $oneDataAtLeast = true;
        }

        if( $request->filled('status') )
        {
          $taskToUpdate->status = $request->input('status');
          $oneDataAtLeast = true;
        }

        // Si on n'a pas au moins une donnée, alors c'est une BAD REQUEST
        // if ($oneDataAtLeast === false) {
        if( !$oneDataAtLeast )
        {
          return response( "", Response::HTTP_BAD_REQUEST );
        }
      }

      // Si on arrive ici, c'est qu'on n'a pas rencontré d'erreur
      // ni sur le PUT ni sur le PATCH, on peut donc sauver dans la BDD
      if( $taskToUpdate->save() )
      {
        // alors retourner un code de réponse HTTP 204 "No Content"
        // https://restfulapi.net/http-methods/#put
        // sans body (pas de JSON ni d'HTML)
        return response( "", Response::HTTP_NO_CONTENT );
      }
      else
      {
        // alors retourner un code de réponse HTTP 500 "Internal Server Error"
        // https://restfulapi.net/http-status-codes/
        // sans body (pas de JSON ni d'HTML)
        return response( "", Response::HTTP_INTERNAL_SERVER_ERROR );
      }
    }
    else
    {
      // sinon, la tâche n'existe pas => not found
      return response( "", Response::HTTP_NOT_FOUND );
    }
  }
}
