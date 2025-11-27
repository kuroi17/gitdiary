// use when functions is specific to entries page

const buttonSelector = document.querySelector(".newEntriesBtn");

buttonSelector.addEventListener("click", () => {
  window.location.href = "new-entry.html";
});
