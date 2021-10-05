const initSlide = document.getElementById("next-level");
const levelBlock = document.getElementById("level-wrapper");
const questionText = document.getElementById("question");
const buttonsBLock = document.getElementById("button-wrapper");
let answerButtons = [];
// TODO: Checking for corrent answer is -1, cuz it starts from. its 1 to `n`
let questions;
let currentQ = 0;
let isSwitching = false;

const readFile = async () => {
    try {
        const file = await fetch("res/data/data.json");
        console.log("Json load successful")
        return await file.json();
    } catch (e) {
        return readFileGitHub();
    }
};

const changeQuestionText = () => {
    let question;
    try {
        question = questions[currentQ]["question"];
    } catch {
        question = "Už žádné otázky, došly";
    }
    questionText.innerText = question;
};

const HandleNextQuestion = async () => {
    // TODO: After clicking for new question increment the currentQ
    if (isSwitching) {
        return;
    }

    levelBlock.classList.add("next-question");
    isSwitching = true;

    await setTimeout(() => {
        changeQuestionText();
        generateButtons();
        currentQ++;
    }, 500);

    await setTimeout(() => {
        levelBlock.classList.remove("next-question");
        isSwitching = false;
    }, 2100);
};
initSlide.onclick = HandleNextQuestion;

const generateButtons = async () => {
    answerButtons = [];
    buttonsBLock.innerHTML = "";
    await questions[currentQ]["answers"].forEach(text => createButton(text));
}

const createButton = (answerText) => {
    let button = document.createElement("button");
    buttonsBLock.appendChild(button);
    button.innerText = answerText;
    button.classList.add("button");
    answerButtons.push(button);
};

window.onload = async () => {
    questions = await readFile();
    // console.log(questions);
};