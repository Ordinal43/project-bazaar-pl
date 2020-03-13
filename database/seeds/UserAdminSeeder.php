<?php

use Illuminate\Database\Seeder;
use App\User;

class UserAdminSeeder extends Seeder
{
    public function run()
    {
        $faker = Faker\Factory::create();
            User::create([
               'name' => 'admin',
               'email' => 'admin@mail.com',
               'password' => Hash::make('@Admin123'),
               'role_id' => 1,
        ]);
    }
}
