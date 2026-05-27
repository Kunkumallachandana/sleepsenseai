"""
SleepSense AI - Flask Backend
POST /predict -> analyzes sleep data and returns score, risk level, suggestions
"""

from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from Next.js frontend


def calculate_sleep_score(data):
    """
    Calculate sleep score starting from 100 and deducting based on risk factors.
    """
    score = 100
    suggestions = []
    deductions = []

    # 1. Sleep Duration (ideal: 7-9 hours)
    duration = float(data.get("sleep_duration", 7))
    if duration < 5:
        score -= 30
        suggestions.append("🛏️ You're severely sleep-deprived. Aim for at least 7–8 hours per night.")
        deductions.append(("Sleep Duration", -30))
    elif duration < 6:
        score -= 20
        suggestions.append("🛏️ Less than 6 hours of sleep is linked to poor focus and health. Try going to bed earlier.")
        deductions.append(("Sleep Duration", -20))
    elif duration < 7:
        score -= 10
        suggestions.append("🛏️ You're close — try adding 30–60 more minutes of sleep for better recovery.")
        deductions.append(("Sleep Duration", -10))
    elif duration > 10:
        score -= 5
        suggestions.append("🛏️ Oversleeping can indicate poor sleep quality. Check if you feel rested upon waking.")
        deductions.append(("Sleep Duration", -5))

    # 2. Bedtime (ideal: before midnight)
    bedtime = data.get("bedtime", "22:00")
    try:
        hour = int(bedtime.split(":")[0])
        minute = int(bedtime.split(":")[1]) if ":" in bedtime else 0
        # Convert to 24h; treat 0–5 as after midnight
        if hour == 0 or (1 <= hour <= 5):
            score -= 20
            suggestions.append("🌙 Going to bed after midnight disrupts your circadian rhythm. Try sleeping before 11 PM.")
            deductions.append(("Late Bedtime", -20))
        elif hour >= 23:
            score -= 10
            suggestions.append("🌙 Sleeping around midnight can reduce deep sleep stages. Aim for 10–11 PM.")
            deductions.append(("Late Bedtime", -10))
    except Exception:
        pass

    # 3. Screen Time Before Bed (ideal: < 30 min)
    screen_time = int(data.get("screen_time", 30))
    if screen_time > 120:
        score -= 20
        suggestions.append("📱 Over 2 hours of screen time before bed severely impacts melatonin production. Stop screens 90 minutes before sleep.")
        deductions.append(("Screen Time", -20))
    elif screen_time > 60:
        score -= 12
        suggestions.append("📱 Reduce screen exposure before bed — blue light tricks your brain into staying awake.")
        deductions.append(("Screen Time", -12))
    elif screen_time > 30:
        score -= 6
        suggestions.append("📱 Try limiting screens to 30 minutes before bed. Consider reading instead.")
        deductions.append(("Screen Time", -6))

    # 4. Stress Level
    stress = data.get("stress_level", "low").lower()
    if stress == "high":
        score -= 20
        suggestions.append("😓 High stress activates your fight-or-flight response, making deep sleep difficult. Try meditation or journaling before bed.")
        deductions.append(("High Stress", -20))
    elif stress == "medium":
        score -= 10
        suggestions.append("😓 Moderate stress can fragment sleep cycles. Progressive muscle relaxation or deep breathing may help.")
        deductions.append(("Moderate Stress", -10))

    # 5. Caffeine Intake (ideal: 0–2 cups/day, none after 2 PM)
    caffeine = int(data.get("caffeine_intake", 1))
    if caffeine > 5:
        score -= 15
        suggestions.append("☕ More than 5 cups of caffeine significantly disrupts sleep architecture. Cut back and avoid caffeine after 2 PM.")
        deductions.append(("High Caffeine", -15))
    elif caffeine > 3:
        score -= 10
        suggestions.append("☕ Caffeine has a 5–6 hour half-life. Reduce intake and avoid coffee after noon.")
        deductions.append(("Caffeine Intake", -10))
    elif caffeine > 1:
        score -= 3
        suggestions.append("☕ Limit caffeine to mornings only for the best sleep results.")
        deductions.append(("Caffeine Intake", -3))

    # Clamp score between 0 and 100
    score = max(0, min(100, score))

    # Determine risk level
    if score >= 80:
        risk_level = "Excellent Sleep"
        risk_emoji = "😴"
        risk_color = "green"
        if not suggestions:
            suggestions.append("✅ Fantastic! Your sleep habits are excellent. Keep maintaining your consistent sleep schedule.")
    elif score >= 55:
        risk_level = "Moderate Sleep"
        risk_emoji = "⚠️"
        risk_color = "yellow"
        if not suggestions:
            suggestions.append("⚠️ Your sleep is decent but there's room for improvement. Focus on consistency.")
    else:
        risk_level = "Poor Sleep"
        risk_emoji = "🚨"
        risk_color = "red"
        if not suggestions:
            suggestions.append("🚨 Your sleep quality needs urgent attention. Consider speaking to a sleep specialist.")

    # Always add a general positive tip
    general_tips = [
        "🌿 Keep a consistent sleep-wake schedule, even on weekends.",
        "🧘 A cool, dark, and quiet room dramatically improves sleep quality.",
        "💧 Stay hydrated throughout the day but limit fluids 2 hours before bed.",
        "🚶 Regular daytime exercise (not too close to bedtime) improves deep sleep.",
    ]
    import random
    suggestions.append(random.choice(general_tips))

    return {
        "score": score,
        "risk_level": risk_level,
        "risk_emoji": risk_emoji,
        "risk_color": risk_color,
        "suggestions": suggestions,
        "deductions": deductions,
    }


@app.route("/predict", methods=["POST"])
def predict():
    """
    Endpoint: POST /predict
    Expects JSON body with sleep data fields.
    Returns score, risk_level, and personalized suggestions.
    """
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No data provided"}), 400

        result = calculate_sleep_score(data)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SleepSense AI API"}), 200


if __name__ == "__main__":
    app.run(debug=True, port=5000)
