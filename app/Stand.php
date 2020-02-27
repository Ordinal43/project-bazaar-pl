<?php

namespace App;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;


class Stand extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'stand_name',        
        'description',
        'user_id',
    ];
    
    public function products(){
        return $this->hasMany(Product::class);
    }

    public function orders(){
        return $this->hasMany(Order::class);
    }

    public function notas(){
        return $this->hasMany(Nota::class);
    }
    
    public function users(){
        return $this->belongsTo(User::class, 'user_id');
    }
}
