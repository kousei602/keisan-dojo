// app.js

// --- State Management ---
const SAVE_KEY = "keisanDojoSaveData";

let saveData = {
    // subject -> level -> { clearCount: 0, unlocked: false }
    progress: {}
};

function loadData() {
    const data = localStorage.getItem(SAVE_KEY);
    if (data) {
        try {
            saveData = JSON.parse(data);
        } catch (e) {
            console.error("Save data corrupted", e);
        }
    }
}

function saveDataToLocal() {
    localStorage.setItem(SAVE_KEY, JSON.stringify(saveData));
}

function getProgress(subject, levelIndex) {
    if (!saveData.progress[subject]) saveData.progress[subject] = {};
    if (!saveData.progress[subject][levelIndex]) {
        saveData.progress[subject][levelIndex] = { clearCount: 0, unlocked: false };
    }
    return saveData.progress[subject][levelIndex];
}

function getHighestTitle() {
    let highestLevel = -1;
    let titleName = "見習い";
    
    for (const sub in saveData.progress) {
        for (const lvl in saveData.progress[sub]) {
            const levelIndex = parseInt(lvl);
            const data = saveData.progress[sub][lvl];
            if (data.unlocked && levelIndex > highestLevel) {
                highestLevel = levelIndex;
                titleName = `${sub} ${Difficulties[levelIndex].name}`;
            }
        }
    }
    return titleName;
}

// --- DOM Elements ---
const views = {
    home: document.getElementById("view-home"),
    game: document.getElementById("view-game"),
    result: document.getElementById("view-result")
};
const modalModeSelect = document.getElementById("modal-mode-select");

// --- View Switching ---
function switchView(viewName) {
    Object.values(views).forEach(v => v.classList.remove("active"));
    views[viewName].classList.add("active");
    views[viewName].classList.remove("hidden");
    // Hide others
    Object.keys(views).forEach(k => {
        if (k !== viewName) views[k].classList.add("hidden");
    });
}

// --- App Variables ---
let currentSubject = "";
let currentLevelIndex = 0;
let currentQuestions = [];
let currentQIndex = 0;
let currentInput = "";
let score = 0;

// --- Home Screen Logic ---
function renderHome() {
    document.getElementById("highest-title").innerText = getHighestTitle();
    
    const list = document.getElementById("subject-list");
    list.innerHTML = "";
    
    SubjectCategories.forEach(cat => {
        const group = document.createElement("div");
        group.className = "subject-group";
        
        cat.subjects.forEach(sub => {
            const subTitle = document.createElement("div");
            subTitle.className = "subject-title";
            subTitle.innerText = sub;
            group.appendChild(subTitle);
            
            const scroll = document.createElement("div");
            scroll.className = "difficulty-scroll";
            
            Difficulties.forEach((diff, idx) => {
                const prog = getProgress(sub, idx);
                const isCompleted = prog.unlocked;
                const percent = Math.min(prog.clearCount * 10, 100);
                
                const badge = document.createElement("div");
                badge.className = `badge ${isCompleted ? 'completed' : ''}`;
                badge.innerHTML = `
                    <div class="kyu-name">${diff.name}</div>
                    <div class="progress-text">${isCompleted ? '★' : percent + '%'}</div>
                    <div class="badge-progress-bar" style="width: ${percent}%"></div>
                `;
                
                badge.addEventListener("click", () => {
                    openModeSelect(sub, idx);
                });
                
                scroll.appendChild(badge);
            });
            group.appendChild(scroll);
        });
        
        list.appendChild(group);
    });
}

// --- Mode Select Logic ---
function openModeSelect(subject, levelIndex) {
    currentSubject = subject;
    currentLevelIndex = levelIndex;
    
    document.getElementById("mode-select-title").innerText = `${subject} - ${Difficulties[levelIndex].name}`;
    
    let desc = "推奨モードを選択してください";
    if (levelIndex <= 3) desc = "暗算で解ける超基本問題です";
    if (levelIndex >= 6) desc = "手書きを推奨する難易度です";
    document.getElementById("mode-select-desc").innerText = desc;
    
    modalModeSelect.classList.remove("hidden");
}

document.getElementById("btn-close-modal").addEventListener("click", () => {
    modalModeSelect.classList.add("hidden");
});

