<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    
    public function run()
    {
         $this->call([
            //  StandTableSeeder::class,
            //  ProductSeeder::class,
             UserSeeder::class,
             RoleSeeder::class,
            //  NotaSeeder::class,
            //  OrderSeeder::class,
         ]);
    }
}
