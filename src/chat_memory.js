class ChatMemory {
    constructor() {
        this.messages = [];
        this.startTime = Date.now();
        this.commandCount = 0;
        this.maxMessages = 100; // Limit memory usage
    }

    addMessage(role, content) {
        const message = {
            role,
            content,
            timestamp: new Date().toISOString()
        };
        
        this.messages.push(message);
        
        // Keep only recent messages to prevent memory overflow
        if (this.messages.length > this.maxMessages) {
            this.messages = this.messages.slice(-this.maxMessages);
        }
        
        if (content.startsWith('/')) {
            this.commandCount++;
        }
    }

    getRecentMessages(count = 10) {
        return this.messages.slice(-count);
    }

    getConversationHistory() {
        if (this.messages.length === 0) {
            return "No conversation history yet. Start chatting!";
        }
        
        const recent = this.getRecentMessages(10);
        let history = "📝 Recent Conversation History:\n\n";
        
        recent.forEach((msg, index) => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const role = msg.role === 'user' ? '👤 You' : '🤖 Assistant';
            history += `[${time}] ${role}: ${msg.content}\n`;
        });
        
        return history;
    }

    getMessageCount() {
        return this.messages.length;
    }

    getStartTime() {
        return this.startTime;
    }

    getCommandCount() {
        return this.commandCount;
    }

    clearHistory() {
        this.messages = [];
        this.commandCount = 0;
    }

    searchMessages(query) {
        const results = this.messages.filter(msg => 
            msg.content.toLowerCase().includes(query.toLowerCase())
        );
        
        if (results.length === 0) {
            return `No messages found containing "${query}"`;
        }
        
        let searchResults = `🔍 Found ${results.length} messages containing "${query}":\n\n`;
        results.slice(-5).forEach(msg => {
            const time = new Date(msg.timestamp).toLocaleTimeString();
            const role = msg.role === 'user' ? '👤' : '🤖';
            searchResults += `[${time}] ${role}: ${msg.content}\n`;
        });
        
        return searchResults;
    }

    getStats() {
        const userMessages = this.messages.filter(msg => msg.role === 'user').length;
        const assistantMessages = this.messages.filter(msg => msg.role === 'assistant').length;
        
        return {
            total: this.messages.length,
            user: userMessages,
            assistant: assistantMessages,
            commands: this.commandCount,
            duration: Date.now() - this.startTime
        };
    }
}

module.exports = ChatMemory;