## **BAB IV** 

## **ANALISA DAN HASIL** 

## **4.1 Analisa Sistem** 

Analisis merupakan suatu kegiatan dalam mempelajari serta mengavaluasi suatu bentuk permasalahan atau kasus yang terjadi, sedangkan sistem merupakan gabungan dari beberapa komponen yang saling berhubungan satu sama yang lainya. 

Analisa sistem merupakan tahap melakukan investigasi awal terhadap sistem yang sedang berjalan atau gambaran umum terhadap sistem yang sedang berjalan. Untuk itu dibutuhkan alat dan teknik pengumpulan data, antara lain pengamatan langsung _(observasi)_ , wawancara, kuisioner dan pengamatan sampling dokumen. 

## **4.1.1 Aliran Sistem Informasi Yang Sedang Berjalan** 

Aliran sistem informasi yang sedang berjalan merupakan bagian yang menunjukan arus pekerjaan keseluruhan dari sistem yang sedang berjalan. Berikut ini aliran sistem informasi yang sedang berjalan di Konseling SMP IT Budi Mulia Padang 

1. Siswa datang kepada Guru Bimbingan Konseling (BK) untuk melakukan sesi konseling. 

2. Guru BK mencatat data siswa yang akan melakukan konseling, kemudian melaksanakan sesi bimbingan konseling bersama siswa tersebut. 

3. Setelah sesi selesai, Guru BK membuat sebuah laporan yang berisi data hasil bimbingan konseling 

4. Guru BK menyerahkan laporan tersebut kepada Kepala Sekolah 

   - untuk diperiksa dan divalidasi. 

5. Kepala Sekolah menerima laporan, kemudian memeriksanya 

dan memberikan pengesahan pada laporan tersebut. 

6. Setelah disahkan, laporan tersebut menjadi laporan data 

bimbingan konseling yang sah 

**Gambar 4.1 Aliran sistem informasi yang sedang berjalan** 

## **4.1.2 Kelemahan Sistem Yang Sedang Berjalan** 

Berdasarkan penelitian yang telah dilakukan pada Konseling SMP IT 

Budi Mulia Padang, penulis melihat ada beberapa kelemahan pada sistem yang sedang berjalan yaitu : 

1. Guru BK harus menyerahkan laporan kepada Kepala Sekolah secara manual (fisik), yang berisiko memakan banyak waktu jika Kepala Sekolah sedang tidak berada di tempat atau sibuk. 

2. Proses penulisan data siswa dan pembuatan laporan masih dilakukan secara manual, sehingga rentan terjadi kesalahan penulisan, format yang tidak konsisten, atau bahkan data yang tidak lengkap. 

3. Proses pengesahan yang bergantung sepenuhnya pada kehadiran fisik Kepala Sekolah dapat menjadi penghambat dan memperlambat penyelesaian laporan secara keseluruhan. 

4. Pencarian data atau laporan lama menjadi tidak efisien. Diperlukan waktu untuk mencari dokumen secara manual di dalam tumpukan arsip fisik milik Guru BK dan Kepala Sekolah. 

5. Belum adanya sistem informasi terpusat untuk pendataan dan pelaporan bimbingan konseling, yang mengakibatkan data sulit untuk diolah kembali menjadi laporan rekapitulasi (misalnya laporan bulanan atau tahunan) untuk evaluasi program BK. 

## **4.2 Perancangan Sistem Secara Umum** 

Dalam menganalisa dan desain sistem informasi daftar urut ini penulis menggunakan aliran sistem informasi atau bagan aliran dokumen atau laporan yang terjadi dalam sistem yang sedang berjalan. Di bawah ini akan dijelaskan gambaran aliran sistem informasi Konseling SMP IT Budi Mulia Padang sebagai berikut : 

1. Siswa melakukan login dengan mengisi user dan password. Setelah login, siswa dapat melihat halaman utama yang berisi data dan jadwal Guru BK yang tersedia, lalu dapat langsung melakukan pengajuan jadwal untuk sesi konseling. 

2. Guru BK dapat melakukan pengelolaan data secara digital, meliputi pengelolaan jadwal ketersediaan, melihat daftar pengajuan dari siswa, mengisi catatan atau hasil konseling, serta membuat laporan digital untuk diajukan kepada Kepala Sekolah. 

