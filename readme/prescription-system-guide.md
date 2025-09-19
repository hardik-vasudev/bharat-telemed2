# 💊 Bharat Telemed Prescription System Guide

## Overview
The Bharat Telemed prescription system provides doctors with a professional, efficient way to create digital prescriptions during teleconsultations. The system uses medicine codes for quick prescription generation and stores all data securely in the database.

---

## 🔍 Medicine Coding System

### How It Works
Every medicine has a unique **2-letter code** for quick identification:

| Medicine Code | Medicine Name | Generic Name | Strength |
|---------------|---------------|--------------|----------|
| **AC** | Paracetamol | Acetaminophen | 500mg |
| **IB** | Ibuprofen | Ibuprofen | 400mg |
| **AS** | Aspirin | Acetylsalicylic Acid | 325mg |
| **DC** | Diclofenac | Diclofenac Sodium | 50mg |
| **AX** | Amoxicillin | Amoxicillin | 500mg |
| **AZ** | Azithromycin | Azithromycin | 250mg |
| **CT** | Cetirizine | Cetirizine | 10mg |
| **OM** | Omeprazole | Omeprazole | 20mg |
| **VD** | Vitamin D3 | Cholecalciferol | 60000IU |

### Prescription Code Format
**Format:** `{MEDICINE_CODE}-{DOSAGE_NUMBER}-{DURATION_DAYS}`

**Examples:**
- `AC-2-7` = Paracetamol, 2 tablets, for 7 days
- `IB-1-5` = Ibuprofen, 1 tablet, for 5 days
- `AZ-1-3` = Azithromycin, 1 tablet, for 3 days

---

## 🩺 For Doctors: How to Use

### 1. **Opening Prescription Builder**
- Click the **MedKit** button in the teleconsultation navbar
- Select **"Quick Prescription"** from the dropdown
- The prescription builder will open as a modal

### 2. **Adding Patient Diagnosis**
- Start by entering the patient's diagnosis in the text area
- This helps provide context for the prescribed medicines

### 3. **Adding Medicines**

#### **Step-by-Step:**
1. Click **"Add Medicine"** button
2. **Search for medicine** by:
   - Medicine name (e.g., "Paracetamol")
   - Generic name (e.g., "Acetaminophen")
   - Medicine code (e.g., "AC")
3. **Select medicine** from dropdown suggestions
4. **Configure dosage details:**
   - **Dosage:** Number of tablets/dose (e.g., 1, 2, 1/2)
   - **Frequency:** How often per day
     - Once Daily (1-0-0)
     - Twice Daily (1-0-1)
     - Thrice Daily (1-1-1)
     - As Needed (SOS)
   - **Duration:** Number of days (3, 5, 7, 10, 14, 21, 30)
   - **Meal Timing:** Before/After/With meal
5. **Add special instructions** (optional)
6. **Preview the prescription code** (e.g., AC-2-7)
7. Click **"Add Medicine to Prescription"**

### 4. **General Instructions**
- Use the **"Common"** dropdown to quickly add standard instructions:
  - "Take rest and drink plenty of fluids"
  - "Avoid spicy and oily food"
  - "Complete the full course of antibiotics"
  - "Consult immediately if symptoms worsen"
- Add custom instructions as needed

### 5. **Follow-up Date**
- Set optional follow-up appointment date
- System prevents selecting past dates

### 6. **Saving Prescription**
- Click **"Save to Database"** to store prescription securely
- Prescription is saved with:
  - Patient details
  - Doctor details
  - Consultation ID
  - Timestamp
  - All medicines with codes
  - General instructions

---

## 📋 General Instructions for Doctors

### **Common Medical Instructions**

#### **General Care:**
- Take adequate rest
- Drink plenty of fluids (8-10 glasses water daily)
- Maintain proper hygiene
- Avoid crowded places if infectious

#### **Dietary Instructions:**
- Avoid spicy and oily food
- Take light, easily digestible meals
- Include fresh fruits and vegetables
- Avoid alcohol during medication

#### **Medication Guidelines:**
- Complete the full course of antibiotics
- Take medicine with food to avoid stomach upset
- Do not skip doses
- Store medicines in cool, dry place

#### **When to Consult:**
- Consult immediately if symptoms worsen
- Return if fever persists beyond 3 days
- Contact if any allergic reactions occur
- Follow up as scheduled

#### **Lifestyle:**
- Avoid smoking during treatment
- Get adequate sleep (7-8 hours)
- Light exercise as tolerated
- Maintain regular meal times

---

## 🔧 Technical Features

### **Auto-Generated Prescription Codes**
- System automatically generates codes like `AC-2-7`
- Helps with quick identification and billing
- Stored in database for easy retrieval

### **Medicine Database Integration**
- Comprehensive medicine database with codes
- Search by name, generic name, or code
- Auto-complete suggestions for faster prescribing

### **Professional Formatting**
- Clean, organized prescription layout
- Medicine sequencing (1, 2, 3...)
- Frequency symbols (1-0-1, 1-1-1, etc.)
- Professional medical terminology

### **Database Storage**
- All prescriptions saved securely
- Complete audit trail
- Patient history tracking
- Doctor prescribing patterns

---

## 🏥 Professional Standards

### **Prescription Guidelines**
1. **Always include diagnosis** for context
2. **Use appropriate dosing** based on patient weight/age
3. **Check for drug interactions** before prescribing
4. **Provide clear instructions** for patient understanding
5. **Set appropriate follow-up** dates

### **Legal Compliance**
- All prescriptions are digitally signed
- Timestamps are automatically recorded
- Complete audit trail maintained
- Compliant with digital prescription standards

### **Best Practices**
- Double-check medicine codes before saving
- Use generic names when possible
- Provide comprehensive instructions
- Set realistic follow-up schedules
- Maintain professional language

---

## 💡 Tips for Efficient Prescribing

### **Quick Search Techniques**
- Type medicine codes directly (e.g., "AC" for Paracetamol)
- Use partial names for quick results
- Common medicines appear first in suggestions

### **Dosage Shortcuts**
- Use simple numbers: "1", "2", "1/2"
- Standard durations: 3, 5, 7 days for most conditions
- Common frequencies: BD (twice daily) most common

### **Instruction Templates**
- Use common instruction dropdown for speed
- Build personal templates for frequent conditions
- Keep instructions clear and actionable

---

## 🔒 Security & Privacy

### **Data Protection**
- All prescription data encrypted
- HIPAA compliant storage
- Secure transmission protocols
- Access logging and monitoring

### **Patient Privacy**
- No patient data stored locally
- All data on secure servers
- Access controls in place
- Regular security audits

---

## 📞 Support & Contact

For technical support or questions about the prescription system:

**Technical Support:** support@bharattelemed.com
**Medical Queries:** medical@bharattelemed.com
**Emergency Support:** +91-9876543210

---

*This documentation is regularly updated. Last updated: December 2024*