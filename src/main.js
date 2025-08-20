const readline = require('readline');
const ChatMemory = require('./chat_memory');
const DailyFeatures = require('./daily_features');
const Interface = require('./interface');

class DailyLifeAssistant {
    constructor() {
        this.memory = new ChatMemory();
        this.features = new DailyFeatures();
        this.interface = new Interface();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.isRunning = false;
    }

    async start() {
        this.isRunning = true;
        this.interface.showWelcome();
        
        while (this.isRunning) {
            try {
                const input = await this.getUserInput();
                
                if (input.trim() === '') continue;
                
                const response = await this.processInput(input);
                this.interface.displayResponse(response);
                
                // Store conversation in memory
                this.memory.addMessage('user', input);
                this.memory.addMessage('assistant', response);
                
            } catch (error) {
                console.error('Error:', error.message);
            }
        }
        
        this.rl.close();
    }

    async getUserInput() {
        return new Promise((resolve) => {
            this.rl.question(this.interface.getPrompt(), (answer) => {
                resolve(answer);
            });
        });
    }

    async processInput(input) {
        const trimmedInput = input.trim().toLowerCase();
        
        // Handle system commands
        if (trimmedInput.startsWith('/')) {
            return this.handleCommand(trimmedInput);
        }
        
        // Handle daily life features
        if (this.features.canHandle(input)) {
            return this.features.process(input);
        }
        
        // Handle general conversation
        return this.handleGeneralChat(input);
    }

    handleCommand(command) {
        const [cmd, ...args] = command.split(' ');
        
        switch (cmd) {
            case '/help':
                return this.interface.getHelpText();
            
            case '/exit':
            case '/quit':
                this.isRunning = false;
                return "Goodbye! Have a great day! 👋";
            
            case '/clear':
                console.clear();
                return "Chat cleared! Starting fresh.";
            
            case '/history':
                return this.memory.getConversationHistory();
            
            case '/stats':
                return this.getSessionStats();
            
            case '/remind':
                return this.features.setReminder(args.join(' '));
            
            case '/habit':
                return this.features.trackHabit(args.join(' '));
            
            case '/tip':
                return this.features.getDailyTip();
            
            case '/calc':
                return this.features.calculate(args.join(' '));
            
            case '/weather':
                return this.features.getWeatherAdvice(args.join(' '));
            
            default:
                return `Unknown command: ${cmd}. Type /help for available commands.`;
        }
    }

    handleGeneralChat(input) {
        // Simple conversational responses
        const responses = [
            "That's interesting! Tell me more about that.",
            "I understand. How can I help you with that?",
            "Thanks for sharing! Is there anything specific you'd like assistance with?",
            "I'm here to help! What would you like to do today?",
            "That sounds important. Would you like me to help you organize your thoughts about it?",
            "I see. Is there a way I can assist you with this?",
            "Interesting perspective! How can I support you today?",
            "I'm listening. What's on your mind?",
            "That's worth considering. Need any help planning or organizing around that?",
            "I appreciate you sharing that with me. How can I be most helpful right now?"
        ];
        
        return responses[Math.floor(Math.random() * responses.length)];
    }

    getSessionStats() {
        const messageCount = this.memory.getMessageCount();
        const startTime = this.memory.getStartTime();
        const duration = Math.floor((Date.now() - startTime) / 1000 / 60);
        
        return `📊 Session Statistics:
• Messages exchanged: ${messageCount}
• Session duration: ${duration} minutes
• Commands used: ${this.memory.getCommandCount()}
• Started: ${new Date(startTime).toLocaleTimeString()}`;
    }
}

// Start the assistant
const assistant = new DailyLifeAssistant();
assistant.start().catch(console.error);