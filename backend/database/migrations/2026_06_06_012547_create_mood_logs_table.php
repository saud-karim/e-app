<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('mood_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->integer('mood_level')->comment('1: Awful, 2: Bad, 3: Neutral, 4: Good, 5: Awesome');
            $table->integer('anxiety_level')->default(1)->comment('1: None ... 5: Severe');
            $table->decimal('sleep_hours', 4, 1)->nullable();
            $table->text('journal_notes')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('mood_logs');
    }
};
