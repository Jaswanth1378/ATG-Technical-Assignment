# 🤖 Daily Life Assistant Chatbot

A powerful, feature-rich command-line chatbot built with Node.js and Hugging Face models. This chatbot not only provides conversational AI but also includes practical daily life features like habit tracking, reminders, quick calculations, and productivity tips.

## ✨ Features

### 🧠 AI Conversation
- **Smart Memory**: Maintains conversation context with sliding window buffer (last 3-5 turns)
- **Personalized Responses**: Learns user preferences and provides contextual replies
- **Fallback Intelligence**: Works offline with intelligent local responses when API is unavailable

### 🎯 Daily Life Tools
- **Habit Tracking**: Track daily habits and build streaks
- **Smart Reminders**: Set and manage personal reminders
- **Daily Tips**: Get practical life advice and productivity tips
- **Quick Calculations**: Tip calculator, unit conversions, time zones
- **Weather Advice**: Get activity suggestions based on weather conditions

### 📊 Analytics & Memory
- **Session Statistics**: Track questions asked, topics discussed, session duration
- **Conversation Export**: Export chat history as JSON
- **User Preferences**: Remembers likes/dislikes for personalized experience
- **Smart Greetings**: Time-aware, personalized greetings

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed on your system
- Internet connection (optional - works offline with fallback responses)

### Installation

1. **Clone or download the project**
```bash
git clone <repository-url>
cd daily-life-chatbot
```

2. **Install dependencies**
```bash
npm install
```

3. **Run the chatbot**
```bash
npm start
```

## 📁 Project Structure

```
daily-life-chatbot/
├── src/
│   ├── model_loader.js     # AI model integration & fallback responses
│   ├── chat_memory.js      # Conversation memory & user preferences
│   ├── daily_features.js   # Daily life utilities & tools
│   └── interface.js        # CLI interface & command handling
├── main.js                 # Application entry point
├── package.json           # Dependencies & scripts
└── README.md              # This file
```

## 🎮 Usage Guide

### Basic Conversation
Simply type your message and press Enter:
```
You: How can I be more productive?
🤖 Bot: For better time management, try the Pomodoro technique: 25 minutes focused work, 5 minute breaks. Also, prioritize your most important tasks first thing in the morning!
```

### Commands Reference

#### 💬 Conversation Management
- `/clear` - Clear conversation history
- `/history` - Show full conversation history
- `/stats` - Display session statistics
- `/export` - Export chat as JSON format

#### 🎯 Productivity Tools
- `/remind [text] at [time]` - Set a reminder
  ```
  You: /remind Take medicine at 8:00 PM
  🤖 Bot: ✅ Reminder set: "Take medicine" for 8:00 PM
  ```

- `/reminders` - Show all active reminders
- `/habit [name]` - Track a daily habit
  ```
  You: /habit morning exercise
  🤖 Bot: 🎯 Great job! Habit "morning exercise" tracked for today. Streak: 1 days
  ```

- `/tip` - Get a random daily life tip

#### 🧮 Quick Utilities
- `/calc tip [amount] [percentage]` - Calculate restaurant tips
  ```
  You: /calc tip 45 18
  🤖 Bot: 💰 Bill: $45.00
          💵 Tip (18%): $8.10
          💳 Total: $53.10
  ```

- `/weather [condition]` - Get weather-appropriate advice
- `/time [timezone]` - Check time in different timezones
  ```
  You: /time America/New_York
  🤖 Bot: 🕐 Current time in America/New_York: 3/15/2024, 2:30:45 PM
  ```

#### ⚙️ System Commands
- `/help` - Show all available commands
- `/exit` - Exit the chatbot with session summary

## 🔧 Configuration

### Memory Settings
Edit `src/chat_memory.js` to adjust:
- `maxTurns`: Number of conversation turns to remember (default: 5)
- Conversation context length
- Statistics tracking preferences

### AI Model Settings
Edit `src/model_loader.js` to modify:
- Model selection (default: microsoft/DialoGPT-medium)
- Response parameters (temperature, max tokens)
- Fallback response categories

## 💡 Example Interactions

### Productivity Conversation
```
You: I'm feeling overwhelmed with work
🤖 Bot: I understand that feeling. Try breaking your tasks into smaller, manageable chunks. What's the most important thing you need to accomplish today?

You: I need to finish a report and prepare for a meeting
🤖 Bot: Great! Focus on one at a time. Which one has the earlier deadline? Also, try the Pomodoro technique for focused work sessions.

You: /tip
🤖 Bot: 💡 Tip: Use the 2-minute rule: if it takes less than 2 minutes, do it now!
```

### Daily Life Management
```
You: /remind Call mom at 7:00 PM
🤖 Bot: ✅ Reminder set: "Call mom" for 7:00 PM

You: /habit drink water
🤖 Bot: 🎯 Great job! Habit "drink water" tracked for today. Streak: 1 days

You: /calc tip 32 20
🤖 Bot: 💰 Bill: $32.00
        💵 Tip (20%): $6.40
        💳 Total: $38.40
```

## 🛠️ Technical Details

### Architecture
- **Modular Design**: Separated concerns across multiple files
- **Error Handling**: Graceful fallbacks when API is unavailable
- **Memory Management**: Efficient sliding window for conversation context
- **Async/Await**: Modern JavaScript patterns for better performance

### AI Integration
- **Primary**: Hugging Face Inference API with DialoGPT-medium
- **Fallback**: Intelligent local responses based on keyword detection
- **Context Aware**: Uses conversation history for coherent responses

### Data Persistence
- **Session-based**: Data persists during chat session
- **Export Feature**: Save conversations and statistics as JSON
- **Privacy-focused**: No data stored permanently without user action

## 🚨 Troubleshooting

### Common Issues

**"Command not found" errors**
- Ensure Node.js 16+ is installed: `node --version`
- Run `npm install` to install dependencies

**API connection issues**
- The chatbot automatically falls back to local responses
- Check internet connection for full AI features
- All core features work offline

**Memory issues with long conversations**
- Use `/clear` to reset conversation history
- Adjust `maxTurns` in `chat_memory.js` for longer/shorter memory

## 🎯 Use Cases

### Daily Scenarios
- **Morning Routine**: Get tips, set reminders, track habits
- **Work Productivity**: Time management advice, break reminders
- **Evening Planning**: Review day, set tomorrow's goals
- **Quick Calculations**: Tips, conversions, time zones
- **Habit Building**: Track progress, maintain streaks

### Professional Use
- **Team Standup Prep**: Review daily goals and progress
- **Break Management**: Pomodoro technique integration
- **Meeting Preparation**: Set reminders, time management
- **Productivity Tracking**: Monitor daily statistics

## 🔮 Future Enhancements

- **Data Persistence**: Save habits and reminders between sessions
- **Calendar Integration**: Sync with external calendar apps
- **Voice Commands**: Speech-to-text input support
- **Mobile App**: React Native companion app
- **Team Features**: Shared habits and group challenges
- **Advanced Analytics**: Weekly/monthly progress reports

## 📄 License

MIT License - feel free to modify and distribute!

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

**Made with ❤️ for daily productivity and AI-powered assistance**

*Start your conversation with the chatbot and discover how AI can enhance your daily life!*