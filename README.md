
# Ko-fi Webhook Storage API

API sederhana untuk mengumpulkan dan mengakses data webhook Ko-fi.

Saya membuat project ini karena **Ko-fi tidak menyediakan API resmi** untuk mengambil semua data subscription/donation sekaligus.  
Satu-satunya cara untuk mendapatkan seluruh data secara lengkap adalah dengan **menyimpan webhook yang dikirim Ko-fi**, lalu mengolahnya sendiri.

Dengan project ini, kamu bisa dengan mudah:
- melihat semua donation yang pernah masuk
- melihat semua subscription yang pernah masuk
- mengambil daftar **subscription yang masih aktif**

Dokumentasi webhook Ko-fi:
https://help.ko-fi.com/hc/en-us/articles/360004162298

---

## ✨ Fitur Utama

✅ Menyimpan semua webhook Ko-fi ke database lokal (JSON / LokiJS)  
✅ Endpoint untuk membaca data donation & subscription  
✅ Endpoint untuk mengambil **subscription aktif**  
✅ Keamanan endpoint menggunakan token (API_TOKEN)  
✅ Verifikasi webhook Ko-fi menggunakan KO_FI_VERIFICATION_TOKEN  

⚠️ Catatan:
Project ini **tidak mendukung**:
- commissions
- shop orders/items
- shipping information

---

## 📌 Endpoints

### Webhook Receiver
- `POST /webhooks/ko-fi`  
  Endpoint ini digunakan Ko-fi untuk mengirim webhook.

### Donation
- `GET /donations`  
  Mengambil semua payload donation yang pernah diterima.

### Subscription
- `GET /subscriptions`  
  Mengambil semua payload subscription yang pernah diterima.

### Subscription Aktif
- `GET /subscriptions/active`  
  Mengambil daftar subscription yang masih aktif (berdasarkan timestamp pembayaran terakhir).

---

## 🔐 Authentication & Security

### 1. Webhook Verification (Ko-fi)
Endpoint webhook (`POST /webhooks/ko-fi`) akan memverifikasi request menggunakan:

- `KO_FI_VERIFICATION_TOKEN`

Token ini berasal dari:
https://ko-fi.com/manage/webhooks

Tujuannya adalah memastikan webhook benar-benar berasal dari Ko-fi, bukan pihak lain.

---

### 2. API Token (GET Endpoints)
Semua endpoint `GET` diproteksi dengan `API_TOKEN`, supaya data donation/subscription tidak bisa diakses sembarang orang.

Contoh penggunaan:

```sh
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:3000/subscriptions
````

---

## ⚙️ Setup

1. Copy file `.env.example` menjadi `.env`

2. Isi variabel mandatory berikut:

### Mandatory Environment Variables

* `KO_FI_VERIFICATION_TOKEN`
  Token verifikasi webhook yang kamu dapatkan dari dashboard Ko-fi.

* `API_TOKEN`
  Token private untuk mengakses endpoint `GET`.

  Kamu bisa generate token random menggunakan:

```sh
openssl rand -hex 24
```

---

### Optional Environment Variables

* `TEST_WEBHOOKS`
  Mengatur apakah webhook "test" dari dashboard Ko-fi ikut disimpan.

  Nilai:

  * `0` = tidak disimpan
  * `1` = disimpan

Contoh:

```env
TEST_WEBHOOKS=0
```

---

## ▶️ Menjalankan Project

### Development

```sh
npm run dev
```

### Production

```sh
npm run build
npm run --silent start
```

---

## 📤 Export Semua Data Webhook

Kamu bisa export semua data webhook yang sudah tersimpan menggunakan script:

```sh
node scripts/export.js ./path/to/kofi_data.json
```

Hasil export akan disimpan sebagai file:

```
webhookPayloads.json
```

di directory tempat command dijalankan.

---

## 📌 Kenapa Project Ini Dibutuhkan?

Ko-fi hanya mengirim data lewat webhook secara real-time.
Artinya jika kamu ingin melihat semua subscription aktif atau riwayat donation lengkap, kamu harus:

1. menerima webhook
2. menyimpannya ke database
3. membuat endpoint sendiri untuk membacanya

Project ini menyelesaikan semua itu secara otomatis.

---

## 🧾 Contoh Use Case

* Sistem premium Discord bot berbasis Ko-fi
* Dashboard membership Ko-fi
* Menghitung subscription aktif dalam 30 hari terakhir
* Menyimpan semua riwayat donasi untuk laporan atau analitik

---