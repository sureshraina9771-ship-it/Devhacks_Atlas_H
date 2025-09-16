import React, { useEffect } from 'react';
import { Box, Typography } from '@mui/material';

const GoogleTranslate = ({ style = {} }) => {
  useEffect(() => {
    // Add Google Translate script
    const addScript = () => {
      if (document.querySelector('script[src*="translate.google.com"]')) return;
      
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      
      window.googleTranslateElementInit = () => {
        if (window.google?.translate?.TranslateElement) {
          new window.google.translate.TranslateElement(
            {
              pageLanguage: 'en',
              includedLanguages: 'en,hi,pa,bn,ta,te,ml,gu,mr,or,as,ur,ne,zh,ar,fr,es,de,ja,ko,pt,ru,it',
              layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE,
              autoDisplay: false,
              multilanguagePage: true
            },
            'google_translate_element'
          );
        }
      };
      
      document.head.appendChild(script);
    };

    addScript();
    
    // Retry initialization after delay
    const retryTimer = setTimeout(() => {
      if (window.google?.translate?.TranslateElement) {
        window.googleTranslateElementInit();
      }
    }, 2000);

    return () => clearTimeout(retryTimer);
  }, []);

  const defaultStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '4px 8px',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: '8px',
    ...style
  };

  return (
    <Box sx={defaultStyle}>
      <Typography 
        variant="caption" 
        sx={{ 
          fontSize: '12px', 
          color: 'rgba(255,255,255,0.9)', 
          whiteSpace: 'nowrap',
          fontWeight: 500
        }}
      >
        🌐 Translate:
      </Typography>
      
      {/* Google Translate Widget */}
      <div 
        id="google_translate_element"
        style={{ 
          display: 'inline-block',
          minWidth: '100px'
        }}
      />
    </Box>
  );
};

export default GoogleTranslate;
