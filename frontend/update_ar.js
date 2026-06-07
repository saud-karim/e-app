const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'locales', 'ar.json');
let arData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const newTranslations = {
  "Edit Medication": "تعديل الدواء",
  "Medication Details": "تفاصيل الدواء",
  "Schedule & Details": "الجدول والتفاصيل",
  "Frequency": "التكرار",
  "Daily": "يومياً",
  "Reminder Times": "أوقات التذكير",
  "Not set": "غير محدد",
  "Instructions": "التعليمات",
  "Adherence": "الالتزام الدوائي",
  "Perfect! You have taken all doses this week.": "ممتاز! لقد أخذت جميع جرعاتك هذا الأسبوع.",
  "Delete Medication": "حذف الدواء",
  "Are you sure you want to delete ": "هل أنت متأكد أنك تريد حذف ",
  "? This action cannot be undone.": "؟ لا يمكن التراجع عن هذا الإجراء.",
  "Cancel": "إلغاء",
  "AI Smart Scan": "المسح الذكي بالذكاء الاصطناعي",
  "Scan your prescription or medication box to automatically extract the details.": "قم بتصوير الروشتة أو علبة الدواء لاستخراج التفاصيل تلقائياً.",
  "Take Photo": "التقاط صورة",
  "Gallery": "المعرض",
  "Analyzing with AI...": "جاري التحليل بالذكاء الاصطناعي...",
  "Retake": "إعادة التصوير",
  "Extract Data": "استخراج البيانات",
  "Extracted Medications": "الأدوية المستخرجة",
  "Add to My Medications": "أضف إلى أدويتي",
  "Sorry, we need camera permissions to make this work!": "عذراً، نحتاج صلاحية الوصول للكاميرا لكي تعمل هذه الميزة!",
  "Medical Profile": "الملف الطبي",
  "Update your health information": "تحديث معلوماتك الصحية"
};

for (const [key, value] of Object.entries(newTranslations)) {
  if (!arData[key]) {
    arData[key] = value;
  }
}

fs.writeFileSync(filePath, JSON.stringify(arData, null, 2));
console.log('Arabic translations updated successfully.');
