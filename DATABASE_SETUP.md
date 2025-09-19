# Database Setup Guide

## ⚠️ Important: Database Tables Required

The prescription system requires database tables to be created. If you're getting the error:

```
Error saving prescription: Failed to create prescription
```

This means the database tables haven't been created yet.

## 🚀 Quick Setup

### Step 1: Fix Missing Columns First

⚠️ **If you got "diagnosis column not found" error:**

1. Open your **Supabase Dashboard**
2. Go to **SQL Editor**
3. Copy and paste the contents of `database/fix_prescriptions_table.sql`
4. Click **Run** (this adds missing columns to your existing prescriptions table)

### Step 2: Run the SAFE Migration Script

1. Copy and paste the contents of `database/safe_medicine_migration.sql`
2. Click **Run** (this adds the medicine system)

**OR** if you have direct database access:

```sql
\i database/fix_prescriptions_table.sql
\i database/safe_medicine_migration.sql
```

### Step 2: Verify Tables Created

After running the script, you should see these tables:
- ✅ `medicines` - Medicine master data (AC=Paracetamol, etc.)
- ✅ `prescription_medicines` - Individual medicines per prescription
- ✅ `medicine_frequencies` - Frequency options (OD, BD, TDS, etc.)
- ✅ `prescriptions` - Main prescription records (should already exist)

### Step 3: Test the System

1. Go to `/teleconsultation` page
2. Open **Prescription Builder**
3. Add a medicine (search should work now)
4. Save prescription (should work without errors)

## 🔍 Troubleshooting

### Error: "Medicine tables not found"
- **Cause**: Migration script not run
- **Solution**: Run the SQL migration script in Supabase

### Error: "Failed to create prescription"
- **Cause**: Database permissions or missing tables
- **Solution**: Check Supabase logs and ensure RLS policies are correct

### Error: "No medicines found"
- **Cause**: Sample medicine data not inserted
- **Solution**: The migration script includes sample medicines (AC, IB, AZ, etc.)

## 🎯 What Gets Created

### Sample Medicines
- **AC** - Paracetamol (500mg tablet)
- **IB** - Ibuprofen (400mg tablet)
- **AZ** - Azithromycin (250mg tablet)
- **OM** - Omeprazole (20mg capsule)
- And 13 more common medicines...

### Auto-Generated Codes
When you prescribe:
- **AC** (Paracetamol)
- **2** tablets
- **7** days

System generates: **AC-2-7** automatically! 🎉

## ✅ Success Indicators

You'll know it's working when:
1. Medicine search shows actual medicines from database
2. Prescription saving shows "Prescription saved successfully!"
3. No more "table does not exist" errors
4. Console shows ✅ success messages

---

**Need help?** Check the browser console (F12) for detailed error messages.