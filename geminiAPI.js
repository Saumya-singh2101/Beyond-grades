/**
 * Gemini API Integration for EduReform AI
 * Handles real-time communication with Google's Gemini AI
 */

class GeminiAPI {
    constructor() {
        // API Configuration
        this.apiKey = 'AIzaSyARn9Fnjei6ySAvn2Vfsb4I3sMXF1LrNx4'; // Demo key - replace with your actual API key for full functionality
        this.baseURL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';
        
        // Mentor personality and context
        this.systemContext = `You are an AI educational mentor for EduReform AI, a platform that transforms learning from rote memorization to active exploration and reasoning. Your role:

1. Ask probing questions to assess understanding
2. Adapt difficulty based on student responses
3. Focus on developing critical thinking and creativity
4. Identify reasoning gaps and guide students to fill them
5. Encourage exploration of cause-effect relationships
6. Suggest alternative scenarios and perspectives
7. Be encouraging but challenge assumptions
8. Provide personalized insights based on learning patterns

Keep responses concise but thought-provoking. Always end with a question to continue the learning dialogue.`;

        // Conversation history
        this.conversationHistory = [];
        
        // Error tracking
        this.lastError = null;
        this.isProcessing = false;
    }

    /**
     * Send message to Gemini API and get response
     * @param {string} userMessage - The user's message
     * @param {Object} options - Additional options for the request
     * @returns {Promise<string>} - The AI's response
     */
    async sendMessage(userMessage, options = {}) {
        if (this.isProcessing) {
            throw new Error('Another request is already being processed. Please wait.');
        }

        this.isProcessing = true;
        
        try {
            // Validate API key
            if (!this.apiKey || this.apiKey === 'YOUR_GEMINI_API_KEY_HERE') {
                throw new Error('Gemini API key not configured. Please set your API key in geminiAPI.js');
            }

            // Add user message to history
            this.conversationHistory.push({
                role: 'user',
                content: userMessage,
                timestamp: new Date().toISOString()
            });

            // Prepare the request payload
            const payload = this.buildRequestPayload(userMessage, options);
            
            // Make API request
            const response = await this.makeAPIRequest(payload);
            
            // Process response
            const aiResponse = this.processResponse(response);
            
            // Add AI response to history
            this.conversationHistory.push({
                role: 'assistant',
                content: aiResponse,
                timestamp: new Date().toISOString()
            });

            this.lastError = null;
            return aiResponse;

        } catch (error) {
            this.lastError = error.message;
            console.error('Gemini API Error:', error);
            
            // Return fallback response
            return this.getFallbackResponse(userMessage);
        } finally {
            this.isProcessing = false;
        }
    }

    /**
     * Build the request payload for Gemini API
     * @param {string} userMessage - The user's message
     * @param {Object} options - Additional options
     * @returns {Object} - Formatted request payload
     */
    buildRequestPayload(userMessage, options) {
        const contextualMessage = this.buildContextualMessage(userMessage, options);
        
        return {
            contents: [{
                parts: [{
                    text: contextualMessage
                }]
            }],
            generationConfig: {
                temperature: options.temperature || 0.7,
                topP: options.topP || 0.8,
                topK: options.topK || 40,
                maxOutputTokens: options.maxTokens || 500,
                stopSequences: options.stopSequences || []
            },
            safetySettings: [
                {
                    category: 'HARM_CATEGORY_HARASSMENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                    category: 'HARM_CATEGORY_HATE_SPEECH',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                    category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                },
                {
                    category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
                    threshold: 'BLOCK_MEDIUM_AND_ABOVE'
                }
            ]
        };
    }

    /**
     * Build contextual message with system prompt and conversation history
     * @param {string} userMessage - Current user message
     * @param {Object} options - Additional context options
     * @returns {string} - Complete contextual message
     */
    buildContextualMessage(userMessage, options) {
        let contextualMessage = this.systemContext + '\n\n';
        
        // Add user context if available
        if (options.userProfile) {
            contextualMessage += `Student Profile: ${JSON.stringify(options.userProfile)}\n\n`;
        }

        // Add recent conversation history (last 6 messages to stay within token limits)
        const recentHistory = this.conversationHistory.slice(-6);
        if (recentHistory.length > 0) {
            contextualMessage += 'Recent Conversation:\n';
            recentHistory.forEach(msg => {
                const role = msg.role === 'user' ? 'Student' : 'Mentor';
                contextualMessage += `${role}: ${msg.content}\n`;
            });
            contextualMessage += '\n';
        }

        // Add current learning context
        if (options.currentTopic) {
            contextualMessage += `Current Topic: ${options.currentTopic}\n\n`;
        }

        // Add the current user message
        contextualMessage += `Student: ${userMessage}\n\nMentor:`;

        return contextualMessage;
    }

    /**
     * Make the actual API request to Gemini
     * @param {Object} payload - Request payload
     * @returns {Promise<Object>} - API response
     */
    async makeAPIRequest(payload) {
        const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(`API request failed: ${response.status} ${response.statusText}. ${errorData.error?.message || ''}`);
        }

        return await response.json();
    }

