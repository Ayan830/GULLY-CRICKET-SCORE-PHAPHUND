let runsA = 0, wicketsA = 0;
let runsB = 0, wicketsB = 0;
let balls = 0;

function addRun(team) {
  if (team === 'A') {
    runsA++;
    document.getElementById('runsA').textContent = runsA;
  } else {
    runsB++;
    document.getElementById('runsB').textContent = runsB;
  }
  saveData();
}

function addWicket(team) {
  if (team === 'A') {
    if (wicketsA < 10) wicketsA++;
    document.getElementById('wicketsA').textContent = wicketsA;
  } else {
    if (wicketsB < 10) wicketsB++;
    document.getElementById('wicketsB').textContent = wicketsB;
  }
  saveData();
}

function addBall() {
  balls++;
  const overs = Math.floor(balls / 6) + "." + (balls % 6);
  document.getElementById('overs').textContent = overs;
  saveData();
}

function resetMatch() {
  if (!confirm("Are you sure you want to reset the match?")) return;

  runsA = runsB = wicketsA = wicketsB = balls = 0;
  document.getElementById('runsA').textContent = '0';
  document.getElementById('wicketsA').textContent = '0';
  document.getElementById('runsB').textContent = '0';
  document.getElementById('wicketsB').textContent = '0';
  document.getElementById('overs').textContent = '0.0';

  document.getElementById('teamNameA').textContent = "Team A";
  document.getElementById('teamNameB').textContent = "Team B";
  document.getElementById('playersA').innerHTML = "<li>Player A1</li><li>Player A2</li>";
  document.getElementById('playersB').innerHTML = "<li>Player B1</li><li>Player B2</li>";

  localStorage.removeItem("gullyMatch");
}

function saveData() {
  const data = {
    runsA, wicketsA, runsB, wicketsB, balls,
    teamA: document.getElementById('teamNameA').textContent,
    teamB: document.getElementById('teamNameB').textContent,
    playersA: document.getElementById('playersA').innerHTML,
    playersB: document.getElementById('playersB').innerHTML
  };
  localStorage.setItem("gullyMatch", JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem("gullyMatch");
  if (saved) {
    const data = JSON.parse(saved);
    runsA = data.runsA || 0;
    wicketsA = data.wicketsA || 0;
    runsB = data.runsB || 0;
    wicketsB = data.wicketsB || 0;
    balls = data.balls || 0;

    document.getElementById('runsA').textContent = runsA;
    document.getElementById('wicketsA').textContent = wicketsA;
    document.getElementById('runsB').textContent = runsB;
    document.getElementById('wicketsB').textContent = wicketsB;
    document.getElementById('overs').textContent = Math.floor(balls / 6) + "." + (balls % 6);

    document.getElementById('teamNameA').textContent = data.teamA || "Team A";
    document.getElementById('teamNameB').textContent = data.teamB || "Team B";
    document.getElementById('playersA').innerHTML = data.playersA || "";
    document.getElementById('playersB').innerHTML = data.playersB || "";
  }
function fetchLiveMatches() {
  fetch("https://unofficial-cricbuzz-api.vercel.app/matches")
    .then(response => response.json())
    .then(data => {
      const match = data[0]; // First live match

      document.getElementById('teamNameA').textContent = match.team1;
      document.getElementById('teamNameB').textContent = match.team2;
      document.getElementById('runsA').textContent = match.score_team1 || 'N/A';
      document.getElementById('runsB').textContent = match.score_team2 || 'N/A';
      document.getElementById('wicketsA').textContent = match.wickets_team1 || '-';
      document.getElementById('wicketsB').textContent = match.wickets_team2 || '-';
      document.getElementById('overs').textContent = match.overs || 'N/A';
      document.getElementById('status').textContent = match.status || 'Match status unavailable';
    })
    .catch(error => {
      console.error("API Error:", error);
      document.getElementById('status').textContent = "⚠️ Failed to load live score.";
    });
}

// Load score when page opens
fetchLiveMatches();

// Refresh every 30 seconds
setInterval(fetchLiveMatches, 30000);

// Load saved match data when page loads
window.onload = loadData;
