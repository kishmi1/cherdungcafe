# Vercel मा Payment Gateway समस्या समाधान

## समस्या: Local मा काम गर्छ तर Vercel मा गर्दैन

तपाईंको समस्याको मुख्य कारण Vercel मा environment variables properly set गरिएको छैन।

## समाधान: Vercel मा Environment Variables Set गर्नुहोस्

Vercel project dashboard मा यी variables add गर्नुहोस्:

### 1. APP_URL (महत्त्वपूर्ण - सबै payment gateways को लागि)
```
APP_URL=https://your-app.vercel.app
```
तपाईंको actual Vercel domain राख्नुहोस्। यो Khalti र eSewa दुवैको return URL को लागि आवश्यक छ।

### 2. Khalti Variables
```
KHALTI_SECRET_KEY=your_khalti_secret_key
```

### 3. eSewa Variables
```
ESEWA_PRODUCT_CODE=your_esewa_product_code
ESEWA_SECRET_KEY=your_esewa_secret_key
```

### 4. अन्य Required Variables
```
DATABASE_URL=your_database_url
BREVO_API_KEY=your_brevo_api_key
EMAIL_FROM=no-reply@yourdomain.com
```

## Vercel मा Configure गर्ने Steps:

1. Vercel project dashboard मा जानुहोस्
2. Settings → Environment Variables मा जानुहोस्
3. माथि दिइएको सबै variables add गर्नुहोस्
4. Variables add गरेपछि redeploy गर्नुहोस्

## महत्त्वपूर्ण नोट:

- **APP_URL** सबैभन्दा महत्त्वपूर्ण variable हो - यो बिना कुनै payment gateway काम गर्दैन
- Code मा automatic Vercel detection थपिएको छ, तर APP_URL set गर्नु राम्रो
- Local मा sandbox credentials use गरिरहनुहुन्छ, Vercel मा पनि same credentials use गर्न सक्नुहुन्छ
- Variables add गरेपछि अवश्य redeploy गर्नुहोस्