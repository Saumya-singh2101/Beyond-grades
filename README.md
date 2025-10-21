# EduReform AI - Interactive Learning Platform

A complete skill-based learning platform that transforms education from rote memorization to active exploration and reasoning-based learning.

## 🌟 Features

### Core Platform Features
- **AI Chatbot Integration** with Google Gemini API for real-time mentorship
- **Student Skill Map Dashboard** with dynamic progress tracking and career pathway suggestions
- **Interactive Learning Modules** with drag-and-drop timeline reconstruction and What-If scenario generation
- **Educator Analytics Panel** with student progress tracking, AI insights, and export functionality
- **Responsive Design** with glassmorphism UI and mobile-first approach

### Technical Features
- Pure HTML, CSS, and JavaScript (no frameworks)
- Real-time AI integration using fetch POST requests
- Dynamic DOM manipulation and interactive components
- Local storage for user authentication and progress tracking
- Professional glassmorphism design with smooth animations
- Fully responsive across all device sizes

## 📁 Project Structure

```
edureform-ai/
├── index.html          # Landing page with feature showcase
├── dashboard.html      # Student dashboard with skill visualization
├── learning.html       # Interactive learning modules
├── educator.html       # Educator analytics panel
├── styles.css          # Comprehensive CSS with glassmorphism design
├── app.js             # Core application logic and authentication
├── geminiAPI.js       # Gemini AI integration with error handling
├── chatbot.js         # Chatbot interface with streaming effects
└── README.md          # Project documentation
```

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Google Gemini API key (optional for full AI functionality)
- Local web server (recommended) or direct file access

### Installation

1. **Clone or download the project files**
   ```bash
   # If using Git
   git clone https://github.com/yourusername/edureform-ai.git
   cd edureform-ai
   
   # Or download and extract the ZIP file
   ```

2. **Set up Gemini API (Optional)**
   - Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Open `geminiAPI.js`
   - Replace `'YOUR_GEMINI_API_KEY_HERE'` with your actual API key:
     ```javascript
     this.apiKey = 'your_actual_api_key_here';
     ```

3. **Launch the application**
   
   **Option A: Using a local server (Recommended)**
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```
   Then open `http://localhost:8000` in your browser.
   
   **Option B: Direct file access**
   - Simply open `index.html` in your browser
   - Note: Some features may be limited due to CORS restrictions

## 🚀 Direct Access

The platform is now fully accessible without any login requirements:

- **Direct Access**: All features are immediately available
- **No Authentication**: Simply navigate between pages freely
- **Full Functionality**: All interactive features are enabled by default

## 🎯 Usage Guide

### For Students
1. **Navigate to Dashboard** to view your skill map and progress
2. **Access Interactive Learning** to reconstruct historical timelines
3. **Generate What-If Scenarios** to explore alternative outcomes
4. **Chat with AI Mentor** for personalized guidance and probing questions
5. **Track Your Progress** across multiple learning modules

### For Educators
1. **Visit Educator Panel** for comprehensive student analytics
2. **View Student Progress** with real-time tracking
3. **Access AI Insights** for teaching recommendations
4. **Export Data** for comprehensive reports
5. **Monitor Class Performance** across multiple skill areas

### Key Interactive Features

#### Timeline Learning Module
- **Drag and Drop**: Reconstruct historical events in chronological order
- **Difficulty Levels**: Easy (6 events), Medium (8 events), Hard (10 events)
- **Multiple Topics**: WWII, Industrial Revolution, Scientific Revolution, Renaissance
- **Hints System**: AI-powered assistance when students get stuck
- **Progress Tracking**: Real-time feedback on correctness

#### What-If Scenario Generator
- **Event Selection**: Choose any historical event to modify
- **Change Types**: Prevent, delay, advance, or alter events
- **Perspective Options**: Global, economic, social, or political analysis
- **AI Analysis**: Gemini-powered counterfactual reasoning

#### AI Mentor Chatbot
- **Probing Questions**: AI asks follow-up questions to deepen understanding
- **Streaming Text**: Real-time typing effect for engaging conversations
- **Context Awareness**: Remembers conversation history and current topics
- **Mentor Mode**: Automatically guides students with thoughtful questions

