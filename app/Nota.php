<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Nota extends Model
{
    protected $fillable = [
        'harga_total',
        'user_id',
        'qrcode',
        'stand_id',
    ];

    public function Order(){
        return $this->hasMany(Order::class);
    }
    
    public function Users(){
        return $this->belongsTo(User::class, 'user_id');
    }

    public function Stands(){
        return $this->belongsTo(Stand::class, 'stand_id');
    }
}
