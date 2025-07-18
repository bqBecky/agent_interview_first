// document.addEventListener('DOMContentLoaded', function () {
//     const userVideo = document.getElementById('user-video');
//     const aiVideo = document.getElementById('ai-video');
//     const micToggle = document.getElementById('mic-toggle');
//     const videoToggle = document.getElementById('video-toggle');
//     const endInterview = document.getElementById('end-interview');
//     const startInterview = document.getElementById('start-interview');
//     const questionList = document.getElementById('question-list');
//     const interviewQuestions = document.getElementById('interview-questions');
//
//     let mediaStream = null;
//     let isMicOn = true;
//     let isVideoOn = true;
//     let interviewStarted = false;
//
//     // 获取摄像头和麦克风权限
//     async function setupMedia() {
//         try {
//             mediaStream = await navigator.mediaDevices.getUserMedia({
//                 video: true,
//                 audio: true
//             });
//
//             userVideo.srcObject = mediaStream;
//             userVideo.style.display = 'block';
//
//             // 模拟AI视频
//             aiVideo.style.display = 'block';
//
//         } catch (error) {
//             console.error('Error accessing media devices:', error);
//             alert('无法访问摄像头或麦克风，请检查权限设置。');
//         }
//     }
//
//     // 生成面试问题
//     async function generateQuestions() {
//         try {
//             const response = await fetch('/generate_questions', {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     job_title: '前端开发',
//                     experience_level: '中级'
//                 })
//             });
//
//             const data = await response.json();
//
//             // 显示问题列表
//             questionList.innerHTML = '';
//             data.forEach((question, index) => {
//                 const questionItem = document.createElement('div');
//                 questionItem.className = 'question-item';
//                 questionItem.innerHTML = `
//                     <p><strong>问题 ${index + 1}:</strong> ${question}</p>
//                     <textarea placeholder="输入您的回答..." data-question="${index}"></textarea>
//                 `;
//                 questionList.appendChild(questionItem);
//             });
//
//             interviewQuestions.style.display = 'block';
//
//         } catch (error) {
//             console.error('Error generating questions:', error);
//         }
//     }
//
//     // 开始面试
//     startInterview.addEventListener('click', function () {
//         interviewStarted = true;
//         interviewQuestions.style.display = 'none';
//         // 这里可以添加开始面试的逻辑
//     });
//
//     // 结束面试
//     endInterview.addEventListener('click', function () {
//         if (confirm('确定要结束面试吗？')) {
//             if (mediaStream) {
//                 mediaStream.getTracks().forEach(track => track.stop());
//             }
//
//             if (interviewStarted) {
//                 // 收集答案并发送到服务器
//                 const answers = [];
//                 document.querySelectorAll('textarea').forEach(textarea => {
//                     answers.push(textarea.value);
//                 });
//
//                 // 保存面试记录
//                 fetch('/save_interview', {
//                     method: 'POST',
//                     headers: {
//                         'Content-Type': 'application/json',
//                     },
//                     body: JSON.stringify({
//                         type: 'video',
//                         questions: Array.from(document.querySelectorAll('.question-item p')).map(p => p.textContent),
//                         answers: answers
//                     })
//                 })
//                 .then(response => response.json())
//                 .then(data => {
//                     if (data.success) {
//                         alert('面试已保存，您可以查看反馈报告。');
//                         window.location.href = "{{ url_for('interview') }}";
//                     }
//                 });
//             } else {
//                 window.location.href = "{{ url_for('interview') }}";
//             }
//         }
//     });
//
//     // 切换麦克风
//     micToggle.addEventListener('click', function () {
//         if (mediaStream) {
//             const audioTracks = mediaStream.getAudioTracks();
//             audioTracks.forEach(track => {
//                 track.enabled = !track.enabled;
//             });
//
//             isMicOn = !isMicOn;
//             this.innerHTML = `<i class="fas fa-microphone${isMicOn ? '' : '-slash'}"></i>`;
//         }
//     });
//
//     // 切换摄像头
//     videoToggle.addEventListener('click', function () {
//         if (mediaStream) {
//             const videoTracks = mediaStream.getVideoTracks();
//             videoTracks.forEach(track => {
//                 track.enabled = !track.enabled;
//             });
//
//             isVideoOn = !isVideoOn;
//             this.innerHTML = `<i class="fas fa-video${isVideoOn ? '' : '-slash'}"></i>`;
//         }
//     });
//
//     // 初始化
//     setupMedia();
//     generateQuestions();
// });
document.addEventListener('DOMContentLoaded', function () {
    const userVideo = document.getElementById('user-video');
    const aiVideo = document.getElementById('ai-video');
    const micToggle = document.getElementById('mic-toggle');
    const videoToggle = document.getElementById('video-toggle');
    const endInterview = document.getElementById('end-interview');
    const startInterview = document.getElementById('start-interview');
    const questionList = document.getElementById('question-list');
    const interviewQuestions = document.getElementById('interview-questions');

    let mediaStream = null;
    let isMicOn = true;
    let isVideoOn = true;
    let interviewStarted = false;

    // 获取摄像头和麦克风权限
    async function setupMedia() {
        try {
            mediaStream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            userVideo.srcObject = mediaStream;
            userVideo.style.display = 'block';

            // 模拟AI视频
            aiVideo.style.display = 'block';

        } catch (error) {
            console.error('Error accessing media devices:', error);
            alert('无法访问摄像头或麦克风，请检查权限设置。');
        }
    }

    // 生成面试问题
    async function generateQuestions() {
        try {
            const response = await fetch('/generate_questions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    job_title: '前端开发',
                    experience_level: '中级'
                })
            });

            const data = await response.json();

            // 显示问题列表
            questionList.innerHTML = '';
            data.forEach((question, index) => {
                const questionItem = document.createElement('div');
                questionItem.className = 'question-item';
                questionItem.innerHTML = `
                    <p><strong>问题 ${index + 1}:</strong> ${question}</p>
                    <textarea placeholder="输入您的回答..." data-question="${index}"></textarea>
                `;
                questionList.appendChild(questionItem);
            });

            interviewQuestions.style.display = 'block';

        } catch (error) {
            console.error('Error generating questions:', error);
        }
    }

    // 开始面试
    startInterview.addEventListener('click', function () {
        interviewStarted = true;
        interviewQuestions.style.display = 'none';
        // 这里可以添加开始面试的逻辑
    });

    // 结束面试
    endInterview.addEventListener('click', function () {
        if (confirm('确定要结束面试吗？')) {
            if (mediaStream) {
                mediaStream.getTracks().forEach(track => track.stop());
            }

            if (interviewStarted) {
                // 收集答案并发送到服务器
                const answers = [];
                document.querySelectorAll('textarea').forEach(textarea => {
                    answers.push(textarea.value);
                });

                // 保存面试记录
                fetch('/save_interview', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        type: 'video',
                        questions: Array.from(document.querySelectorAll('.question-item p')).map(p => p.textContent),
                        answers: answers
                    })
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        alert('面试已保存，您可以查看反馈报告。');
                        // 不再跳转页面，而是返回聊天模式
                        document.getElementById('new-chat').click();
                    }
                });
            } else {
                // 不再跳转页面，而是返回聊天模式
                document.getElementById('new-chat').click();
            }
        }
    });

    // 切换麦克风
    micToggle.addEventListener('click', function () {
        if (mediaStream) {
            const audioTracks = mediaStream.getAudioTracks();
            audioTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            isMicOn = !isMicOn;
            this.innerHTML = `<i class="fas fa-microphone${isMicOn ? '' : '-slash'}"></i>`;
        }
    });

    // 切换摄像头
    videoToggle.addEventListener('click', function () {
        if (mediaStream) {
            const videoTracks = mediaStream.getVideoTracks();
            videoTracks.forEach(track => {
                track.enabled = !track.enabled;
            });

            isVideoOn = !isVideoOn;
            this.innerHTML = `<i class="fas fa-video${isVideoOn ? '' : '-slash'}"></i>`;
        }
    });

    // 初始化
    setupMedia();
    generateQuestions();
});