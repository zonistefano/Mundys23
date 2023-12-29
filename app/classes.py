import json

class Message:

    def __init__(self, is_user, content):
        self.is_user = is_user
        self.content = content
    
    def chat(self):
        return {
            'role': 'user' if self.is_user else 'assistant',
            'content': self.content
        }

    def get_card_style(self):
        if self.is_user:
            return ' background-color: #91d3f7; margin-left: auto; margin-right: 0;'
        else:
            return ''