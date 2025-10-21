/**
 * Chatbot Interface for EduReform AI
 * Handles chat UI interactions, streaming text effects, and AI mentor mode
 */

class EduReformChatbot {
    constructor() {
        this.chatWindow = null;
        this.chatMessages = null;
        this.chatInput = null;
        this.chatButton = null;
        this.isOpen = false;
        this.isTyping = false;
        this.mentorMode = true;
        this.currentTopic = null;
        this.questionQueue = [];
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    /**
     * Initialize chatbot components and event listeners
     */
    init() {
        this.setupElements();
        this.setupEventListeners();
        this.startMentorMode();
        
        console.log('EduReform Chatbot initialized');
    }

    /**
     * Setup DOM elements
     */
    setupElements() {
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatButton = document.getElementById('chatButton');

        // Create chat window if it doesn't exist
        if (!this.chatWindow) {
            this.createChatWindow();
        }

        // Ensure all elements are available
        this.chatWindow = document.getElementById('chatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatButton = document.getElementById('chatButton');
    }

    /**
     * Create chat window HTML structure
     */
    createChatWindow() {
        const chatHTML = `
            <div id="chatWindow" class="chat-window">
                <div class="chat-header">
                    <h4>AI Mentor</h4>
                    <button class="modal-close" onclick="toggleChat()">&times;</button>
                </div>
                <div id="chatMessages" class="chat-messages">
                    <div class="chat-message ai">
                        Hello! I'm your AI mentor. I'm here to help you explore topics through questions and critical thinking. What would you like to learn about today?
                    </div>
                </div>
                <div class="chat-input">
                    <input type="text" id="chatInput" placeholder="Ask me anything...">
                    <button onclick="sendMessage()">Send</button>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', chatHTML);
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Enter key to send message
        if (this.chatInput) {
            this.chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    this.sendMessage();
                }
            });

            // Focus input when chat opens
            this.chatInput.addEventListener('focus', () => {
                this.scrollToBottom();
            });
        }

        // Auto-resize chat input
        if (this.chatInput) {
            this.chatInput.addEventListener('input', (e) => {
                e.target.style.height = 'auto';
                e.target.style.height = e.target.scrollHeight + 'px';
            });
        }
    }

    /**
     * Toggle chat window visibility
     */
    toggleChat() {
        if (!this.chatWindow) return;

        this.isOpen = !this.isOpen;
        
        if (this.isOpen) {
            this.chatWindow.classList.add('active');
            this.chatButton?.classList.add('active');
            
            // Focus input after animation
            setTimeout(() => {
                this.chatInput?.focus();
                this.scrollToBottom();
            }, 300);
            
            // Send probing question if mentor mode is active
            if (this.mentorMode && this.shouldAskQuestion()) {
                setTimeout(() => this.askMentorQuestion(), 1000);
            }
        } else {
            this.chatWindow.classList.remove('active');
            this.chatButton?.classList.remove('active');
        }
    }

    /**
     * Send user message
     */
    async sendMessage() {
        const input = this.chatInput;
        if (!input) return;

        const message = input.value.trim();
        if (!message) return;

        // Clear input
        input.value = '';
        input.style.height = 'auto';

        // Add user message to chat
        this.addMessage(message, 'user');

        // Show typing indicator
        this.showTypingIndicator();

        try {
            // Get AI response
            const userProfile = this.getUserProfile();
            const options = {
                userProfile,
                currentTopic: this.currentTopic,
                temperature: 0.7
            };

            const response = await geminiAPI.sendMessage(message, options);
            
            // Remove typing indicator
            this.removeTypingIndicator();
            
            // Add AI response with streaming effect
            await this.addAIMessageWithStreaming(response);
            
            // Analyze response for learning insights
            this.analyzeUserResponse(message);
            
            // Queue follow-up question if in mentor mode
            if (this.mentorMode) {
                this.queueFollowUpQuestion(message, response);
            }

        } catch (error) {
            console.error('Chat error:', error);
            this.removeTypingIndicator();
            this.addMessage('I apologize, but I\'m having trouble processing your message right now. Could you try rephrasing your question?', 'ai');
        }

        this.scrollToBottom();
    }

    /**
     * Add message to chat
     * @param {string} message - Message text
     * @param {string} sender - 'user' or 'ai'
     */
    addMessage(message, sender) {
        if (!this.chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = `chat-message ${sender}`;
        messageElement.textContent = message;
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();

        // Add fade-in animation
        messageElement.style.opacity = '0';
        messageElement.style.transform = 'translateY(10px)';
        
        setTimeout(() => {
            messageElement.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            messageElement.style.opacity = '1';
            messageElement.style.transform = 'translateY(0)';
        }, 100);
    }

    /**
     * Add AI message with streaming text effect
     * @param {string} message - AI message text
     */
    async addAIMessageWithStreaming(message) {
        if (!this.chatMessages) return;

        const messageElement = document.createElement('div');
        messageElement.className = 'chat-message ai';
        messageElement.textContent = '';
        
        this.chatMessages.appendChild(messageElement);
        this.scrollToBottom();

        // Streaming effect
        let index = 0;
        const streamingSpeed = 30; // milliseconds per character

        return new Promise((resolve) => {
            const streamText = () => {
                if (index < message.length) {
                    messageElement.textContent += message.charAt(index);
                    index++;
                    this.scrollToBottom();
                    setTimeout(streamText, streamingSpeed);
                } else {
                    resolve();
                }
            };
            
            streamText();
        });
    }

    /**
     * Show typing indicator
     */
    showTypingIndicator() {
        if (!this.chatMessages) return;

        const typingElement = document.createElement('div');
        typingElement.className = 'chat-message ai typing-indicator';
        typingElement.innerHTML = `
            <div class="typing-dots">
                <span></span>
                <span></span>
                <span></span>
            </div>
        `;
        typingElement.id = 'typingIndicator';

        this.chatMessages.appendChild(typingElement);
        this.scrollToBottom();

        // Add typing animation CSS if not present
        if (!document.getElementById('typingAnimationStyle')) {
            const style = document.createElement('style');
            style.id = 'typingAnimationStyle';
            style.textContent = `
                .typing-indicator {
                    padding: 1rem !important;
                }
                .typing-dots {
                    display: flex;
                    gap: 4px;
                    align-items: center;
                }
                .typing-dots span {
                    width: 8px;
                    height: 8px;
                    background: rgba(255, 255, 255, 0.6);
                    border-radius: 50%;
                    animation: typingPulse 1.4s infinite;
                }
                .typing-dots span:nth-child(2) {
                    animation-delay: 0.2s;
                }
                .typing-dots span:nth-child(3) {
                    animation-delay: 0.4s;
                }
                @keyframes typingPulse {
                    0%, 60%, 100% { opacity: 0.3; transform: scale(1); }
                    30% { opacity: 1; transform: scale(1.2); }
                }
            `;
            document.head.appendChild(style);
        }
    }

    /**
     * Remove typing indicator
     */
    removeTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    /**
     * Scroll chat to bottom
     */
    scrollToBottom() {
        if (this.chatMessages) {
            setTimeout(() => {
                this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
            }, 100);
        }
    }

    /**
     * Start mentor mode - proactive questioning
     */
    startMentorMode() {
        this.mentorMode = true;
        
        // Periodically check if we should ask a probing question
        setInterval(() => {
            if (this.mentorMode && this.isOpen && this.shouldAskQuestion()) {
                this.askMentorQuestion();
            }
        }, 30000); // Every 30 seconds
    }

    /**
     * Determine if we should ask a mentor question
     * @returns {boolean}
     */
    shouldAskQuestion() {
        if (!this.chatMessages) return false;

        const messages = this.chatMessages.children;
        if (messages.length < 2) return false;

        const lastMessage = messages[messages.length - 1];
        const isLastMessageUser = lastMessage.classList.contains('user');
        
        // Don't ask if we just responded
        if (!isLastMessageUser) return false;

        // Ask if it's been a while since last interaction
        const timeSinceLastMessage = Date.now() - this.getLastMessageTime();
        return timeSinceLastMessage > 20000; // 20 seconds
    }

    /**
     * Ask a probing mentor question
     */
    async askMentorQuestion() {
        if (this.isTyping || this.questionQueue.length === 0) return;

        const question = this.questionQueue.shift();
        
        setTimeout(() => {
            this.addMessage(question, 'ai');
        }, 1000);
    }

    /**
     * Queue a follow-up question based on the conversation
     * @param {string} userMessage - User's message
     * @param {string} aiResponse - AI's response
     */
    queueFollowUpQuestion(userMessage, aiResponse) {
        const questions = [
            "What made you think about this topic in that way?",
            "Can you give me an example from your own experience?",
            "What would happen if we changed one key element here?",
            "How does this connect to something else you've learned?",
            "What questions does this raise for you?",
            "If you had to explain this to a friend, how would you do it?",
            "What evidence would support or challenge this idea?",
            "Can you think of an alternative perspective on this?"
        ];

        // Select question based on user message keywords
        let selectedQuestion;
        if (userMessage.toLowerCase().includes('because') || userMessage.toLowerCase().includes('reason')) {
            selectedQuestion = "What other factors might also play a role here?";
        } else if (userMessage.toLowerCase().includes('think') || userMessage.toLowerCase().includes('believe')) {
            selectedQuestion = "What experiences or evidence led you to that conclusion?";
        } else {
            selectedQuestion = questions[Math.floor(Math.random() * questions.length)];
        }

        // Queue question for later
        setTimeout(() => {
            this.questionQueue.push(selectedQuestion);
        }, 15000); // Wait 15 seconds before queueing
    }

    /**
     * Analyze user response for learning insights
     * @param {string} response - User's response
     */
    async analyzeUserResponse(response) {
        try {
            const analysis = await geminiAPI.analyzeResponse(response, this.currentTopic || 'general discussion');
            
            if (analysis) {
                // Store analysis for dashboard insights
                this.storelearningInsight(analysis);
            }
        } catch (error) {
            console.error('Error analyzing user response:', error);
        }
    }

    /**
     * Store learning insight for dashboard
     * @param {Object} insight - Learning analysis
     */
    storelearningInsight(insight) {
        const insights = JSON.parse(localStorage.getItem('eduReformInsights') || '[]');
        insights.push({
            timestamp: new Date().toISOString(),
            insight: insight,
            topic: this.currentTopic
        });

        // Keep only last 20 insights
        if (insights.length > 20) {
            insights.splice(0, insights.length - 20);
        }

        localStorage.setItem('eduReformInsights', JSON.stringify(insights));
    }

    /**
     * Get user profile for AI context
     * @returns {Object} - User profile data
     */
    getUserProfile() {
        // Always return demo student profile
        return {
            name: 'Student',
            type: 'student',
            skills: {
                criticalThinking: 85,
                creativity: 72,
                reasoning: 91,
                communication: 68
            },
            interests: ['History', 'Science', 'Technology'],
            learningStyle: 'visual'
        };
    }

    /**
     * Get timestamp of last message
     * @returns {number} - Timestamp
     */
    getLastMessageTime() {
        // In a real app, this would track actual message times
        // For now, return current time
        return Date.now();
    }

    /**
     * Set current learning topic
     * @param {string} topic - Current topic
     */
    setCurrentTopic(topic) {
        this.currentTopic = topic;
        
        // Add contextual welcome message
        if (topic) {
            const welcomeMessage = `I see you're exploring ${topic}. What aspects of this topic interest you most?`;
            setTimeout(() => {
                this.addMessage(welcomeMessage, 'ai');
            }, 1000);
        }
    }

    /**
     * Toggle mentor mode
     * @param {boolean} enabled - Enable/disable mentor mode
     */
    toggleMentorMode(enabled) {
        this.mentorMode = enabled;
        
        const statusMessage = enabled 
            ? "Mentor mode activated. I'll guide you with probing questions to deepen your understanding."
            : "Mentor mode deactivated. I'll respond to your questions directly.";
            
        this.addMessage(statusMessage, 'ai');
    }

    /**
     * Clear chat history
     */
    clearChat() {
        if (this.chatMessages) {
            this.chatMessages.innerHTML = `
                <div class="chat-message ai">
                    Chat cleared. How can I help you learn something new?
                </div>
            `;
        }
        
        // Clear API conversation history
        if (window.geminiAPI) {
            geminiAPI.clearHistory();
        }
        
        this.questionQueue = [];
    }

    /**
     * Export chat history
     * @returns {string} - Chat history as text
     */
    exportChatHistory() {
        if (!this.chatMessages) return '';

        const messages = Array.from(this.chatMessages.children);
        return messages.map(msg => {
            const sender = msg.classList.contains('user') ? 'You' : 'AI Mentor';
            return `${sender}: ${msg.textContent}`;
        }).join('\n\n');
    }

    /**
     * Get chat statistics
     * @returns {Object} - Chat statistics
     */
    getChatStats() {
        if (!this.chatMessages) return { userMessages: 0, aiMessages: 0, totalMessages: 0 };

        const messages = Array.from(this.chatMessages.children);
        const userMessages = messages.filter(msg => msg.classList.contains('user')).length;
        const aiMessages = messages.filter(msg => msg.classList.contains('ai')).length;

        return {
            userMessages,
            aiMessages,
            totalMessages: messages.length,
            mentorMode: this.mentorMode
        };
    }
}

// Global functions for HTML onclick events
function toggleChat() {
    if (window.eduReformChatbot) {
        window.eduReformChatbot.toggleChat();
    }
}

function sendMessage() {
    if (window.eduReformChatbot) {
        window.eduReformChatbot.sendMessage();
    }
}

function clearChat() {
    if (window.eduReformChatbot) {
        window.eduReformChatbot.clearChat();
    }
}

function toggleMentorMode() {
    if (window.eduReformChatbot) {
        const currentMode = window.eduReformChatbot.mentorMode;
        window.eduReformChatbot.toggleMentorMode(!currentMode);
    }
}

// Initialize chatbot when script loads
window.eduReformChatbot = new EduReformChatbot();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = EduReformChatbot;
}