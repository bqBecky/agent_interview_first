import os
import re
from pdfminer.high_level import extract_text
from docx import Document
import json


def parse_resume(filepath):
    text = ""
    if filepath.endswith('.pdf'):
        text = extract_text(filepath)
    elif filepath.endswith(('.doc', '.docx')):
        doc = Document(filepath)
        text = "\n".join([para.text for para in doc.paragraphs])

    # Simple parsing logic - can be enhanced with NLP
    parsed_data = {
        'name': extract_name(text),
        'email': extract_email(text),
        'phone': extract_phone(text),
        'education': extract_education(text),
        'experience': extract_experience(text),
        'skills': extract_skills(text)
    }

    return parsed_data


def extract_name(text):
    # Simple name extraction - can be enhanced
    return text.split('\n')[0].strip()


def extract_email(text):
    email_regex = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    match = re.search(email_regex, text)
    return match.group(0) if match else ""


def extract_phone(text):
    phone_regex = r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
    match = re.search(phone_regex, text)
    return match.group(0) if match else ""


def extract_education(text):
    # Simple education extraction
    education_keywords = ['education', 'degree', 'university', 'college', 'school']
    lines = text.split('\n')
    education = []

    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in education_keywords):
            # Get next few lines as education info
            for j in range(i + 1, min(i + 5, len(lines))):
                if lines[j].strip():
                    education.append(lines[j].strip())
            break

    return education


def extract_experience(text):
    # Simple experience extraction
    exp_keywords = ['experience', 'employment', 'work history']
    lines = text.split('\n')
    experience = []

    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in exp_keywords):
            # Get next few lines as experience info
            for j in range(i + 1, min(i + 10, len(lines))):
                if lines[j].strip():
                    experience.append(lines[j].strip())
            break

    return experience


def extract_skills(text):
    # Simple skills extraction
    skills_keywords = ['skills', 'technical skills', 'abilities']
    common_skills = ['Python', 'Java', 'C++', 'JavaScript', 'SQL', 'HTML',
                     'CSS', 'Machine Learning', 'Data Analysis', 'Flask',
                     'Django', 'React', 'Angular', 'Vue', 'AWS', 'Docker']

    lines = text.split('\n')
    skills = []

    for i, line in enumerate(lines):
        if any(keyword in line.lower() for keyword in skills_keywords):
            # Get next few lines as skills info
            for j in range(i + 1, min(i + 5, len(lines))):
                if lines[j].strip():
                    skills.append(lines[j].strip())
            break

    # Also check for common skills in the entire text
    for skill in common_skills:
        if skill.lower() in text.lower():
            if skill not in skills:
                skills.append(skill)

    return skills