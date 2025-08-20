const readline = require('readline');
const ChatMemory = require('./chat_memory');
const DailyFeatures = require('./daily_features');
const Interface = require('./interface');
const { ModelLoader } = require('./model_loader');

class DailyLifeAssistant {
    constructor() {
        this.memory = new ChatMemory();
        this.features = new DailyFeatures();
        this.interface = new Interface();
        this.model = new ModelLoader();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.isRunning = false;
    }

    async start() {
        await this.model.initialize();
        this.isRunning = true;
        this.interface.showWelcome();

        while (this.isRunning) {
            try {
                const input = await this.getUserInput();
                if (!input.trim()) continue;

                const response = await this.processInput(input);
                this.interface.displayResponse(response);

                // Store conversation
                this.memory.addMessage('user', input);
                this.memory.addMessage('assistant', response);

            } catch (error) {
                console.error('Error:', error.message);
            }
        }

        this.rl.close();
    }

    async getUserInput() {
        return new Promise(resolve => {
            this.rl.question(this.interface.getPrompt(), answer => resolve(answer));
        });
    }

    async processInput(input) {
        const trimmedInput = input.trim();

        // Handle system commands first
        if (trimmedInput.startsWith('/')) return this.handleCommand(trimmedInput);

        const lowerInput = trimmedInput.toLowerCase();

        // --- Fallback checks before AI ---
        // Capital queries
        if (/capital of\s+/.test(lowerInput)) return await this.model.getFallbackResponse(trimmedInput);

        // Basic math and other common queries
        if (this.model.isFallbackQuery(lowerInput)) return await this.model.getFallbackResponse(trimmedInput);

        // Daily life features
        if (this.features.canHandle(lowerInput)) return this.features.process(trimmedInput);

        // General AI chat
        const context = this.memory.getConversationHistory();
        return await this.model.generateResponse(trimmedInput, context);
    }

    handleCommand(command) {
        const [cmd, ...args] = command.split(' ');

        switch (cmd) {
            case '/help': return this.interface.getHelpText();
            case '/exit':
            case '/quit':
                this.isRunning = false;
                return "Goodbye! Have a great day! 👋";
            case '/clear':
                console.clear();
                return "Chat cleared! Starting fresh.";
            case '/history': return this.memory.getConversationHistory();
            case '/stats': return this.getSessionStats();
            case '/remind': return this.features.setReminder(args.join(' '));
            case '/habit': return this.features.trackHabit(args.join(' '));
            case '/tip': return this.features.getDailyTip();
            case '/calc': return this.features.calculate(args.join(' '));
            case '/weather': return this.features.getWeatherAdvice(args.join(' '));
            default: return `Unknown command: ${cmd}. Type /help for available commands.`;
        }
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

// Run chatbot
const assistant = new DailyLifeAssistant();
assistant.start().catch(console.error);
