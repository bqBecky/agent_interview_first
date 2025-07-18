// document.addEventListener('DOMContentLoaded', function() {
//     const voiceVisualizer = document.getElementById('voice-visualizer');
//     const micToggle = document.getElementById('mic-toggle');
//     const startBtn = document.getElementById('start-btn');
//     const stopBtn = document.getElementById('stop-btn');
//     const statusText = document.getElementById('status-text');
//     const instructionText = document.getElementById('instruction-text');
//     const questionContainer = document.getElementById('question-container');
//     const currentQuestion = document.getElementById('current-question');
//     const timer = document.getElementById('timer');
//     const questionList = document.getElementById('question-list');
//
//     let recognition;
//     let isRecording = false;
//     let timerInterval;
//     let seconds = 0;
//     let currentQuestionIndex = 0;
//     let interviewQuestions = [];
//
//     // 检查浏览器是否支持语音识别
//     if (!('webkitSpeechRecognition' in window)) {
//         statusText.textContent = '您的浏览器不支持语音识别功能';
//         startBtn.disabled = true;
//         return;
//     }
//
//     // 初始化语音识别
//     recognition = new webkitSpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = 'zh-CN';
//
//     recognition.onstart = function() {
//         isRecording = true;
//         startBtn.innerHTML = '<i class="fas fa-pause"></i>';
//         statusText.textContent = '正在录音...';
//         instructionText.textContent = '请回答当前问题';
//         startTimer();
//     };
//
//     recognition.onresult = function(event) {
//         let interimTranscript = '';
//         let finalTranscript = '';
//
//         for (let i = event.resultIndex; i < event.results.length; i++) {
//             const transcript = event.results[i][0].transcript;
//             if (event.results[i].isFinal) {
//                 finalTranscript += transcript;
//             } else {
//                 interimTranscript += transcript;
//             }
//         }
//
//         // 这里可以处理识别结果
//         console.log('Interim:', interimTranscript);
//         console.log('Final:', finalTranscript);
//     };
//
//     recognition.onerror = function(event) {
//         console.error('语音识别错误:', event.error);
//         stopRecording();
//     };
//
//     recognition.onend = function() {
//         if (isRecording) {
//             recognition.start(); // 继续录音
//         }
//     };
//
//     // 开始/暂停录音
//     startBtn.addEventListener('click', function() {
//         if (isRecording) {
//             recognition.stop();
//             isRecording = false;
//             startBtn.innerHTML = '<i class="fas fa-play"></i>';
//             statusText.textContent = '已暂停';
//             stopTimer();
//         } else {
//             recognition.start();
//             questionContainer.style.display = 'block';
//             loadNextQuestion();
//         }
//     });
//
//     // 停止录音
//     stopBtn.addEventListener('click', function() {
//         stopRecording();
//         if (confirm('确定要结束面试吗？')) {
//             // 保存面试记录
//             saveInterview();
//             window.location.href = "{{ url_for('interview') }}";
//         }
//     });
//
//     // 麦克风切换
//     micToggle.addEventListener('click', function() {
//         // 在实际应用中，这里可以切换麦克风状态
//         this.classList.toggle('muted');
//         if (this.classList.contains('muted')) {
//             this.innerHTML = '<i class="fas fa-microphone-slash"></i>';
//         } else {
//             this.innerHTML = '<i class="fas fa-microphone"></i>';
//         }
//     });
//
//     // 停止录音
//     function stopRecording() {
//         recognition.stop();
//         isRecording = false;
//         startBtn.innerHTML = '<i class="fas fa-play"></i>';
//         statusText.textContent = '录音已停止';
//         instructionText.textContent = '点击播放按钮继续';
//         stopTimer();
//     }
//
//     // 开始计时器
//     function startTimer() {
//         seconds = 0;
//         updateTimer();
//         timerInterval = setInterval(updateTimer, 1000);
//     }
//
//     // 更新计时器显示
//     function updateTimer() {
//         seconds++;
//         const mins = Math.floor(seconds / 60);
//         const secs = seconds % 60;
//         timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
//     }
//
//     // 停止计时器
//     function stopTimer() {
//         clearInterval(timerInterval);
//     }
//
//     // 加载下一个问题
//     function loadNextQuestion() {
//         if (currentQuestionIndex < interviewQuestions.length) {
//             currentQuestion.textContent = interviewQuestions[currentQuestionIndex];
//             currentQuestionIndex++;
//         } else {
//             currentQuestion.textContent = '面试问题已完成';
//             stopRecording();
//         }
//     }
//
//     // 生成面试问题
//     function generateInterviewQuestions() {
//         // 模拟从服务器获取问题
//         interviewQuestions = [
//             "请简单介绍一下你自己",
//             "你为什么对这个职位感兴趣?",
//             "你最大的优点和缺点是什么?",
//             "描述一个你解决过的技术难题",
//             "你如何保持自己的技术更新?",
//             "你未来的职业规划是什么?"
//         ];
//
//         // 显示问题列表
//         questionList.innerHTML = interviewQuestions.map((q, i) =>
//             `<div class="question-item">${i+1}. ${q}</div>`
//         ).join('');
//     }
//
//     // 保存面试记录
//     function saveInterview() {
//         // 这里可以发送数据到服务器保存
//         fetch('/save_interview', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 type: 'voice',
//                 questions: interviewQuestions,
//                 answers: [] // 实际应用中这里应该是用户的回答
//             })
//         })
//         .then(response => response.json())
//         .then(data => {
//             console.log('Interview saved:', data);
//         });
//     }
//
//     // 初始化
//     generateInterviewQuestions();
// });

