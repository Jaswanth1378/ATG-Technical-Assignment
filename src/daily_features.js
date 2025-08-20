class DailyFeatures {
    constructor() {
        this.reminders = [];
        this.habits = new Map();
        this.tips = [
            "💡 Start your day with a glass of water to stay hydrated!",
            "🌅 Try the 2-minute rule: if something takes less than 2 minutes, do it now!",
            "📱 Take regular breaks from screens to rest your eyes.",
            "🚶‍♀️ A 10-minute walk can boost your energy and mood.",
            "📝 Write down 3 things you're grateful for each day.",
            "🧘‍♂️ Take 5 deep breaths when feeling stressed.",
            "🛏️ Make your bed first thing in the morning for an instant win!",
            "🥗 Prep healthy snacks in advance to avoid junk food.",
            "📚 Read for 15 minutes before bed instead of scrolling.",
            "🎯 Set 3 priorities for tomorrow before ending your day.",
            "☀️ Get some sunlight exposure in the morning to regulate sleep.",
            "🧹 Clean as you go to maintain a tidy space.",
            "💪 Do 10 push-ups or stretches during work breaks.",
            "📞 Call a friend or family member you haven't spoken to recently.",
            "🎵 Listen to uplifting music to boost your mood."
        ];
    }

    canHandle(input) {
        const keywords = [
            'remind', 'reminder', 'habit', 'track', 'tip', 'advice',
            'calculate', 'calc', 'weather', 'time', 'schedule'
        ];
        
        return keywords.some(keyword => 
            input.toLowerCase().includes(keyword)
        );
    }

    process(input) {
        const lowerInput = input.toLowerCase();
        
        if (lowerInput.includes('remind')) {
            return this.handleReminderRequest(input);
        }
        
        if (lowerInput.includes('habit')) {
            return this.handleHabitRequest(input);
        }
        
        if (lowerInput.includes('tip') || lowerInput.includes('advice')) {
            return this.getDailyTip();
        }
        
        if (lowerInput.includes('calc') || lowerInput.includes('calculate')) {
            return this.handleCalculation(input);
        }
        
        if (lowerInput.includes('weather')) {
            return this.getWeatherAdvice(input);
        }
        
        if (lowerInput.includes('time')) {
            return this.getCurrentTime();
        }
        
        return "I can help with reminders, habits, tips, calculations, and more! Type /help for commands.";
    }

    setReminder(text) {
        if (!text || text.trim() === '') {
            return "Please specify what you'd like to be reminded about. Example: /remind Call mom at 3pm";
        }
        
        const reminder = {
            id: Date.now(),
            text: text.trim(),
            created: new Date().toLocaleString()
        };
        
        this.reminders.push(reminder);
        
        return `✅ Reminder set: "${text}"
📅 Created: ${reminder.created}
💡 Tip: I'll remember this for our conversation, but for actual notifications, consider using your phone's reminder app!`;
    }

    trackHabit(habitName) {
        if (!habitName || habitName.trim() === '') {
            return this.getHabitSummary();
        }
        
        const name = habitName.trim().toLowerCase();
        const today = new Date().toDateString();
        
        if (!this.habits.has(name)) {
            this.habits.set(name, {
                name: habitName.trim(),
                dates: [],
                streak: 0
            });
        }
        
        const habit = this.habits.get(name);
        
        if (!habit.dates.includes(today)) {
            habit.dates.push(today);
            habit.streak = this.calculateStreak(habit.dates);
            
            return `🎯 Habit "${habit.name}" tracked for today!
🔥 Current streak: ${habit.streak} days
📊 Total completions: ${habit.dates.length}`;
        } else {
            return `✅ You've already tracked "${habit.name}" today!
🔥 Current streak: ${habit.streak} days`;
        }
    }

    calculateStreak(dates) {
        if (dates.length === 0) return 0;
        
        const sortedDates = dates.map(d => new Date(d)).sort((a, b) => b - a);
        let streak = 1;
        
        for (let i = 1; i < sortedDates.length; i++) {
            const dayDiff = (sortedDates[i-1] - sortedDates[i]) / (1000 * 60 * 60 * 24);
            if (dayDiff === 1) {
                streak++;
            } else {
                break;
            }
        }
        
        return streak;
    }

    getHabitSummary() {
        if (this.habits.size === 0) {
            return "📊 No habits tracked yet. Start tracking with: /habit [habit name]";
        }
        
        let summary = "📊 Your Habit Summary:\n\n";
        
        for (const [name, habit] of this.habits) {
            summary += `🎯 ${habit.name}
   🔥 Streak: ${habit.streak} days
   📈 Total: ${habit.dates.length} completions\n\n`;
        }
        
        return summary;
    }

    getDailyTip() {
        const randomTip = this.tips[Math.floor(Math.random() * this.tips.length)];
        return `${randomTip}\n\n💪 You've got this! Small daily actions lead to big results.`;
    }

    calculate(expression) {
        if (!expression || expression.trim() === '') {
            return "Please provide a calculation. Examples:\n• /calc 15 + 25\n• /calc tip 50 (calculates 20% tip)\n• /calc 10 * 8";
        }
        
        const input = expression.trim().toLowerCase();
        
        // Handle tip calculation
        if (input.startsWith('tip')) {
            const amount = parseFloat(input.replace('tip', '').trim());
            if (isNaN(amount)) {
                return "Please provide a valid amount for tip calculation. Example: /calc tip 50";
            }
            
            const tip15 = (amount * 0.15).toFixed(2);
            const tip18 = (amount * 0.18).toFixed(2);
            const tip20 = (amount * 0.20).toFixed(2);
            
            return `💰 Tip Calculator for $${amount}:
• 15%: $${tip15} (Total: $${(amount + parseFloat(tip15)).toFixed(2)})
• 18%: $${tip18} (Total: $${(amount + parseFloat(tip18)).toFixed(2)})
• 20%: $${tip20} (Total: $${(amount + parseFloat(tip20)).toFixed(2)})`;
        }
        
        // Handle basic math
        try {
            // Simple safety check - only allow basic math operations
            if (!/^[\d\s+\-*/.()]+$/.test(expression)) {
                return "For security, I can only calculate basic math expressions (+, -, *, /, parentheses).";
            }
            
            const result = eval(expression);
            return `🧮 ${expression} = ${result}`;
        } catch (error) {
            return "Sorry, I couldn't calculate that. Please check your expression and try again.";
        }
    }

    getWeatherAdvice(condition) {
        const advice = {
            'sunny': "☀️ Great weather! Don't forget sunscreen and stay hydrated.",
            'rainy': "🌧️ Perfect day for indoor activities! Maybe catch up on reading or organize your space.",
            'cloudy': "☁️ Nice mild weather - great for a walk or outdoor errands.",
            'cold': "🥶 Bundle up! Hot drinks and warm meals will keep you cozy.",
            'hot': "🔥 Stay cool and hydrated! Seek shade and avoid peak sun hours.",
            'windy': "💨 Secure loose items and maybe skip the outdoor workout today.",
            'snowy': "❄️ Beautiful but be careful! Hot cocoa weather for sure."
        };
        
        const lowerCondition = condition.toLowerCase();
        
        for (const [weather, tip] of Object.entries(advice)) {
            if (lowerCondition.includes(weather)) {
                return tip;
            }
        }
        
        return "🌤️ Whatever the weather, make it a great day! Stay prepared and enjoy the moment.";
    }

    getCurrentTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString();
        const dateString = now.toLocaleDateString();
        
        return `🕐 Current time: ${timeString}
📅 Today's date: ${dateString}
🌍 Time zone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}`;
    }

    handleReminderRequest(input) {
        const reminderText = input.replace(/remind|reminder/gi, '').trim();
        return this.setReminder(reminderText);
    }

    handleHabitRequest(input) {
        const habitName = input.replace(/habit|track/gi, '').trim();
        return this.trackHabit(habitName);
    }

    handleCalculation(input) {
        const expression = input.replace(/calc|calculate/gi, '').trim();
        return this.calculate(expression);
    }

    getReminders() {
        if (this.reminders.length === 0) {
            return "📝 No reminders set yet.";
        }
        
        let reminderList = "📝 Your Reminders:\n\n";
        this.reminders.forEach((reminder, index) => {
            reminderList += `${index + 1}. ${reminder.text}\n   📅 Created: ${reminder.created}\n\n`;
        });
        
        return reminderList;
    }
}

module.exports = DailyFeatures;