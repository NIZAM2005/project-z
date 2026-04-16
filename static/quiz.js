const quizData = 
[
    {
        question: "What is the output of : print(2 + 3 * 4)",
        a: "20",
        b: "14",
        c: "24",
        d: "9",
        correct: "b"
    },
    {
        question: "What does the <p> tag represent in HTML?",
        a: "Paragraph",
        b: "Picture",
        c: "Page",
        d: "Preformatted text",
        correct: "a"
    },
    {
        question: "Which language is primarily used to style web pages?",
        a: "HTML",
        b: "CSS",
        c: "Python",
        d: "Java",
        correct: "b"
    },
    {
        question: "Which tag is used to insert an image in HTML?",
        a: "<img>",
        b: "<image>",
        c: "<src>",
        d: "<picture>",
        correct: "a"
    },
];

const quiz = document.getElementById('quiz')
const answerEls = document.querySelectorAll('.answer')
const questionEl = document.getElementById('question')
const a_text = document.getElementById('a_text')
const b_text = document.getElementById('b_text')
const c_text = document.getElementById('c_text')
const d_text = document.getElementById('d_text')
const submitBtn = document.getElementById('submit')

let currentQuiz = 0
let score = 0
loadQuiz()

function loadQuiz()
{
    deselectAnswer()

    const currentQuizData = quizData[currentQuiz]

    questionEl.innerText = currentQuizData.question
    a_text.innerText = currentQuizData.a
    b_text.innerText = currentQuizData.b
    c_text.innerText = currentQuizData.c
    d_text.innerText = currentQuizData.d 
}

function deselectAnswer()
{
    answerEls.forEach(answerEl => answerEl.checked = false)
}

function getSelected()
{
    let answer
    answerEls.forEach(answerEl =>
    {
        if(answerEl.checked)
        {
            answer = answerEl.id
        }
    })
    return answer
}

submitBtn.addEventListener('click', () =>
{
    const answer = getSelected()
    if(answer)
    {
        if(answer === quizData[currentQuiz].correct)
        {
            score++
        }

        currentQuiz++

        if(currentQuiz < quizData.length)
        {
            loadQuiz()
        }

        else
        {
            quiz.innerHTML = `
<h2>You answered ${score}/${quizData.length} questions correctly</h2>
<button onclick="location.reload()">Reload</button>
`
        }
    }
})