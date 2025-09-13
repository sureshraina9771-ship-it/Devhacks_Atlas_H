import React, { useState, useEffect } from 'react';

// Simple translations for English, Hindi, Kannada
const translations = {
  en: {
    title: "Health Risk Predictor",
    respiratory: "Respiratory Rate",
    oxygen: "Oxygen Saturation",
    o2scale: "O2 Scale",
    systolic: "Systolic BP",
    heart: "Heart Rate",
    temp: "Temperature",
    consciousness: "Consciousness",
    onOxygen: "On Oxygen",
    alert: "A (Alert)",
    voice: "V (Voice)",
    pain: "P (Pain)",
    unresponsive: "U (Unresponsive)",
    confused: "C (Confused)",
    yes: "Yes",
    no: "No",
    predict: "Predict Risk",
    predicting: "Predicting...",
    highRisk: "High Health Risk",
    highRiskMsg: "Please consult a doctor immediately.",
    lowRisk: "Low Health Risk",
    lowRiskMsg: "You are safe.",
    predicted: "Predicted Risk Level",
    error: "Prediction failed. Please check your input and try again.",
    selectLang: "Select Language"
  },
  hi: {
    title: "स्वास्थ्य जोखिम पूर्वानुमानक",
    respiratory: "श्वसन दर",
    oxygen: "ऑक्सीजन संतृप्ति",
    o2scale: "O2 स्केल",
    systolic: "सिस्टोलिक बीपी",
    heart: "हृदय दर",
    temp: "तापमान",
    consciousness: "चेतना",
    onOxygen: "ऑक्सीजन पर",
    alert: "A (सचेत)",
    voice: "V (आवाज़)",
    pain: "P (दर्द)",
    unresponsive: "U (अचेतन)",
    confused: "C (भ्रमित)",
    yes: "हाँ",
    no: "नहीं",
    predict: "जोखिम का पूर्वानुमान लगाएं",
    predicting: "पूर्वानुमान लगाया जा रहा है...",
    highRisk: "उच्च स्वास्थ्य जोखिम",
    highRiskMsg: "कृपया तुरंत डॉक्टर से संपर्क करें।",
    lowRisk: "कम स्वास्थ्य जोखिम",
    lowRiskMsg: "आप सुरक्षित हैं।",
    predicted: "अनुमानित जोखिम स्तर",
    error: "पूर्वानुमान विफल। कृपया अपनी जानकारी जांचें और पुनः प्रयास करें।",
    selectLang: "भाषा चुनें"
  },
  kn: {
    title: "ಆರೋಗ್ಯ ಅಪಾಯ ಭವಿಷ್ಯವಾಣಿ",
    respiratory: "ಉಸಿರಾಟದ ಪ್ರಮಾಣ",
    oxygen: "ಆಕ್ಸಿಜನ್ ತೃಪ್ತಿ",
    o2scale: "O2 ಮಾಪಕ",
    systolic: "ಸಿಸ್ಟೋಲಿಕ್ ಬಿಪಿ",
    heart: "ಹೃದಯದ ಪ್ರಮಾಣ",
    temp: "ತಾಪಮಾನ",
    consciousness: "ಜಾಗೃತಿ",
    onOxygen: "ಆಕ್ಸಿಜನ್ ನಲ್ಲಿ",
    alert: "A (ಎಚ್ಚರಿಕೆ)",
    voice: "V (ಧ್ವನಿ)",
    pain: "P (ನೋವು)",
    unresponsive: "U (ಪ್ರತಿಕ್ರಿಯೆ ಇಲ್ಲ)",
    confused: "C (ಗೊಂದಲ)",
    yes: "ಹೌದು",
    no: "ಇಲ್ಲ",
    predict: "ಅಪಾಯ ಭವಿಷ್ಯವಾಣಿ",
    predicting: "ಭವಿಷ್ಯವಾಣಿ ನಡೆಯುತ್ತಿದೆ...",
    highRisk: "ಹೆಚ್ಚು ಆರೋಗ್ಯ ಅಪಾಯ",
    highRiskMsg: "ದಯವಿಟ್ಟು ತಕ್ಷಣ ವೈದ್ಯರನ್ನು ಸಂಪರ್ಕಿಸಿ.",
    lowRisk: "ಕಡಿಮೆ ಆರೋಗ್ಯ ಅಪಾಯ",
    lowRiskMsg: "ನೀವು ಸುರಕ್ಷಿತವಾಗಿದ್ದೀರಿ.",
    predicted: "ಭವಿಷ್ಯವಾಣಿ ಅಪಾಯ ಮಟ್ಟ",
    error: "ಭವಿಷ್ಯವಾಣಿ ವಿಫಲವಾಗಿದೆ. ದಯವಿಟ್ಟು ನಿಮ್ಮ ಮಾಹಿತಿಯನ್ನು ಪರಿಶೀಲಿಸಿ.",
    selectLang: "ಭಾಷೆ ಆಯ್ಕೆಮಾಡಿ"
  }
};

