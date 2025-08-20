"""
chat_memory.py - Conversation memory management with sliding window buffer

This module implements a sliding window memory system to maintain
conversation context for coherent multi-turn dialogue.
"""


class ChatMemory:
    """
    Manages conversation history using a sliding window buffer.
    Maintains the last N turns of conversation for context.
    """
    
    def __init__(self, window_size=4):
        """
        Initialize the chat memory with specified window size.
        
        Args:
            window_size (int): Number of conversation turns to remember (default: 4)
        """
        self.window_size = window_size
        self.conversation_history = []
        self.turn_count = 0
    
    def add_exchange(self, user_input, bot_response):
        """
        Add a user-bot exchange to the conversation history.
        
        Args:
            user_input (str): User's input message
            bot_response (str): Bot's response message
        """
        exchange = {
            'turn': self.turn_count,
            'user': user_input.strip(),
            'bot': bot_response.strip()
        }
        
        self.conversation_history.append(exchange)
        self.turn_count += 1
        
        # Apply sliding window - keep only the last N exchanges
        if len(self.conversation_history) > self.window_size:
            self.conversation_history = self.conversation_history[-self.window_size:]
    
    def get_context_prompt(self, current_user_input):
        """
        Build a context-aware prompt including recent conversation history.
        
        Args:
            current_user_input (str): Current user input
            
        Returns:
            str: Formatted prompt with conversation context
        """
        if not self.conversation_history:
            return f"Human: {current_user_input}\nAssistant:"
        
        # Build conversation context
        context_lines = []
        
        for exchange in self.conversation_history:
            context_lines.append(f"Human: {exchange['user']}")
            context_lines.append(f"Assistant: {exchange['bot']}")
        
        # Add current user input
        context_lines.append(f"Human: {current_user_input}")
        context_lines.append("Assistant:")
        
        return "\n".join(context_lines)
    
    def get_simple_context(self, current_user_input):
        """
        Get a simpler context format for better model compatibility.
        
        Args:
            current_user_input (str): Current user input
            
        Returns:
            str: Simple context prompt
        """
        if not self.conversation_history:
            return current_user_input
        
        # Get last 2 exchanges for context
        recent_history = self.conversation_history[-2:]
        context_parts = []
        
        for exchange in recent_history:
            context_parts.append(f"Q: {exchange['user']} A: {exchange['bot']}")
        
        context_parts.append(f"Q: {current_user_input} A:")
        return " ".join(context_parts)
    
    def clear_history(self):
        """Clear all conversation history."""
        self.conversation_history = []
        self.turn_count = 0
    
    def get_history_summary(self):
        """
        Get a summary of the conversation history.
        
        Returns:
            dict: Summary information about the conversation
        """
        return {
            'total_turns': self.turn_count,
            'stored_exchanges': len(self.conversation_history),
            'window_size': self.window_size,
            'memory_usage': f"{len(self.conversation_history)}/{self.window_size}"
        }
    
    def display_history(self):
        """Display the current conversation history in a readable format."""
        if not self.conversation_history:
            print("No conversation history.")
            return
        
        print("\n--- Conversation History ---")
        for i, exchange in enumerate(self.conversation_history, 1):
            print(f"Turn {exchange['turn'] + 1}:")
            print(f"  User: {exchange['user']}")
            print(f"  Bot:  {exchange['bot']}")
            if i < len(self.conversation_history):
                print()
        print("--- End History ---\n")