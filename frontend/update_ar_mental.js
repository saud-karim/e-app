const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'ar.json');
let arData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const mentalTranslations = {
  "Exercises & Relaxation": "تمارين والاسترخاء",
  "Breathing": "تمرين التنفس",
  "Reduce stress": "تقليل التوتر",
  "Meditation": "جلسة تأمل",
  "Find peace": "ابحث عن الهدوء",
  "Mute": "كتم الصوت",
  "Rain Sounds": "أصوات المطر",
  "Ocean Waves": "أمواج البحر",
  "Nature & Forest": "طبيعة وغابة",
  "White Noise": "ضوضاء بيضاء",
  "Find Your Peace": "ابحث عن سلامك الداخلي",
  "Close your eyes and listen to the silence.": "أغمض عينيك واستمع إلى الهدوء.",
  "min": "دقيقة",
  "Ambient Sound": "الصوت المحيط",
  "Relax and Breathe": "استرخ وتنفس",
  "Breathe In": "شهيق...",
  "Hold": "احتفظ بالهواء...",
  "Breathe Out": "زفير...",
  "Tap to Start": "اضغط للبدء",
  "Stop": "إيقاف"
};

for (const [key, value] of Object.entries(mentalTranslations)) {
  if (!arData[key]) {
    arData[key] = value;
  }
}

fs.writeFileSync(filePath, JSON.stringify(arData, null, 2));
console.log('Arabic translations for Mental Health updated successfully.');
