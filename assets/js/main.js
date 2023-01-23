/**
 * Theming.
 *
 * Supports the preferred color scheme of the operation system as well as
 * the theme choice of the user.
 *
 */
const themeToggle = document.querySelector(".theme-toggle");
const chosenTheme = window.localStorage && window.localStorage.getItem("theme");
const chosenThemeIsDark = chosenTheme == "dark";
const chosenThemeIsLight = chosenTheme == "light";

// Detect the color scheme the operating system prefers.
function detectOSColorTheme() {
  if (chosenThemeIsDark) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else if (chosenThemeIsLight) {
    document.documentElement.setAttribute("data-theme", "light");
  } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
  }
  jQuery("img.color-scheme").get().map(function(el) {
    file = el.src;
    var i = file.lastIndexOf('.');
    if (i < 0) {
      i = file.length;
    }
    dataTheme = document.documentElement.getAttribute("data-theme");
    if (dataTheme == "dark" && !el.src.endsWith("-dark", i)) {
      newFile = file.substr(0, i) + "-dark" + file.substr(i, file.length);
      el.src = newFile;
    } else if (dataTheme == "light" && el.src.endsWith("-dark")) {
      newFile = file.substr(0, i - "-dark".length) + file.substr(i, file.length);
      el.src = newFile;
    }
    el.style.width = "100%";
  });
}

function showColorSchemeImages() {
  jQuery("img.color-scheme").get().map(function(el) {
    el.style.display = "block";
  });
  jQuery("img.banner").get().map(function(el) {
    el.style.display = "block";
  });
}

// Switch the theme.
function switchTheme(e) {
  if (chosenThemeIsDark) {
    localStorage.setItem("theme", "light");
  } else if (chosenThemeIsLight) {
    localStorage.setItem("theme", "dark");
  } else if (document.documentElement.getAttribute("data-theme") == "dark") {
    localStorage.setItem("theme", "light");
  } else {
    localStorage.setItem("theme", "dark");
  }

  detectOSColorTheme();
  window.location.reload();
}

// Event listener
if (themeToggle) {
  themeToggle.addEventListener("click", switchTheme, false);
  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());
  window
    .matchMedia("(prefers-color-scheme: light)")
    .addEventListener("change", (e) => e.matches && detectOSColorTheme());

  detectOSColorTheme();
} else {
  localStorage.removeItem("theme");
}

function menuUnderline(element, enable) {
  if (enable) {
    element.style.textDecoration="underline";
  } else {
    element.style.textDecoration="none";
  }
}
function menuDisplay(element, enable) {
  if (enable) {
    element.style.display="block";
  } else {
    element.style.display="none";
  }
}
function createCopyButton(highlightDiv) {
  const button = document.createElement("button");
  button.className = "copy-code-button";
  button.type = "button";
  button.innerText = "⧉";
  button.addEventListener("click", () => copyCodeToClipboard(button, highlightDiv));
  highlightDiv.insertBefore(button, highlightDiv.firstChild);

  const wrapper = document.createElement("div");
  wrapper.className = "highlight-wrapper";
  highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
  wrapper.appendChild(highlightDiv);
}

document.querySelectorAll(".highlight").forEach((highlightDiv) => createCopyButton(highlightDiv));

async function copyCodeToClipboard(button, highlightDiv) {
  const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code").innerText;
  try {
    var result = await navigator.permissions.query({ name: "clipboard-write" });
    if (result.state == "granted" || result.state == "prompt") {
      await navigator.clipboard.writeText(codeToCopy);
    } else {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    }
  } catch (_) {
    copyCodeBlockExecCommand(codeToCopy, highlightDiv);
  } finally {
 button.blur();
  button.innerText = "📋";
  setTimeout(function () {
    button.innerText = "⧉";
  }, 500);  }
}

function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
  const textArea = document.createElement("textArea");
  textArea.contentEditable = "true";
  textArea.readOnly = "false";
  textArea.className = "copyable-text-area";
  textArea.value = codeToCopy;
  highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
  const range = document.createRange();
  range.selectNodeContents(textArea);
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(range);
  textArea.setSelectionRange(0, 999999);
  document.execCommand("copy");
  highlightDiv.removeChild(textArea);
}

function searchFocus() {
  document.querySelector("#search > div > form > input").focus();
}

function switchTab(isButtonEvent, tabGroup, tabId) {
  allTabItems = jQuery("[data-tab-group='" + tabGroup + "']");
  targetTabItems = jQuery("[data-tab-group='" + tabGroup + "'][data-tab-item='" + tabId + "']");

  if (isButtonEvent) {
    var yposButton = event.target.getBoundingClientRect().top;
  }

  allTabItems.removeClass("active");
  targetTabItems.addClass("active");

  if (isButtonEvent) {
    var yposButtonDiff = event.target.getBoundingClientRect().top - yposButton;
    window.scrollTo(window.scrollX, window.scrollY+yposButtonDiff);

    if (window.localStorage) {
      var selectionsJSON = window.localStorage.getItem("tabSelections");
      if (selectionsJSON) {
        var tabSelections = JSON.parse(selectionsJSON);
      } else {
        var tabSelections = {};
      }
      tabSelections[tabGroup] = tabId;
      window.localStorage.setItem("tabSelections", JSON.stringify(tabSelections));
    }
  }
}

function detectOs() {
  if (navigator.appVersion.indexOf("Win") != -1) return "Windows";
  if (navigator.appVersion.indexOf("Mac") != -1) return "macOS";
  if (navigator.appVersion.indexOf("Linux") != -1) return "Linux";
  return "Unknown";
}

function armString() {
  if (navigator.platform.indexOf("aarch64") != -1) return " (aarch64";
  if (navigator.platform.indexOf("arm") != -1 || navigator.platform.indexOf("aarch") != -1) return " (aarch";
  return "";
}

function tryClickTab(tabNav, itemSubstring) {
  var found = false;
  for (button of tabNav.children) if (!found) {
    item = button.getAttribute("data-tab-item")
    if (item.indexOf(itemSubstring) != -1) {
      found = true;
      button.click();
    }
  }
  return found;
}

function restoreTabSelections() {
  if (window.localStorage) {
    selectionsJSON = window.localStorage.getItem("tabSelections");
    if (selectionsJSON) {
      let tabSelections = JSON.parse(selectionsJSON);
      Object.keys(tabSelections).forEach(function(tabGroup) {
        var tabItem = tabSelections[tabGroup];
        switchTab(false, tabGroup, tabItem);
      });
      return;
    }
  }
  os = detectOs();
  arm = armString();
  jQuery(".tab-nav").get().forEach(tabNav => {
    if (!tryClickTab(tabNav, os + arm)) {
      tryClickTab(tabNav, os);
    }
  });
}

window.addEventListener('load', function () {
  showColorSchemeImages();
  restoreTabSelections();
})

