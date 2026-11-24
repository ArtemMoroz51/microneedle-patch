const menuToggle = document.querySelector(".menu-toggle");
const navigation = document.querySelector("#navigation");

menuToggle.addEventListener("click", () => {
  const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
  menuToggle.setAttribute("aria-expanded", String(!isOpen));
  navigation.classList.toggle("is-open", !isOpen);
});

navigation.addEventListener("click", (event) => {
  if (event.target.closest("a")) {
    navigation.classList.remove("is-open");
    menuToggle.setAttribute("aria-expanded", "false");
  }
});

const mechanism = document.querySelector(".mechanism");
const mechanismCaption = document.querySelector("#mechanism-caption");
const stageButtons = document.querySelectorAll(".step");
const stageDescriptions = {
  contact: "Массив микроигл проходит наружный барьер кожи.",
  dissolve:
    "Матрица взаимодействует с влагой, постепенно высвобождая вещество.",
  delivery: "Состав матрицы влияет на профиль доставки действующего вещества.",
};

stageButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const stage = button.dataset.stage;
    mechanism.dataset.stage = stage;
    mechanismCaption.textContent = stageDescriptions[stage];
    stageButtons.forEach((stageButton) => {
      const isSelected = stageButton === button;
      stageButton.classList.toggle("is-active", isSelected);
      stageButton.setAttribute("aria-pressed", String(isSelected));
    });
  });
});

const contactDialog = document.querySelector("#contact-dialog");
const contactForm = document.querySelector("#contact-form");
const contactResult = document.querySelector("#contact-result");
const contactStatus = document.querySelector("#contact-status");
const preparedMessage = document.querySelector("#prepared-message");
const retryEmail = document.querySelector("#retry-email");
const copyMessage = document.querySelector("#copy-message");
const recipient = "polozovadashuta@gmail.com";
let contactOpener;

document.querySelectorAll("[data-contact]").forEach((button) => {
  button.addEventListener("click", () => {
    contactOpener = button;
    contactForm.reset();
    contactForm.elements.interest.value = button.dataset.contact;
    contactForm.hidden = false;
    contactResult.hidden = true;
    copyMessage.textContent = "Скопировать текст заявки";
    contactDialog.showModal();
  });
});

document
  .querySelector(".dialog-close")
  .addEventListener("click", () => contactDialog.close());
contactDialog.addEventListener("click", (event) => {
  if (event.target !== contactDialog) return;
  const bounds = contactDialog.getBoundingClientRect();
  const isOutside =
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom;
  if (isOutside) contactDialog.close();
});
contactDialog.addEventListener("close", () => contactOpener?.focus());

contactForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const values = new FormData(contactForm);
  const interestLabel =
    contactForm.elements.interest.selectedOptions[0].textContent;
  const subject = `Микроигольный пластырь · ${interestLabel}`;
  const body = [
    "Здравствуйте!",
    "",
    `Меня зовут ${values.get("name").trim()}.`,
    `Мой email: ${values.get("email").trim()}`,
    `Интересует: ${interestLabel}.`,
    "",
    values.get("message").trim(),
  ].join("\n");
  const mailto = `mailto:${recipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  preparedMessage.value = `${subject}\n\n${body}`;
  retryEmail.href = mailto;
  contactForm.hidden = true;
  contactResult.hidden = false;
  contactStatus.textContent =
    "Заявка подготовлена. Отправьте письмо из почтового приложения. Если оно не открылось, скопируйте текст ниже и напишите команде напрямую.";
  copyMessage.focus();
  window.location.href = mailto;
});

copyMessage.addEventListener("click", async () => {
  try {
    await navigator.clipboard.writeText(preparedMessage.value);
    copyMessage.textContent = "Текст скопирован";
  } catch {
    preparedMessage.focus();
    preparedMessage.select();
    contactStatus.textContent =
      "Выделили текст заявки. Скопируйте его и отправьте на polozovadashuta@gmail.com.";
  }
});
