const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs').promises;
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Check if OpenAI API key is available
    if (process.env.OPENAI_API_KEY) {
      const OpenAI = require('openai');
      const openai = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });

      const completion = await openai.chat.completions.create({
        messages: [
          {
            role: "system",
            content: "You are an AI learning mentor for an educational platform focused on skills-based and inquiry-driven learning. Help students explore concepts deeply, ask probing questions, and connect ideas across disciplines. Encourage critical thinking and real-world applications."
          },
          {
            role: "user",
            content: message
          }
        ],
        model: "gpt-3.5-turbo",
        max_tokens: 500,
        temperature: 0.7
      });

      res.json({
        response: completion.choices[0].message.content,
        source: 'openai'
      });
    } else {
      // Fallback responses when no API key is provided
      const fallbackResponses = [
        "That's an interesting question! Let me help you think about this differently. What do you think might be the underlying causes or connections here?",
        "I'd love to explore that concept with you. Can you tell me what you already know about this topic, and what aspects intrigue you most?",
        "Great thinking! This reminds me of similar patterns in other fields. How might this principle apply to real-world situations you've encountered?",
        "Let's dig deeper into this. What questions come to mind when you consider the 'why' behind what you're learning?",
        "That's a valuable insight. How might you test or verify this understanding? What evidence would support or challenge this idea?",
        "I notice you're exploring complex ideas. What connections can you draw between this concept and other subjects you've studied?",
        "Excellent curiosity! Instead of just accepting this information, what critical questions might a researcher ask about this topic?"
      ];
      
      const randomResponse = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
      
      res.json({
        response: randomResponse + " (Note: This is a demo response. For full AI capabilities, configure your OpenAI API key.)",
        source: 'fallback'
      });
    }
  } catch (error) {
    console.error('Chat API error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Sorry, I encountered an issue. Please try again.'
    });
  }
});

// Feedback submission endpoint
app.post('/api/feedback', async (req, res) => {
  try {
    const { feedback, rating, page } = req.body;
    
    const feedbackEntry = {
      id: Date.now().toString(),
      feedback,
      rating,
      page,
      timestamp: new Date().toISOString()
    };

    // Ensure data directory exists
    await fs.mkdir(path.join(__dirname, 'data'), { recursive: true });
    
    const feedbackPath = path.join(__dirname, 'data', 'feedback.json');
    let existingFeedback = [];
    
    try {
      const data = await fs.readFile(feedbackPath, 'utf8');
      existingFeedback = JSON.parse(data);
    } catch (error) {
      // File doesn't exist or is invalid, start with empty array
      existingFeedback = [];
    }
    
    existingFeedback.push(feedbackEntry);
    await fs.writeFile(feedbackPath, JSON.stringify(existingFeedback, null, 2));
    
    res.json({ success: true, message: 'Feedback submitted successfully' });
  } catch (error) {
    console.error('Feedback API error:', error);
    res.status(500).json({ error: 'Failed to submit feedback' });
  }
});

// Static files are served by the express.static middleware above
// Individual HTML files can be accessed directly: /index.html, /problem1.html, /problem2.html

app.listen(PORT, () => {
  console.log(`[NEON] Platform running at http://localhost:${PORT}`);
  console.log(`[HEALTH] Health check: http://localhost:${PORT}/api/health`);
  console.log(`[AI] Chat API: http://localhost:${PORT}/api/chat`);
});