function HealthRiskPredictor() {
  const [form, setForm] = useState({
    Respiratory_Rate: '',
    Oxygen_Saturation: '',
    O2_Scale: '',
    Systolic_BP: '',
    Heart_Rate: '',
    Temperature: '',
    Consciousness: 'A',
    On_Oxygen: '0'
  });
  const [risk, setRisk] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [spoken, setSpoken] = useState(false);
  const [lang, setLang] = useState('en');

  const t = translations[lang];

  const handleChange = e => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleLangChange = e => {
    setLang(e.target.value);
    setSpoken(false);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setRisk('');
    setSpoken(false);
    try {
      const payload = { ...form, On_Oxygen: Number(form.On_Oxygen) };
      const res = await fetch('http://127.0.0.1:5000/predict-health-risk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Prediction failed');
      const data = await res.json();
      setRisk(data.risk);
    } catch (err) {
      setError(t.error);
    }
    setLoading(false);
  };

  // Voice output for risk result (in English only for now)
  useEffect(() => {
    if (risk && !spoken) {
      let message = '';
      if (risk.toLowerCase().includes('high')) {
        message = t.highRisk + '. ' + t.highRiskMsg;
      } else if (risk.toLowerCase().includes('low')) {
        message = t.lowRisk + '. ' + t.lowRiskMsg;
      } else {
        message = `${t.predicted}: ${risk}`;
      }
      if ('speechSynthesis' in window) {
        const utter = new window.SpeechSynthesisUtterance(message);
        utter.lang = lang === 'en' ? 'en-IN' : lang === 'hi' ? 'hi-IN' : 'kn-IN';
        window.speechSynthesis.speak(utter);
        setSpoken(true);
      }
    }
  }, [risk, spoken, lang, t]);

  return (
    <div className="card" style={{
      width: '100vw',
      height: '100vh',
      minHeight: '100vh',
      background: '#f8f9fa',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Language Selector */}
      <div style={{
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: '16px 32px 0 0',
        width: '100%',
        gap: 10
      }}>
        <label htmlFor="lang" style={{ fontSize: 18, fontWeight: 500 }}>{t.selectLang}:</label>
        <select
          id="lang"
          value={lang}
          onChange={handleLangChange}
          style={{
            fontSize: 18,
            borderRadius: 8,
            padding: '6px 12px',
            border: '1px solid #1976d2',
            background: '#fff',
            cursor: 'pointer'
          }}
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="kn">ಕನ್ನಡ</option>
        </select>
      </div>
      <h2 style={{
        fontSize: 40,
        marginBottom: 30,
        color: '#1976d2',
        textAlign: 'center',
        marginTop: 16
      }}>{t.title}</h2>
      <form onSubmit={handleSubmit} style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        background: '#fff',
        padding: 32,
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        height: '100%',
        maxWidth: '100vw',
        maxHeight: '100vh',
        boxSizing: 'border-box',
        justifyContent: 'center',
        transition: 'box-shadow 0.3s'
      }}>
        <input
          name="Respiratory_Rate"
          placeholder={t.respiratory}
          value={form.Respiratory_Rate}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <input
          name="Oxygen_Saturation"
          placeholder={t.oxygen}
          value={form.Oxygen_Saturation}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <input
          name="O2_Scale"
          placeholder={t.o2scale}
          value={form.O2_Scale}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <input
          name="Systolic_BP"
          placeholder={t.systolic}
          value={form.Systolic_BP}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <input
          name="Heart_Rate"
          placeholder={t.heart}
          value={form.Heart_Rate}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <input
          name="Temperature"
          placeholder={t.temp}
          value={form.Temperature}
          onChange={handleChange}
          required
          style={{
            fontSize: 24,
            margin: '12px 0',
            padding: '12px 16px',
            borderRadius: 8,
            border: '1px solid #ccc',
            width: '100%',
            transition: 'border 0.2s, box-shadow 0.2s',
            outline: 'none'
          }}
          onFocus={e => e.target.style.border = '1.5px solid #1976d2'}
          onBlur={e => e.target.style.border = '1px solid #ccc'}
        />
        <label style={{ fontSize: 22, margin: '12px 0', width: '100%', textAlign: 'left' }}>
          {t.consciousness}:
          <select name="Consciousness" value={form.Consciousness} onChange={handleChange} style={{
            fontSize: 22,
            marginLeft: 10,
            borderRadius: 8,
            padding: '6px 12px'
          }}>
            <option value="A">{t.alert}</option>
            <option value="V">{t.voice}</option>
            <option value="P">{t.pain}</option>
            <option value="U">{t.unresponsive}</option>
            <option value="C">{t.confused}</option>
          </select>
        </label>
        <label style={{ fontSize: 22, margin: '12px 0', width: '100%', textAlign: 'left' }}>
          {t.onOxygen}:
          <select name="On_Oxygen" value={form.On_Oxygen} onChange={handleChange} style={{
            fontSize: 22,
            marginLeft: 10,
            borderRadius: 8,
            padding: '6px 12px'
          }}>
            <option value="0">{t.no}</option>
            <option value="1">{t.yes}</option>
          </select>
        </label>
        <button type="submit" disabled={loading} style={{
          fontSize: 26,
          margin: '20px 0 0 0',
          padding: '14px 0',
          borderRadius: 10,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          width: '100%',
          fontWeight: 'bold',
          cursor: loading ? 'not-allowed' : 'pointer',
          boxShadow: '0 2px 8px rgba(25,118,210,0.08)',
          transition: 'background 0.2s, box-shadow 0.2s'
        }}
        onMouseOver={e => e.target.style.background = '#1251a3'}
        onMouseOut={e => e.target.style.background = '#1976d2'}
        >
          {loading ? t.predicting : t.predict}
        </button>
      </form>
      {risk && (
        <div style={{
          marginTop: '1em',
          display: 'flex',
          alignItems: 'center',
          flexDirection: 'column',
          animation: 'fadeInScale 0.7s'
        }}>
          <style>
            {`
              @keyframes fadeInScale {
                0% { opacity: 0; transform: scale(0.9);}
                100% { opacity: 1; transform: scale(1);}
              }
            `}
          </style>
          {risk.toLowerCase().includes('high') ? (
            <>
              <span style={{ fontSize: 60, color: 'red', transition: 'transform 0.3s' }} role="img" aria-label="High Risk">&#9888;&#65039;</span>
              <div style={{ color: 'red', fontWeight: 'bold', fontSize: 28, marginTop: 8 }}>
                {t.highRisk}
              </div>
              <div style={{ color: 'red', fontSize: 18, marginTop: 4 }}>
                {t.highRiskMsg}
              </div>
            </>
          ) : risk.toLowerCase().includes('low') ? (
            <>
              <span style={{ fontSize: 60, color: 'green', transition: 'transform 0.3s' }} role="img" aria-label="Low Risk">&#9989;</span>
              <div style={{ color: 'green', fontWeight: 'bold', fontSize: 28, marginTop: 8 }}>
                {t.lowRisk}
              </div>
              <div style={{ color: 'green', fontSize: 18, marginTop: 4 }}>
                {t.lowRiskMsg}
              </div>
            </>
          ) : (
            <div style={{ color: '#1976d2', fontWeight: 'bold', fontSize: 24 }}>
              {t.predicted}: {risk}
            </div>
          )}
        </div>
      )}
      {error && (
        <div style={{ marginTop: '1em', color: 'red' }}>
          {error}
        </div>
      )}
    </div>
  );
}

export default HealthRiskPredictor;