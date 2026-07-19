import os

FILE = os.path.join(
    os.path.dirname(__file__),
    "knowledge",
    "medical_guidelines.txt"
)

def retrieve_context(symptoms):
    try:
        with open(FILE, "r", encoding="utf-8") as f:
            data = f.read()

        sections = data.split("------------------------")

        symptoms = symptoms.lower()

        relevant = []

        for section in sections:
            section_lower = section.lower()

            score = 0

            for word in symptoms.split():
                if len(word) > 2 and word in section_lower:
                    score += 1

            if score > 0:
                relevant.append((score, section.strip()))

        if not relevant:
            return "No specific medical guideline found. Use general first-aid principles."

        # Highest matching sections first
        relevant.sort(reverse=True)

        return "\n\n".join(section for score, section in relevant[:3])

    except Exception as e:
        return f"Knowledge retrieval error: {e}"