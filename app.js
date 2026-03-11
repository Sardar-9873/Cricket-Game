let userName = "";
let userLevel = "";
let selectedTeam = "";
let selectedCoin = "";
let isUserBatting = null;
let totalScore = 0;
let totalwickets = 0;
let target = 0;
let lastWicketFall = null;
let attempt = [];

const nameWrapper = document.getElementById("name-wrapper");
const nameNextButton = nameWrapper.querySelector("button");
const nameInput = nameWrapper.querySelector("input");

const levelWrapper = document.getElementById("level-wrapper");
const levelNextButton = levelWrapper.querySelector("#level-next");

const teamWrapper = document.getElementById("team-wrapper");
const teams = teamWrapper.getElementsByClassName("team");

const tossWrapper = document.getElementById("toss-wrapper");
const coins = tossWrapper.getElementsByClassName("coin");

const battingSelectionWrapper = document.getElementById("batting-selection-wrapper");
const battingOptions = battingSelectionWrapper.getElementsByClassName("batting-option");

const playWrapper = document.getElementById("play-wrapper");
const playButton = playWrapper.querySelector("#play");
const scoreEl = playWrapper.querySelector("#score");
const wicketEl = playWrapper.querySelector("#wickets");
const targetEl = playWrapper.querySelector("#target");
const typeEl = playWrapper.querySelector("#type");
const teamEl = playWrapper.querySelector("#team");
const levelEl = playWrapper.querySelector("#level");

function getUserName() {
  const value = nameInput.value;
  userName = value;
  nameWrapper.remove();
  levelWrapper.classList.replace("none", "flex");
}
nameNextButton.addEventListener("click", getUserName);

function getUserLevel() {
  const levelInput = levelWrapper.querySelector('input[name="level"]:checked');

  if (!levelInput) {
    alert("Please select a level");
    return;
  }

  const value = levelInput.value;
  userLevel = value;

  const isConfirm = confirm("Are you sure you want to play " + userLevel + " level");


  if(isConfirm){
  levelWrapper.remove();
  teamWrapper.classList.replace("none", "flex");
  }else{
    return;
  }

  if (userLevel === "Easy"){
    attempt = [
  "score",
  "score",
  "score",
  "score",
  "wicket",
  "score",
  "score",
  "score",
  "score",
];
}else if(userLevel === "Medium"){
    attempt = [
  "score",
  "score",
  "wicket",
  "score",
  "score",
  "score",
];
}else{
attempt = [
  "score",
  "wicket",
  "score",
];
}
}
levelNextButton.addEventListener("click" , getUserLevel);


for (let i = 0; i < teams.length; i++) {
  const team = teams[i];
  team.addEventListener("click", selectTeam);
}

function selectTeam(event) {
  selectedTeam = event.target.innerText;
  const isConfirm = confirm(`Are you sure, You want to select ${selectedTeam}`);
  if (isConfirm) proceedToNextPageThenSelecTeam();
}

function proceedToNextPageThenSelecTeam() {
  teamWrapper.remove();
  tossWrapper.classList.replace("none", "flex");
}

for (let i = 0; i < coins.length; i++) {
  const coin = coins[i];
  coin.addEventListener("click", selectCoin);
}

function selectCoin(event) {
  selectedCoin = event.target.innerText;
  let selectedSide = event.target.id;
  const isConfirm = confirm(`Are you sure, You want to select ${selectedCoin}`);

  if (isConfirm) {
    const winnerSide = generateCoinResult();
    const isUserWon = winnerSide === selectedSide;
    if (isUserWon) {
      alert("Congrats!!!, You Won the toss");
      proceedToNextPageThenSelectCoin();
    } else {
      alert("You can't even manage to won the toss");
      autoSelectBattingOptionAndProceed();
    }
  }
}

function autoSelectBattingOptionAndProceed() {
  const randomNumber = Math.random();
  const selectedSide = Math.ceil(randomNumber * 2);
  if (selectedSide === 1) {
    isUserBatting = false;
  } else {
    isUserBatting = true;
  }

  tossWrapper.remove();
  showAndUpdatePlay();
}

