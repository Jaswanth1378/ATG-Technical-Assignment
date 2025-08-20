class Interface {
    constructor() {
        this.colors = {
            reset: '\x1b[0m',
            bright: '\x1b[1m',
            dim: '\x1b[2m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m'
        };
    }

    showWelcome() {
        console.clear();
        console.log(this.colorize(`
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║           🤖 Daily Life Assistant Chatbot 🤖                ║
║                                                              ║
║              Your AI companion for daily tasks               ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝

${this.colorize('Welcome! I\'m here to help you with:', 'cyan')}

💬 Natural conversations and friendly chat
⏰ Reminders and time management  
🎯 Habit tracking and motivation
💡 Daily tips and life advice
🧮 Quick calculations and tips
🌤️ Weather-based suggestions
📊 Session statistics and history

${this.colorize('Quick Start:', 'yellow')}
• Just start typing to chat naturally
• Use /help to see all available commands
• Type /exit when you're ready to leave

${this.colorize('Example commands:', 'green')}
• /remind Call dentist tomorrow
• /habit morning exercise
• /tip (get a daily life tip)
• /calc tip 45 (calculate tip for $45)

Let's make your day more organized and productive! 🚀
`, 'bright'));
    }

    getPrompt() {
        return this.colorize('\n💬 You: ', 'cyan');
    }

    displayResponse(response) {
        console.log(this.colorize(`🤖 Assistant: ${response}`, 'white'));
    }

    getHelpText() {
        return `
${this.colorize('📚 Available Commands:', 'bright')}

${this.colorize('💬 Chat Commands:', 'cyan')}
• /tip                    - Get a random daily life tip
• /remind [text]          - Set a reminder
• /habit [name]           - Track a habit for today
• /calc [expression]      - Calculate math or tips
• /weather [condition]    - Get weather-based advice

${this.colorize('🛠️ System Commands:', 'yellow')}
• /help                   - Show this help message
• /history                - View recent conversation
• /stats                  - Show session statistics
• /clear                  - Clear the screen
• /exit or /quit          - Exit the chatbot

${this.colorize('💡 Usage Examples:', 'green')}
• "How can I be more productive?"
• "/remind Buy groceries after work"
• "/habit drink water"
• "/calc 15 * 8"
• "/calc tip 50"
• "/weather rainy"
• "/tip"

${this.colorize('🎯 Pro Tips:', 'magenta')}
• I remember our conversation during this session
• I can help with planning, motivation, and daily tasks
• Try asking me about productivity, habits, or life advice
• Use natural language - I understand context!

Ready to chat? Just type your message or command! 🚀
        `;
    }

    colorize(text, color = 'reset') {
        if (!this.colors[color]) return text;
        return `${this.colors[color]}${text}${this.colors.reset}`;
    }

    showError(error) {
        console.log(this.colorize(`❌ Error: ${error}`, 'red'));
    }

    showSuccess(message) {
        console.log(this.colorize(`✅ ${message}`, 'green'));
    }

    showWarning(message) {
        console.log(this.colorize(`⚠️ ${message}`, 'yellow'));
    }

    showInfo(message) {
        console.log(this.colorize(`ℹ️ ${message}`, 'blue'));
    }

    formatList(items, title = 'List') {
        let formatted = this.colorize(`\n📋 ${title}:\n`, 'bright');
        items.forEach((item, index) => {
            formatted += `  ${index + 1}. ${item}\n`;
        });
        return formatted;
    }

    formatTable(data, headers) {
        let table = '\n';
        
        // Headers
        table += this.colorize(headers.join(' | '), 'bright') + '\n';
        table += '-'.repeat(headers.join(' | ').length) + '\n';
        
        // Data rows
        data.forEach(row => {
            table += row.join(' | ') + '\n';
        });
        
        return table;
    }

    showProgress(current, total, task = 'Progress') {
        const percentage = Math.round((current / total) * 100);
        const barLength = 20;
        const filledLength = Math.round((percentage / 100) * barLength);
        const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
        
        console.log(this.colorize(`${task}: [${bar}] ${percentage}% (${current}/${total})`, 'cyan'));
    }
}

module.exports = Interface;