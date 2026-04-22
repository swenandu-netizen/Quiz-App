let currentQuestionIndex = 0;
let quizData = [];

// आपकी JSON फ़ाइल का नाम
const jsonURL = "j.json"; 

// 1. डेटा मंगाना
fetch(jsonURL)
    .then(response => response.json())
    .then(data => {
        quizData = data[""] || data; 
        if(quizData && quizData.length > 0) {
            loadQuestion(); 
        } else {
            document.getElementById('question').innerText = "क्विज़ में कोई सवाल नहीं मिला!";
        }
    })
    .catch(error => {
        console.error('डेटा लोड करने में गलती हुई:', error);
        document.getElementById('question').innerText = "एरर: डेटा लोड नहीं हो सका!";
    });

// 2. स्क्रीन पर सवाल दिखाना
function loadQuestion() {
    const questionElement = document.getElementById('question');
    const optionsElement = document.getElementById('options');
    
    optionsElement.innerHTML = ''; 

    let currentData = quizData[currentQuestionIndex];
    questionElement.innerText = currentData.q; 

    currentData.options.forEach(option => {
        const button = document.createElement('button');
        button.innerText = option;
        button.classList.add('btn'); 
        
        button.onclick = () => checkAnswer(option, currentData.answer, button);
        optionsElement.appendChild(button);
    });
}

// 3. जवाब चेक करना
function checkAnswer(selectedOption, correctAnswer, buttonElement) {
    const allButtons = document.querySelectorAll('.btn');
    allButtons.forEach(btn => btn.disabled = true);

    if (selectedOption === correctAnswer) {
        // सही जवाब के लिए शानदार हरा रंग
        buttonElement.style.background = '#2ecc71'; 
        buttonElement.style.borderColor = '#27ae60';
        buttonElement.style.color = 'white';
    } else {
        // गलत जवाब के लिए लाल रंग
        buttonElement.style.background = '#e74c3c'; 
        buttonElement.style.borderColor = '#c0392b';
        buttonElement.style.color = 'white';
        
        // सही जवाब को भी हरा करके दिखाएँ
        allButtons.forEach(btn => {
            if(btn.innerText === correctAnswer) {
                btn.style.background = '#2ecc71';
                btn.style.borderColor = '#27ae60';
                btn.style.color = 'white';
            }
        });
    }
    
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        setTimeout(loadQuestion, 1500); // 1.5 सेकंड का इंतज़ार
    } else {
        setTimeout(() => {
            document.getElementById('quiz-container').innerHTML = `
                <h2 style="color: #2c3e50; font-size: 28px; margin-bottom: 10px;">🎉 क्विज़ समाप्त! 🎉</h2>
                <p style="color: #7f8c8d; font-size: 16px; margin-bottom: 25px;">आपने बहुत शानदार खेला।</p>
                <button class="btn" onclick="location.reload()" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; border: none; font-size: 18px;">फिर से खेलें 🔄</button>
            `;
        }, 1500);
    }
}
