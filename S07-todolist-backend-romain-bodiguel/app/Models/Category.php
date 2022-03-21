<?php

  namespace App\Models;

  use Illuminate\Database\Eloquent\Model;

  class Category extends Model
  {
    // En écrivant cette méthode, on indique une relation
    // entre les Models Category et Task.
    // --
    // Grace à elle, on sera capable d'aller chercher facilement toutes
    // les taches liées à une catégorie
    // --
    // Comme il y a potentiellement plusieurs taches dans une même
    // catégorie, on utilise la relation "One to Many" et la méthode correspondante : hasMany
    // --
    // https://laravel.com/docs/6.x/eloquent-relationships#one-to-many
    public function tasks()
    {
      return $this->hasMany( "App\Models\Task" );
    }
  }
