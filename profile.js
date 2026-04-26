function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function scoreBar(label, value) {
  const pct = Math.max(0, Math.min(5, value)) * 20;
  return `
    <div class="fit-metric">
      <div class="fit-label-line">
        <span>${label}</span>
        <span class="fit-caption">${value}/5</span>
      </div>
      <div class="fit-bar"><div class="fit-fill" style="width:${pct}%"></div></div>
    </div>
  `;
}

function renderProfile(profile) {
  document.title = `${profile.name} | PI Dossier`;
  document.getElementById("profile-track").textContent = `${profile.priority} · ${profile.track}`;
  document.getElementById("profile-name").textContent = profile.name;
  document.getElementById("profile-headline").textContent = profile.headline;
  document.getElementById("profile-meta").textContent = `${profile.institution} · ${profile.country}`;
  document.getElementById("profile-fit-summary").textContent = profile.fitSummary;
  document.getElementById("profile-fit-detail").textContent = profile.fitDetail;
  document.getElementById("profile-decision").textContent = profile.decision;
  document.getElementById("profile-caution").textContent = `需要留意：${profile.caution}`;

  document.getElementById("fit-panel").innerHTML = [
    scoreBar("肾小管生理", profile.scores.physiology),
    scoreBar("遗传性结石病", profile.scores.stone),
    scoreBar("培养 / organoid 平台", profile.scores.models),
  ].join("");

  document.getElementById("focus-list").innerHTML = profile.focus
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("methods-list").innerHTML = profile.methods
    .map((item) => `<li>${item}</li>`)
    .join("");
  document.getElementById("angle-list").innerHTML = profile.angles
    .map((item) => `<li>${item}</li>`)
    .join("");

  document.getElementById("paper-list").innerHTML = profile.papers
    .map(
      (paper) => `
        <article class="paper-item">
          <h3>${paper.title}</h3>
          <p>${paper.journal}</p>
          <p><a href="https://pubmed.ncbi.nlm.nih.gov/${paper.pmid}/" target="_blank" rel="noreferrer">PubMed PMID ${paper.pmid}</a></p>
          <span>${paper.note}</span>
        </article>
      `
    )
    .join("");

  document.getElementById("links-list").innerHTML = profile.links
    .map(
      (link) => `
        <article class="link-item">
          <h3>${link.label}</h3>
          <p><a href="${link.url}" target="_blank" rel="noreferrer">${link.url}</a></p>
        </article>
      `
    )
    .join("");
}

const profile = window.PI_DATA.find((item) => item.id === qs("id")) || window.PI_DATA[0];
renderProfile(profile);
