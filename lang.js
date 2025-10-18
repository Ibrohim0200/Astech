function getLangFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get("lang") || localStorage.getItem("lang") || "uz";
}


async function loadLanguage(lang) {
  try {
    const response = await fetch(`langs/${lang}.json`);
    if (!response.ok) throw new Error("Language file not found");
    const data = await response.json();
    applyTranslations(data);
    localStorage.setItem("lang", lang); // tanlangan tilni saqlab qo‘yish
  } catch (err) {
    console.error("❌ Tilni yuklashda xatolik:", err);
  }
}

function applyTranslations(texts) {
  document.querySelector("nav a.active").textContent = texts.navbar.autopark;

  document.querySelectorAll(".car-card").forEach((card) => {
    const priceElement = card.querySelector(".price");
    if (priceElement) {
      const priceText = priceElement.innerText.split(" ")[0];
      priceElement.innerText = `${priceText} ${texts.cars.price_suffix}`;
    }
    const btn = card.querySelector(".btn");
    if (btn) btn.innerText = texts.cars.order_button;
  });

  document.querySelector("#orderModal h2").innerText = texts.modal.title;
  document.querySelector("label[for='name']")?.removeAttribute("for"); // eski 'for'ni tozalaymiz

  const labels = document.querySelectorAll(".form-group label");
  if (labels.length >= 4) {
    labels[0].innerText = texts.modal.name_label;
    labels[1].innerText = texts.modal.phone_label;
    labels[2].innerText = texts.modal.start_date_label;
    labels[3].innerText = texts.modal.end_date_label;
  }

  document.querySelector("#orderModal button").innerText = texts.modal.confirm_button;

  console.log(texts.console.ready);

  window.ALERTS = texts.alerts;
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
