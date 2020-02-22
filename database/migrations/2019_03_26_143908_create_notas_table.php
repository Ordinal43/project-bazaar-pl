<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateNotasTable extends Migration
{
    public function up()
    {
        Schema::create('notas', function (Blueprint $table) {
            $table->bigIncrements('id');
            $table->double('harga_total');
            $table->unsignedInteger('user_id');
            $table->unsignedInteger('stand_id');
            $table->String('qrcode')->unique();
            $table->boolean('is_paid')->default(false);
            $table->boolean('is_cancel')->default(false);
            $table->timestamps();
        });
    }

    
    public function down()
    {
        Schema::dropIfExists('notas');
    }
}
