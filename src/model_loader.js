import fetch from 'node-fetch'; // ensure node-fetch is installed for REST API calls
import { HfInference } from '@huggingface/inference';

export class ModelLoader {
    constructor() {
        this.hf = new HfInference();
        this.modelName = 'microsoft/DialoGPT-medium';
        this.isInitialized = false;
    }

    async initialize() {
        try {
            console.log('🤖 Initializing AI model...');
            // Test the model with a simple query
            await this.hf.textGeneration({
                model: this.modelName,
                inputs: 'Hello',
                parameters: { max_new_tokens: 10, temperature: 0.7, do_sample: true }
            });
            this.isInitialized = true;
            console.log('✅ Model initialized successfully!');
            return true;
        } catch (error) {
            console.log('⚠️  Using fallback local responses due to API limitations');
            this.isInitialized = false;
            return false;
        }
    }

    async generateResponse(prompt, context = '') {
        if (!this.isInitialized) {
            return await this.getFallbackResponse(prompt);
        }

        try {
            const fullPrompt = context ? `${context}\nUser: ${prompt}\nBot:` : `User: ${prompt}\nBot:`;

            const response = await this.hf.textGeneration({
                model: this.modelName,
                inputs: fullPrompt,
                parameters: { max_new_tokens: 100, temperature: 0.7, do_sample: true, pad_token_id: 50256 }
            });

            return this.cleanResponse(response.generated_text, fullPrompt);
        } catch (error) {
            console.log('⚠️  Falling back to local response');
            return await this.getFallbackResponse(prompt);
        }
    }

    cleanResponse(response, prompt) {
        let cleaned = response.replace(prompt, '').trim();
        cleaned = cleaned.split('\n')[0].trim();
        return cleaned || "I understand what you're saying. Could you tell me more?";
    }

    async getFallbackResponse(prompt) {
        const lowerPrompt = prompt.toLowerCase();

        // 🌍 Capital of countries (fixed with fullText=true)
        if (lowerPrompt.includes('capital')) {
            const match = prompt.match(/capital of\s+([a-zA-Z ]+)/i);
            if (match) {
                const country = match[1].replace(/[?.,!]/g, '').trim();
                try {
                    const res = await fetch(`https://restcountries.com/v3.1/name/${country}?fullText=true&fields=capital`);
                    const data = await res.json();

                    if (data && data[0] && data[0].capital) {
                        return `The capital of ${country} is ${data[0].capital[0]}.`;
                    } else {
                        return `Sorry, I couldn't find the capital of ${country}.`;
                    }
                } catch (err) {
                    return `Sorry, I had trouble fetching the capital of ${country}.`;
                }
            }
        }

        // ➕ Basic math
        if (lowerPrompt.includes('what is') && (lowerPrompt.includes('+') || lowerPrompt.includes('plus'))) {
            const numbers = lowerPrompt.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                const sum = parseInt(numbers[0]) + parseInt(numbers[1]);
                return `${numbers[0]} plus ${numbers[1]} equals ${sum}.`;
            }
        }

        if (lowerPrompt.includes('what is') && (lowerPrompt.includes('-') || lowerPrompt.includes('minus'))) {
            const numbers = lowerPrompt.match(/\d+/g);
            if (numbers && numbers.length >= 2) {
                const difference = parseInt(numbers[0]) - parseInt(numbers[1]);
                return `${numbers[0]} minus ${numbers[1]} equals ${difference}.`;
            }
        }

        // 🌈 Colors
        if (lowerPrompt.includes('color') || lowerPrompt.includes('colour')) {
            if (lowerPrompt.includes('sky')) return "The sky is typically blue during the day.";
            if (lowerPrompt.includes('grass')) return "Grass is typically green.";
            if (lowerPrompt.includes('sun')) return "The sun appears yellow or white.";
        }

        // 📅 Days and time
        if (lowerPrompt.includes('days in') || lowerPrompt.includes('how many days')) {
            if (lowerPrompt.includes('week')) return "There are 7 days in a week.";
            if (lowerPrompt.includes('year')) return "There are 365 days in a regular year, and 366 days in a leap year.";
            if (lowerPrompt.includes('month')) return "Most months have 30 or 31 days, except February which has 28 days (29 in leap years).";
        }

        // 🔬 Basic science
        if (lowerPrompt.includes('water') && lowerPrompt.includes('boil')) {
            return "Water boils at 100°C (212°F) at sea level.";
        }
        if (lowerPrompt.includes('water') && lowerPrompt.includes('freeze')) {
            return "Water freezes at 0°C (32°F) at sea level.";
        }

        // 🪐 Planets
        if (lowerPrompt.includes('planet')) {
            if (lowerPrompt.includes('closest to sun') || lowerPrompt.includes('nearest to sun')) {
                return "Mercury is the planet closest to the Sun.";
            }
            if (lowerPrompt.includes('largest')) return "Jupiter is the largest planet in our solar system.";
            if (lowerPrompt.includes('how many')) return "There are 8 planets in our solar system.";
        }

        // Default fallback
        const defaultResponses = [
            "That's interesting! Can you tell me more about that?",
            "I see what you mean. How does that make you feel?",
            "That's a great point. What would you like to explore about this topic?",
            "Thanks for sharing that with me. What's your next step?",
            "I understand. Is there a specific aspect you'd like to focus on?"
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    }
}
