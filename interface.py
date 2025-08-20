"""
interface.py - Command-line interface for the chatbot

This module provides the main CLI loop and user interaction handling
for the Hugging Face chatbot with memory management.
"""

import sys
from model_loader import ModelLoader
from chat_memory import ChatMemory


class ChatInterface:
    """
    Manages the command-line interface for the chatbot.
    Handles user input, model interaction, and conversation flow.
    """
    
    def __init__(self, model_name="distilgpt2", memory_window=4):
        """
        Initialize the chat interface.
        
        Args:
            model_name (str): Hugging Face model to use
            memory_window (int): Size of conversation memory window
        """
        self.model_loader = ModelLoader(model_name)
        self.memory = ChatMemory(memory_window)
        self.is_running = False
        
        # Chat configuration
        self.generation_params = {
            'max_length': 120,
            'temperature': 0.8
        }
    
    def initialize(self):
        """
        Initialize the chatbot by loading the model.
        
        Returns:
            bool: True if initialization successful, False otherwise
        """
        print("🤖 Initializing Local Chatbot...")
        print("=" * 50)
        
        if not self.model_loader.load_model():
            print("Failed to initialize chatbot. Please check your setup.")
            return False
        
        print("🎯 Chatbot ready! Type your message or '/exit' to quit.")
        print("💡 The bot will remember the last few exchanges for context.")
        print("=" * 50)
        return True
    
    def process_user_input(self, user_input):
        """
        Process user input and return appropriate response.
        
        Args:
            user_input (str): User's input message
            
        Returns:
            str: Bot's response or None for commands
        """
        user_input = user_input.strip()
        
        # Handle special commands
        if user_input.lower() in ['/exit', '/quit', 'exit', 'quit']:
            return None
        
        if user_input.lower() in ['/clear', '/reset']:
            self.memory.clear_history()
            return "🔄 Conversation history cleared!"
        
        if user_input.lower() in ['/history', '/memory']:
            self.memory.display_history()
            summary = self.memory.get_history_summary()
            return f"📊 Memory: {summary['memory_usage']} turns stored"
        
        if user_input.lower() == '/help':
            return self.get_help_text()
        
        if not user_input:
            return "Please enter a message or type '/help' for commands."
        
        # Generate bot response
        try:
            # Create context-aware prompt
            context_prompt = self.memory.get_simple_context(user_input)
            
            # Generate response
            bot_response = self.model_loader.generate_response(
                context_prompt,
                **self.generation_params
            )
            
            # Clean up response
            bot_response = self.clean_response(bot_response, user_input)
            
            # Add to memory
            self.memory.add_exchange(user_input, bot_response)
            
            return bot_response
            
        except Exception as e:
            return f"Sorry, I encountered an error: {str(e)}"
    
    def clean_response(self, response, user_input):
        """
        Clean and format the bot's response.
        
        Args:
            response (str): Raw response from model
            user_input (str): Original user input
            
        Returns:
            str: Cleaned response
        """
        if not response:
            return "I'm not sure how to respond to that."
        
        # Remove common artifacts
        response = response.replace("Q:", "").replace("A:", "")
        response = response.replace("Human:", "").replace("Assistant:", "")
        
        # Remove repeated user input
        if user_input.lower() in response.lower():
            response = response.replace(user_input, "").strip()
        
        # Ensure proper capitalization
        if response and not response[0].isupper():
            response = response.capitalize()
        
        # Limit response length for better UX
        if len(response) > 200:
            sentences = response.split('.')
            if len(sentences) > 1:
                response = '. '.join(sentences[:2]) + '.'
        
        return response.strip() if response.strip() else "I understand, but I'm not sure how to respond."
    
    def get_help_text(self):
        """Return help text with available commands."""
        return """
Available commands:
• /exit or /quit - Exit the chatbot
• /clear or /reset - Clear conversation history
• /history or /memory - Show conversation history
• /help - Show this help message

Just type naturally to chat with the bot!
        """.strip()
    
    def run(self):
        """
        Main chat loop. Handles user interaction until exit.
        """
        if not self.initialize():
            return
        
        self.is_running = True
        
        try:
            while self.is_running:
                # Get user input
                try:
                    user_input = input("\n👤 You: ").strip()
                except (KeyboardInterrupt, EOFError):
                    break
                
                if not user_input:
                    continue
                
                # Process input and get response
                response = self.process_user_input(user_input)
                
                if response is None:  # Exit command
                    break
                
                # Display bot response
                print(f"🤖 Bot: {response}")
        
        except KeyboardInterrupt:
            print("\n\nInterrupted by user.")
        except Exception as e:
            print(f"\nUnexpected error: {e}")
        finally:
            self.shutdown()
    
    def shutdown(self):
        """Gracefully shutdown the chatbot."""
        print("\n" + "=" * 50)
        print("🚀 Thanks for chatting! Goodbye!")
        
        # Display session summary
        summary = self.memory.get_history_summary()
        if summary['total_turns'] > 0:
            print(f"📊 Session summary: {summary['total_turns']} turns, "
                  f"{summary['stored_exchanges']} exchanges in memory")
        
        print("=" * 50)
        self.is_running = False


def main():
    """Main entry point for the chat interface."""
    chatbot = ChatInterface()
    chatbot.run()


if __name__ == "__main__":
    main()