3. Kepala Sekolah dapat melihat laporan yang diajukan oleh Guru BK. 

## **4.3 Perancangan Dan Pemodelan Sistem** 

Dalam membuat rancangan dan pemodelan sistem ini, digunakan beberapa diagram sebagai berikut : 

## **4.3.1 Deskripsi Aktor** 

Aktor adalah entitas eksternal yang berinteraksi dengan sistem untuk mencapai tujuan tertentu. Aktor bisa berupa pengguna manusia, 

perangkat lunak, sistem eksternal, atau entitas lainnya yang terlibat dalam interaksi dengan sistem yang sedang dianalisis. Aktor direpresentasikan sebagai simbol manusia atau kotak kecil dengan nama di dalamnya. Mereka berfungsi sebagai pemain utama dalam _use case_ dan menyediakan input ke sistem atau menerima output dari sistem. Adapun aktor yang terlihat dalam Sistem Informasi ini dapat dilihat dari tabel berikut: 

**Tabel 4.1 Tabel Deskripsi Aktor** 

|No.|<br>Aktor|Deskripsi|
|---|---|---|
|1.|Guru BK|Guru BK adalah orang yang memiliki hak akses untuk mengelola data<br>Siswa, data Jadwal, data Kategori Konseling, data Kelas, data<br>Konseling, data Hasil Konseling dan mencetak laporan.|
|2.|Siswa|Siswa adalah orang yang memiliki akses pengajuan jadwal konseling<br>dan melihat hasil konseling.|
|3.|Kepala<br>sekolah|Kepala Sekolah adalah orang yang dapat melihat seluruh laporan|



## **4.3.2** _**UseCase Diagram**_ 

_Use case diagram_ adalah jenis diagram yang digunakan dalam rekayasa perangkat lunak untuk menggambarkan interaksi antara aktor-aktor yang terlibat dan fungsionalitas sistem dalam suatu lingkungan tertentu. Diagram ini membantu dalam mengidentifikasi, memodelkan, dan memvisualisasikan perilaku dan fungsi sistem dari perspektif pengguna atau aktor eksternal. Diagram ini dapat digunakan sebagai alat komunikasi yang kuat antara pengembang perangkat lunak, analis sistem, dan pemangku kepentingan lainnya untuk memahami persyaratan sistem dan 

interaksi pengguna dengan sistem yang direncanakan. Adapun use case diagram dari Sistem Informasi ini dapat dilihat pada gambar berikut: 

**Gambar 4.2** _**Use Case Diagram**_ 

## **4.3.3** _**Activiy Diagram**_ 

Aktifitas diagram memberikan gambaran ilustrasi alur dari setiap 

fungsi yang ada dalam sistem. Aktifitas diagram memberikan gambaran ilustrasi alur dari setiap fungsi yang ada dalam sistem. 

**4.3.3.1** _**Activity Diagram Login**_ 

**Gambar 4.3** _Activity Diagram Login_ 

## **4.3.3.2** _**Activity Diagram Input**_ **Kelas** 

**Gambar 4.4** _Activity Diagram input_ Kelas 

**4.3.3.3** _**Activity Diagram Input**_ **Siswa** 

**Gambar 4.5** _Activity Diagram Input_ Siswa 

## **4.3.3.4** _**Activity Diagram Input**_ **Kategori** 

**Gambar 4.6** _Activity Diagram Input_ Kategori 

**4.3.3.5** _**Activity Diagram Input**_ **Jadwal** 

**Gambar 4.7** _Activity Diagram Input_ Jadwal 

## **4.3.3.6** _**Activity Diagram Input**_ **Pengajuan** 

**Gambar 4.8** _Activity Diagram Input_ Pengajuan 

## **4.3.3.7** _**Activity Diagram Input**_ **Konseling** 

**Gambar 4.9** _Activity Diagram Input_ Konseling 

## **4.3.3.8** _**Activity Diagram**_ **Hasil** 

**Gambar 4.10** _Activity Diagram_ Hasil 

## **4.3.3.9** _**Activity**_ **Diagram Laporan** 

**Gambar 4.11** _Activity Diagram_ Laporan 

## **4.3.4** _**Sequence Diagram**_ 

