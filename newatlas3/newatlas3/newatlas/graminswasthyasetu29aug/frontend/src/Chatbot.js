import React, { useState, useRef } from 'react';
import axios from 'axios';
import { Box, Typography, TextField, Button, Paper, CircularProgress, IconButton, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const API_URL = 'http://127.0.0.1:5000';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'bho', label: 'Bhojpuri' }, // Not all browsers support this, but you can try
  { code: 'har', label: 'Haryanvi' }  // Not all browsers support this, but you can try
];

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { sender: 'bot', text: 'HELLO HOW ARE U DOING BUDDY' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);
  const [language, setLanguage] = useState('en-US');
  const recognitionRef = useRef(null);

  // Voice input (Speech-to-Text)
  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
        alert('Speech recognition not supported in this browser.');
        return;
    }
    
    if (listening) {
        recognitionRef.current.stop();
        setListening(false);
        return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setListening(false);
        // Automatically send message when voice input is received
        sendMessage(null, transcript);
    };

    recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setListening(false);
    };

    recognition.onend = () => {
        setListening(false);
    };

    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  // Voice output (Text-to-Speech)
  const speak = (text) => {
    if ('speechSynthesis' in window) {
      const synth = window.speechSynthesis;
      // Sometimes voices are not loaded immediately, so we wait if needed
      let voices = synth.getVoices();
      if (!voices.length) {
        // Chrome loads voices asynchronously
        window.speechSynthesis.onvoiceschanged = () => speak(text);
        return;
      }
      // Try to find a female voice for the selected language
      let selectedVoice = voices.find(v => v.lang === language && v.name.toLowerCase().includes('female'));
      if (!selectedVoice) selectedVoice = voices.find(v => v.lang === language);
      if (!selectedVoice) selectedVoice = voices[0];
      const utter = new window.SpeechSynthesisUtterance(text);
      utter.lang = language;
      utter.voice = selectedVoice;
      utter.rate = 1;
      utter.pitch = 1.1;
      synth.speak(utter);
    }
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  };
  // filepath: c:\Users\raj azad\Documents\newatlas3\newatlas\graminswasthyasetu29aug\frontend\src\Chatbot.js
const sendMessage = async (e, voiceInput = null) => {
    if (e) e.preventDefault();
    const messageText = voiceInput || input;
    if (!messageText.trim()) return;

    const userMessage = { sender: 'user', text: messageText };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);
    setInput('');

    try {
        const res = await axios.post(`${API_URL}/chatbot`, {
            message: messageText,
            language: language
        });

        const botMessage = { 
            sender: 'bot', 
            text: res.data.response,
            audio: res.data.audio 
        };
        setMessages(prev => [...prev, botMessage]);

        // Automatically play audio response
        if (res.data.audio) {
            const audio = new Audio(`data:audio/mp3;base64,${res.data.audio}`);
            audio.play();
        }
    } catch (error) {
        console.error('Error:', error);
        setMessages(prev => [...prev, {
            sender: 'bot',
            text: 'Sorry, there was an error. Please try again.'
        }]);
    }
    setLoading(false);
};

  return (
    <Paper elevation={4} sx={{ maxWidth: 420, margin: '40px auto', p: 3, borderRadius: 3 }}>
      <img src="https://www.pikpng.com/pngl/m/52-527419_atlas-logo-atlas-magazine-logo-clipart.png" alt="ATLAS Ai" style={{ width: 60, margin: '0 auto', display: 'block' }} />
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 700, color: '#1976d2' }}>
        AI Health Chatbot
      </Typography>
      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel id="lang-label">Listening Language</InputLabel>
        <Select
          labelId="lang-label"
          value={language}
          label="Listening Language"
          onChange={e => setLanguage(e.target.value)}
          size="small"
        >
          {LANGUAGES.map(lang => (
            <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
      <Box sx={{ minHeight: 260, maxHeight: 320, overflowY: 'auto', mb: 2, background: '#f5f7fa', p: 2, borderRadius: 2 }}>
        {messages.map((msg, idx) => (
          <Box
            key={idx}
            sx={{
              display: 'flex',
              justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
              mb: 1
            }}
          >
            <Box
              sx={{
                bgcolor: msg.sender === 'user' ? '#1976d2' : '#e3f2fd',
                color: msg.sender === 'user' ? '#fff' : '#222',
                px: 2,
                py: 1,
                borderRadius: 2,
                maxWidth: '80%',
                fontSize: 16,
                position: 'relative'
              }}
            >
              {msg.text}
              {msg.sender === 'bot' && (
                <IconButton
                  size="small"
                  sx={{ ml: 1, position: 'absolute', right: -36, top: 0 }}
                  onClick={() => speak(msg.text)}
                  title="Listen"
                >
                  <VolumeUpIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          </Box>
        ))}
        {loading && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', mt: 1 }}>
            <CircularProgress size={20} sx={{ mr: 1 }} />
            <Typography variant="body2" color="text.secondary">Thinking...</Typography>
          </Box>
        )}
      </Box>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: 8 }}>
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          placeholder="Type or use the mic..."
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <IconButton onClick={handleVoiceInput} color={listening ? 'error' : 'primary'}>
          <MicIcon />
        </IconButton>
        <Button type="submit" variant="contained" color="primary" disabled={loading}>
          Send
        </Button>
        <Button
          variant="outlined"
          color="secondary"
          disabled={loading}
          onClick={stopSpeaking}
        >
          Stop
        </Button>
      </form>
      {listening && (
        <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block' }}>
          Listening...
        </Typography>
      )}
    </Paper>
  );
};

export default Chatbot;