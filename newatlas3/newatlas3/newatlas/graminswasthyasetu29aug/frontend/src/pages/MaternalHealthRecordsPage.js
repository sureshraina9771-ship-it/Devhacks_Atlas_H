import { Paper, Typography, Link, Box, Select, MenuItem } from '@mui/material';
import { useState } from 'react';

// Simple translations for demonstration
const translations = {
  en: {
    title: "WHO Recommendations: Maternal and Newborn Health",
    intro: "The following instructions are based on World Health Organization (WHO) guidelines for mothers and families during pregnancy and after childbirth.",
    duringPregnancy: "During Pregnancy:",
    afterDelivery: "After Delivery:",
    pregnancyTips: [
      "Attend at least 8 antenatal care visits for timely detection and management of risks.",
      "Eat a balanced, nutritious diet and maintain adequate hydration.",
      "Take iron and folic acid supplements as recommended.",
      "Receive all recommended vaccinations (such as tetanus).",
      "Practice good hygiene and handwashing.",
      "Engage in regular, moderate physical activity as advised by your healthcare provider.",
      "Avoid tobacco, alcohol, and exposure to harmful substances.",
      "Monitor for warning signs: severe headache, blurred vision, swelling, bleeding, fever, or pain—seek medical help immediately if any occur.",
      "Prepare a birth plan and arrange for skilled care at birth.",
      "Ensure emotional support from family and community."
    ],
    deliveryTips: [
      "Attend all postnatal checkups for both mother and baby.",
      "Practice exclusive breastfeeding for the first 6 months.",
      "Ensure the mother has adequate nutrition and rest.",
      "Keep the baby warm and maintain hygiene for both mother and baby.",
      "Monitor for signs of infection or complications in mother and baby; seek medical help if needed.",
      "Ensure timely immunizations for the baby.",
      "Support the mother emotionally and physically; involve family members in care.",
      "Maintain a clean environment to prevent infections.",
      "Encourage open communication about any health concerns."
    ],
    moreInfo: "For more information, visit the",
    whoPage: "WHO Maternal Health page"
  },
  hi: {
    title: "WHO सिफारिशें: मातृ और नवजात स्वास्थ्य",
    intro: "निम्नलिखित निर्देश विश्व स्वास्थ्य संगठन (WHO) के दिशानिर्देशों पर आधारित हैं, जो गर्भावस्था और प्रसव के बाद माताओं और परिवारों के लिए हैं।",
    duringPregnancy: "गर्भावस्था के दौरान:",
    afterDelivery: "प्रसव के बाद:",
    pregnancyTips: [
      "जोखिमों की समय पर पहचान और प्रबंधन के लिए कम से कम 8 प्रसवपूर्व देखभाल विजिट करें।",
      "संतुलित, पौष्टिक आहार लें और पर्याप्त पानी पिएं।",
      "आयरन और फोलिक एसिड की गोलियां लें जैसा सलाह दी गई हो।",
      "सभी अनुशंसित टीकाकरण (जैसे टेटनस) प्राप्त करें।",
      "अच्छी स्वच्छता और हाथ धोने का अभ्यास करें।",
      "अपने स्वास्थ्य सेवा प्रदाता की सलाह के अनुसार नियमित, मध्यम शारीरिक गतिविधि करें।",
      "तंबाकू, शराब और हानिकारक पदार्थों से बचें।",
      "चेतावनी संकेतों की निगरानी करें: तेज सिरदर्द, धुंधली दृष्टि, सूजन, रक्तस्राव, बुखार या दर्द—यदि कोई हो तो तुरंत चिकित्सा सहायता लें।",
      "जन्म योजना बनाएं और जन्म के समय कुशल देखभाल की व्यवस्था करें।",
      "परिवार और समुदाय से भावनात्मक समर्थन सुनिश्चित करें।"
    ],
    deliveryTips: [
      "माँ और बच्चे दोनों के लिए सभी प्रसवोत्तर जांच करवाएं।",
      "पहले 6 महीनों के लिए केवल स्तनपान कराएं।",
      "माँ को पर्याप्त पोषण और आराम सुनिश्चित करें।",
      "बच्चे को गर्म रखें और माँ-बच्चे दोनों के लिए स्वच्छता बनाए रखें।",
      "माँ और बच्चे में संक्रमण या जटिलताओं के संकेतों की निगरानी करें; आवश्यकता होने पर चिकित्सा सहायता लें।",
      "बच्चे के लिए समय पर टीकाकरण सुनिश्चित करें।",
      "माँ को भावनात्मक और शारीरिक रूप से समर्थन दें; देखभाल में परिवार के सदस्यों को शामिल करें।",
      "संक्रमण से बचाव के लिए स्वच्छ वातावरण बनाए रखें।",
      "किसी भी स्वास्थ्य चिंता के बारे में खुलकर बात करें।"
    ],
    moreInfo: "अधिक जानकारी के लिए देखें",
    whoPage: "WHO मातृ स्वास्थ्य पृष्ठ"
  },
  kn: {
    title: "WHO ಶಿಫಾರಸುಗಳು: ತಾಯಿ ಮತ್ತು ನವಜಾತ ಶಿಶು ಆರೋಗ್ಯ",
    intro: "ಕೆಳಗಿನ ಸೂಚನೆಗಳು ಗರ್ಭಧಾರಣೆ ಮತ್ತು ಹೆರಿಗೆ ನಂತರ ತಾಯಂದಿರು ಮತ್ತು ಕುಟುಂಬಗಳಿಗೆ ವಿಶ್ವ ಆರೋಗ್ಯ ಸಂಸ್ಥೆ (WHO) ಮಾರ್ಗಸೂಚಿಗಳ ಆಧಾರದ ಮೇಲೆ ನೀಡಲಾಗಿದೆ.",
    duringPregnancy: "ಗರ್ಭಧಾರಣೆಯ ಸಮಯದಲ್ಲಿ:",
    afterDelivery: "ಹೆರಿಗೆ ನಂತರ:",
    pregnancyTips: [
      "ಅಪಾಯಗಳ ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಪತ್ತೆ ಮತ್ತು ನಿರ್ವಹಣೆಗೆ ಕನಿಷ್ಠ 8 ಗರ್ಭಪೂರ್ವ ಆರೈಕೆ ಭೇಟಿಗಳನ್ನು ಮಾಡಿ.",
      "ಸಮತೋಲನದ, ಪೌಷ್ಟಿಕ ಆಹಾರ ಸೇವಿಸಿ ಮತ್ತು ಸಾಕಷ್ಟು ನೀರು ಕುಡಿಯಿರಿ.",
      "ಐರನ್ ಮತ್ತು ಫೋಲಿಕ್ ಆಸಿಡ್ ಪೂರಕಗಳನ್ನು ಸಲಹೆಯಂತೆ ತೆಗೆದುಕೊಳ್ಳಿ.",
      "ಎಲ್ಲಾ ಶಿಫಾರಸು ಮಾಡಿದ ಲಸಿಕೆಗಳನ್ನು (ಉದಾ: ಟೆಟನಸ್) ಪಡೆಯಿರಿ.",
      "ಚೆನ್ನಾಗಿ ಸ್ವಚ್ಛತೆ ಮತ್ತು ಕೈ ತೊಳೆಯುವ ಅಭ್ಯಾಸ ಮಾಡಿ.",
      "ನಿಮ್ಮ ಆರೋಗ್ಯ ಸೇವಾ ಪೂರೈಕೆದಾರರ ಸಲಹೆಯಂತೆ ನಿಯಮಿತ, ಮಧ್ಯಮ ಶಾರೀರಿಕ ಚಟುವಟಿಕೆ ಮಾಡಿ.",
      "ಧೂಮಪಾನ, ಮದ್ಯಪಾನ ಮತ್ತು ಹಾನಿಕಾರಕ ಪದಾರ್ಥಗಳಿಂದ ದೂರಿರಿ.",
      "ಎಚ್ಚರಿಕೆ ಸೂಚನೆಗಳನ್ನು ಗಮನಿಸಿ: ತೀವ್ರ ತಲೆನೋವು, ಮಸುಕು ದೃಷ್ಟಿ, ಊತ, ರಕ್ತಸ್ರಾವ, ಜ್ವರ ಅಥವಾ ನೋವು—ಯಾವುದೇ ಉಂಟಾದರೆ ತಕ್ಷಣ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ಹೆರಿಗೆ ಯೋಜನೆ ಮಾಡಿ ಮತ್ತು ಹೆರಿಗೆ ಸಮಯದಲ್ಲಿ ನಿಪುಣ ಆರೈಕೆ ವ್ಯವಸ್ಥೆ ಮಾಡಿ.",
      "ಕುಟುಂಬ ಮತ್ತು ಸಮುದಾಯದಿಂದ ಭಾವನಾತ್ಮಕ ಬೆಂಬಲವನ್ನು ಖಚಿತಪಡಿಸಿ."
    ],
    deliveryTips: [
      "ತಾಯಿ ಮತ್ತು ಶಿಶು ಇಬ್ಬರಿಗೂ ಎಲ್ಲಾ ಹೆರಿಗೆ ನಂತರದ ತಪಾಸಣೆಗಳನ್ನು ಮಾಡಿ.",
      "ಮೊದಲ 6 ತಿಂಗಳುಗಳ ಕಾಲ ಮಾತ್ರ ತಾಯಿ ಹಾಲು ನೀಡಿರಿ.",
      "ತಾಯಿಗೆ ಸಾಕಷ್ಟು ಪೌಷ್ಟಿಕ ಆಹಾರ ಮತ್ತು ವಿಶ್ರಾಂತಿ ಖಚಿತಪಡಿಸಿ.",
      "ಶಿಶುವನ್ನು ಬಿಸಿ ಇಟ್ಟುಕೊಳ್ಳಿ ಮತ್ತು ತಾಯಿ-ಶಿಶು ಇಬ್ಬರಿಗೂ ಸ್ವಚ್ಛತೆ ಕಾಯ್ದುಕೊಳ್ಳಿ.",
      "ತಾಯಿ ಮತ್ತು ಶಿಶುವಿನಲ್ಲಿ ಸೋಂಕು ಅಥವಾ ಸಂಕೀರ್ಣತೆಗಳ ಸೂಚನೆಗಳನ್ನು ಗಮನಿಸಿ; ಅಗತ್ಯವಿದ್ದರೆ ವೈದ್ಯಕೀಯ ಸಹಾಯ ಪಡೆಯಿರಿ.",
      "ಶಿಶುವಿಗೆ ಸಮಯಕ್ಕೆ ಸರಿಯಾದ ಲಸಿಕೆಗಳನ್ನು ಖಚಿತಪಡಿಸಿ.",
      "ತಾಯಿಗೆ ಭಾವನಾತ್ಮಕ ಮತ್ತು ಶಾರೀರಿಕ ಬೆಂಬಲ ನೀಡಿ; ಆರೈಕೆಯಲ್ಲಿ ಕುಟುಂಬದ ಸದಸ್ಯರನ್ನು ಒಳಗೊಳ್ಳಿಸಿ.",
      "ಸೋಂಕು ತಡೆಯಲು ಸ್ವಚ್ಛ ವಾತಾವರಣವನ್ನು ಕಾಯ್ದುಕೊಳ್ಳಿ.",
      "ಯಾವುದೇ ಆರೋಗ್ಯ ಚಿಂತನೆಗಳ ಬಗ್ಗೆ ತೆರೆಯಾಗಿ ಸಂವಹನ ಮಾಡಿ."
    ],
    moreInfo: "ಹೆಚ್ಚಿನ ಮಾಹಿತಿಗಾಗಿ ಭೇಟಿ ನೀಡಿ",
    whoPage: "WHO ತಾಯಿ ಆರೋಗ್ಯ ಪುಟ"
  }
};

