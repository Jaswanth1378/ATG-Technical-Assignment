"""
main.py - Entry point for the Hugging Face Local Chatbot

This is the main entry point that initializes and runs the chatbot
with all its components: model loading, memory management, and CLI interface.
"""

from interface import ChatInterface
import sys


def main():
    """
    Main function to start the Hugging Face chatbot.
    """
    print("🚀 Starting Hugging Face Local Chatbot")
    print("Using DistilGPT2 for lightweight, CPU-friendly text generation")
    print()
    
    try:
        # Initialize and run chatbot
        chatbot = ChatInterface(
            model_name="distilgpt2",
            memory_window=4
        )
        chatbot.run()
    
    except KeyboardInterrupt:
        print("\n\n👋 Chatbot interrupted by user. Goodbye!")
    except Exception as e:
        print(f"\n❌ Fatal error: {e}")
        sys.exit(1)


if __name__ == "__main__":
    main()