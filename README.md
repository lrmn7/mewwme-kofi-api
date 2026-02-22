# Mewwme Ko-fi API

A simple API to collect and access Ko-fi webhook data.

I created this project because **Ko-fi does not provide an official API** to fetch all subscription/donation data at once.  
The only way to fully access your complete Ko-fi data is by **storing incoming webhooks**, then processing them yourself.

With this project, you can easily:
- view all donations that have ever been received
- view all subscriptions that have ever been received
- retrieve a list of **currently active subscriptions**

Ko-fi webhook documentation:  
https://help.ko-fi.com/hc/en-us/articles/360004162298

---

## ✨ Main Features

✅ Stores all Ko-fi webhooks into a local database (JSON / LokiJS)  
✅ Endpoints to retrieve donation & subscription data  
✅ Endpoint to fetch **active subscriptions**  
✅ Secures endpoints using an API token (API_TOKEN)  
✅ Verifies Ko-fi webhooks using KO_FI_VERIFICATION_TOKEN  

⚠️ Note:  
This project **does not support**:
- commissions
- shop orders/items
- shipping information

---

## 📌 Endpoints

### Webhook Receiver
- `POST /webhooks/ko-fi`  
  This endpoint is used by Ko-fi to send webhook events.

### Donations
- `GET /donations`  
  Fetches all donation payloads that have been received.

### Subscriptions
- `GET /subscriptions`  
  Fetches all subscription payloads that have been received.

### Active Subscriptions
- `GET /subscriptions/active`  
  Fetches all subscriptions that are still active (based on the latest payment timestamp).

---

## 🔐 Authentication & Security

### 1. Webhook Verification (Ko-fi)
The webhook endpoint (`POST /webhooks/ko-fi`) verifies incoming requests using:

- `KO_FI_VERIFICATION_TOKEN`

This token can be found here:  
https://ko-fi.com/manage/webhooks

Its purpose is to ensure that the webhook request is truly sent by Ko-fi, not a third party.

---

### 2. API Token (GET Endpoints)
All `GET` endpoints are protected using `API_TOKEN`, so your donation/subscription data cannot be accessed publicly.

Example usage:

```sh
curl -H "Authorization: Bearer YOUR_API_TOKEN" http://localhost:3000/subscriptions
````

---

## ⚙️ Setup

1. Copy `.env.example` to `.env`

2. Fill in the following mandatory variables:

### Mandatory Environment Variables

* `KO_FI_VERIFICATION_TOKEN`
  The webhook verification token you get from your Ko-fi dashboard.

* `API_TOKEN`
  A private token required to access all `GET` endpoints.

  You can generate a random token using:

```sh
openssl rand -hex 24
```

---

### Optional Environment Variables

* `TEST_WEBHOOKS`
  Controls whether test webhooks from the Ko-fi dashboard should be stored.

  Values:

  * `0` = do not store
  * `1` = store

Example:

```env
TEST_WEBHOOKS=0
```

---

## ▶️ Running the Project

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

## 📤 Export All Webhook Data

You can export all stored webhook payloads using this script:

```sh
node scripts/export.js ./path/to/kofi_data.json
```

The exported output will be saved as:

```
webhookPayloads.json
```

in the directory where the command is executed.

---

## 📌 Why This Project Exists

Ko-fi only provides data through real-time webhooks.
This means if you want to see all active subscriptions or your full donation history, you must:

1. receive webhook events
2. store them in a database
3. create your own API endpoints to read the data

This project automates the entire process.

---

## 🧾 Example Use Cases

* Ko-fi based premium system for a Discord bot
* Ko-fi membership dashboard
* Counting active subscriptions from the last 30 days
* Storing full donation history for reports or analytics