function generateCoinResult() {
  const randomNumber = Math.random();
  const side = Math.ceil(randomNumber * 2);
  return side.toString();
}

function proceedToNextPageThenSelectCoin() {
  tossWrapper.remove();
  battingSelectionWrapper.classList.replace("none", "flex");
}

for (let i = 0; i < battingOptions.length; i++) {
  const battingOption = battingOptions[i];
  battingOption.addEventListener("click", selectionOption);
}

function selectionOption(event) {
  const userSelectOptionName = event.target.innerText;
  const userSelectedOption = event.target.id;

  const isUserConfirmed = confirm(`Are you sure, you want ${userSelectOptionName}`,);

  if (!isUserConfirmed) return;

  if (userSelectedOption === "batting") {
    isUserBatting = true;
  } else {
    isUserBatting = false;
  }

  battingSelectionWrapper.remove();
  showAndUpdatePlay();
}

function showAndUpdatePlay() {
  let type = "";
  if (isUserBatting) type = "Batting";
  else type = "Bowling";

  const nameEl = playWrapper.querySelector("#name");
  nameEl.innerText = `${userName}`;

  typeEl.innerText = `You're ${type}`;
  teamEl.innerText = `${selectedTeam} vs AI`;
  levelEl.innerText = userLevel;
  playWrapper.classList.replace("none", "block");
}



const subAttempts = {
  score: [0, 1, 2, 3, 4, 5, 6],
  wicket: [
    "LBW",
    "Caught Behind",
    "Caught Out",
    "Bowled",
    "Run out",
    "Hit Wickets",
    "Stump Out",
  ],
};
playButton.addEventListener("click", function () {
  document.addEventListener("keypress", playAttempt);
  playButton.remove();
});

function playAttempt(event) {
  const isSpacePressed = event.keyCode === 32;
  if (!isSpacePressed) return;
  

  const randomNumerForAttempt = Math.random();
  const parentAttempInd = Math.floor(randomNumerForAttempt * attempt.length);

  const parentAttempt = attempt[parentAttempInd];
  const isScore = parentAttempt === "score";

  if (isScore) {
    updateScore();
  } else {
    updateWicket();
  }
}

function updateWicket() {
    const wicketTypes = subAttempts.wicket;
    const randomNumber = Math.random();
    const wicketIndex = Math.floor(randomNumber * wicketTypes.length);
    const wicket = wicketTypes[wicketIndex];
    alert(`Wicket Out: ${wicket}`);
  
  totalwickets++;
  wicketEl.innerText = totalwickets;

  if (totalwickets === 10) {
    if (isUserBatting) {
      alert("You've lost all wickets");
      if (!target) {
        isUserBatting = false;
        target = totalScore + 1;
        targetEl.innerText = target;
        const type = "Bowling";
        typeEl.innerText = `You're ${type}`;
      } else {
        alert("You've lost the match");
        document.removeEventListener("keypress", playAttempt);
      }
    } else {
      if (!target) {
        target = totalScore + 1;
        targetEl.innerText = target;
        isUserBatting = true;
        alert("You've taken all the wickets");
        const type = "Batting";
        typeEl.innerText = `You're ${type}`;
      } else {
        alert("You've won the match");
        document.removeEventListener("keypress", playAttempt);
      }
    }
    totalwickets = 0;
    totalScore = 0;
    scoreEl.innerText = 0;
    wicketEl.innerText = 0;
  }
}

function updateScore() {
  isTakingStance = false;

  const scoreTypes = subAttempts.score;
  const randomNumber = Math.random();
  const scoreIndex = Math.floor(randomNumber * 7);
  const score = scoreTypes[scoreIndex];
  if (isUserBatting) {
    alert(`You've scored: ${score}`);
  } else {
    alert(`AI has scored ${score}`);
  }
  totalScore += score;
  scoreEl.innerText = totalScore;

  if (target && totalScore >= target) {
    if (isUserBatting) {
      alert("Hurryay!!! you've won the match");
    } else {
      alert("You can't even win against AI");
    }
    document.removeEventListener("keypress", playAttempt);
  }
}
