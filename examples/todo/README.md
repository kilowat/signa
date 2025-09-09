# 📝 ToDo App на Tailwind CSS

Простое приложение ToDo List на **HTML + Tailwind CSS** с настройкой сборки под development и production.

---

## 🚀 Установка

```bash
git clone https://github.com/yourname/todo-app.git
cd todo-app
npm install
```

---

## ⚡ Скрипты

- `npm run dev` — запускает локальный сервер + watch Tailwind  
- `npm run watch` — пересборка CSS при изменениях (без минификации)  
- `npm run serve` — только локальный сервер (`live-server`)  
- `npm run build` — сборка минифицированного production CSS  

---

## 🛠 Структура проекта

```
src/           # исходники
  ├─ input.css # Tailwind entrypoint
  └─ index.html

dist/          # скомпилированный CSS
  └─ output.css
```

---

## 🌐 Запуск в dev-режиме

```bash
npm run dev
```

Приложение откроется в браузере по адресу:  
👉 `http://127.0.0.1:8080`

---

## 📦 Production сборка

```bash
npm run build
```

Итоговый минифицированный CSS появится в `dist/output.css`.
