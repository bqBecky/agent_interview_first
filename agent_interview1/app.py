import os
from flask import Flask, render_template, request, redirect, url_for, flash, jsonify, send_from_directory
from flask_login import LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.utils import secure_filename
from config import Config
from models import db, User, Resume, Interview
from utils.resume_parser import parse_resume
from utils.question_generator import generate_questions
from utils.report_generator import generate_report
import uuid

app = Flask(__name__)
app.config.from_object(Config)

# Initialize extensions
db.init_app(app)
login_manager = LoginManager(app)
login_manager.login_view = 'login'

# Create upload folder if not exists
if not os.path.exists(app.config['UPLOAD_FOLDER']):
    os.makedirs(app.config['UPLOAD_FOLDER'])


@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))


def allowed_file(filename):
    return '.' in filename and \
        filename.rsplit('.', 1)[1].lower() in app.config['ALLOWED_EXTENSIONS']


@app.route('/')
def index():
    # 添加当前用户状态传递给模板
    return render_template('index.html', current_user=current_user)


@app.route('/chat', methods=['POST'])
@login_required
def chat():
    data = request.json
    message = data.get('message', '')

    # 简单的聊天逻辑 - 实际中应该使用AI模型
    responses = {
        "你好": "您好！我是您的求职助手，有什么可以帮您的？",
        "自我介绍": "好的，请告诉我您的基本信息、工作经验和技能特长。",
        "面试准备": "面试前需要做好以下准备：1. 研究公司背景 2. 准备常见问题答案 3. 练习自我介绍 4. 准备提问环节的问题",
        "简历建议": "好的简历应包含：1. 个人信息 2. 求职意向 3. 工作经历 4. 教育背景 5. 技能证书 6. 项目经验",
        "薪资谈判": "薪资谈判技巧：1. 提前了解市场行情 2. 不要先报价 3. 强调自己的价值 4. 考虑整体薪酬包",
        "职业规划": "制定职业规划的步骤：1. 自我评估 2. 设定短期和长期目标 3. 分析差距 4. 制定行动计划 5. 定期评估调整",
        "谢谢": "不客气，很高兴能帮到您！还有什么问题吗？"
    }

    # 查找匹配的响应
    response = responses.get(message, "抱歉，我不太明白您的问题。您可以尝试问关于面试准备、简历建议或职业规划的问题。")

    return jsonify({'response': response})


@app.route('/login', methods=['GET', 'POST'])
def login():
    # 如果已登录则直接跳转
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        username = request.form.get('username')
        password = request.form.get('password')

        user = User.query.filter_by(username=username).first()

        if user and user.check_password(password):
            login_user(user)
            flash('登录成功！', 'success')
            return redirect(url_for('index'))
        flash('用户名或密码无效', 'error')
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if current_user.is_authenticated:
        return redirect(url_for('index'))
    if request.method == 'POST':
        username = request.form.get('username')
        email = request.form.get('email')
        password = request.form.get('password')

        if User.query.filter_by(username=username).first():
            flash('Username already exists')
            return redirect(url_for('register'))

        if User.query.filter_by(email=email).first():
            flash('Email already exists')
            return redirect(url_for('register'))

        user = User(username=username, email=email)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()

        login_user(user)
        flash('注册成功！', 'success')
        return redirect(url_for('interview'))

    return render_template('login.html', register=True)


@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('index'))


@app.route('/interview')
@login_required
def interview():
    return render_template('interview.html')


@app.route('/video_interview')
@login_required
def video_interview():
    return render_template('video.html')


@app.route('/voice_interview')
@login_required
def voice_interview():
    return render_template('voice.html')


@app.route('/resume', methods=['GET', 'POST'])
@login_required
def resume():
    if request.method == 'POST':
        if 'file' not in request.files:
            flash('No file part')
            return redirect(request.url)

        file = request.files['file']
        if file.filename == '':
            flash('No selected file')
            return redirect(request.url)

        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            unique_filename = f"{uuid.uuid4().hex}_{filename}"
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
            file.save(filepath)

            # Parse resume
            parsed_data = parse_resume(filepath)

            # Save to database
            resume = Resume(
                user_id=current_user.id,
                filename=unique_filename,
                parsed_data=parsed_data
            )
            db.session.add(resume)
            db.session.commit()

            return jsonify(parsed_data)

    return render_template('resume.html')


@app.route('/generate_questions', methods=['POST'])
@login_required
def generate_interview_questions():
    data = request.json
    job_title = data.get('job_title')
    experience_level = data.get('experience_level')

    questions = generate_questions(job_title, experience_level)
    return jsonify(questions)


@app.route('/save_interview', methods=['POST'])
@login_required
def save_interview():
    data = request.json
    interview_type = data.get('type')
    questions = data.get('questions')
    answers = data.get('answers')

    interview = Interview(
        user_id=current_user.id,
        interview_type=interview_type,
        questions=questions,
        answers=answers
    )
    db.session.add(interview)
    db.session.commit()

    return jsonify({'success': True})


@app.route('/generate_report/<int:interview_id>')
@login_required
def generate_interview_report(interview_id):
    interview = Interview.query.get_or_404(interview_id)
    if interview.user_id != current_user.id:
        return jsonify({'error': 'Unauthorized'}), 403

    report = generate_report(interview)
    return jsonify(report)


@app.route('/uploads/<filename>')
@login_required
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)


def create_tables():
    with app.app_context():
        db.create_all()
        print("表创建成功！")


create_tables()

if __name__ == '__main__':
    app.run(debug=True)
