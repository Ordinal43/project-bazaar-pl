<?php

use Illuminate\Database\Seeder;
use App\Order;

class OrderSeeder extends Seeder
{
    
    public function run()
    {
        $faker = Faker\Factory::create();

        foreach(range (1,10) as $i){
            Order::create([
                'product_id' => $faker->numberBetween(2,6),
                'harga_satuan' => $faker->randomNumber(2),
                'quantity' => $faker->randomNumber(1),
                'nota_id' => $i,   
            ]);
        }
    }
}
