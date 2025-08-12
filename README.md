# Getting Started with Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).
# JWT Auth Frontend

Bu proje, JWT tabanlı kimlik doğrulama sistemi ile çalışan bir React frontend uygulamasıdır.  
Backend API, kullanıcı girişini doğrular ve başarılı girişlerde JWT token döner.

##  Özellikler
- Kullanıcı adı ve şifre ile giriş yapma
- Backend API'ye istek gönderme
- Başarılı giriş sonrası yönlendirme
- Hatalı girişte kullanıcıya uyarı mesajı

##  Kullanılan Teknolojiler
- React.js
- JavaScript (ES6+)
- Fetch API
- HTML5 & CSS3

##  Kurulum
```bash
# Projeyi klonla
git clone https://github.com/KilleanPlay/JwtAuthProjectFrontend.git

# Proje klasörüne gir
cd jwt-auth-frontend

# Bağımlılıkları yükle
npm install

# Geliştirme modunda çalıştır
npm start
 Backend API
Bu frontend, JwtAuthProjectApi backend projesi ile birlikte çalışır.
API endpoint URL’si .env dosyasında ayarlanmalıdır.

Örnek .env dosyası:

ini
Kopyala
Düzenle
REACT_APP_API_URL=http://localhost:5000
📁 Proje Yapısı
bash
Kopyala
Düzenle
src/
 ├── components/
 │    ├── LoginForm.jsx    # Giriş formu bileşeni
 │
 ├── pages/
 │    ├── AdminManage.jsx  # Admin paneli sayfası
 │    ├── UsersPage.jsx    # Kullanıcılar sayfası
 │
 ├── api.js                # API istekleri
 ├── auth.js               # JWT token işlemleri
 ├── App.js                # Ana bileşen
 ├── index.js              # React giriş noktası
💡 Not: Backend çalışmazsa giriş işlemleri başarısız olur. Öncelikle backend API'yi başlattığınızdan emin olun.