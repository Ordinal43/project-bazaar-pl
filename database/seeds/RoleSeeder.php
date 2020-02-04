<?php

use Illuminate\Database\Seeder;
use App\Role;

class RoleSeeder extends Seeder
{
    public function run()
    {
        Role::create(['role_name' => ('Admin')]);
        Role::create(['role_name' => ('Seller')]);
        Role::create(['role_name' => ('Customer')]);
    }
}
