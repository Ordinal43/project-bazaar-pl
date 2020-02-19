<?php

namespace App;

use Laravel\Passport\HasApiTokens;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    use Notifiable, SoftDeletes, HasApiTokens;

    protected $fillable = [
        'name', 'email', 'password', 'role_id', 'balance'
    ];

    protected $hidden = [
        'password', 'remember_token',
    ];

    public function notas(){
        return $this->hasMany(Nota::class);
    }

    public function stands(){
        return $this->hasOne(Stand::class);
    }

}
