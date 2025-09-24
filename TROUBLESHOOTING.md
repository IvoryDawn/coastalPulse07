# Troubleshooting Guide: Reports Not Fetching

## Quick Diagnosis Steps

### Step 1: Check Backend Server
```bash
# Make sure backend is running
cd backend
npm start

# Check if server is responding
curl http://localhost:4000/api/health
```

### Step 2: Check Database
```bash
# Run database check
cd backend
node check-database.js
```

### Step 3: Test API Endpoints
```bash
# Test all endpoints
node test-reports.js
```

### Step 4: Check Frontend Console
1. Open browser developer tools (F12)
2. Go to Console tab
3. Look for error messages when loading profile page
4. Check Network tab for failed API calls

## Common Issues and Solutions

### Issue 1: 404 Error on API Calls
**Symptoms:** Console shows "Failed to load resource: 404 (Not Found)"

**Solutions:**
1. **Backend not running:** Start backend server
2. **Wrong API base URL:** Check `VITE_API_BASE` in frontend/.env
3. **Route not registered:** Verify routes are added to app.js

### Issue 2: 403 Forbidden Error
**Symptoms:** Console shows "Access denied" or 403 status

**Solutions:**
1. **Role restrictions:** Check if user has correct role
2. **Token expired:** Re-login to get new token
3. **API permissions:** Verify role-based access in backend

### Issue 3: 500 Server Error
**Symptoms:** Console shows "Server error" or 500 status

**Solutions:**
1. **Database connection:** Check if database is running
2. **Missing tables:** Run database migrations
3. **SQL errors:** Check backend logs for specific errors

### Issue 4: Empty Reports Array
**Symptoms:** Profile loads but shows "No reports submitted yet"

**Solutions:**
1. **No data in database:** Create some test reports
2. **Wrong user ID:** Check if reports belong to current user
3. **Database query issues:** Check SQL queries in backend

## Debugging Commands

### Check Database Content
```bash
cd backend
node check-database.js
```

### Test API Endpoints
```bash
node test-reports.js
```

### Check Backend Logs
Look for these log messages in backend console:
- `🔍 Fetching reports for user:`
- `✅ Found X reports for user`
- `❌ Error fetching user reports:`

### Check Frontend Logs
Look for these log messages in browser console:
- `🔍 Fetching profile stats...`
- `🔍 Fetching profile reports...`
- `✅ Stats data:`
- `✅ Reports data:`

## Manual Testing

### Test 1: Create a Test Report
1. Login as any user
2. Go to Report Form
3. Submit a test report
4. Check if it appears in Profile page

### Test 2: Check Database Directly
```sql
-- Connect to your database and run:
SELECT * FROM reports;
SELECT * FROM users;
```

### Test 3: Test API with curl
```bash
# Get user token from browser localStorage
TOKEN="your_token_here"

# Test profile stats
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/profile/stats

# Test profile reports
curl -H "Authorization: Bearer $TOKEN" http://localhost:4000/api/profile/reports
```

## Expected Behavior

### When Working Correctly:
1. Backend logs show: `✅ Found X reports for user`
2. Frontend logs show: `✅ Reports data: [...]`
3. Profile page displays user's reports
4. No console errors

### When Not Working:
1. Backend logs show errors
2. Frontend console shows 404/403/500 errors
3. Profile page shows "No reports submitted yet"
4. Network tab shows failed API calls

## Next Steps

If issues persist:
1. Check backend console for specific error messages
2. Check browser console for detailed error information
3. Verify database has data
4. Test API endpoints individually
5. Check user authentication and roles