document.addEventListener('DOMContentLoaded', function() {
    const voiceVisualizer = document.getElementById('voice-visualizer');
    const micToggle = document.getElementById('mic-toggle');
    const startBtn = document.getElementById('start-btn');
    const stopBtn = document.getElementById('stop-btn');
    const statusText = document.getElementById('status-text');
    const instructionText = document.getElementById('instruction-text');
    const questionContainer = document.getElementById('question-container');
    const currentQuestion = document.getElementById('current-question');
    const timer = document.getElementById('timer');
    const questionList = document.getElementById('question-list');

    let recognition;
    let isRecording = false;
    let timerInterval;
    let seconds = 0;
    let currentQuestionIndex = 0;
    let interviewQuestions = [];

    // 检查浏览器是否支持语音识别
    if (!('webkitSpeechRecognition' in window)) {
        statusText.textContent = '您的浏览器不支持语音识别功能';
        startBtn.disabled = true;
        return;
    }

    // 初始化语音识别
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'zh-CN';

    recognition.onstart = function() {
        isRecording = true;
        startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        statusText.textContent = '正在录音...';
        instructionText.textContent = '请回答当前问题';
        startTimer();
    };

    recognition.onresult = function(event) {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // 这里可以处理识别结果
        console.log('Interim:', interimTranscript);
        console.log('Final:', finalTranscript);
    };

    recognition.onerror = function(event) {
        console.error('语音识别错误:', event.error);
        stopRecording();
    };

    recognition.onend = function() {
        if (isRecording) {
            recognition.start(); // 继续录音
        }
    };

    // 开始/暂停录音
    startBtn.addEventListener('click', function() {
        if (isRecording) {
            recognition.stop();
            isRecording = false;
            startBtn.innerHTML = '<i class="fas fa-play"></i>';
            statusText.textContent = '已暂停';
            stopTimer();
        } else {
            recognition.start();
            questionContainer.style.display = 'block';
            loadNextQuestion();
        }
    });

    // 停止录音
    stopBtn.addEventListener('click', function() {
        stopRecording();
        if (confirm('确定要结束面试吗？')) {
            // 保存面试记录
            saveInterview();
            // 不再跳转页面，而是返回聊天模式
            document.getElementById('new-chat').click();
        }
    });

    // 麦克风切换
    micToggle.addEventListener('click', function() {
        // 在实际应用中，这里可以切换麦克风状态
        this.classList.toggle('muted');
        if (this.classList.contains('muted')) {
            this.innerHTML = '<i class="fas fa-microphone-slash"></i>';
        } else {
            this.innerHTML = '<i class="fas fa-microphone"></i>';
        }
    });

    // 停止录音
    function stopRecording() {
        recognition.stop();
        isRecording = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
        statusText.textContent = '录音已停止';
        instructionText.textContent = '点击播放按钮继续';
        stopTimer();
    }

    // 开始计时器
    function startTimer() {
        seconds = 0;
        updateTimer();
        timerInterval = setInterval(updateTimer, 1000);
    }

    // 更新计时器显示
    function updateTimer() {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timer.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    // 停止计时器
    function stopTimer() {
        clearInterval(timerInterval);
    }

    // 加载下一个问题
    function loadNextQuestion() {
        if (currentQuestionIndex < interviewQuestions.length) {
            currentQuestion.textContent = interviewQuestions[currentQuestionIndex];
            currentQuestionIndex++;
        } else {
            currentQuestion.textContent = '面试问题已完成';
            stopRecording();
        }
    }

    // 生成面试问题
    function generateInterviewQuestions() {
        // 模拟从服务器获取问题
        interviewQuestions = [
            "请简单介绍一下你自己",
            "你为什么对这个职位感兴趣?",
            "你最大的优点和缺点是什么?",
            "描述一个你解决过的技术难题",
            "你如何保持自己的技术更新?",
            "你未来的职业规划是什么?"
        ];

        // 显示问题列表
        questionList.innerHTML = interviewQuestions.map((q, i) =>
            `<div class="question-item">${i+1}. ${q}</div>`
        ).join('');
    }

    // 保存面试记录
    function saveInterview() {
        // 这里可以发送数据到服务器保存
        fetch('/save_interview', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'voice',
                questions: interviewQuestions,
                answers: [] // 实际应用中这里应该是用户的回答
            })
        })
        .then(response => response.json())
        .then(data => {
            console.log('Interview saved:', data);
        });
    }

    // 初始化
    generateInterviewQuestions();
});