# Mental Health AI Chatbot

## Overview

This is a personalized AI mental health chatbot application that provides compassionate mental health support based on user's emotional state. The system collects user traits (mood and stress levels) to personalize AI responses and create a supportive chat experience. Built as a full-stack web application with a simple frontend interface and Express.js backend powered by OpenAI's GPT-4o-mini model.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Static HTML/CSS/JavaScript**: Simple, lightweight frontend served as static files
- **Single Page Application**: All interactions happen on one page with dynamic content updates
- **Form-based Initialization**: Users input mood and stress levels (1-5 scale) before starting chat
- **Real-time Chat Interface**: Dynamic message display with user/AI conversation flow
- **Error Handling**: Client-side validation and error display for user feedback

### Backend Architecture
- **Express.js Server**: RESTful API server handling chat requests and serving static files
- **Modular Route Structure**: Separated chat logic into dedicated route handlers
- **Middleware Stack**: CORS for cross-origin requests, body parser with security limits
- **Environment-based Configuration**: Uses Replit secrets for secure API key management
- **Static File Serving**: Backend serves frontend files and handles SPA routing

### AI Integration
- **OpenAI GPT-4o-mini**: Primary language model for generating responses
- **Personalized System Prompts**: Dynamic prompt generation based on user's mood and stress levels
- **Context-aware Responses**: AI behavior adapts to user's emotional state (low mood gets extra encouragement, high stress gets calming strategies)
- **Response Optimization**: Limited token count (500) and controlled temperature (0.7) for focused, helpful responses

### Data Flow
- **Stateless Design**: No persistent data storage, each request is independent
- **Trait-based Personalization**: User traits passed with each message to maintain context
- **Request Validation**: Input sanitization and validation for security and reliability

## External Dependencies

### Core Technologies
- **Node.js/Express.js**: Backend server framework
- **OpenAI API**: AI language model integration requiring API key
- **CORS**: Cross-origin resource sharing middleware

### Development Dependencies
- **dotenv**: Environment variable management (noted but not actively used - relies on Replit secrets)

### API Integrations
- **OpenAI GPT-4o-mini**: Requires `OPENAI_API_KEY` environment variable
- **Chat Completions API**: Used for generating contextual mental health support responses

### Security Considerations
- **Replit Secrets**: Secure API key storage instead of local environment files
- **Request Size Limits**: 10MB limit on request body size
- **Input Validation**: Message content validation and sanitization
- **CORS Configuration**: Environment-based origin restrictions