Diagram _sequence_ merupakan salah satu yang menjelaskan bagaimana suatu operasi itu dilakukan, _message (pesan)_ apa yang dikirim dan kapan pelaksanaannya. Diagram ini diatur berdasarkan waktu. Objekobjek yang berkaitan dengan proses berjalannya operasi diurutkan dari kiri ke kanan berdasarkan waktu terjadinya dalam pesan yang terurut. 

## **4.3.4.1** _**Sequence Diagram Login**_ 

**Gambar 4.12** _Sequence Diagram Login_ 

## **4.3.4.2** _**Sequence Diagram**_ **Kelas** 

**Gambar 4.13** _Sequence Diagram_ Kelas 

## **4.3.4.3** _**Sequence Diagram**_ **Siswa** 

**Gambar 4.14** _Sequence Diagram_ Siswa 

## **4.3.4.4** _**Sequence Diagram**_ **Kategori** 

**Gambar 4.15** _Sequence Diagram_ Kategori 

## **4.3.4.5** _**Sequence Diagram**_ **Jadwal** 

**Gambar 4.16** _Sequence Diagram_ Jadwal 

## **4.3.4.6** _**Sequence Diagram**_ **Pengajuan** 

**Gambar 4.17** _Sequence Diagram_ Pengajuan 

## **4.3.4.7** _**Sequence Diagram**_ **Konseling** 

**Gambar 4.18** _Sequence Diagram_ Konseling 

## **4.3.4.8** _**Sequence Diagram**_ **Hasil** 

**Gambar 4.19** _Sequence Diagram_ Hasil 

## **4.3.4.9** _**Sequence Diagram**_ **Laporan** 

**Gambar 4.20** _Sequence Diagram_ Laporan 

## **4.3.5** _**Class Diagram**_ 

_Class_ adalah sebuah spesifikasi yang jika di instansiasi akan menghasilkan sebuah objek dan merupakan inti dari pengembangan dan desain berorientasi objek. _Class_ menggambarkan keadaan (atribut/properti) suatu sistem, sekaligus menawarkan layanan untuk memanipulasi keadaan tersebut (metoda/fungsi). Adapun _class_ diagram dari Sistem Informasi Konseling SMP IT Budi Mulia dapat dilihat pada gambar berikut : 

**Gambar 4.21** _Class Diagram_ Konseling SMP IT Budi Mulia Padang 

## **4.4 Perancangan** _**Database**_ 

Sebelum memulai pembuatan sistem informasi perlu dilakukan perancangan _database_ . Perancangan database merupakan hal yang pertama kali yang harus dilakukan karena pada sistem informasi Konseling SMP IT Budi Mulia Padang membutuhkan sebuah _database_ agar dapat berjalan dengan baik. Metode yang digunakan dalam perancangan _database_ ini adalah perancangan logika _database_ dan fisik _database_ . _Database_ yang digunakan pada sistem informasi ini adalah _database_ Konseling SMP IT Budi Mulia Padang. 

## **4.4.1 Perancangan Fisik** _**Database**_ 

Perancangan _database_ secara fisik merupakan proses pemilihan struktur-struktur penyimpanan dan jalur-jalur akses pada file-file _database_ untuk mencapai penampilan yang terbaik pada bermacam-macam sistem informasi. Selama fase ini, dirancang spesifikasi–spesifikasi untuk _database_ dimana yang berhubungan dengan struktur-struktur penyimpanan fisik, penempatan _record_ dan jalur akses. Perancangan fisik _database_ dapat dilihat pada tabel dibawah ini. 

## 1. Desain Tabel User 

**Tabel 4.2** tabel _user_ 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|iduser|int|10|no|primary|
|username|varchar|30|||
|password|varchar|255|||
|level|enum|‘1’,’2’,’3’||foregin keys|



## 2. Desain Tabel Kelas 

**Tabel 4.3** tabel kelas 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|id|char|10|no|primary|
|nama|varchar|255|||
|walikelas|varchar|255|||



## 3. Desain Tabel Siswa 

