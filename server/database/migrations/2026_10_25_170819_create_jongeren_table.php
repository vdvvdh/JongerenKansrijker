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
        Schema::table('jongeren', function (Blueprint $table) {
            $table->foreignId('instituut_id')->nullable()->constrained('instituten')->nullOnDelete();
            $table->date('uitgeplaatst_op')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('jongeren', function (Blueprint $table) {
            $table->dropConstrainedForeignId('instituut_id');
            $table->dropColumn('uitgeplaatst_op');
        });
    }
};
