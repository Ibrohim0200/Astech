function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") || localStorage.getItem("lang") || "uz";
}

async function loadLanguage(lang) {
  try {
    const response = await fetch(`locales/${lang}.json`);
    if (!response.ok) throw new Error("Language file not found");
    const data = await response.json();
    applyTranslations(data);
    localStorage.setItem("lang", lang);
  } catch (err) {
    console.error("❌ Tilni yuklashda xatolik:", err);
  }
}

function applyTranslations(texts) {
  // Navbar
  document.querySelector("nav a.active").textContent = texts.navbar.autopark;

  // Car cards
  document.querySelectorAll(".car-card").forEach(card => {
    const priceElement = card.querySelector(".price");
    if (priceElement) {
      const priceText = priceElement.innerText.split(" ")[0];
      priceElement.innerText = `${priceText} ${texts.cars.price_suffix}`;
    }
    const btn = card.querySelector(".btn");
    if (btn) btn.innerText = texts.cars.order_button;
  });

  // Modal
  document.querySelector("#orderModal h2").innerText = texts.modal.title;
  const labels = document.querySelectorAll(".form-group label");
  if (labels.length >= 4) {
    labels[0].innerText = texts.modal.name_label;
    labels[1].innerText = texts.modal.phone_label;
    labels[2].innerText = texts.modal.start_date_label;
    labels[3].innerText = texts.modal.end_date_label;
  }
  document.querySelector("#orderModal button").innerText = texts.modal.confirm_button;

  // Alertlar globalga qo‘yiladi
  window.ALERTS = texts.alerts;

  console.log(texts.console.ready);
}

function showAlert(type) {
  if (window.ALERTS && window.ALERTS[type]) {
    alert(window.ALERTS[type]);
  } else {
    alert("⚠️ Xatolik yuz berdi!");
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const lang = getLangFromUrl();
  loadLanguage(lang);
});
