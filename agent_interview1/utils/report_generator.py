import openai
from datetime import datetime


def generate_report(interview):
    # Basic report structure
    report = {
        'interview_id': interview.id,
        'interview_type': interview.interview_type,
        'date': interview.created_at.strftime('%Y-%m-%d %H:%M'),
        'questions': interview.questions,
        'answers': interview.answers,
        'analysis': {},
        'recommendations': []
    }

    # Generate analysis using OpenAI

    try:
        qa_block = "\n".join([f"Q: {q}\nA: {a}" for q, a in zip(interview.questions, interview.answers)])
        prompt = f"""
        Analyze the following interview responses and provide feedback:

        Questions and Answers:
        {qa_block}
        Please provide:
        1. Strengths in the candidate's responses
        2. Areas for improvement
        3. Technical knowledge assessment
        4. Communication skills assessment
        5. Overall recommendation (1-5 scale)
        """

        response = openai.Completion.create(
            engine="text-davinci-003",
            prompt=prompt,
            max_tokens=500,
            temperature=0.5
        )

        analysis = response.choices[0].text.strip()
        report['analysis'] = analysis

        # Extract recommendation score (simple heuristic)
        if "5" in analysis:
            report['score'] = 5
        elif "4" in analysis:
            report['score'] = 4
        elif "3" in analysis:
            report['score'] = 3
        elif "2" in analysis:
            report['score'] = 2
        else:
            report['score'] = 1

    except Exception as e:
        print(f"Error generating report with OpenAI: {e}")
        report['analysis'] = "Could not generate detailed analysis. Please review manually."
        report['score'] = 3

    # Basic recommendations
    if report['score'] >= 4:
        report['recommendations'].append("Strong candidate, recommend for next round")
    elif report['score'] >= 3:
        report['recommendations'].append("Potential candidate, may need some training")
    else:
        report['recommendations'].append("Not a good fit for this position")

    return report