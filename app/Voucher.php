<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Voucher extends Model
{
    protected $fillable = [
        // 'redeem_by', 
        'nominal',
        'qrcode'
    ];

    public function user(){
        return $this->belongsTo(User::class);
    }
}
