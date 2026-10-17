const dictionary = {
  "zh-CN": {
    "home.eyebrow": "互动数学演示",
    "home.title": "把小学数学题变成可以点击、暂停、重放的动画。",
    "home.copy": "每道题都是一个独立 HTML 页面，适合慢慢扩展。先从平行线、相交线和正方形合并开始。",
    "home.lesson1Badge": "几何",
    "home.lesson1Title": "平行线与相交线",
    "home.lesson1Copy": "两个原创奇幻角色沿直线前进，观察他们是否会在同一点相遇。",
    "home.lesson2Badge": "周长",
    "home.lesson2Title": "两个正方形合成长方形",
    "home.lesson2Copy": "拖近两个正方形，看中间贴合的边为什么不再属于外边界。"
  },
  "en-US": {
    "home.eyebrow": "Interactive math demos",
    "home.title": "Turn primary school math into animations you can click, pause, and replay.",
    "home.copy": "Each lesson can stay as its own HTML page, so the collection can grow slowly. Start with parallel lines, intersecting lines, and joined squares.",
    "home.lesson1Badge": "Geometry",
    "home.lesson1Title": "Parallel and Intersecting Lines",
    "home.lesson1Copy": "Two original fantasy characters walk along straight paths so children can see whether they meet.",
    "home.lesson2Badge": "Perimeter",
    "home.lesson2Title": "Two Squares Become a Rectangle",
    "home.lesson2Copy": "Slide two squares together and watch why the touching sides are no longer outside edges."
  }
};

function getLanguage() {
  return localStorage.getItem("math-lab-language") || "zh-CN";
}

function setLanguage(language) {
  localStorage.setItem("math-lab-language", language);
  document.documentElement.lang = language;
  document.querySelectorAll("[data-language-toggle]").forEach((button) => {
    button.textContent = language === "zh-CN" ? "EN" : "中文";
  });

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.dataset.i18n;
    const value = dictionary[language]?.[key];
    if (value) node.textContent = value;
  });
}

document.querySelectorAll("[data-language-toggle]").forEach((button) => {
  button.addEventListener("click", () => {
    setLanguage(getLanguage() === "zh-CN" ? "en-US" : "zh-CN");
  });
});

setLanguage(getLanguage());
