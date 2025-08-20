#!/usr/bin/env node

import { ChatInterface } from './src/interface.js';

async function main() {
    try {
        const chatbot = new ChatInterface();
        await chatbot.initialize();
        await chatbot.startChat();
    } catch (error) {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
    console.log('\n\n👋 Goodbye! Thanks for using Daily Life Assistant!');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n\n👋 Goodbye! Thanks for using Daily Life Assistant!');
    process.exit(0);
});

main().catch(console.error);