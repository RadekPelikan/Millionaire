const initSlide = document.getElementById("next-level");
const levelBlock = document.getElementById("level-wrapper");
const questionText = document.getElementById("question");
const buttonsBLock = document.getElementById("button-wrapper");

// TODO: Multiple correct answers
let answerButtons;
let questionsJson;
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
        question = questionsJson[currentQ]["question"];
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
    }, 500);

    await setTimeout(() => {
        levelBlock.classList.remove("next-question");
        isSwitching = false;
    }, 2100);
};
initSlide.onclick = () => {
    currentQ = 0;
    HandleNextQuestion();
};

const generateButtons = async () => {
    answerButtons = [];
    buttonsBLock.innerHTML = "";
    await questionsJson[currentQ]["answers"].forEach((text, index) => createButton(text, index));
}

const createButton = (answerText, index) => {
    let button = document.createElement("button");
    button.dataset.id = index;
    button.onclick = checkAnswer;
    buttonsBLock.appendChild(button);
    button.innerText = answerText;
    button.classList.add("button");
    answerButtons.push(button);
};

const checkAnswer = () => {
    let button = event.target;
    console.log(button);
    console.log(parseInt(questionsJson[currentQ].correctAns) - 1)
    if (button.dataset.id == parseInt(questionsJson[currentQ].correctAns) - 1) {
        button.classList.add("is-success");
    } else {
        button.classList.add("is-danger")
    }

    setTimeout(() => {
        HandleNextQuestion();
        currentQ++;
    }, 1500)
}

window.onload = async () => {
    questionsJson = await readFile();
    HandleNextQuestion();
    // console.log(questions);
};