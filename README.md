# React Frontend (JWT + HealthCheck)

Bu branch, HealthCheck API için **React** arayüzünü içerir.  
JWT ile **rol bazlı erişim**, **Health dashboard**, **grafikler** (recharts) ve **animasyonlu** modern UI (framer-motion) bulunur.  
Ayrıca ana sayfada **tanıtım (Hero)** ve **animasyonlu galeri** (localStorage) vardır.

---

## 🚀 Kurulum ve Çalıştırma

```bash
# bağımlılıklar
npm i

# grafik + animasyon (gerekirse)
npm i recharts framer-motion

# geliştirme sunucusu
npm start

# prod derleme
npm run build
```

---

## ⚙️ Ortam Değişkeni

Kök dizine `.env.local` oluşturun:

```
REACT_APP_API_URL=https://localhost:5001
```

> Boş bırakılırsa varsayılan `https://localhost:5001` kullanılır.

---

## 📚 Sayfalar ve Erişim

- `/` **Home** — Tanıtım (hero + blob arkaplan), özellik kartları, **animasyonlu galeri** (sürükle-bırak / dosya seç).  
- `/login` **Giriş** — `POST /login` → `{ token }` bekler.  
- `/users` **Kullanıcılar** — **Giriş zorunlu** (Admin/Chief/Manager/Staff).  
- `/admin` **Admin Paneli** — **Admin, Manager**.  
- `/health` **Health Dashboard** — **Admin, Manager** (bar/pie grafikler, süre/dağılım).

**Koruma davranışları**
- **Giriş yoksa:** korumalı sayfalara gidişte otomatik **/login**’e yönlendirilir.
- **Yetkisiz rol (ör. Chief/Staff → `/admin` / `/health`):** sayfada **animasyonlu “Erişim reddedildi”** kartı gösterilir (yönlendirme yok, aynı sayfada uyarı).

---

## 🔌 API Uçları (beklenen)

- `POST /login` → **Body:** `{ username, password }`  **Resp:** `{ token }`
- `GET  /User/users` → liste
- `POST /User/users` → ekle
- `PUT  /User/users/{id}` → güncelle
- `DELETE /User/users/{id}` → sil
- `GET  /admin/health/details-proxy` → Health detayları (`status`, `entries.{name}.status`, `duration`, `data.description`)

---

## 🧠 Roller

`Admin`, `Chief`, `Manager`, `Staff`  
> Frontend tarafında enum eşlemesi kullanılır: **Admin=0, Chief=1, Manager=2, Staff=3**.

---

## 🧩 Teknolojiler

- **React (CRA)** — yönlendirme: `react-router-dom`
- **JWT** — `auth.js` ile decode, localStorage’da saklama
- **recharts** — Bar/Pie grafikler (Health süre ve durum dağılımı)
- **framer-motion** — route ve UI animasyonları
- **Saf CSS** — glassmorphism, rozetler, kartlar, tema değişkenleri

---

## 🗂️ Dizin Yapısı (kısa)

```
src/
  App.js
  App.css
  index.css
  api.js          # fetch yardımcıları + token header
  auth.js         # login / token / rol decode
  components/
    LoginForm.jsx
    ProtectedRoute.jsx  # giriş yoksa /login; yetkisizse animasyonlu uyarı
  pages/
    Home.jsx           # hero + özellikler + animasyonlu galeri (localStorage)
    UsersPage.jsx      # liste (korumalı: giriş gerekli)
    AdminManage.jsx    # CRUD (korumalı: Admin/Manager)
    HealthPage.jsx     # grafikler + kartlar (korumalı: Admin/Manager)
```

---

## 🎨 Tema & Stil Özelleştirme

`index.css` → `:root` değişkenleriyle renk/tema:

```
--brand, --brand-2, --ok, --warn, --bad, --card, --text, --muted, --ring
```

> Görsel dili hızlıca kurum renklerinize uydurmak için bu değişkenleri güncelleyin.

---

## 📊 Health Süreleri (Önemli Not)

Backend `duration` alanını **TimeSpan** benzeri bir string döndürür (örn. `00:00:00.0007252` veya `1.03:12:05.12`).  
Frontend’de bu değerler **ms**’e parse edilerek grafikte kullanılır; tooltip ve kartlarda `µs/ms/s` olarak formatlanır.

---

## 🔐 Güvenlik Notları

- Geliştirmede **HTTPS** önerilir.
- Üretimde token saklama stratejisini (örn. **HttpOnly cookie**) değerlendirin.
- Galeri görselleri **localStorage**’a kaydedilir (sunucuya yüklenmez).

---

## 🏗️ Build & Dağıtım

```bash
npm run build
# /build klasörünü web sunucunuza/hostinge yükleyin
```
<img width="1901" height="902" alt="healtcheck" src="https://github.com/user-attachments/assets/2597cce5-8b6b-4b8f-bd8a-ae5ad97dba2c" />
<img width="1900" height="905" alt="home" src="https://github.com/user-attachments/assets/bfaf640d-ac74-4762-86ce-d5edb1633582" />
<img width="1918" height="908" alt="denied" src="https://github.com/user-attachments/assets/37e61d04-2d7f-460b-9200-03ead43f0693" />
<img width="1918" height="905" alt="login" src="https://github.com/user-attachments/assets/3d84b30c-11be-4e0a-b455-d039812d8e05" />
<img width="1918" height="906" alt="user" src="https://github.com/user-attachments/assets/75b8e82a-c487-4384-8d53-f015789bf631" />
<img width="1902" height="907" alt="admin" src="https://github.com/user-attachments/assets/85ed2882-1b65-468b-8e1b-7479d601a34a" />

