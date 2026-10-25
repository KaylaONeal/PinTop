"use strict";
(() => {
  const supported = ["en", "zh-Hans", "zh-Hant"];
  const requested = new URLSearchParams(location.search).get("lang");
  let saved;
  try { saved = localStorage.getItem("pintop-language"); } catch (_) {}
  const browser = (navigator.languages || [navigator.language || "en"])
    .map(value => /^zh-(Hant|TW|HK|MO)(-|$)/i.test(value) ? "zh-Hant" : /^zh(-|$)/i.test(value) ? "zh-Hans" : /^en(-|$)/i.test(value) ? "en" : null)
    .find(Boolean);
  const language = supported.includes(requested) ? requested : supported.includes(saved) ? saved : browser || "en";
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language]").forEach(element => {
    element.hidden = element.dataset.language !== language;
  });
  document.querySelectorAll("[data-language-choice]").forEach(link => {
    if (link.dataset.languageChoice === language) link.setAttribute("aria-current", "true");
  });
  document.querySelectorAll("a[data-local-link]").forEach(link => {
    const target = new URL(link.getAttribute("href"), location.href);
    target.searchParams.set("lang", language);
    link.href = target.href;
  });
  const article = document.querySelector(`main [data-language="${language}"]`);
  if (article) {
    document.title = article.dataset.title;
    document.querySelector('meta[name="description"]').content = article.dataset.description;
  }
  // Only remember an explicit choice. This value stays in this browser.
  if (supported.includes(requested)) {
    try { localStorage.setItem("pintop-language", language); } catch (_) {}
  }
})();
