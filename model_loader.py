"""
model_loader.py - Hugging Face model and tokenizer loading module

This module handles the loading and management of the DistilGPT2 model
for text generation in a lightweight, CPU-optimized setup.
"""

from transformers import AutoModelForCausalLM, AutoTokenizer, pipeline
import torch


class ModelLoader:
    """
    Handles loading and managing the DistilGPT2 model for text generation.
    Optimized for CPU inference with reasonable generation parameters.
    """
    
    def __init__(self, model_name="distilgpt2"):
        """
        Initialize the model loader with specified model name.
        
        Args:
            model_name (str): Hugging Face model identifier (default: distilgpt2)
        """
        self.model_name = model_name
        self.tokenizer = None
        self.model = None
        self.generator = None
        
    def load_model(self):
        """
        Load the tokenizer and model from Hugging Face.
        Sets up the text generation pipeline for CPU inference.
        """
        print(f"Loading {self.model_name} model...")
        
        try:
            # Load tokenizer
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
            
            # Add padding token if not present
            if self.tokenizer.pad_token is None:
                self.tokenizer.pad_token = self.tokenizer.eos_token
            
            # Load model with CPU optimization
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_name,
                torch_dtype=torch.float32,  # Use float32 for CPU
                device_map="cpu"
            )
            
            # Create text generation pipeline
            self.generator = pipeline(
                "text-generation",
                model=self.model,
                tokenizer=self.tokenizer,
                device=-1,  # Use CPU
                framework="pt"
            )
            
            print("✓ Model loaded successfully!")
            return True
            
        except Exception as e:
            print(f"✗ Error loading model: {e}")
            return False
    
    def generate_response(self, prompt, max_length=150, temperature=0.8, num_return_sequences=1):
        """
        Generate a response using the loaded model.
        
        Args:
            prompt (str): Input text prompt
            max_length (int): Maximum length of generated text
            temperature (float): Sampling temperature for randomness
            num_return_sequences (int): Number of sequences to generate
            
        Returns:
            str: Generated response text
        """
        if not self.generator:
            return "Model not loaded. Please load the model first."
        
        try:
            # Generate response
            outputs = self.generator(
                prompt,
                max_length=max_length,
                temperature=temperature,
                num_return_sequences=num_return_sequences,
                do_sample=True,
                pad_token_id=self.tokenizer.eos_token_id,
                repetition_penalty=1.1,
                no_repeat_ngram_size=2,
                early_stopping=True
            )
            
            # Extract generated text and remove the prompt
            generated_text = outputs[0]['generated_text']
            response = generated_text[len(prompt):].strip()
            
            # Clean up response (remove incomplete sentences at the end)
            if response:
                sentences = response.split('.')
                if len(sentences) > 1 and sentences[-1].strip() == '':
                    sentences = sentences[:-1]
                if sentences and sentences[-1].strip():
                    # If last sentence seems incomplete, remove it
                    if len(sentences) > 1 and len(sentences[-1]) < 10:
                        sentences = sentences[:-1]
                response = '. '.join(sentences)
                if response and not response.endswith('.'):
                    response += '.'
            
            return response if response else "I'm not sure how to respond to that."
            
        except Exception as e:
            print(f"Error generating response: {e}")
            return "Sorry, I encountered an error generating a response."
    
    def is_loaded(self):
        """Check if the model is successfully loaded."""
        return self.generator is not None