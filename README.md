# Zephy - Anonymous Student Wellness Hub 🏫

A safe, anonymous platform for college students to connect, share experiences, participate in polls, and check their wellness - all while maintaining complete privacy.

## 🌟 Features

### 1. Anonymous Communities 👥
- **Anonymous Posting**: Share questions and experiences without revealing your identity
- **Community Groups**: Join specific groups like "Exam Stress Circle", "Homesick Freshers", "Final-Year Anxiety"
- **Interactive Reactions**: Support fellow students with emoji reactions (💝 Support, 🤝 Relate, 💡 Helpful)
- **Anonymous Replies**: Comment and help others while staying anonymous

### 2. Pulse Polls 📊
- **Anonymous Voting**: Vote on campus topics without revealing your identity
- **Multiple Poll Types**: 
  - Emoji reactions (e.g., "How ready are you for midterms?" ✅😅😭)
  - Multiple choice questions
  - Scale ratings (1-5, 1-7, 1-10)
  - Yes/No polls
- **Real-time Results**: See aggregated results instantly
- **Campus Insights**: Understand how fellow students really feel

### 3. Wellness Fit Check 🧠
- **Quick Assessment**: Evaluate stress, sleep, mood, and academic pressure
- **Personalized Recommendations**: Get tailored tasks and tips based on your responses
- **Wellness Score**: Track your overall wellness with a simple score
- **Progress Tracking**: Build streaks and earn badges for consistency
- **AI Integration**: Connect with AI support for personalized advice

### 4. Peer Connections 💬
- **Anonymous Chat**: One-on-one conversations with fellow students
- **No Personal Data**: Complete anonymity with random nicknames and avatars
- **Safe Environment**: Moderated space for student support

### 5. Gamification 🎮
- **Streak Counter**: Track daily login streaks
- **Achievement Badges**: Earn badges like "Helper", "Consistent", "Week Warrior"
- **Progress Tracking**: Visual representation of your wellness journey

## 🔒 Privacy & Trust

- **100% Anonymous**: No email or roll number required
- **Local Storage**: All data stored locally on your device
- **Aggregated Data Only**: Only poll statistics are shared, never individual responses
- **No Tracking**: Your college cannot see what you post or how you vote
- **Safe Space**: AI moderation filters for inappropriate content

## 🛠️ Technical Stack

### Frontend
- **HTML5/CSS3/JavaScript**: Pure vanilla web technologies
- **Responsive Design**: Works on desktop and mobile
- **Local Storage**: Client-side data persistence
- **Modern UI**: Clean, intuitive interface with smooth animations

### Backend
- **Node.js**: Server runtime
- **Express.js**: Web framework
- **OpenAI API**: AI chat support
- **CORS**: Cross-origin resource sharing
- **RESTful API**: Clean API endpoints for data management

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- OpenAI API key (for AI chat feature)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/sih-mental-health.git
   cd sih-mental-health
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Set your OpenAI API key (Windows PowerShell)
   $env:OPENAI_API_KEY="your_openai_api_key_here"
   
   # Or create a .env file in the root directory:
   # OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Start the backend server**
   ```bash
   cd backend
   node Server.js
   ```

5. **Access the application**
   - Open your browser and go to `http://localhost:5000`
   - Create an anonymous profile
   - Start exploring the features!

### Running Frontend Only
If you want to run just the frontend (without AI chat):
1. Open `frontend/index.html` in your browser
2. Or use a simple HTTP server:
   ```bash
   # Using Python
   cd frontend
   python -m http.server 8000
   
   # Using Node.js (if you have http-server installed)
   cd frontend
   npx http-server
   ```

## 📁 Project Structure

