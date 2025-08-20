export class DailyFeatures {
    constructor() {
        this.reminders = [];
        this.habits = new Map();
        this.goals = [];
    }

    // Daily reminder system
    addReminder(text, time) {
        const reminder = {
            id: Date.now(),
            text,
            time,
            created: new Date(),
            completed: false
        };
        this.reminders.push(reminder);
        return `✅ Reminder set: "${text}" for ${time}`;
    }

    getReminders() {
        if (this.reminders.length === 0) {
            return "📝 No reminders set. Use '/remind [text] at [time]' to add one!";
        }
        
        return this.reminders
            .filter(r => !r.completed)
            .map(r => `⏰ ${r.text} at ${r.time}`)
            .join('\n');
    }

    // Habit tracking
    trackHabit(habitName) {
        const today = new Date().toDateString();
        const habitKey = `${habitName}_${today}`;
        
        if (!this.habits.has(habitName)) {
            this.habits.set(habitName, []);
        }
        
        const habitDays = this.habits.get(habitName);
        if (!habitDays.includes(today)) {
            habitDays.push(today);
            return `🎯 Great job! Habit "${habitName}" tracked for today. Streak: ${habitDays.length} days`;
        }
        
        return `✨ You've already tracked "${habitName}" today! Keep it up!`;
    }

    getHabits() {
        if (this.habits.size === 0) {
            return "🎯 No habits being tracked. Use '/habit [name]' to start tracking!";
        }
        
        let habitReport = "📊 Your Habits:\n";
        for (const [habit, days] of this.habits) {
            habitReport += `• ${habit}: ${days.length} days tracked\n`;
        }
        return habitReport;
    }

    // Quick daily tips
    getDailyTip() {
        const tips = [
            "💡 Tip: Start your day with a glass of water to kickstart your metabolism!",
            "💡 Tip: Take a 2-minute break every hour to rest your eyes and stretch.",
            "💡 Tip: Write down 3 things you're grateful for to boost your mood.",
            "💡 Tip: Prepare your clothes the night before to save morning time.",
            "💡 Tip: Use the 2-minute rule: if it takes less than 2 minutes, do it now!",
            "💡 Tip: Keep healthy snacks visible and junk food out of sight.",
            "💡 Tip: Set your phone to 'Do Not Disturb' during focused work time.",
            "💡 Tip: Take deep breaths when feeling stressed - 4 counts in, 6 counts out.",
            "💡 Tip: Meal prep on Sundays to save time during busy weekdays.",
            "💡 Tip: Use a timer for tasks to stay focused and avoid procrastination."
        ];
        
        return tips[Math.floor(Math.random() * tips.length)];
    }

    // Weather-appropriate suggestions
    getWeatherAdvice(condition = 'sunny') {
        const advice = {
            sunny: "☀️ Perfect day to go outside! Don't forget sunscreen and stay hydrated.",
            rainy: "🌧️ Great day for indoor activities! Maybe catch up on reading or organize your space.",
            cloudy: "☁️ Nice weather for a walk! The clouds provide natural shade.",
            cold: "🥶 Bundle up! Hot drinks and warm meals will keep you cozy.",
            hot: "🔥 Stay cool! Seek shade, drink lots of water, and avoid heavy meals."
        };
        
        return advice[condition] || advice.sunny;
    }

    // Quick calculations for daily life
    calculateTip(bill, percentage = 15) {
        const tip = (bill * percentage) / 100;
        const total = bill + tip;
        return `💰 Bill: $${bill.toFixed(2)}\n💵 Tip (${percentage}%): $${tip.toFixed(2)}\n💳 Total: $${total.toFixed(2)}`;
    }

    // Time zone helper
    getTimeIn(timezone) {
        try {
            const time = new Date().toLocaleString('en-US', { timeZone: timezone });
            return `🕐 Current time in ${timezone}: ${time}`;
        } catch (error) {
            return "❌ Invalid timezone. Try formats like 'America/New_York' or 'Europe/London'";
        }
    }

    // Quick unit conversions
    convert(value, from, to) {
        const conversions = {
            'f_to_c': (f) => ((f - 32) * 5/9).toFixed(1),
            'c_to_f': (c) => ((c * 9/5) + 32).toFixed(1),
            'kg_to_lbs': (kg) => (kg * 2.20462).toFixed(1),
            'lbs_to_kg': (lbs) => (lbs / 2.20462).toFixed(1),
            'km_to_miles': (km) => (km * 0.621371).toFixed(1),
            'miles_to_km': (miles) => (miles / 0.621371).toFixed(1)
        };

        const conversionKey = `${from}_to_${to}`;
        if (conversions[conversionKey]) {
            return `🔄 ${value}°${from.toUpperCase()} = ${conversions[conversionKey](value)}°${to.toUpperCase()}`;
        }
        
        return "❌ Conversion not supported. Try: f/c (temperature), kg/lbs (weight), km/miles (distance)";
    }
}