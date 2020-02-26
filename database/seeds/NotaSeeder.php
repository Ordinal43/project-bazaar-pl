<?php

use Illuminate\Database\Seeder;
use App\Nota;

class NotaSeeder extends Seeder
{
   
    public function run()
    {
        $faker = Faker\Factory::create();

        foreach(range (1,10) as $i){
            Nota::create([
                'harga_total' => $faker->randomNumber(2),
                'user_id' => $faker->numberBetween(11,19),
                'stand_id' => $faker->numberBetween(2,10),
                'qrcode' => $faker->md5()
            ]);
        }
    }
}