**Tabel 4.4** tabel siswa 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|nis|char|30|no|primary|
|nama|varchar|50|||
|jenkel|varchar|50|||
|tempatlahir|varchar|50|||
|tgllahir|date||||
|agama|varchar|50|||
|alamat|text||||
|idkelas|char|10||foregin keys|
|namaayah|varchar|50|||
|pekerjaanayah|varchar|50|||
|alamatayah|varchar|50|||
|nohpayah|char|30|||
|namaibu|varchar|50|||
|pekerjaanibu|varchar|50|||
|alamatibu|varchar|50|||
|nohpibu|char|30|||



## 4. Desain Tabel kategori 

**Tabel 4.5** tabel kategori 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|id|int|11|_(auto)_|primary|
|namakategori|varchar|50|||
|deskripsi|text||||



## 5. Desain Tabel Jadwal 

**Tabel 4.6** tabel jadwal 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|idjadwal|int|11|_(auto)_|primary|
|hari|varchar|255|||



|jammulai|time||||
|---|---|---|---|---|
|jamselesai|time||||



## 6. Desain Tabel Detail Pengajuan 

**Tabel 4.7** tabel detail pengajuan 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|idpengajuan|char|30|no|primary|
|idjadwal|int|11|no|foregin keys|
|idkategori|int|11||foregin keys|
|tglpengajuan|date||||
|nis|char|30||foregin keys|
|catatan|text||||



## 7. Desain Tabel Konseling 

**Tabel 4.8** tabel konseling 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|idkonseling|char|30|no|primary|
|idpengajuan|char|30||foregin keys|
|tglkonseling|date||||
|keterangan|text||||



## 8. Desain Tabel hasil 

**Tabel 4.9** tabel hasil 

|Field|Type|Length|Null|Key|
|---|---|---|---|---|
|idhasil|int|11|no|primary|
|idkonseling|char|30|||
|tglhasil|date||||
|solusi|text||||



## **4.5 Normalisasi** 

Normalisasi merupakan sebuah teknik dalam logical desain sebuah basis 

data yang mengelompokkan atribut dari suatu relasi sehingga membentuk struktur relasi yang baik (tanpa redudansi). Berikut adalah rencana normalisasi untuk sistem informasi Konseling SMP IT Budi Mulia Padang: 

## **1. Unnormalized form** 

Bentuk ini merupakan bentuk data yang direkam, tidak ada keharusan untuk mengikuti suatu format tertentu, dapat saja data tidak lengkap atau terduplikasi. 

**Tabel 4.10** Unnformalized form 

|**idkonseling**|**idpengajuan**|**nis**|**nama**|**catatan**|**keterangan**|**jadwal**|
|---|---|---|---|---|---|---|
|K001|P001|123|dilla|bingung|pilihan|senin|
|K002|P002|321|adam|sedih|sakit||



**Tabel 4.11** Unnformalized form lanjutan 

|**idkategori**|**namakategori**|**idhasil**|**solusi**|**tglkonseling**|**jam**|
|---|---|---|---|---|---|
|KT001|Konsultasi|H001|Terbaik|20-07-2025|13:00|
|||balqis|Semangat||14:00|



## **2. Normalisasi 1NF** 

1NF adalah bentuk normalisasi untuk mengelompokkan beberapa 

data sejenis untuk mengatasi masalah anomali. Suatu tabel dikatakan 1NF jika dan hanya jika setiap atribut dari data tersebut hanya memiliki nilai tunggal dalam satu baris. 

**Tabel 4.12** Tabel Siswa 

|**nis**|**nama**|**jenkel**|**tempatlahir**|**tgllahir**|**agama**|**alamat**|**namaayah**|**idkelas**|
|---|---|---|---|---|---|---|---|---|
|123|dilla|P|Padang|21-01-2002|Islam|koto baru|Anton|1|
|321|adam|L|Palembang|22-12-2002|Kristen|banuaran|Budi|1|



**Tabel 4.13** Tabel Siswa Lanjutan 

|**pekerjaanayah**|**alamatayah**|**nohpayah**|**namaibu**|**pekerjaanibu**|**alamatibu**|**nohpibu**|
|---|---|---|---|---|---|---|
|swasta|kotobaru|08123|Siti|rumah tangga|kotobaru|08423|
|bumn|banuaran|08987|Sandra|guru|banuaran|08487|



**Tabel 4.14** Tabel Jadwal 

|**idjadwal**|**hari**|**jammulai**|**jamselesai**|
|---|---|---|---|
|JW001|Senin|08.00|09:00|
|JW002||09.00|10:00|



