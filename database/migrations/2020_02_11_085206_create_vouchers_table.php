<?php

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Database\Migrations\Migration;

class CreateVouchersTable extends Migration
{
   
    public function up()
    {
        Schema::create('vouchers', function (Blueprint $table) {
            $table->bigIncrements('id');
            // $table->String('redeem_by');
            $table->String('qrcode')->unique();
            $table->unsignedInteger('user_id')->nullable();
            $table->double('nominal');
            $table->boolean('is_redeem')->default(false);
            $table->timestamps();
        });
    }

    
    public function down()
    {
        Schema::dropIfExists('vouchers');
    }
}