## 🎨 Design Philosophy

### Glassmorphism UI
- **Transparent Elements** with backdrop blur effects
- **Soft Gradients** for professional aesthetic
- **Subtle Animations** and micro-interactions
- **Glass-like Cards** with proper depth and shadows

### Educational Approach
- **Skill-Based Learning** over memorization
- **Active Reconstruction** of knowledge
- **Critical Thinking** emphasis
- **Alternative Scenario Exploration**
- **Personalized AI Mentorship**

## 🛠️ Customization

### Adding New Learning Modules
1. Open `learning.html`
2. Add new module data to the `historicalEvents` object
3. Include events with proper difficulty ratings
4. Update module selector cards

### Modifying AI Behavior
1. Open `geminiAPI.js`
2. Adjust the `systemContext` for different AI personality
3. Modify temperature and other generation parameters
4. Customize fallback responses

### Styling Changes
1. Open `styles.css`
2. Modify CSS custom properties (variables) at the top
3. Adjust glassmorphism effects, gradients, and animations
4. Update responsive breakpoints as needed

## 📊 Analytics & Progress Tracking

### Student Metrics
- **Skill Development**: Critical thinking, creativity, reasoning, communication
- **Module Progress**: Completion rates and accuracy scores
- **Engagement Tracking**: Time spent, activities completed
- **AI Interaction**: Chat statistics and mentor engagement

### Educator Insights
- **Class Overview**: Total students, average progress, completion rates
- **Individual Tracking**: Detailed student progress with skill breakdowns
- **AI Recommendations**: Teaching suggestions based on student performance
- **Export Functionality**: JSON data export for external analysis

## 🔧 Technical Implementation

### Glassmorphism CSS
```css
.glass-card {
    background: rgba(255, 255, 255, 0.1);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(31, 38, 135, 0.37);
}
```

