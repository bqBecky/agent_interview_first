document.addEventListener('DOMContentLoaded', function () {
    // 功能标签切换
    const featureTabs = document.querySelectorAll('.feature-tab');
    featureTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // 移除所有active类
            document.querySelector('.feature-tab.active').classList.remove('active');
            document.querySelector('.feature-desc.active').classList.remove('active');

            // 添加active类到当前点击的标签
            tab.classList.add('active');
            const tabId = tab.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');
        });
    });

    // 平滑滚动
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 登录按钮点击事件
    document.querySelector('.login-btn').addEventListener('click', () => {
        window.location.href = '../html/login.html';
    });

    // 开始使用按钮点击事件
    document.querySelector('.hero-btn').addEventListener('click', () => {
        window.location.href = '../html/login.html';
    });

    // 滚动时高亮导航栏对应项
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    // 创建Intersection Observer实例
    const observer = new IntersectionObserver(
        (entries) => {
            let closestSection = null;
            let closestDistance = Infinity;

            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // 计算元素到视口顶部的距离
                    const rect = entry.target.getBoundingClientRect();
                    const distance = Math.abs(rect.top);

                    // 找出距离视口顶部最近的section
                    if (distance < closestDistance) {
                        closestDistance = distance;
                        closestSection = entry.target;
                    }
                }
            });

            if (closestSection) {
                // 移除所有导航链接的active类
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });

                // 获取当前可见部分的ID
                const id = closestSection.getAttribute('id');

                // 找到对应的导航链接并添加active类
                const correspondingLink = document.querySelector(`.nav-links a[href="#${id}"]`);
                if (correspondingLink) {
                    correspondingLink.classList.add('active');
                }
            }
        },
        {
            // 当元素进入视口的10%时触发
            threshold: 0.1,
            // 设置rootMargin以便更早检测到元素进入视口
            rootMargin: '0px 0px -50% 0px'
        }
    );

    // 观察所有带ID的section
    sections.forEach(section => {
        observer.observe(section);
    });

    // 初始高亮第一个导航项（如果没有任何section在视口中）
    if (!document.querySelector('.nav-links a.active')) {
        navLinks[0].classList.add('active');
    }

    // 功能标签切换动画
    const featureDescs = document.querySelectorAll('.feature-desc');

    // 初始显示第一个功能描述
    featureTabs[0].classList.add('active');
    featureDescs[0].classList.add('active');

    // 为每个标签添加点击事件
    featureTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 移除所有active类
            document.querySelector('.feature-tab.active').classList.remove('active');
            document.querySelector('.feature-desc.active').classList.remove('active');

            // 添加active类到当前点击的标签
            this.classList.add('active');
            const tabId = this.getAttribute('data-tab');
            document.getElementById(tabId).classList.add('active');

            // 添加动画效果
            document.getElementById(tabId).style.animation = 'fadeIn 0.5s ease';
        });

        // 添加悬停效果
        tab.addEventListener('mouseenter', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-3px)';
                this.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.1)';
            }
        });

        tab.addEventListener('mouseleave', function () {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
                this.style.boxShadow = '';
            }
        });
    });

    // 专业岗位标签切换
    const professionTabs = document.querySelectorAll('.profession-tab');
    const professionPanels = document.querySelectorAll('.profession-panel');

    // 初始化显示第一个面板
    professionTabs[0].classList.add('active');
    professionPanels[0].classList.add('active');

    professionTabs.forEach(tab => {
        tab.addEventListener('click', function () {
            // 如果点击的是当前激活的标签，不做任何操作
            if (this.classList.contains('active')) return;

            // 移除所有active类
            document.querySelector('.profession-tab.active').classList.remove('active');

            // 添加active类到当前点击的标签
            this.classList.add('active');

            // 获取目标面板ID
            const professionId = this.getAttribute('data-profession');
            const targetPanel = document.getElementById(professionId);

            // 淡出当前活动面板
            const currentPanel = document.querySelector('.profession-panel.active');
            currentPanel.style.opacity = 0;
            currentPanel.style.transform = 'translateY(20px)';

            // 延迟切换面板，确保动画完成
            setTimeout(() => {
                currentPanel.classList.remove('active');

                // 显示新面板
                targetPanel.classList.add('active');
                setTimeout(() => {
                    targetPanel.style.opacity = 1;
                    targetPanel.style.transform = 'translateY(0)';

                    // 重置卡片动画
                    const cards = targetPanel.querySelectorAll('.profession-card');
                    cards.forEach((card, index) => {
                        card.style.animation = 'none';
                        setTimeout(() => {
                            card.style.animation = `cardEntrance 0.6s forwards ${index * 0.1}s`;
                        }, 10);
                    });
                }, 10);
            }, 300);
        });
    });

    // 平滑滚动到专业岗位区域
    document.querySelectorAll('.dropdown-item').forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);

            // 触发对应的标签点击事件
            document.querySelector(`.profession-tab[data-profession="${targetId}"]`).click();

            // 平滑滚动
            document.getElementById('professions').scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // 流程步骤动画
    function animateProcessSteps() {
        const steps = document.querySelectorAll('.process-step');
        const options = {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animated');
                    observer.unobserve(entry.target);
                }
            });
        }, options);

        steps.forEach((step, index) => {
            // 为每个步骤设置不同的延迟
            step.style.transitionDelay = `${index * 0.15}s`;
            observer.observe(step);
        });
    }

    // 页面加载完成后初始化
    animateProcessSteps();

    // 添加步骤悬停效果
    const steps = document.querySelectorAll('.process-step');
    steps.forEach(step => {
        step.addEventListener('mouseenter', function () {
            this.querySelector('.circle-inner').style.transform = 'scale(1.1)';
            this.querySelector('.step-content').style.transform = 'translateX(10px)';
        });z

        step.addEventListener('mouseleave', function () {
            this.querySelector('.circle-inner').style.transform = '';
            this.querySelector('.step-content').style.transform = '';
        });
    });
});