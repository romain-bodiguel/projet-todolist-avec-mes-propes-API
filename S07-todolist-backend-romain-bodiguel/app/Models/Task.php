<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Task extends Model {

    // Pour la fonction create dans le TaskController
    // protected $fillable = ['title', 'completion', 'status', 'category_id'];

    public function category() {

        // En écrivant cette méthode, on indique une relation
        // entre les Models Task et Category.
        // --
        // Grace à elle, on sera capable d'aller chercher facilement LA catégorie
        // associée à une tache
        // --
        // Comme une tache est liée à une seule catégorie
        // catégorie, et qu'on a déjà défini la relation dans l'autre sens sur Category
        //  on utilise la relation "One to Many (Inverse)"
        // et la méthode correspondante : belongsTo
        // --
        // https://laravel.com/docs/6.x/eloquent-relationships#one-to-many-inverse
        return $this->belongsTo("App\Models\Category");
    }
}