### Gemini API Integration
```javascript
const response = await fetch(`${this.baseURL}?key=${this.apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
});
```

### Drag and Drop System
```javascript
function handleDrop(e) {
    e.preventDefault();
    // Custom drop logic for timeline reconstruction
    // Validates correct chronological placement
    // Provides real-time feedback
}
```

## 📱 Responsive Design

- **Mobile-First Approach**: Optimized for smartphones and tablets
- **Flexible Grid Layouts**: Adapts to any screen size
- **Touch-Friendly Interactions**: Large touch targets and smooth gestures
- **Optimized Performance**: Efficient animations and resource usage

## 🧪 Testing Features

### Student Learning Flow
1. Select a learning module (e.g., WWII Timeline)
2. Drag events from the pool to timeline positions
3. Use hints if needed for guidance
4. Check answers for immediate feedback
5. Generate What-If scenarios for deeper exploration

### Educator Analytics Flow
1. View class overview with key metrics
2. Examine individual student progress
3. Read AI-generated insights and recommendations
4. Export data for external analysis
5. Switch between grid and table views

## 🚨 Important Notes

### Browser Compatibility
- **Modern Browsers**: Chrome 80+, Firefox 75+, Safari 13+, Edge 80+
- **JavaScript Required**: Platform won't function without JavaScript
- **Local Storage**: Used for progress tracking and user preferences

### API Key Security
- **Development Only**: Current implementation suitable for development/demo
- **Production Deployment**: Implement proper backend API proxy
- **Rate Limiting**: Be aware of Gemini API usage limits

### Performance Considerations
- **Image Assets**: All icons are CSS-based for fast loading
- **Animation Performance**: Uses hardware-accelerated transforms
- **Memory Usage**: Efficient DOM manipulation and cleanup

## 🤝 Contributing

This is a complete demonstration project showcasing modern web development techniques and educational technology integration. Feel free to fork, modify, and adapt for your own educational initiatives.

## 📄 License

This project is open source and available under the MIT License. Use it as inspiration for your own educational platforms and learning management systems.

---

**EduReform AI** - Transforming education through intelligent, interactive learning experiences. 🚀✨

# 🚀 Beyond Grades: Reimagining Education for Skills & Critical Thinking

> A next-gen neon cyber-learning web application that goes beyond traditional grades, helping students develop critical thinking, reasoning abilities, and real-world skills through immersive, interactive experiences.

![Beyond Grades](https://img.shields.io/badge/Platform-Beyond%20Grades-00f5ff?style=for-the-badge)
![Cyberpunk](https://img.shields.io/badge/Theme-Cyberpunk-ff006e?style=for-the-badge)
![AI Powered](https://img.shields.io/badge/AI-ARIA%20Mentor-8b5cf6?style=for-the-badge)
![Interactive](https://img.shields.io/badge/Learning-Interactive-39ff14?style=for-the-badge)

## 🌟 Vision

Beyond Grades represents a paradigm shift from passive memorization to active exploration, reasoning, and skill-building. Our platform creates an immersive cyberpunk learning environment where students:

- **Think Critically** through AI-guided Socratic questioning
- **Reason Deeply** via interactive cause-effect analysis  
- **Explore Actively** with hands-on learning modules
- **Connect Globally** through anonymous, interest-based communities
- **Grow Holistically** beyond traditional academic metrics

## ✨ Key Features

### 🤖 AI Chatbot Capabilities
- Context-aware responses based on current page
- Probing questions to encourage critical thinking
- Personalized learning path recommendations
- Real-time conversation with typing indicators
- Fallback responses when OpenAI API is not configured
- Conversation history and export functionality

### 🎨 Design Features
- **Neon Color Palette**: Electric blues, vibrant pinks, and glowing purples
- **Smooth Animations**: CSS transitions and JavaScript-powered effects
- **Interactive Elements**: Hover effects, floating animations, and reveal transitions
- **Modern Typography**: Orbitron and Exo 2 font families for futuristic appeal
- **Grid Background**: Animated grid pattern with particle effects

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **OpenAI API** - AI chatbot integration (optional)
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Advanced styling with custom properties
- **Vanilla JavaScript** - Interactive functionality
- **Google Fonts** - Orbitron & Exo 2 typography
- **Intersection Observer API** - Scroll-triggered animations

## 📋 Prerequisites

Before running this project, make sure you have:
- **Node.js** (version 18 or higher)
- **npm** (comes with Node.js)
- **Git** (for cloning the repository)
- **OpenAI API Key** (optional, for full AI capabilities)

## 🚀 Quick Start (Windows)

### 1. Clone or Navigate to the Project
```powershell
# If you don't have the project yet, clone it:
git clone <repository-url>
cd neon-learning-platform

# If you already have the project (like in this case):
cd C:\Users\SAUMYA\neon-learning-platform
```

### 2. Install Dependencies
```powershell
npm install
```

### 3. Set Up Environment Variables
```powershell
# Copy the example environment file
Copy-Item .env.example .env

# Edit the .env file with your preferred text editor
notepad .env
```

**Optional**: Add your OpenAI API key to the `.env` file:
```env
OPENAI_API_KEY=your_actual_api_key_here
```

### 4. Start the Server
```powershell
node server.js
```

### 5. Open in Browser
Navigate to: `http://localhost:3000`

## 🔧 Available Scripts

### Start the Server
```powershell
node server.js
```

### Start with Auto-restart (if you have nodemon)
```powershell
# Install nodemon globally (optional)
npm install -g nodemon

# Start with nodemon
nodemon server.js
```

### Check Health
```powershell
# Test the API health endpoint
curl http://localhost:3000/api/health
```

## 📁 Project Structure

```
neon-learning-platform/
├── 📁 public/                 # Frontend files
│   ├── 📁 css/
│   │   └── styles.css         # Neon theme styles
│   ├── 📁 js/
│   │   ├── app.js            # Main JavaScript functionality
│   │   └── chatbot.js        # AI chatbot system
│   ├── index.html            # Home page
│   ├── problem1.html         # AI Mentors page
│   └── problem2.html         # Beyond Grades page
├── 📁 data/                  # Data storage
│   └── feedback.json         # User feedback storage
├── 📁 node_modules/          # Dependencies
├── server.js                 # Express server
├── package.json              # Project configuration
├── .env.example              # Environment variables template
├── .env                      # Your environment variables (create this)
└── README.md                 # This file
```

