const state = {
  priority: "全部",
  track: "全部",
  country: "全部",
  search: "",
};

const priorityOrder = ["全部", "最优先", "第一梯队"];

function uniqueValues(key) {
  const values = [...new Set(window.PI_DATA.map((item) => item[key]))];
  return ["全部", ...values];
}

function createFilterButtons(targetId, values, stateKey) {
  const root = document.getElementById(targetId);
  root.innerHTML = "";

  values.forEach((value) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `filter-chip${state[stateKey] === value ? " active" : ""}`;
    button.textContent = value;
    button.addEventListener("click", () => {
      state[stateKey] = value;
      refreshFilters();
      renderRows();
    });
    root.appendChild(button);
  });
}

function refreshFilters() {
  createFilterButtons("priority-filters", priorityOrder, "priority");
  createFilterButtons("track-filters", uniqueValues("track"), "track");
  createFilterButtons("country-filters", uniqueValues("country"), "country");
}

function matchFilters(item) {
  const haystack = [
    item.name,
    item.institution,
    item.country,
    item.track,
    item.headline,
    item.tags.join(" "),
  ]
    .join(" ")
    .toLowerCase();

  return (
    (state.priority === "全部" || item.priority === state.priority) &&
    (state.track === "全部" || item.track === state.track) &&
    (state.country === "全部" || item.country === state.country) &&
    (!state.search || haystack.includes(state.search))
  );
}

function rowTemplate(item) {
  return `
    <a class="atlas-row" href="profile.html?id=${item.id}" style="--row-accent:${item.accent}">
      <div class="row-head">
        <span class="accent-bar"></span>
        <div class="row-main">
          <div class="pill-row">
            <span class="pill">${item.priority}</span>
            <span class="pill">${item.track}</span>
            <span class="pill">${item.country}</span>
          </div>
          <h3>${item.name}</h3>
          <p class="row-meta">${item.institution}</p>
          <p>${item.headline}</p>
        </div>
      </div>
      <div class="row-summary">
        <p class="tagline">${item.fitSummary}</p>
        <div class="pill-row">
          ${item.tags.map((tag) => `<span class="pill">${tag}</span>`).join("")}
        </div>
        <span class="row-arrow">打开 dossier</span>
      </div>
    </a>
  `;
}

function revealRows() {
  const rows = document.querySelectorAll(".atlas-row");
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.16 }
  );

  rows.forEach((row) => observer.observe(row));
}

function renderRows() {
  const rowsRoot = document.getElementById("atlas-rows");
  const count = document.getElementById("result-count");
  const filtered = window.PI_DATA.filter(matchFilters);

  rowsRoot.innerHTML = filtered.map(rowTemplate).join("");
  count.textContent = `当前显示 ${filtered.length} / ${window.PI_DATA.length} 位老师`;
  revealRows();
}

document.getElementById("search-box").addEventListener("input", (event) => {
  state.search = event.target.value.trim().toLowerCase();
  renderRows();
});

refreshFilters();
renderRows();
