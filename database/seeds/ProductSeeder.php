<?php

use Illuminate\Database\Seeder;
use App\Product;

class ProductSeeder extends Seeder
{
    
    public function run()
    {
        $faker = Faker\Factory::create();

        foreach(range (1,10) as $i){
            Product::create([
                'name' => $faker->name,
                'description' => $faker->name,
                'units' => $faker->numberBetween(10,20),
                'stand_id' => $faker->numberBetween(2,6),
                'price' => $faker->randomNumber(4),
                'image' => $faker->imageUrl($width = 640, $height = 480),
            ]);
        }
    }
}