## 🎯 Problem Statements Addressed

### Problem 1: AI Mentors for Personalized Learning
**Challenge**: Traditional education operates on a one-size-fits-all model that fails to address individual learning styles, paces, and interests.

**Solution**: AI-powered mentors that:
- Provide personalized learning experiences
- Ask probing questions to deepen understanding
- Adapt to each student's unique profile
- Offer 24/7 availability for questions and guidance

### Problem 2: Beyond Grades - Skills & Critical Thinking
**Challenge**: Current education systems reduce learners to grades, overlooking real skills, interdisciplinary thinking, and career direction.

**Solution**: Skills-first approach that:
- Maps individual strengths and abilities
- Focuses on inquiry-based learning
- Creates interactive, reasoning-based experiences
- Connects knowledge across subjects and real-world applications

## 🌐 API Endpoints

### Health Check
```
GET /api/health
```
Returns server status and timestamp.

### AI Chat
```
POST /api/chat
Content-Type: application/json

{
  "message": "Your question here"
}
```
Returns AI-generated response or fallback message.

### Feedback Submission
```
POST /api/feedback
Content-Type: application/json

{
  "rating": 5,
  "feedback": "Great experience!",
  "page": "/index.html"
}
```
Stores user feedback with timestamp.

## 🎨 Customization

### Changing Colors
Edit the CSS custom properties in `public/css/styles.css`:
```css
:root {
  --neon-blue: #00f5ff;
  --neon-pink: #ff006e;
  --neon-purple: #8b5cf6;
  /* Add your custom colors */
}
```

### Adding New Pages
1. Create HTML file in `/public/`
2. Add navigation link in all existing pages
3. Update `app.js` page detection if needed

### Customizing AI Responses
Modify the fallback responses in `server.js`:
```javascript
const fallbackResponses = [
  "Your custom response here...",
  // Add more responses
];
```

## 🔒 Security Notes

- **Environment Variables**: Never commit `.env` files to version control
- **API Keys**: Keep your OpenAI API key secure and private
- **CORS**: The server is configured for development; adjust for production
- **Input Validation**: Basic validation is implemented; enhance for production use

## 🚀 Deployment

### Local Development
The project is ready to run locally with the quick start instructions above.

### Production Deployment
For production deployment, consider:
1. Set `NODE_ENV=production` in your environment
2. Use a process manager like PM2
3. Set up reverse proxy with Nginx
4. Enable HTTPS
5. Configure proper CORS settings
6. Set up monitoring and logging

## 🤝 Contributing

We welcome contributions! Here's how you can help:

1. **Report Issues**: Found a bug? Open an issue
2. **Suggest Features**: Have ideas? Share them!
3. **Submit Pull Requests**: Code improvements welcome
4. **Documentation**: Help improve docs and examples

## 📞 Support

Need help? Here are your options:

- **GitHub Issues**: For bugs and feature requests
- **Documentation**: Check this README and code comments
- **Community**: Share your experience and get help

## 🏆 Acknowledgments

- **OpenAI** - For GPT API integration
- **Google Fonts** - For Orbitron and Exo 2 fonts
- **CSS Grid & Flexbox** - For responsive layouts
- **Intersection Observer** - For scroll animations
- **Express.js Community** - For the excellent web framework

## 📈 Future Enhancements

- [ ] User authentication system
- [ ] Progress tracking database
- [ ] Advanced analytics dashboard
- [ ] Mobile app version
- [ ] Multi-language support
- [ ] Integration with learning management systems
- [ ] Advanced AI conversation context
- [ ] Voice interaction capabilities

---

## 🎉 Getting Started

Ready to transform education? Start the server and explore the future of learning:

```powershell
cd C:\Users\SAUMYA\neon-learning-platform
node server.js
```

Open `http://localhost:3000` and experience the neon-powered future of education!

---

**Built with 💙 by the Neon Learning Team**

*Empowering learners through AI mentorship and skills-based education*