**Tabel 4.15** Tabel Pengajuan 

|**idpengajuan**|**idjadwal**|**tglpengajuan**|**idjenis**|**nis**|**catatan**|
|---|---|---|---|---|---|
|P001|JW001|2025-05-27|JW001|123|bingung|
|P002|JW002||JW002|321|sedih|



**Tabel 4.16** Tabel Konseling 

|**idkonseling**|**idjadwal**|**tglkonseling**|**keterangan**|
|---|---|---|---|
|K001|P001|2025-05-27|pilihan|
|K002|P002||sakit|



**Tabel 4.17** Tabel Hasil 

|**idhasil**|**idkonseling**|**tglhasil**|**solusi**|
|---|---|---|---|
|H001|K001|2025-05-28|Terbaik|
|H002|K002||Semangat|



## **3. Normalisasi 2NF** 

Relasi 2NF adalah relasi yang memenuhi 1NF dan setiap atribut bukan primary key memiliki ketergantungan fungsional penuh pada primary key. Jadi, ada dua hal yang berkaitan dengan relasi 2NF, yaitu primary key dan ketergantungan fungsional. 

**Tabel 4.18** Tabel Pengajuan 

|**idpengajuan**|**idjadwal**|**tglpengajuan**|**idjenis**|**nis**|**catatan**|
|---|---|---|---|---|---|
|P001|JW001|2025-05-27|JW001|123|bingung|
|P002|JW002|2025-05-27|JW002|321|sedih|



**Tabel 4.19** Tabel Konseling 

|**idkonseling**|**idjadwal**|**tglkonseling**|**keterangan**|
|---|---|---|---|
|K001|P001|2025-05-27|pilihan|
|K002|P002|2025-05-27|sakit|



**Tabel 4.20** Tabel Hasil 

|**idhasil**|**idkonseling**|**tglhasil**|**solusi**|
|---|---|---|---|
|H001|K001|2025-05-28|Terbaik|
|H002|K002|2025-05-28|Semangat|



**Tabel 4.21** Tabel Siswa 

|**nis**|**nama**|**jenkel**|**tempatlahir**|**tgllahir**|**agama**|**alamat**|**namaayah**|**idkelas**|
|---|---|---|---|---|---|---|---|---|
|123|dilla|P|Padang|21-01-2002|Islam|koto baru|Anton|1|
|321|adam|L|Palembang|22-12-2002|Kristen|banuaran|Budi|1|



**Tabel 4.22** Tabel Siswa Lanjutan 

|**pekerjaanayah**|**alamatayah**|**nohpayah**|**namaibu**|**pekerjaanibu**|**alamatibu**|**nohpibu**|
|---|---|---|---|---|---|---|
|swasta|kotobaru|08123|Siti|rumah tangga|kotobaru|08423|
|bumn|banuaran|08987|Sandra|guru|banuaran|08487|



**Tabel 4.23** Tabel Jadwal 

|**idjadwal**|**hari**|**jammulai**|**jamselesai**|
|---|---|---|---|
|JW001|Senin|08.00|09:00|
|JW002|Senin|09.00|10:00|



**Tabel 4.24** Tabel Kategori 

|**idkategori**|**namakategori**|**deskripsi**|
|---|---|---|
|KT001|Konsultasi|Curhat individu|
|KT002|Pengembangan|Pilihan SMA atau SMK|



**Tabel 4.25** Tabel Kelas 

|**idkategori**|**namakelas**|**walikelas**|
|---|---|---|
|KL001|VII A|Nursusi, S.Pd|



## **4.6 Desain Sistem Secara Rinci** 

## **4.6.1 Desain Output** 

Desain Output atau rancangan digunakan untuk menetapkan format tampilan yang digunakan sebagai media untuk melihat hasil akhir dari sebuah sistem yang telah dibangun.  Sebagai bentuk data yang dapat dilihat pada layar komputer. Desain Output pada sistem informasi ini dapat dilihat pada gambar dibawah ini : 

## **4.6.1.1 Desain** _**Output**_ **Laporan Kategori** 

**Gambar 4.23** Desain Output Laporan Kategori 

## **4.6.1.2 Desain** _**Output**_ **Laporan Jadwal** 

