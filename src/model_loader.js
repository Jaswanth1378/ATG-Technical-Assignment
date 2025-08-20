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
                parameters: {
                    max_new_tokens: 10,
                    temperature: 0.7,
                    do_sample: true
                }
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
            return this.getFallbackResponse(prompt);
        }

        try {
            const fullPrompt = context ? `${context}\nUser: ${prompt}\nBot:` : `User: ${prompt}\nBot:`;
            
            const response = await this.hf.textGeneration({
                model: this.modelName,
                inputs: fullPrompt,
                parameters: {
                    max_new_tokens: 100,
                    temperature: 0.7,
                    do_sample: true,
                    pad_token_id: 50256
                }
            });

            return this.cleanResponse(response.generated_text, fullPrompt);
        } catch (error) {
            console.log('⚠️  Falling back to local response');
            return this.getFallbackResponse(prompt);
        }
    }

    cleanResponse(response, prompt) {
        let cleaned = response.replace(prompt, '').trim();
        cleaned = cleaned.split('\n')[0].trim();
        return cleaned || "I understand what you're saying. Could you tell me more?";
    }

    getFallbackResponse(prompt) {
        const lowerPrompt = prompt.toLowerCase();
        
        // Geography and capitals
        if (lowerPrompt.includes('capital')) {
            if (lowerPrompt.includes('france')) return "The capital of France is Paris.";
            if (lowerPrompt.includes('italy')) return "The capital of Italy is Rome.";
            if (lowerPrompt.includes('germany')) return "The capital of Germany is Berlin.";
            if (lowerPrompt.includes('spain')) return "The capital of Spain is Madrid.";
            if (lowerPrompt.includes('japan')) return "The capital of Japan is Tokyo.";
            if (lowerPrompt.includes('china')) return "The capital of China is Beijing.";
            if (lowerPrompt.includes('india')) return "The capital of India is New Delhi.";
            if (lowerPrompt.includes('brazil')) return "The capital of Brazil is Brasília.";
            if (lowerPrompt.includes('canada')) return "The capital of Canada is Ottawa.";
            if (lowerPrompt.includes('australia')) return "The capital of Australia is Canberra.";
            if (lowerPrompt.includes('russia')) return "The capital of Russia is Moscow.";
            if (lowerPrompt.includes('uk') || lowerPrompt.includes('united kingdom') || lowerPrompt.includes('england')) return "The capital of the United Kingdom is London.";
            if (lowerPrompt.includes('usa') || lowerPrompt.includes('united states') || lowerPrompt.includes('america')) return "The capital of the United States is Washington, D.C.";
        }
        
        // Basic math and calculations
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
        
        // Colors and basic facts
        if (lowerPrompt.includes('color') || lowerPrompt.includes('colour')) {
            if (lowerPrompt.includes('sky')) return "The sky is typically blue during the day.";
            if (lowerPrompt.includes('grass')) return "Grass is typically green.";
            if (lowerPrompt.includes('sun')) return "The sun appears yellow or white.";
        }
        
        // Days and time
        if (lowerPrompt.includes('days in') || lowerPrompt.includes('how many days')) {
            if (lowerPrompt.includes('week')) return "There are 7 days in a week.";
            if (lowerPrompt.includes('year')) return "There are 365 days in a regular year, and 366 days in a leap year.";
            if (lowerPrompt.includes('month')) return "Most months have 30 or 31 days, except February which has 28 days (29 in leap years).";
        }
        
        // Basic science
        if (lowerPrompt.includes('water') && lowerPrompt.includes('boil')) {
            return "Water boils at 100°C (212°F) at sea level.";
        }
        
        if (lowerPrompt.includes('water') && lowerPrompt.includes('freeze')) {
            return "Water freezes at 0°C (32°F) at sea level.";
        }
        
        // Planets
        if (lowerPrompt.includes('planet')) {
            if (lowerPrompt.includes('closest to sun') || lowerPrompt.includes('nearest to sun')) {
                return "Mercury is the planet closest to the Sun.";
            }
            if (lowerPrompt.includes('largest')) return "Jupiter is the largest planet in our solar system.";
            if (lowerPrompt.includes('how many')) return "There are 8 planets in our solar system.";
        }
        
        // Languages
        if (lowerPrompt.includes('language')) {
            if (lowerPrompt.includes('most spoken') || lowerPrompt.includes('popular')) {
                return "Mandarin Chinese is the most spoken language by native speakers, while English is widely used internationally.";
            }
        }
        
        // Current events and general knowledge
        if (lowerPrompt.includes('who is') || lowerPrompt.includes('who was')) {
            if (lowerPrompt.includes('einstein')) return "Albert Einstein was a theoretical physicist famous for his theory of relativity.";
            if (lowerPrompt.includes('shakespeare')) return "William Shakespeare was an English playwright and poet, often called the greatest writer in the English language.";
        }
        
        // Animals
        if (lowerPrompt.includes('largest animal') || lowerPrompt.includes('biggest animal')) {
            return "The blue whale is the largest animal on Earth.";
        }
        
        if (lowerPrompt.includes('fastest animal')) {
            return "The peregrine falcon is the fastest animal, reaching speeds over 240 mph when diving.";
        }
        
        // Weather responses
        if (lowerPrompt.includes('weather')) {
            return "I'd recommend checking a weather app for accurate forecasts. Generally, dress in layers and check the forecast before heading out!";
        }
        
        // Time management
        if (lowerPrompt.includes('time') || lowerPrompt.includes('schedule') || lowerPrompt.includes('productivity')) {
            return "For better time management, try the Pomodoro technique: 25 minutes focused work, 5 minute breaks. Also, prioritize your most important tasks first thing in the morning!";
        }
        
        // Health and wellness
        if (lowerPrompt.includes('health') || lowerPrompt.includes('exercise') || lowerPrompt.includes('wellness')) {
            return "Remember to stay hydrated, take regular breaks from screens, and aim for 7-8 hours of sleep. Even a 10-minute walk can boost your energy!";
        }
        
        // Food and cooking
        if (lowerPrompt.includes('food') || lowerPrompt.includes('cook') || lowerPrompt.includes('recipe')) {
            return "For quick healthy meals, try batch cooking on weekends. Keep basics like eggs, rice, and frozen vegetables handy for easy meals!";
        }
        
        // Money and budgeting
        if (lowerPrompt.includes('money') || lowerPrompt.includes('budget') || lowerPrompt.includes('save')) {
            return "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings. Track your expenses for a week to see where your money goes!";
        }
        
        // Learning and skills
        if (lowerPrompt.includes('learn') || lowerPrompt.includes('skill') || lowerPrompt.includes('study')) {
            return "Break learning into small, daily chunks. Use active recall and spaced repetition. Teaching others what you've learned helps solidify knowledge!";
        }
        
        // Default responses
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