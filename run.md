#Run Project
composer run dev

#Table Bersih Kosong Hanya ada user Guru BK dan Kepsek
php artisan migrate:fresh --seed

#Table Ada Contoh Data Palsu
php artisan migrate:fresh --seeder=TestingSeeder