**Gambar 4.24** Desain Output Laporan Jadwal 

## **4.6.1.3 Desain** _**Output**_ **Laporan Siswa** 

**Gambar 4.25** Desain _Output_ Laporan Siswa 

## **4.6.1.4 Desain** _**Output**_ **Laporan Kelas** 

**Gambar 4.26** Desain Output Laporan Kelas 

## **4.6.1.5 Desain** _**Output**_ **Laporan Pengajuan** 

**Gambar 4.27** Desain _Output_ Laporan Pengajuan 

## **4.6.1.6 Desain** _**Output**_ **Laporan Konseling** 

**Gambar 4.28** Desain _Output_ Laporan Konseling 

## **4.6.1.7 Desain** _**Output**_ **Laporan Hasil** 

**Gambar 4.29** Desain _Output_ Laporan Hasil 

## **4.6.2 Desain** _**Input**_ 

Tujuan dari desain input adalah untuk menjamin pemasukan data yang diterima dan dimengerti agar tercapai keakuratan yang tinggi sehingga pemasukan data dapat dilakukan dengan seobjektif mungkin. Dalam pembahasan selanjutnya dirancang desain input agar memudahkan bagi pemakai dalam pengentrian data.  Adapun bentuk desain input pada sistem informasi adalah sebagai berikut : 

## **4.6.2.1 Desain** _**Input**_ **Login** 

**Gambar 4.30** Desain _Input Login_ 

## **4.6.2.2 Desain** _**Input**_ **Kategori** 

**Gambar 4.31** Desain _Input_ Kategori 

## **4.6.2.3 Desain** _**Input**_ **Kelas** 

**Gambar 4.32** Desain _Input_ Kelas 

## **4.6.2.4 Desain** _**Input**_ **Jadwal** 

**Gambar 4.33** Desain _Input_ Jadwal 

## **4.6.2.5 Desain Input Siswa** 

**Gambar 4.34** Desain _Input_ Siswa 

## **4.6.2.6 Desain** _**Input**_ **Pengajuan** 

**Gambar 4.35** Desain _Input_ Pengajuan 

## **4.6.2.7 Desain** _**Input**_ **Konseling** 

**Gambar 4.36** Desain _Input_ Konseling 

## **4.6.2.8 Desain** _**Input**_ **Hasil** 

**Gambar 4.36** Desain _Input_ Hasil 

## **4.7 Implementasi Sistem** 

Implementasi sistem merupakan bagian dari siklus pengembangan sistem itu sendiri. Implmentasi sistem dilakukan setelah tahapan perancangan sistem dilakukan. Implementasi sistem dapat dilakukan setelah sistem yang dibuat dapat berjalan sebagaimana mestinya. Perancangan _interface_ dilakukan untuk interaksi _user_ dengan sistem yang telah dibuat. Adapun kebutuhan _hardware_ dan kebutuhan _software_ dalam pengujian sistem ini adalah sebagai berikut: 

1. Kebutuhan _Hardware_ 

Dalam implementasi ini menggunakan bantuan dari perangkat keras _(hardware)_ , dimnana perangkat keras yang digunakan yaitu laptop Asus TUF GAMING 17-12100, RAM 8 GB, SSD 256 GB. 

2. Dalam implementasi sistem ini juga menggunakan bantuan dari berbagai perangkat lunak, diantara perangkat lunak yang digunakan adalah sebagai berikut: 

   - a) Sistem operasi Windows 11 Home 64-bit 

   - b) Xampp 

   - c) SQL Yoq community 64-bit 

   - d) CodeIgniter 4.5.1 

   - e) Visual Studio Code 

   - f) Google Chrome 

## **4.8 Pengujian Sistem** 

Dalam tahap ini peneliti mulai melakukan uji coba terhadap sistem didasarkan pada informasi dari deskripsi perancangan awal perangkat lunak. Beberapa pengujian sistem yang dilakukan adalah : 

1. Semua kebutuhan fungsional perangkat lunak terpenuhi. 

2. Kinerja perangkat lunak telah sesuai dengan kebutuhan. 

3. Dokumentasi sudah benar. 

4. Kebutuhan lain _(transportability, compatibility, error recovery, maintainability)_ terpenuhi. 

