const endDate = new Date("2025-07-28T23:59:59");
function getWordForm(n, forms) {
  return forms[
    n % 10 === 1 && n % 100 !== 11
      ? 0
      : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)
      ? 1
      : 2
  ];
}
let previousLastDigit = null;
function updateTimer() {
  const now = new Date();
  const diff = endDate - now;
  const container = document.getElementById("timer");
  if (diff <= 0) {
    container.innerHTML =
      "<div class='segment'><div class='digit'>00</div><div class='label'>завершено</div></div>";
    return;
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  const secondsStr = seconds.toString().padStart(2, "0");
  const secondLeft = secondsStr[0];
  const secondRight = secondsStr[1];
  const lastChanged = previousLastDigit !== secondRight;
  const segments = [
    { val: days, label: ["день", "дня", "дней"] },
    { val: hours, label: ["час", "часа", "часов"] },
    { val: minutes, label: ["минута", "минуты", "минут"] },
    {
      label: ["секунда", "секунды", "секунд"],
      isLastDigit: true,
      content: `
            <span>${secondLeft}</span><span class="last-digit-inner${
        lastChanged ? " animate" : ""
      }">${secondRight}</span>
          `,
    },
  ];
  container.innerHTML = segments
    .map((seg, idx) => {
      const isLast = seg.isLastDigit;
      const val = seg.val !== undefined ? String(seg.val).padStart(2, "0") : "";
      return `
          <div class="segment">
            <div class="digit ${isLast ? "last-digit" : ""}">${
        isLast ? seg.content : [...val].map((d) => `<span>${d}</span>`).join("")
      }</div>
            <div class="label">${getWordForm(
              isLast ? Number(secondLeft + secondRight) : seg.val,
              seg.label
            )}</div>
          </div>
        `;
    })
    .join("");
  previousLastDigit = secondRight;
}
setInterval(updateTimer, 1000);