document.getElementById("btn-mode-mental").addEventListener("click", () => startGame());
document.getElementById("btn-mode-written").addEventListener("click", () => startGame());

// --- Game Logic ---
function startGame() {
    modalModeSelect.classList.add("hidden");
    currentQuestions = generateQuestions(currentSubject, currentLevelIndex, 10);
    currentQIndex = 0;
    score = 0;
    switchView("game");
    showQuestion();
}

document.getElementById("btn-quit-game").addEventListener("click", () => {
    switchView("home");
    renderHome();
});

function showQuestion() {
    document.getElementById("game-progress").innerText = `問題: ${currentQIndex + 1} / 10`;
    document.getElementById("question-display").innerText = currentQuestions[currentQIndex].q;
    currentInput = "";
    updateAnswerDisplay();
}

function updateAnswerDisplay() {
    document.getElementById("answer-display").innerText = currentInput || " ";
}

// Keypad
document.querySelectorAll(".key.num").forEach(btn => {
    btn.addEventListener("click", (e) => {
        const val = e.target.innerText;
        if (currentInput.length < 10) {
            currentInput += val;
            updateAnswerDisplay();
        }
    });
});
document.querySelector(".key.minus").addEventListener("click", () => {
    if (!currentInput.includes("-")) {
        currentInput = "-" + currentInput;
    } else {
        currentInput = currentInput.replace("-", "");
    }
    updateAnswerDisplay();
});
document.querySelector(".key.clear").addEventListener("click", () => {
    currentInput = "";
    updateAnswerDisplay();
});
document.querySelector(".key.enter").addEventListener("click", () => {
    if (currentInput === "") return;
    checkAnswer();
});

function checkAnswer() {
    const q = currentQuestions[currentQIndex];
    if (currentInput.trim() === q.a.trim()) {
        score++;
    }
    
    currentQIndex++;
    if (currentQIndex < 10) {
        showQuestion();
    } else {
        endGame();
    }
}

// --- Result Logic ---
function endGame() {
    switchView("result");
    
    document.getElementById("result-score").innerText = `${score} / 10`;
    
    const isClear = score >= 8;
    document.getElementById("result-message").innerText = isClear ? "クリア！✨" : "残念！次は頑張ろう";
    document.getElementById("result-message").style.color = isClear ? "var(--accent-gold)" : "var(--accent-red)";
    
    const prog = getProgress(currentSubject, currentLevelIndex);
    const wasUnlocked = prog.unlocked;
    const oldPercent = Math.min(prog.clearCount * 10, 100);
    
    if (isClear && !wasUnlocked) {
        prog.clearCount++;
        if (prog.clearCount >= 10) {
            prog.unlocked = true;
        }
        saveDataToLocal();
    }
    
    const newPercent = Math.min(prog.clearCount * 10, 100);
    
    document.getElementById("result-progress-text").innerText = `達成度: ${oldPercent}% ${isClear && !wasUnlocked ? '→ ' + newPercent + '%' : ''}`;
    
    const fill = document.getElementById("result-progress-fill");
    fill.style.transition = "none";
    fill.style.width = `${oldPercent}%`;
    
    setTimeout(() => {
        fill.style.transition = "width 1s cubic-bezier(0.1, 0.7, 0.1, 1)";
        fill.style.width = `${newPercent}%`;
    }, 100);
    
    const titleAnnouncement = document.getElementById("new-title-announcement");
    if (!wasUnlocked && prog.unlocked) {
        // Just unlocked
        titleAnnouncement.classList.remove("hidden");
        document.getElementById("new-title-name").innerText = `${currentSubject} ${Difficulties[currentLevelIndex].name}`;
        fireConfetti();
    } else {
        titleAnnouncement.classList.add("hidden");
    }
}

document.getElementById("btn-back-home").addEventListener("click", () => {
    switchView("home");
    renderHome();
});

function fireConfetti() {
    const duration = 3000;
    const end = Date.now() + duration;

    (function frame() {
        confetti({
            particleCount: 5,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#e8b038', '#d94848']
        });
        confetti({
            particleCount: 5,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#e8b038', '#4caf50']
        });

        if (Date.now() < end) {
            requestAnimationFrame(frame);
        }
    }());
}

// --- Initialization ---
loadData();
renderHome();
