<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'price',
        'is_available',
        'description',
        'image',
        'stand_id'
    ];
    
   

    public function Stand(){
        return $this->belongsTo(Stand::class, 'stand_id');
    }
    
}
