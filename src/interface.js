import readline from 'readline';
import { ModelLoader } from './model_loader.js';
import { ChatMemory } from './chat_memory.js';
import { DailyFeatures } from './daily_features.js';

export class ChatInterface {
    constructor() {
        this.modelLoader = new ModelLoader();
        this.memory = new ChatMemory();
        this.dailyFeatures = new DailyFeatures();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
        this.isRunning = false;
    }

    async initialize() {
        console.log('🚀 Starting Daily Life Assistant Chatbot...\n');
        await this.modelLoader.initialize();
        this.showWelcome();
    }

    showWelcome() {
        console.log('\n' + '='.repeat(60));
        console.log('🤖 DAILY LIFE ASSISTANT CHATBOT');
        console.log('='.repeat(60));
        console.log('💬 Chat naturally or use these commands:');
        console.log('   /help     - Show all commands');
        console.log('   /tip      - Get daily life tip');
        console.log('   /remind   - Set reminders');
        console.log('   /habit    - Track habits');
        console.log('   /calc     - Quick calculations');
        console.log('   /weather  - Weather advice');
        console.log('   /stats    - Session statistics');
        console.log('   /export   - Export chat history');
        console.log('   /clear    - Clear conversation');
        console.log('   /exit     - Exit chatbot');
        console.log('='.repeat(60));
        console.log(this.memory.getPersonalizedGreeting());
        console.log('');
    }

    async startChat() {
        this.isRunning = true;
        
        while (this.isRunning) {
            try {
                const userInput = await this.getUserInput('You: ');
                
                if (!userInput.trim()) continue;
                
                if (await this.handleCommand(userInput)) {
                    continue;
                }
                
                const response = await this.generateResponse(userInput);
                console.log(`🤖 Bot: ${response}\n`);
                
                this.memory.addTurn(userInput, response);
                
            } catch (error) {
                console.log('❌ An error occurred:', error.message);
            }
        }
    }

    async handleCommand(input) {
        const command = input.toLowerCase().trim();
        
        if (command === '/exit') {
            await this.exitChat();
            return true;
        }
        
        if (command === '/help') {
            this.showHelp();
            return true;
        }
        
        if (command === '/tip') {
            console.log(`🤖 ${this.dailyFeatures.getDailyTip()}\n`);
            return true;
        }
        
        if (command.startsWith('/remind')) {
            const parts = command.split(' at ');
            if (parts.length === 2) {
                const text = parts[0].replace('/remind ', '');
                const time = parts[1];
                console.log(`🤖 ${this.dailyFeatures.addReminder(text, time)}\n`);
            } else {
                console.log('🤖 Usage: /remind [text] at [time]\n   Example: /remind Take medicine at 8:00 PM\n');
            }
            return true;
        }
        
        if (command === '/reminders') {
            console.log(`🤖 ${this.dailyFeatures.getReminders()}\n`);
            return true;
        }
        
        if (command.startsWith('/habit')) {
            const habitName = command.replace('/habit ', '').trim();
            if (habitName && habitName !== '/habit') {
                console.log(`🤖 ${this.dailyFeatures.trackHabit(habitName)}\n`);
            } else {
                console.log(`🤖 ${this.dailyFeatures.getHabits()}\n`);
            }
            return true;
        }
        
        if (command.startsWith('/calc tip')) {
            const parts = command.split(' ');
            if (parts.length >= 3) {
                const bill = parseFloat(parts[2]);
                const percentage = parts[3] ? parseFloat(parts[3]) : 15;
                console.log(`🤖 ${this.dailyFeatures.calculateTip(bill, percentage)}\n`);
            } else {
                console.log('🤖 Usage: /calc tip [amount] [percentage]\n   Example: /calc tip 50 18\n');
            }
            return true;
        }
        
        if (command.startsWith('/weather')) {
            const condition = command.replace('/weather ', '').trim() || 'sunny';
            console.log(`🤖 ${this.dailyFeatures.getWeatherAdvice(condition)}\n`);
            return true;
        }
        
        if (command.startsWith('/time')) {
            const timezone = command.replace('/time ', '').trim();
            if (timezone && timezone !== '/time') {
                console.log(`🤖 ${this.dailyFeatures.getTimeIn(timezone)}\n`);
            } else {
                console.log('🤖 Usage: /time [timezone]\n   Example: /time America/New_York\n');
            }
            return true;
        }
        
        if (command === '/stats') {
            const stats = this.memory.getDailyStats();
            console.log('🤖 📊 Session Statistics:');
            console.log(`   Questions asked: ${stats.questionsAsked}`);
            console.log(`   Topics discussed: ${stats.topicsDiscussed.join(', ') || 'None yet'}`);
            console.log(`   Session duration: ${stats.sessionDuration}`);
            console.log(`   Conversation turns: ${stats.conversationTurns}\n`);
            return true;
        }
        
        if (command === '/history') {
            const history = this.memory.getHistory();
            console.log('🤖 📜 Conversation History:');
            console.log(history || 'No conversation history yet.\n');
            console.log('');
            return true;
        }
        
        if (command === '/export') {
            const chatData = this.memory.exportChat();
            console.log('🤖 📤 Chat Export (JSON format):');
            console.log(chatData);
            console.log('');
            return true;
        }
        
        if (command === '/clear') {
            this.memory.clear();
            return true;
        }
        
        return false;
    }

    showHelp() {
        console.log('🤖 📚 Available Commands:');
        console.log('   💬 CONVERSATION:');
        console.log('      /clear              - Clear conversation history');
        console.log('      /history            - Show conversation history');
        console.log('      /stats              - Show session statistics');
        console.log('      /export             - Export chat as JSON');
        console.log('');
        console.log('   🎯 PRODUCTIVITY:');
        console.log('      /remind [text] at [time] - Set a reminder');
        console.log('      /reminders          - Show active reminders');
        console.log('      /habit [name]       - Track a habit');
        console.log('      /tip                - Get a daily life tip');
        console.log('');
        console.log('   🧮 UTILITIES:');
        console.log('      /calc tip [amount] [%] - Calculate tip');
        console.log('      /weather [condition]   - Get weather advice');
        console.log('      /time [timezone]       - Get time in timezone');
        console.log('');
        console.log('   ⚙️  SYSTEM:');
        console.log('      /help               - Show this help');
        console.log('      /exit               - Exit chatbot');
        console.log('');
    }

    async generateResponse(userInput) {
        const context = this.memory.getContext();
        return await this.modelLoader.generateResponse(userInput, context);
    }

    getUserInput(prompt) {
        return new Promise((resolve) => {
            this.rl.question(prompt, (answer) => {
                resolve(answer);
            });
        });
    }

    async exitChat() {
        const stats = this.memory.getDailyStats();
        console.log('\n' + '='.repeat(50));
        console.log('👋 Thanks for chatting! Session Summary:');
        console.log(`   • Questions asked: ${stats.questionsAsked}`);
        console.log(`   • Session duration: ${stats.sessionDuration}`);
        console.log(`   • Topics discussed: ${stats.topicsDiscussed.join(', ') || 'General chat'}`);
        console.log('='.repeat(50));
        console.log('🌟 Have a great day! Remember to stay hydrated! 💧');
        
        this.rl.close();
        this.isRunning = false;
        process.exit(0);
    }
}