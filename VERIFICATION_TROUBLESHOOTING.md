# Verification Troubleshooting Guide

## Issue: "Fails to verify" when analyst tries to verify reports

### Quick Diagnosis Steps

#### Step 1: Check Backend Logs
Look for these log messages in the backend console:
- `🔍 Analyst verification request:`
- `📝 Verification details:`
- `🔄 Updating report status to:`
- `✅ Report X verified/rejected by analyst Y`

#### Step 2: Check Frontend Console
Look for these log messages in browser console:
- `🔍 Verifying report as analyst:`
- `✅ Verification successful:`
- `❌ Verification failed:`

#### Step 3: Check Database (MongoDB)
Use Mongo shell or your GUI to verify data:
```bash
# Pending for analyst
# status: submitted or in_review
```

#### Step 4: Test API Directly
```bash
node test-verification.js
```

### Common Issues and Solutions

#### Issue 1: No Reports Available for Verification
**Symptoms:** 
- Analyst dashboard shows "No reports pending verification"
- Backend logs show empty results for pending reports

**Solutions:**
1. Create a report via the app as a citizen/officer
2. Ensure report status is `submitted` or `in_review`
3. Confirm via API:
   ```bash
   curl -H "Authorization: Bearer <analystToken>" http://localhost:4000/api/verification/analyst/pending
   ```

#### Issue 2: Permission Denied (403 Error)
**Symptoms:**
- Frontend shows "Access denied" error
- Backend logs show "❌ Access denied - not an analyst"

**Solutions:**
1. Check user role in token payload (localStorage) is `analyst`
2. Re-login as analyst

#### Issue 3: Report Not Found (404 Error)
**Symptoms:**
- Frontend shows "Report not found" error
- Backend logs show "❌ Report not found: X"

**Solutions:**
1. Confirm the report `_id` exists in MongoDB
2. Refresh the page to reload data

#### Issue 4: Database Connection Issues
**Symptoms:**
- Backend logs show Mongo connection errors
- 500 server error responses

**Solutions:**
1. Ensure MongoDB is running and `MONGODB_URI`/`MONGODB_DB` are correct in `backend/.env`
2. Restart backend after updating env vars

#### Issue 5: Invalid Request Data
**Symptoms:**
- Backend logs show "❌ Invalid verified field type"
- 400 Bad Request errors

**Solutions:**
1. Ensure `verified` field is boolean (true/false)
2. Check browser console for request details

### Manual Testing Steps

#### Test 1: Verify Database Has Data
- Ensure at least one user with role `analyst`
- Ensure at least one report with status `submitted` or `in_review`

#### Test 2: Test API Endpoints
```bash
node test-verification.js
```
Expected:
- Verification test endpoint works
- Analyst pending reports endpoint works (with valid token)

#### Test 3: Test Frontend Flow
1. Login as analyst
2. Go to Analyst Dashboard
3. Click "Report Verification" tab
4. Click "Review" on a report
5. Click "Verify" or "Reject"
6. Check console for success/error messages

### Expected Behavior When Working

1. Backend logs show:
```
🔍 Analyst verification request: { reportId: '...', userRole: 'analyst', ... }
📝 Verification details: { reportId: '...', verified: true, notes: '...' }
🔄 Updating report status to: verified
✅ Report ... verified by analyst ...
```

2. Frontend logs show:
```
🔍 Verifying report as analyst: { reportId: '...', verified: true, ... }
✅ Verification successful: { success: true, report: {...}, message: "..." }
```

3. UI shows:
- Report disappears from pending list
- Success message or no error
- Modal closes automatically

### Next Steps if Still Not Working

1. Check all logs (backend console + browser console)
2. Confirm MongoDB connection and collection contents
3. Test API directly with `test-verification.js`
4. Check user authentication and role
5. Verify report exists and has correct status
6. Clear browser cache and try again
