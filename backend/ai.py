import os
from dotenv import load_dotenv
from groq import Groq
from knowledge_retriever import retrieve_context

# Load environment variables
load_dotenv()

# Initialize Groq client
client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


def analyze_patient(data):
    """
    Analyze patient symptoms using RAG + Groq LLM.
    """

    # -------------------------------
    # Retrieve relevant medical knowledge
    # -------------------------------
    context = retrieve_context(data["symptoms"])

    # Debug: Print retrieved knowledge in terminal
    print("\n========== RAG RETRIEVED KNOWLEDGE ==========")
    print(context)
    print("=============================================\n")

    # -------------------------------
    # Prompt for LLM
    # -------------------------------
    prompt = f"""
            You are RuralCare AI, an AI-powered healthcare triage assistant designed for community health workers.

            Your task is to analyze the patient's condition using BOTH:
            1. The retrieved medical knowledge.
            2. The patient details.

            Never provide a confirmed diagnosis.
            Use the retrieved medical knowledge whenever it is relevant.

            ==================================================
            RETRIEVED MEDICAL KNOWLEDGE
            ==================================================

            {context}

            ==================================================
            PATIENT DETAILS
            ==================================================

            Name: {data['name']}
            Age: {data['age']}
            Gender: {data['gender']}
            Symptoms: {data['symptoms']}
            Duration: {data['duration']}
            Medical History: {data['history']}
            Temperature: {data['temperature']}
            Pulse: {data['pulse']}

            ==================================================
            OUTPUT FORMAT (FOLLOW EXACTLY)
            ==================================================

            # 🚨 Urgency

            Display one of these:

            🔴 HIGH RISK
            🟠 MODERATE RISK
            🟢 LOW RISK

            Then explain the urgency in ONLY 2 short sentences.

            --------------------------------------------------

            # 🩺 Possible Conditions

            Write ONLY a numbered list.

            Example:

            1. Heart Attack
            2. Angina
            3. Pulmonary Embolism

            Maximum 3 conditions.

            Do NOT write paragraphs.

            --------------------------------------------------

            # 💊 First Aid

            Write ONLY check-mark points.

            Example:

            ✅ Keep the patient calm.

            ✅ Help the patient sit comfortably.

            ✅ Call emergency medical services immediately.

            Maximum 5 points.

            --------------------------------------------------

            # 🏥 Recommendation

            Write ONLY bullet points.

            Example:

            - Immediate hospital evaluation.
            - ECG recommended.
            - Monitor vital signs.

            Maximum 4 bullets.

            --------------------------------------------------

            # ⚠ Warning Signs

            Write ONLY bullet points.

            Example:

            - Difficulty breathing
            - Loss of consciousness
            - Severe chest pain

            Maximum 5 bullets.

            --------------------------------------------------

            # 📚 Medical Knowledge Used

            Write:

            Retrieved Guidelines:

            - CHEST PAIN
            - HEART ATTACK

            Then write ONE short sentence explaining that the recommendations were generated using the retrieved medical knowledge.

            If no guideline was retrieved write:

            No relevant medical guideline was retrieved.

            --------------------------------------------------

            # 📄 Summary

            Write ONLY 2 short sentences summarizing the patient's condition.

            Finish with this exact sentence:

            ⚠ This AI assessment is for guidance only and is NOT a substitute for professional medical advice.

            ==================================================
            RULES
            ==================================================

            - Use proper Markdown.
            - Never write long paragraphs.
            - Every point must be on a separate line.
            - Use numbered lists where requested.
            - Use bullet lists where requested.
            - Use check marks (✅) for First Aid.
            - Keep the report concise and professional.
            - Do not repeat information.
            - Do not mention that you are an AI model.
        """

    # -------------------------------
    # Call Groq
    # -------------------------------
    response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            temperature=0.3,
            messages=[
                {
                    "role": "user",
                    "content": prompt
                    }
                ]
            )

    return response.choices[0].message.content