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
        Schema::create('medications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->string('dosage')->nullable(); // e.g. 50, 1
            $table->string('dosage_unit')->nullable(); // e.g. mg, Tablet, ml
            $table->string('frequency_type')->nullable(); // e.g. daily, twice_daily, specific_days
            $table->integer('duration_days')->nullable(); // null = continuous
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->json('reminder_times')->nullable(); // JSON array of HH:MM times
            $table->integer('total_pills')->nullable();
            $table->integer('refill_reminder_threshold')->default(10);
            $table->text('notes')->nullable();
            $table->enum('status', ['active', 'completed', 'paused'])->default('active');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('medications');
    }
};
