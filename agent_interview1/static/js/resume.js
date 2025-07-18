document.addEventListener('DOMContentLoaded', function() {
    const dropZone = document.getElementById('drop-zone');
    const fileInput = document.getElementById('file-input');
    const uploadBtn = document.getElementById('upload-btn');
    const resumeResult = document.getElementById('resume-result');
    const downloadBtn = document.getElementById('download-btn');

    // 点击上传按钮触发文件选择
    uploadBtn.addEventListener('click', function() {
        fileInput.click();
    });

    // 处理文件选择
    fileInput.addEventListener('change', function(e) {
        if (e.target.files.length) {
            handleFileUpload(e.target.files[0]);
        }
    });

    // 拖放功能
    dropZone.addEventListener('dragover', function(e) {
        e.preventDefault();
        dropZone.classList.add('dragover');
    });

    dropZone.addEventListener('dragleave', function() {
        dropZone.classList.remove('dragover');
    });

    dropZone.addEventListener('drop', function(e) {
        e.preventDefault();
        dropZone.classList.remove('dragover');

        if (e.dataTransfer.files.length) {
            handleFileUpload(e.dataTransfer.files[0]);
        }
    });

    // 处理文件上传
    function handleFileUpload(file) {
        // 检查文件类型
        const validTypes = ['application/pdf', 'application/msword',
                          'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        if (!validTypes.includes(file.type)) {
            alert('请上传PDF或Word文档');
            return;
        }

        // 检查文件大小 (最大10MB)
        if (file.size > 10 * 1024 * 1024) {
            alert('文件大小不能超过10MB');
            return;
        }

        // 显示上传状态
        dropZone.innerHTML = `
            <i class="fas fa-spinner fa-spin"></i>
            <p>正在上传 ${file.name}...</p>
        `;

        // 创建FormData并上传
        const formData = new FormData();
        formData.append('file', file);

        fetch('/resume', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            displayResumeResults(data);
        })
        .catch(error => {
            console.error('Error:', error);
            dropZone.innerHTML = `
                <i class="fas fa-exclamation-circle"></i>
                <p>上传失败，请重试</p>
                <button class="upload-btn" id="upload-btn">重新选择</button>
            `;
            document.getElementById('upload-btn').addEventListener('click', function() {
                fileInput.click();
            });
        });
    }

    // 显示解析结果
    function displayResumeResults(data) {
        resumeResult.style.display = 'block';

        // 基本信息
        const basicInfo = document.getElementById('basic-info');
        basicInfo.innerHTML = `
            <div class="info-item">
                <span class="info-label">姓名:</span>
                <span class="info-value">${data.name || '未提供'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">邮箱:</span>
                <span class="info-value">${data.email || '未提供'}</span>
            </div>
            <div class="info-item">
                <span class="info-label">电话:</span>
                <span class="info-value">${data.phone || '未提供'}</span>
            </div>
        `;

        // 教育背景
        const educationInfo = document.getElementById('education-info');
        if (data.education && data.education.length > 0) {
            educationInfo.innerHTML = '<ul>' + data.education.map(item => `<li>${item}</li>`).join('') + '</ul>';
        } else {
            educationInfo.innerHTML = '<p>未提供教育背景信息</p>';
        }

        // 工作经历
        const experienceInfo = document.getElementById('experience-info');
        if (data.experience && data.experience.length > 0) {
            experienceInfo.innerHTML = '<ul>' + data.experience.map(item => `<li>${item}</li>`).join('') + '</ul>';
        } else {
            experienceInfo.innerHTML = '<p>未提供工作经历信息</p>';
        }

        // 技能
        const skillsInfo = document.getElementById('skills-info');
        if (data.skills && data.skills.length > 0) {
            skillsInfo.innerHTML = data.skills.map(skill =>
                `<span class="skill-tag">${skill}</span>`
            ).join('');
        } else {
            skillsInfo.innerHTML = '<p>未提供技能信息</p>';
        }

        // 优化建议 (模拟)
        const suggestions = document.getElementById('suggestions');
        suggestions.innerHTML = `
            <div class="suggestion-item">
                <i class="fas fa-check-circle"></i>
                <p>建议添加项目经验部分，展示您的实际工作成果</p>
            </div>
            <div class="suggestion-item">
                <i class="fas fa-check-circle"></i>
                <p>技能部分可以按照熟练程度进行分类展示</p>
            </div>
            <div class="suggestion-item">
                <i class="fas fa-check-circle"></i>
                <p>考虑添加个人简介或职业目标，让简历更具个性</p>
            </div>
        `;

        // 下载报告按钮
        downloadBtn.addEventListener('click', function() {
            // 这里可以生成PDF报告并下载
            alert('报告下载功能将在完整版中实现');
        });
    }
});