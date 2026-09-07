# Vercel मा Khalti Payment समस्या समाधान

## समस्या: Local मा काम गर्छ तर Vercel मा गर्दैन

तपाईंको समस्याको मुख्य कारण Vercel मा environment variables properly set गरिएको छैन।

## समाधान: Vercel मा Environment Variables Set गर्नुहोस्

Vercel project dashboard मा यी variables add गर्नुहोस्:

### 1. APP_URL (महत्त्वपूर्ण)
```
APP_URL=https://your-app.vercel.app
```
तपाईंको actual Vercel domain राख्नुहोस्। यो Khalti return URL को लागि आवश्यक छ।

### 2. KHALTI_SECRET_KEY
```
KHALTI_SECRET_KEY=your_khalti_secret_key
```
तपाईंको Khalti secret key।

### 3. अन्य Required Variables
```
DATABASE_URL=your_database_url
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@yourdomain.com
```

## Vercel मा Configure गर्ने Steps:

1. Vercel project dashboard मा जानुहोस्
2. Settings → Environment Variables मा जानुहोस्
3. माथि दिइएको variables add गर्नुहोस्
4. Variables add गरेपछि redeploy गर्नुहोस्

## महत्त्वपूर्ण नोट:

- तपाईं local मा sandbox Khalti credentials use गरिरहनुहुन्छ, त्यसैले code मा sandbox URL छ
- Vercel मा पनि same sandbox credentials use गर्न सक्नुहुन्छ यदि तपाईं testing गर्दै हुनुहुन्छ
- मुख्य कुरा APP_URL properly set हुनुपर्छ
- Code change गर्नुपर्दैन, केवल environment variables set गर्नुहोस्