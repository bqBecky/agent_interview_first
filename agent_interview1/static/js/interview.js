document.addEventListener('DOMContentLoaded', function () {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const welcomeOverlay = document.getElementById('welcome-overlay');
    const startButton = document.getElementById('start-button');

    // 获取功能容器
    const chatContainer = document.getElementById('chat-container');
    const videoContainer = document.getElementById('video-container');
    const voiceContainer = document.getElementById('voice-container');
    const resumeContainer = document.getElementById('resume-container');

    // 获取菜单项
    const newChatBtn = document.getElementById('new-chat');
    const videoInterviewBtn = document.getElementById('video-interview');
    const voiceInterviewBtn = document.getElementById('voice-interview');
    const resumeParseBtn = document.getElementById('resume-parse');

    // 开始使用按钮
    startButton.addEventListener('click', function () {
        welcomeOverlay.classList.add('hidden');
        showFunctionContainer(chatContainer);
    });

    // 菜单点击事件
    newChatBtn.addEventListener('click', function () {
        // 隐藏欢迎界面
        welcomeOverlay.classList.add('hidden');
        // 切换功能容器
        showFunctionContainer(chatContainer);
        // 激活菜单项
        activateMenuItem(newChatBtn);
    });

    videoInterviewBtn.addEventListener('click', function() {
        welcomeOverlay.classList.add('hidden');
        showFunctionContainer(videoContainer);
        activateMenuItem(videoInterviewBtn);
        // 初始化视频面试
        setupVideoInterview();
    });

    voiceInterviewBtn.addEventListener('click', function () {
        welcomeOverlay.classList.add('hidden');
        showFunctionContainer(voiceContainer);
        activateMenuItem(voiceInterviewBtn);
        // 初始化语音面试
        setupVoiceInterview();
    });

    resumeParseBtn.addEventListener('click', function () {
        welcomeOverlay.classList.add('hidden');
        showFunctionContainer(resumeContainer);
        activateMenuItem(resumeParseBtn);
        // 初始化简历解析
        setupResumeParse();
    });

    function showFunctionContainer(container) {
        // 隐藏所有容器
        [chatContainer, videoContainer, voiceContainer, resumeContainer].forEach(cont => {
            cont.classList.remove('active');
        });
        // 显示选中的容器
        container.classList.add('active');
    }

    function activateMenuItem(item) {
        // 移除所有菜单项的active类
        document.querySelectorAll('.menu-item').forEach(i => {
            i.classList.remove('active');
        });
        // 添加active类到当前菜单项
        item.classList.add('active');
    }

    // 发送消息函数
    function sendMessage() {
        const message = userInput.value.trim();
        if (message === '') return;

        // 添加用户消息
        addMessage(message, 'user');
        userInput.value = '';

        // 发送到后端并获取AI回复
        fetch('/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            addMessage(data.response, 'assistant');
        })
        .catch(error => {
            console.error('Error:', error);
            addMessage("抱歉，我暂时无法处理您的请求。", 'assistant');
        });
    }

    // 添加消息到聊天框
    function addMessage(text, sender) {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${sender}`;

        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas ${sender === 'user' ? 'fa-user' : 'fa-robot'}"></i>
            </div>
            <div class="message-content">
                <div class="message-bubble">${text}</div>
                <div class="message-time">${timeString}</div>
            </div>
        `;

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // 事件监听
    sendButton.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', function (e) {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // 初始化视频面试功能
    function setupVideoInterview() {
        // 创建视频面试界面
        videoContainer.innerHTML = `
            <div class="video-header">
                <h2>视频面试模拟</h2>
                <p>请允许访问您的摄像头和麦克风，开始模拟面试</p>
            </div>
            
            <div class="video-content">
                <div class="video-preview">
                    <video id="local-video" autoplay muted playsinline></video>
                    <div class="video-controls">
                        <button id="start-video" class="video-btn">
                            <i class="fas fa-video"></i> 开始视频
                        </button>
                        <button id="start-record" class="video-btn" disabled>
                            <i class="fas fa-record-vinyl"></i> 开始录制
                        </button>
                        <button id="stop-record" class="video-btn" disabled>
                            <i class="fas fa-stop"></i> 停止录制
                        </button>
                    </div>
                </div>
                
                <div class="interview-questions">
                    <h3>面试问题</h3>
                    <div class="question-list">
                        <div class="question-item">
                            <div class="question-text">1. 请介绍一下您的工作经验。</div>
                            <div class="question-timer">准备时间: <span>30秒</span></div>
                        </div>
                        <div class="question-item">
                            <div class="question-text">2. 您为什么对这个职位感兴趣？</div>
                            <div class="question-timer">准备时间: <span>30秒</span></div>
                        </div>
                        <div class="question-item">
                            <div class="question-text">3. 请描述一个您解决过的技术难题。</div>
                            <div class="question-timer">准备时间: <span>45秒</span></div>
                        </div>
                    </div>
                    
                    <div class="interview-controls">
                        <button id="next-question" class="action-btn">
                            <i class="fas fa-arrow-right"></i> 下一个问题
                        </button>
                        <button id="end-interview" class="action-btn danger">
                            <i class="fas fa-stop-circle"></i> 结束面试
                        </button>
                    </div>
                </div>
            </div>
            
            <div class="video-feedback hidden">
                <h3>面试反馈</h3>
                <div class="feedback-content">
                    <div class="feedback-score">
                        <div class="score-item">
                            <div class="score-label">表达能力</div>
                            <div class="score-bar">
                                <div class="score-value" style="width: 75%"></div>
                                <div class="score-text">7.5/10</div>
                            </div>
                        </div>
                        <div class="score-item">
                            <div class="score-label">专业能力</div>
                            <div class="score-bar">
                                <div class="score-value" style="width: 80%"></div>
                                <div class="score-text">8/10</div>
                            </div>
                        </div>
                        <div class="score-item">
                            <div class="score-label">沟通能力</div>
                            <div class="score-bar">
                                <div class="score-value" style="width: 70%"></div>
                                <div class="score-text">7/10</div>
                            </div>
                        </div>
                    </div>
                    <div class="feedback-comments">
                        <h4>建议与改进</h4>
                        <ul>
                            <li>在回答问题时可以更具体地描述项目细节</li>
                            <li>适当减少口头禅的使用（如"然后"、"嗯"等）</li>
                            <li>可以更清晰地表达技术方案的思路</li>
                        </ul>
                    </div>
                </div>
            </div>
        `;

        // 初始化视频控件事件
        const startVideoBtn = document.getElementById('start-video');
        const startRecordBtn = document.getElementById('start-record');
        const stopRecordBtn = document.getElementById('stop-record');
        const nextQuestionBtn = document.getElementById('next-question');
        const endInterviewBtn = document.getElementById('end-interview');
        const localVideo = document.getElementById('local-video');
        const feedbackSection = document.querySelector('.video-feedback');

        let stream = null;
        let mediaRecorder = null;
        let recordedChunks = [];
        let currentQuestion = 0;

        // 开始视频
        startVideoBtn.addEventListener('click', async () => {
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                    audio: true
                });
                localVideo.srcObject = stream;
                startVideoBtn.disabled = true;
                startRecordBtn.disabled = false;
            } catch (error) {
                console.error('访问摄像头失败:', error);
                alert('无法访问摄像头和麦克风，请确保已授予权限。');
            }
        });

        // 开始录制
        startRecordBtn.addEventListener('click', () => {
            recordedChunks = [];
            mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    recordedChunks.push(event.data);
                }
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(recordedChunks, { type: 'video/webm' });
                // 这里可以上传视频到服务器或保存到本地
                const url = URL.createObjectURL(blob);
                console.log('录制完成，视频URL:', url);
            };

            mediaRecorder.start();
            startRecordBtn.disabled = true;
            stopRecordBtn.disabled = false;
        });

        // 停止录制
        stopRecordBtn.addEventListener('click', () => {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                startRecordBtn.disabled = false;
                stopRecordBtn.disabled = true;
            }
        });

        // 下一个问题
        nextQuestionBtn.addEventListener('click', () => {
            const questionItems = document.querySelectorAll('.question-item');
            questionItems[currentQuestion].classList.remove('active');

            currentQuestion = (currentQuestion + 1) % questionItems.length;

            questionItems[currentQuestion].classList.add('active');

            // 如果是最后一个问题，显示结束面试按钮
            if (currentQuestion === questionItems.length - 1) {
                endInterviewBtn.style.display = 'block';
                nextQuestionBtn.style.display = 'none';
            }
        });

        // 结束面试
        endInterviewBtn.addEventListener('click', () => {
            feedbackSection.classList.remove('hidden');

            // 模拟保存面试记录
            const interviewData = {
                type: 'video',
                questions: Array.from(document.querySelectorAll('.question-text')).map(el => el.textContent),
                answers: ["回答1", "回答2", "回答3"] // 这里应该是实际的回答
            };

            fetch('/save_interview', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(interviewData)
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('面试记录保存成功');
                }
            });
        });
    }

    // 初始化语音面试功能
    function setupVoiceInterview() {
        voiceContainer.innerHTML = `
            <div class="voice-header">
                <h2>语音面试模拟</h2>
                <p>请允许访问您的麦克风，开始语音面试</p>
            </div>
            
            <div class="voice-content">
                <div class="voice-controls">
                    <div class="voice-status">
                        <div class="status-icon">
                            <i class="fas fa-microphone"></i>
                        </div>
                        <div class="status-text">准备开始</div>
                    </div>
                    
                    <button id="start-voice" class="voice-btn">
                        <i class="fas fa-microphone-alt"></i> 开始录音
                    </button>
                    <button id="stop-voice" class="voice-btn" disabled>
                        <i class="fas fa-stop"></i> 停止录音
                    </button>
                </div>
                
                <div class="voice-questions">
                    <h3>当前问题</h3>
                    <div class="current-question">
                        <p>请描述您最有成就感的一个项目，包括您在其中扮演的角色和取得的成果。</p>
                        <div class="question-timer">回答时间: <span>02:00</span></div>
                    </div>
                    
                    <div class="question-list">
                        <div class="question-item active">
                            <div class="question-text">1. 请描述您最有成就感的项目</div>
                        </div>
                        <div class="question-item">
                            <div class="question-text">2. 您如何处理团队冲突？</div>
                        </div>
                        <div class="question-item">
                            <div class="question-text">3. 为什么选择我们公司？</div>
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="voice-transcript">
                <h3>语音转写</h3>
                <div class="transcript-content">
                    <p>开始录音后，您的回答将实时转写为文字...</p>
                </div>
            </div>
        `;

        // 初始化语音控件事件
        const startVoiceBtn = document.getElementById('start-voice');
        const stopVoiceBtn = document.getElementById('stop-voice');
        const transcriptContent = document.querySelector('.transcript-content');
        const questionItems = document.querySelectorAll('.question-item');
        const currentQuestionEl = document.querySelector('.current-question p');
        const statusText = document.querySelector('.status-text');
        const timerEl = document.querySelector('.question-timer span');

        let mediaRecorder = null;
        let audioChunks = [];
        let recognition = null;
        let currentQuestion = 0;
        let timerInterval = null;
        let timeLeft = 120; // 2分钟

        // 开始录音
        startVoiceBtn.addEventListener('click', async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
                mediaRecorder = new MediaRecorder(stream);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        audioChunks.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
                    // 这里可以上传音频到服务器
                    const audioUrl = URL.createObjectURL(audioBlob);
                    console.log('录音完成，音频URL:', audioUrl);
                };

                // 初始化语音识别
                recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
                recognition.lang = 'zh-CN';
                recognition.continuous = true;
                recognition.interimResults = true;

                recognition.onresult = (event) => {
                    let transcript = '';
                    for (let i = event.resultIndex; i < event.results.length; i++) {
                        if (event.results[i].isFinal) {
                            transcript += event.results[i][0].transcript;
                        }
                    }

                    if (transcript) {
                        transcriptContent.innerHTML += `<p>${transcript}</p>`;
                    }
                };

                recognition.start();
                mediaRecorder.start();

                startVoiceBtn.disabled = true;
                stopVoiceBtn.disabled = false;
                statusText.textContent = '录音中...';

                // 开始倒计时
                timerInterval = setInterval(() => {
                    timeLeft--;
                    const minutes = Math.floor(timeLeft / 60);
                    const seconds = timeLeft % 60;
                    timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                    if (timeLeft <= 0) {
                        clearInterval(timerInterval);
                        stopRecording();
                    }
                }, 1000);

            } catch (error) {
                console.error('访问麦克风失败:', error);
                alert('无法访问麦克风，请确保已授予权限。');
            }
        });

        // 停止录音
        stopVoiceBtn.addEventListener('click', stopRecording);

        // 停止录音函数
        function stopRecording() {
            if (mediaRecorder && mediaRecorder.state !== 'inactive') {
                mediaRecorder.stop();
                recognition.stop();
                clearInterval(timerInterval);

                startVoiceBtn.disabled = false;
                stopVoiceBtn.disabled = true;
                statusText.textContent = '录音完成';
            }
        }

        // 点击问题切换到该问题
        questionItems.forEach((item, index) => {
            item.addEventListener('click', () => {
                questionItems.forEach(q => q.classList.remove('active'));
                item.classList.add('active');
                currentQuestion = index;

                // 更新当前问题显示
                const questionText = item.querySelector('.question-text').textContent;
                currentQuestionEl.textContent = questionText.substring(questionText.indexOf(' ') + 1);

                // 重置倒计时
                timeLeft = 120;
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timerEl.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                // 清空转写内容
                transcriptContent.innerHTML = '<p>开始录音后，您的回答将实时转写为文字...</p>';
            });
        });
    }

    // 初始化简历解析功能
    function setupResumeParse() {
        resumeContainer.innerHTML = `
            <div class="resume-header">
                <h2>简历解析</h2>
                <p>上传您的简历，我们将为您解析关键信息</p>
            </div>
            
            <div class="resume-upload">
                <div class="upload-box">
                    <i class="fas fa-cloud-upload-alt"></i>
                    <h3>拖放简历文件到此处</h3>
                    <p>支持PDF、DOC、DOCX格式</p>
                    <input type="file" id="resume-file" accept=".pdf,.doc,.docx">
                    <label for="resume-file" class="upload-btn">选择文件</label>
                </div>
            </div>
            
            <div class="resume-results hidden">
                <div class="resume-preview">
                    <h3>简历预览</h3>
                    <iframe id="resume-preview-frame"></iframe>
                </div>
                
                <div class="resume-analysis">
                    <h3>解析结果</h3>
                    <div class="analysis-section">
                        <h4>个人信息</h4>
                        <div class="info-grid" id="personal-info">
                            <!-- 个人信息将在这里显示 -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>工作经历</h4>
                        <div id="work-experience">
                            <!-- 工作经历将在这里显示 -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>教育背景</h4>
                        <div id="education">
                            <!-- 教育背景将在这里显示 -->
                        </div>
                    </div>
                    
                    <div class="analysis-section">
                        <h4>技能评估</h4>
                        <div class="skills-grid" id="skills">
                            <!-- 技能评估将在这里显示 -->
                        </div>
                    </div>
                </div>
            </div>
        `;

        // 初始化文件上传事件
        const resumeFileInput = document.getElementById('resume-file');
        const uploadBox = document.querySelector('.upload-box');
        const resultsSection = document.querySelector('.resume-results');

        // 文件选择事件
        resumeFileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const file = this.files[0];
                const fileName = file.name;

                // 显示文件名
                uploadBox.innerHTML = `
                    <i class="fas fa-file-alt"></i>
                    <h3>${fileName}</h3>
                    <p>文件已选择，正在解析...</p>
                    <div class="spinner">
                        <div class="bounce1"></div>
                        <div class="bounce2"></div>
                        <div class="bounce3"></div>
                    </div>
                `;

                // 模拟上传和解析过程
                setTimeout(() => {
                    // 这里应该是实际的API调用
                    // fetch('/resume', { method: 'POST', body: formData })
                    // .then(response => response.json())
                    // .then(data => displayResumeResults(data));

                    // 模拟解析结果
                    const mockData = {
                        name: '张三',
                        email: 'zhangsan@example.com',
                        phone: '138****1234',
                        job_title: '高级软件工程师',
                        experiences: [
                            {
                                company: 'ABC科技有限公司',
                                position: '高级软件工程师',
                                duration: '2020.06 - 至今',
                                details: [
                                    '负责公司核心产品的前端架构设计与开发',
                                    '优化前端性能，提升页面加载速度40%',
                                    '带领5人团队完成多个重要项目'
                                ]
                            },
                            {
                                company: 'XYZ互联网公司',
                                position: '前端开发工程师',
                                duration: '2018.03 - 2020.05',
                                details: [
                                    '参与电商平台的前端开发',
                                    '实现响应式设计，提升移动端用户体验',
                                    '优化代码结构，减少30%的维护成本'
                                ]
                            }
                        ],
                        education: [
                            {
                                school: '北京大学',
                                degree: '计算机科学与技术 硕士',
                                duration: '2015.09 - 2018.06'
                            },
                            {
                                school: '清华大学',
                                degree: '软件工程 学士',
                                duration: '2011.09 - 2015.06'
                            }
                        ],
                        skills: [
                            { name: 'JavaScript', level: 90 },
                            { name: 'React', level: 85 },
                            { name: 'Node.js', level: 75 },
                            { name: 'Python', level: 70 },
                            { name: 'Vue', level: 80 },
                            { name: 'Docker', level: 65 }
                        ]
                    };

                    displayResumeResults(mockData);

                }, 2000);
            }
        });

        // 拖放功能
        uploadBox.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadBox.classList.add('dragover');
        });

        uploadBox.addEventListener('dragleave', () => {
            uploadBox.classList.remove('dragover');
        });

        uploadBox.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadBox.classList.remove('dragover');

            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                resumeFileInput.files = e.dataTransfer.files;
                const event = new Event('change', { bubbles: true });
                resumeFileInput.dispatchEvent(event);
            }
        });

        // 显示解析结果
        function displayResumeResults(data) {
            resultsSection.classList.remove('hidden');

            // 显示个人信息
            const personalInfo = document.getElementById('personal-info');
            personalInfo.innerHTML = `
                <div class="info-item">
                    <label>姓名:</label>
                    <span>${data.name}</span>
                </div>
                <div class="info-item">
                    <label>电话:</label>
                    <span>${data.phone}</span>
                </div>
                <div class="info-item">
                    <label>邮箱:</label>
                    <span>${data.email}</span>
                </div>
                <div class="info-item">
                    <label>求职意向:</label>
                    <span>${data.job_title}</span>
                </div>
            `;

            // 显示工作经历
            const workExperience = document.getElementById('work-experience');
            workExperience.innerHTML = data.experiences.map(exp => `
                <div class="experience-item">
                    <div class="exp-header">
                        <div class="exp-company">${exp.company}</div>
                        <div class="exp-date">${exp.duration}</div>
                    </div>
                    <div class="exp-position">${exp.position}</div>
                    <ul class="exp-details">
                        ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
                    </ul>
                </div>
            `).join('');

            // 显示教育背景
            const education = document.getElementById('education');
            education.innerHTML = data.education.map(edu => `
                <div class="education-item">
                    <div class="edu-header">
                        <div class="edu-school">${edu.school}</div>
                        <div class="edu-date">${edu.duration}</div>
                    </div>
                    <div class="edu-degree">${edu.degree}</div>
                </div>
            `).join('');

            // 显示技能评估
            const skills = document.getElementById('skills');
            skills.innerHTML = data.skills.map(skill => `
                <div class="skill-item">
                    <div class="skill-name">${skill.name}</div>
                    <div class="skill-level">
                        <div class="level-bar" style="width: ${skill.level}%"></div>
                        <div class="skill-percentage">${skill.level}%</div>
                    </div>
                </div>
            `).join('');

            // 显示简历预览（模拟）
            const previewFrame = document.getElementById('resume-preview-frame');
            previewFrame.contentDocument.write(`
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; padding: 20px; }
                        h1 { color: #4361ee; }
                        .section { margin-bottom: 20px; }
                        .section-title { border-bottom: 2px solid #4361ee; padding-bottom: 5px; }
                    </style>
                </head>
                <body>
                    <h1>${data.name} - ${data.job_title}</h1>
                    <p>${data.phone} | ${data.email}</p>
                    
                    <div class="section">
                        <h2 class="section-title">工作经历</h2>
                        ${data.experiences.map(exp => `
                            <div>
                                <h3>${exp.company} - ${exp.position}</h3>
                                <p><em>${exp.duration}</em></p>
                                <ul>
                                    ${exp.details.map(detail => `<li>${detail}</li>`).join('')}
                                </ul>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">教育背景</h2>
                        ${data.education.map(edu => `
                            <div>
                                <h3>${edu.school}</h3>
                                <p>${edu.degree} | ${edu.duration}</p>
                            </div>
                        `).join('')}
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">技能</h2>
                        <p>${data.skills.map(skill => skill.name).join(', ')}</p>
                    </div>
                </body>
                </html>
            `);
            previewFrame.contentDocument.close();
        }
    }
});