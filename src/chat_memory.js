export class ChatMemory {
    constructor(maxTurns = 5) {
        this.maxTurns = maxTurns;
        this.conversations = [];
        this.userPreferences = new Map();
        this.dailyStats = {
            questionsAsked: 0,
            topicsDiscussed: new Set(),
            sessionStart: new Date()
        };
    }

    addTurn(userInput, botResponse) {
        const turn = {
            user: userInput,
            bot: botResponse,
            timestamp: new Date(),
            id: Date.now()
        };

        this.conversations.push(turn);
        this.updateStats(userInput);

        // Maintain sliding window
        if (this.conversations.length > this.maxTurns) {
            this.conversations.shift();
        }

        // Learn user preferences
        this.learnPreferences(userInput);
    }

    updateStats(userInput) {
        this.dailyStats.questionsAsked++;
        
        // Extract topics (simple keyword detection)
        const topics = ['work', 'health', 'food', 'weather', 'money', 'learning', 'time', 'exercise'];
        topics.forEach(topic => {
            if (userInput.toLowerCase().includes(topic)) {
                this.dailyStats.topicsDiscussed.add(topic);
            }
        });
    }

    learnPreferences(userInput) {
        const lowerInput = userInput.toLowerCase();
        
        // Learn about user's interests
        if (lowerInput.includes('i like') || lowerInput.includes('i love')) {
            const preference = userInput.substring(userInput.toLowerCase().indexOf('i like') + 6).trim();
            this.userPreferences.set('likes', [...(this.userPreferences.get('likes') || []), preference]);
        }
        
        if (lowerInput.includes('i hate') || lowerInput.includes('i dislike')) {
            const dislike = userInput.substring(userInput.toLowerCase().indexOf('i hate') + 6).trim();
            this.userPreferences.set('dislikes', [...(this.userPreferences.get('dislikes') || []), dislike]);
        }
    }

    getContext() {
        if (this.conversations.length === 0) return '';
        
        return this.conversations
            .slice(-3) // Last 3 turns for context
            .map(turn => `User: ${turn.user}\nBot: ${turn.bot}`)
            .join('\n');
    }

    getHistory() {
        return this.conversations.map((turn, index) => 
            `${index + 1}. [${turn.timestamp.toLocaleTimeString()}] You: ${turn.user}\n   Bot: ${turn.bot}`
        ).join('\n\n');
    }

    getDailyStats() {
        const sessionDuration = Math.round((new Date() - this.dailyStats.sessionStart) / 1000 / 60);
        return {
            questionsAsked: this.dailyStats.questionsAsked,
            topicsDiscussed: Array.from(this.dailyStats.topicsDiscussed),
            sessionDuration: `${sessionDuration} minutes`,
            conversationTurns: this.conversations.length
        };
    }

    getPersonalizedGreeting() {
        const hour = new Date().getHours();
        let timeGreeting;
        
        if (hour < 12) timeGreeting = "Good morning";
        else if (hour < 17) timeGreeting = "Good afternoon";
        else timeGreeting = "Good evening";

        const likes = this.userPreferences.get('likes');
        if (likes && likes.length > 0) {
            return `${timeGreeting}! I remember you mentioned you like ${likes[likes.length - 1]}. How can I help you today?`;
        }

        return `${timeGreeting}! How can I assist you today?`;
    }

    clear() {
        this.conversations = [];
        console.log('💭 Conversation history cleared!');
    }

    exportChat() {
        const timestamp = new Date().toISOString().split('T')[0];
        const chatData = {
            date: timestamp,
            conversations: this.conversations,
            stats: this.getDailyStats(),
            preferences: Object.fromEntries(this.userPreferences)
        };
        
        return JSON.stringify(chatData, null, 2);
    }
}