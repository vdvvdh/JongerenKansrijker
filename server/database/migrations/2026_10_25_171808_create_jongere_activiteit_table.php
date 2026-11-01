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
            Schema::create('jongere_activiteit', function (Blueprint $table) {
                $table->id();
                $table->foreignId('jongere_id')->constrained('jongeren')->cascadeOnDelete();
                $table->foreignId('activiteit_id')->constrained('activiteiten')->cascadeOnDelete();
                $table->date('inschrijf_datum')->nullable();
                $table->string('resultaat')->default('nog bezig');
                $table->timestamps();
            });
        }

        /**
         * Reverse the migrations.
         */
        public function down(): void
        {
            Schema::dropIfExists('jongere_activiteit');
        }
    };
