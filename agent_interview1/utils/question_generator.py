import openai
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import random

# Initialize NLTK
nltk.download('punkt')
nltk.download('stopwords')

# Set your OpenAI API key
openai.api_key = "your-openai-api-key"


def generate_questions(job_title, experience_level):
    # Basic questions based on job title and experience level
    base_questions = [
        f"Tell me about yourself and your experience with {job_title}.",
        f"What attracted you to this {job_title} position?",
        f"Describe a challenging project you worked on as a {job_title} and how you handled it.",
        f"What are your strengths as a {experience_level} {job_title}?",
        f"Where do you see yourself in 5 years as a {job_title}?"
    ]

    # Generate technical questions using OpenAI
    try:
        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=f"Generate 5 technical interview questions for a {experience_level} {job_title} position.",
            max_tokens=150,
            n=1,
            stop=None,
            temperature=0.7
        )

        technical_questions = response.choices[0].text.strip().split('\n')
        technical_questions = [q for q in technical_questions if q.strip()]
    except Exception as e:
        print(f"Error generating questions with OpenAI: {e}")
        technical_questions = [
            f"What are the key technologies you use as a {job_title}?",
            f"Explain a technical concept related to {job_title} to a non-technical person.",
            f"How do you stay updated with the latest trends in {job_title}?",
            f"Describe your approach to troubleshooting a technical issue in {job_title}.",
            f"What tools or frameworks are essential for a {job_title}?"
        ]

    # Combine and shuffle questions
    all_questions = base_questions + technical_questions
    random.shuffle(all_questions)

    return all_questions[:10]  # Return 10 questions