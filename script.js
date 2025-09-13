// Quiz App Enhanced JavaScript
class QuizApp {
    constructor() {
        this.currentQuestion = 0;
        this.score = 0;
        this.questions = [];
        this.timeLeft = 15;
        this.timer = null;
        this.userAnswers = [];
        
        this.initializeElements();
        this.loadQuestions();
    }

    initializeElements() {
        this.elements = {
            questionNumber: document.getElementById('question-number'),
            questionText: document.getElementById('question-text'),
            options: {
                opt1: document.getElementById('option1'),
                opt2: document.getElementById('option2'),
                opt3: document.getElementById('option3'),
                opt4: document.getElementById('option4')
            },
            timer: document.getElementById('timer'),
            progress: document.getElementById('progress'),
            currentScore: document.getElementById('current-score'),
            nextBtn: document.getElementById('next-btn'),
            prevBtn: document.getElementById('prev-btn'),
            loading: document.getElementById('loading')
        };

        this.bindEvents();
    }

    bindEvents() {
        this.elements.nextBtn.addEventListener('click', () => this.handleNext());
        this.elements.prevBtn.addEventListener('click', () => this.handlePrevious());
        
        // Add click handlers for option containers
        document.querySelectorAll('.option').forEach(option => {
            option.addEventListener('click', (e) => {
                const radio = option.querySelector('input[type="radio"]');
                if (radio && !radio.checked) {
                    radio.checked = true;
                    this.handleAnswerSelection();
                }
            });
        });
    }

    async loadQuestions() {
        try {
            const response = await fetch('Questions.json');
            if (!response.ok) throw new Error('Failed to load questions');
            
            this.questions = await response.json();
            this.hideLoading();
            this.startQuiz();
        } catch (error) {
            console.error('Error loading questions:', error);
            this.showError('Failed to load quiz questions. Please try again.');
        }
    }

    startQuiz() {
        this.currentQuestion = 0;
        this.score = 0;
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.updateDisplay();
        this.startTimer();
    }

    updateDisplay() {
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
            return;
        }

        const question = this.questions[this.currentQuestion];
        
        // Update question display
        this.elements.questionNumber.textContent = `${this.currentQuestion + 1}.`;
        this.elements.questionText.textContent = question.question;
        
        // Update options
        this.elements.options.opt1.textContent = question.op1;
        this.elements.options.opt2.textContent = question.op2;
        this.elements.options.opt3.textContent = question.op3;
        this.elements.options.opt4.textContent = question.op4;
        
        // Update progress and score
        this.elements.progress.textContent = `${this.currentQuestion + 1}/${this.questions.length}`;
        this.elements.currentScore.textContent = this.score;
        
        // Clear previous selections
        this.clearSelections();
        
        // Restore previous answer if exists
        if (this.userAnswers[this.currentQuestion]) {
            const savedAnswer = document.getElementById(this.userAnswers[this.currentQuestion]);
            if (savedAnswer) savedAnswer.checked = true;
        }
        
        // Update button states
        this.updateButtonStates();
        
        // Reset and start timer
        this.resetTimer();
    }

    clearSelections() {
        document.querySelectorAll('input[name="answer"]').forEach(input => {
            input.checked = false;
        });
    }

    handleAnswerSelection() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        if (selectedOption) {
            this.userAnswers[this.currentQuestion] = selectedOption.value;
        }
    }

    handleNext() {
        const selectedOption = document.querySelector('input[name="answer"]:checked');
        
        if (!selectedOption) {
            this.showAlert('Please select an answer before proceeding.');
            return;
        }

        // Save answer and check if correct
        this.userAnswers[this.currentQuestion] = selectedOption.value;
        
        if (selectedOption.value === this.questions[this.currentQuestion].Correct) {
            this.score++;
        }

        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.updateDisplay();
        }
    }

    handlePrevious() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.updateDisplay();
        }
    }

    updateButtonStates() {
        this.elements.prevBtn.disabled = this.currentQuestion === 0;
        this.elements.nextBtn.textContent = 
            this.currentQuestion === this.questions.length - 1 ? 'Finish' : 'Next';
    }

    startTimer() {
        this.timeLeft = 15;
        this.updateTimerDisplay();
        
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimerDisplay();
            
            if (this.timeLeft <= 0) {
                this.handleTimeUp();
            }
        }, 1000);
    }

    resetTimer() {
        if (this.timer) {
            clearInterval(this.timer);
        }
        this.startTimer();
    }

    updateTimerDisplay() {
        this.elements.timer.textContent = this.timeLeft;
        
        // Add visual warning for low time
        if (this.timeLeft <= 5) {
            this.elements.timer.style.background = 'rgba(255, 0, 0, 0.3)';
            this.elements.timer.style.color = '#ff0000';
        } else {
            this.elements.timer.style.background = 'rgba(255, 255, 255, 0.2)';
            this.elements.timer.style.color = 'white';
        }
    }

    handleTimeUp() {
        clearInterval(this.timer);
        
        // Auto-advance to next question
        this.currentQuestion++;
        
        if (this.currentQuestion >= this.questions.length) {
            this.finishQuiz();
        } else {
            this.showAlert('Time\'s up! Moving to next question.');
            setTimeout(() => this.updateDisplay(), 1000);
        }
    }

    finishQuiz() {
        clearInterval(this.timer);
        
        // Calculate final score
        const percentage = Math.round((this.score / this.questions.length) * 100);
        
        // Store results
        localStorage.setItem('quizScore', this.score);
        localStorage.setItem('totalQuestions', this.questions.length);
        localStorage.setItem('percentage', percentage);
        localStorage.setItem('userAnswers', JSON.stringify(this.userAnswers));
        localStorage.setItem('questions', JSON.stringify(this.questions));
        
        // Redirect to results page
        window.location.href = 'results.html';
    }

    showAlert(message) {
        // Create custom alert
        const alertDiv = document.createElement('div');
        alertDiv.className = 'custom-alert';
        alertDiv.innerHTML = `
            <div class="alert-content">
                <p>${message}</p>
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;
        
        // Add styles
        alertDiv.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 2000;
        `;
        
        const alertContent = alertDiv.querySelector('.alert-content');
        alertContent.style.cssText = `
            background: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 10px 30px rgba(0,0,0,0.3);
            max-width: 400px;
            width: 90%;
        `;
        
        const button = alertContent.querySelector('button');
        button.style.cssText = `
            margin-top: 20px;
            padding: 10px 20px;
            background: #667eea;
            color: white;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-size: 1rem;
        `;
        
        document.body.appendChild(alertDiv);
    }

    showError(message) {
        this.hideLoading();
        this.elements.questionText.textContent = message;
        this.elements.questionText.style.color = '#dc3545';
    }

    hideLoading() {
        this.elements.loading.classList.add('hidden');
    }
}

// Initialize the quiz when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});