```
sih-mental-health/
├── backend/
│   ├── Server.js              # Main server file
│   ├── routes/
│   │   ├── chat.js           # AI chat endpoints
│   │   └── communities.js    # Communities and polls API
│   └── utils/
│       └── ai.js            # OpenAI integration
├── frontend/
│   ├── index.html           # Landing page
│   ├── communities.html     # Anonymous communities
│   ├── polls.html           # Pulse polls
│   ├── fitcheck.html        # Wellness assessment
│   ├── chat.html            # AI chat interface
│   ├── style.css            # Main styles
│   ├── communities.css      # Communities styles
│   ├── polls.css            # Polls styles
│   ├── fitcheck.css         # Wellness check styles
│   ├── script.js            # Main JavaScript
│   ├── communities.js       # Communities functionality
│   ├── polls.js             # Polls functionality
│   ├── fitcheck.js          # Wellness assessment
│   └── assets/              # Images and icons
├── package.json             # Dependencies
└── README.md               # This file
```

## 🎯 Usage Guide

### Creating an Anonymous Profile
1. Click "Anonymous Login" on the homepage
2. Choose a nickname (e.g., "StudyBuddy42")
3. Select an avatar emoji
4. Choose your academic year
5. Join the anonymous community!

### Using Communities
1. Navigate to the Communities page
2. Choose a community or browse all posts
3. Share your thoughts anonymously
4. React to others' posts with emoji votes
5. Reply to help fellow students

### Creating Polls
1. Go to the Polls page
2. Ask a question about campus life
3. Choose poll type (emoji, multiple choice, scale, yes/no)
4. Select a category
5. Watch responses come in real-time!

### Wellness Check
1. Visit the Fit Check page
2. Honestly answer questions about stress, sleep, mood, and academics
3. Get your wellness score and personalized recommendations
4. Build streaks and earn badges
5. Connect with AI for additional support

## 🔧 Customization

### Adding New Communities
Edit `communities.js` to add new community groups:
```javascript
const communities = {
    'new-community': '🎯 New Community Name'
};
```

### Adding Poll Presets
Modify the emoji presets in `polls.js`:
```javascript
const presets = {
    'custom': [
        { id: 'option1', text: 'Option 1', emoji: '🎯' },
        { id: 'option2', text: 'Option 2', emoji: '✨' }
    ]
};
```

### Customizing Wellness Recommendations
Update the recommendation logic in `fitcheck.js`:
```javascript
if (stress >= 4) {
    tasks.push({
        icon: '🧘‍♀️',
        text: 'Your custom wellness task'
    });
}
```

## 🌍 Deployment

### Local Development
The app runs on `http://localhost:5000` by default.

### Production Deployment
1. **Environment Variables**: Set `NODE_ENV=production` and `OPENAI_API_KEY`
2. **Database**: Consider adding a real database (MongoDB, PostgreSQL) for production
3. **Security**: Add rate limiting, input sanitization, and HTTPS
4. **Hosting**: Deploy to platforms like Heroku, Vercel, or AWS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📜 License

This project is open source and available under the [MIT License](LICENSE).

## 💡 Future Enhancements

- **Real-time Chat**: WebSocket integration for live peer conversations
- **Advanced Analytics**: Wellness trends and insights
- **Mobile App**: React Native or Flutter mobile application
- **Integration**: Campus LMS and counseling service integration
- **AI Improvements**: More sophisticated mental health AI responses
- **Moderation**: Advanced content moderation and reporting systems

## 🆘 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section below
2. Open an issue on GitHub
3. Contact the development team

## 🔧 Troubleshooting

### Common Issues

**Backend won't start:**
- Check if Node.js is installed: `node --version`
- Verify OpenAI API key is set
- Check if port 5000 is available

**Features not working:**
- Clear browser cache and localStorage
- Check browser console for errors
- Ensure JavaScript is enabled

**AI Chat not responding:**
- Verify OpenAI API key is valid
- Check internet connection
- Look at server logs for errors

### Error Messages

**"OpenAI API key missing":**
```bash
# Set the environment variable:
$env:OPENAI_API_KEY="your_key_here"
```

**"Cannot find module":**
```bash
# Reinstall dependencies:
npm install
```

---

Made with 💜 for student mental wellness and anonymous community building.

**Remember**: Your privacy is our priority. Share, connect, and grow in a safe, anonymous environment. 🌸