export default function MaternalHealthRecordsPage() {
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 900, margin: '40px auto', background: '#fff8e1', borderLeft: '6px solid #ff9800' }}>
      {/* Language Selector */}
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'flex-end' }}>
        <Select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          size="small"
          sx={{ minWidth: 120 }}
        >
          <MenuItem value="en">English</MenuItem>
          <MenuItem value="hi">हिन्दी</MenuItem>
          <MenuItem value="kn">ಕನ್ನಡ</MenuItem>
        </Select>
      </Box>
      <Typography variant="h4" fontWeight={700} color="primary" gutterBottom>
        {t.title}
      </Typography>
      <Typography variant="body1" sx={{ mb: 2 }}>
        {t.intro}
      </Typography>
      {/* During Pregnancy Section */}
      <Box sx={{ background: '#e3f2fd', borderRadius: 2, p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mt: 0, mb: 1, color: '#1976d2' }}>
          {t.duringPregnancy}
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 24, color: '#444', fontSize: 17 }}>
          {t.pregnancyTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </Box>
      {/* After Delivery Section */}
      <Box sx={{ background: '#f1f8e9', borderRadius: 2, p: 2, mb: 2 }}>
        <Typography variant="h6" fontWeight={600} sx={{ mt: 0, mb: 1, color: '#388e3c' }}>
          {t.afterDelivery}
        </Typography>
        <ul style={{ margin: 0, paddingLeft: 24, color: '#444', fontSize: 17 }}>
          {t.deliveryTips.map((tip, idx) => (
            <li key={idx}>{tip}</li>
          ))}
        </ul>
      </Box>
      <Typography variant="body2" sx={{ mt: 3 }}>
        {t.moreInfo}&nbsp;
        <Link href="https://www.who.int/health-topics/maternal-health" target="_blank" rel="noopener" underline="hover" color="primary">
          {t.whoPage}
        </Link>.
      </Typography>
    </Paper>
  );
}