    /**
     * Process the API response and extract the text
     * @param {Object} response - Raw API response
     * @returns {string} - Processed AI response text
     */
    processResponse(response) {
        if (!response.candidates || response.candidates.length === 0) {
            throw new Error('No response candidates received from API');
        }

        const candidate = response.candidates[0];
        
        if (candidate.finishReason === 'SAFETY') {
            throw new Error('Response was blocked due to safety filters');
        }

        if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0) {
            throw new Error('No content in API response');
        }

        return candidate.content.parts[0].text.trim();
    }

    /**
     * Get fallback response when API fails
     * @param {string} userMessage - Original user message
     * @returns {string} - Fallback response
     */
    getFallbackResponse(userMessage) {
        const fallbackResponses = [
            "I'm having trouble connecting right now, but let me ask you this: What do you think is the most important aspect of what you just shared?",
            "While I process that, can you tell me what led you to that conclusion? What evidence supports your thinking?",
            "That's interesting! Even though I'm experiencing some technical difficulties, I'd love to hear more about your reasoning process.",
            "Let me think about that while my systems recover. In the meantime, what questions does this topic raise for you?",
            "I'm experiencing some connectivity issues, but your question is thought-provoking. What alternative perspectives might exist on this topic?"
        ];

        const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        // Add context-aware fallback based on message keywords
        if (userMessage.toLowerCase().includes('help')) {
            return "I want to help you explore this topic! While I reconnect, think about: What specific aspect challenges you the most?";
        } else if (userMessage.toLowerCase().includes('why') || userMessage.toLowerCase().includes('how')) {
            return "Great question! While my systems restart, consider: What factors might influence the answer to your question?";
        } else if (userMessage.toLowerCase().includes('what')) {
            return "That's a thoughtful inquiry. As I recover from technical issues, reflect on: What do you already know that might relate to this?";
        }

        return randomResponse;
    }

    /**
     * Generate mentor questions based on student's skill level
     * @param {Object} skillProfile - Student's skill assessment
     * @param {string} topic - Current learning topic
     * @returns {Promise<Array>} - Array of personalized questions
     */
    async generateMentorQuestions(skillProfile, topic) {
        try {
            const options = {
                userProfile: skillProfile,
                currentTopic: topic,
                temperature: 0.8
            };

            const prompt = `Generate 3 probing questions for this topic that match the student's skill level. Questions should encourage critical thinking and reasoning.`;
            
            const response = await this.sendMessage(prompt, options);
            
            // Parse response into questions array
            const questions = response.split('\n')
                .filter(line => line.trim().length > 0 && (line.includes('?') || line.match(/^\d/)))
                .map(q => q.replace(/^\d+\.?\s*/, '').trim())
                .slice(0, 3);

            return questions.length > 0 ? questions : [
                'What patterns do you notice in this topic?',
                'How might this connect to something you already know?',
                'What would happen if we changed one key element here?'
            ];

        } catch (error) {
            console.error('Error generating mentor questions:', error);
            return [
                'What interests you most about this topic?',
                'What questions does this raise for you?',
                'How would you explain this to someone else?'
            ];
        }
    }

    /**
     * Analyze student response for learning insights
     * @param {string} response - Student's response
     * @param {string} context - Learning context
     * @returns {Promise<Object>} - Analysis results
     */
    async analyzeResponse(response, context) {
        try {
            const analysisPrompt = `Analyze this student response for:
1. Depth of reasoning
2. Critical thinking level
3. Areas for improvement
4. Suggested next steps

Student response: "${response}"
Context: ${context}

Provide a brief analysis in JSON format.`;

            const analysis = await this.sendMessage(analysisPrompt, { temperature: 0.3 });
            
            // Try to parse as JSON, fallback to text analysis
            try {
                return JSON.parse(analysis);
            } catch {
                return {
                    reasoning_depth: 'moderate',
                    critical_thinking: 'developing',
                    improvements: ['Encourage more specific examples'],
                    next_steps: ['Ask follow-up questions']
                };
            }

        } catch (error) {
            console.error('Error analyzing response:', error);
            return null;
        }
    }

    /**
     * Get conversation history
     * @returns {Array} - Conversation history
     */
    getConversationHistory() {
        return [...this.conversationHistory];
    }

    /**
     * Clear conversation history
     */
    clearHistory() {
        this.conversationHistory = [];
    }

    /**
     * Get last error message
     * @returns {string|null} - Last error message
     */
    getLastError() {
        return this.lastError;
    }

    /**
     * Check if API is currently processing
     * @returns {boolean} - Processing status
     */
    isProcessingRequest() {
        return this.isProcessing;
    }

    /**
     * Test API connection
     * @returns {Promise<boolean>} - Connection status
     */
    async testConnection() {
        try {
            const testResponse = await this.sendMessage('Hello, can you confirm the connection is working?', { maxTokens: 50 });
            return testResponse.length > 0;
        } catch (error) {
            console.error('Connection test failed:', error);
            return false;
        }
    }
}

// Create and export global instance
const geminiAPI = new GeminiAPI();

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeminiAPI;
}

// Make available globally
window.GeminiAPI = GeminiAPI;
window.geminiAPI = geminiAPI;