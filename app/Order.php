<?php

namespace App;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
        'product_id',
        'harga_satuan',
        'quantity',
        'is_ready',
        'nota_id',
        
    ];

    public function Nota(){
        return $this->belongsTo(Nota::class);
    }

    public function Product()
    {
        return $this->belongsTo(Product::class)->withTrashed();
    }

}
