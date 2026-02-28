# 🧪 User Management - Quick Test Guide

## 🚀 Getting Started

### Start Development Server
```bash
cd /workspaces/shop-website
npm run dev
```

Access the application at: `http://localhost:5173/`

---

## 🔐 Login Credentials

### Admin User (Access User Management)
- **Username**: `admin`
- **Password**: `Admin@123`

### Staff User (NO Access to User Management)
- **Username**: `staff`
- **Password**: `Staff@123`

---

## 📋 Testing Workflows

### Test 1: Add a New User

1. Login with **Admin** credentials
2. Navigate to **Users** in sidebar → **User Management**
3. Click **➕ Add User** button
4. Fill in form:
   - **Name**: `Test Cashier`
   - **Email**: `testcashier@shop.com`
   - **Role**: `Cashier`
   - **Status**: `Active`
5. Click **Create User**
6. ✅ Verify: New user appears in table

**Test Variations**:
- Try adding with empty name (should show error)
- Try duplicate email (should show error)
- Try invalid email format (should show error)
- Create Manager and Staff roles

---

### Test 2: Edit Existing User

1. Click **✏️ Edit** next to any user
2. Modal opens with pre-filled data
3. Change:
   - Name to: `Updated Name`
   - Role to: `Manager`
4. Click **Update User**
5. ✅ Verify: Changes appear in table immediately

---

### Test 3: Block/Unblock User

#### Quick Toggle (from table)
1. Click **🚫 Block** button next to Active user
2. ✅ Verify: Status changes to Blocked (✗ Blocked)
3. Click **✓ Unblock** button
4. ✅ Verify: Status changes back to Active (✓ Active)

#### Via Modal Edit
1. Click **✏️ Edit** on any user
2. Change Status dropdown to opposite
3. Click **Update User**
4. ✅ Verify: Status updated in table

---

### Test 4: Delete User

1. Click **🗑️ Delete** next to a user
2. Confirmation dialog appears with message:
   - "Are you sure you want to delete this user?"
3. Click **OK** to confirm
4. ✅ Verify: User removed from table

**Test Cancel**:
1. Click **🗑️ Delete** again
2. Click **Cancel** in confirmation
3. ✅ Verify: User still appears in table

---

### Test 5: Filter Users

#### Filter by Role
1. Click **Cashiers** tab
2. ✅ Verify: Only Cashier role users displayed
3. Count updates: "Cashiers (X)"
4. Click **Managers** tab
5. ✅ Verify: Only Manager role users displayed
6. Click **All Users** to reset

#### Filter by Status
1. Click **Active** tab
2. ✅ Verify: Only active (✓) status users shown
3. ✅ Verify: Blocked users hidden
4. Click **All Users** to reset

---

### Test 6: Form Validation

#### Test Missing Name
1. Click **➕ Add User**
2. Leave Name empty
3. Fill other fields
4. Click **Create User**
5. ✅ Verify: Red border on Name field + error message

#### Test Invalid Email
1. Click **➕ Add User**
2. Enter Email: `invalidemail`
3. Click **Create User**
4. ✅ Verify: Error message: "Invalid email format"

#### Test Duplicate Email
1. Add user with email: `test@shop.com`
2. Try to add another with same email
3. ✅ Verify: Error message: "Email already exists"

#### Test Duplicate on Edit
1. Create User A with email `a@shop.com`
2. Create User B with email `b@shop.com`
3. Edit User B, change email to `a@shop.com`
4. ✅ Verify: Error message: "Email already exists"
5. Change to different email - should work

---

### Test 7: Modal Interaction

#### Test Close Button
1. Click **➕ Add User**
2. Click **✕** (close button)
3. ✅ Verify: Modal closes, form resets

#### Test Cancel Button
1. Click **➕ Add User**
2. Fill some fields
3. Click **Cancel**
4. ✅ Verify: Modal closes, data discarded

#### Test Form Reset After Save
1. Click **➕ Add User**
2. Create a user
3. Click **➕ Add User** again
4. ✅ Verify: Form is empty (reset)

---

### Test 8: Responsive Design

#### Desktop View (>1024px)
1. Open browser at full width
2. ✅ Verify:
   - Table shows all columns
   - Modal at 500px width
   - Two-column footer buttons

#### Tablet View (768-1024px)
1. Reduce browser width to 800px
2. ✅ Verify:
   - Table still readable
   - Modal responsive
   - All buttons accessible

#### Mobile View (<768px)
1. Reduce browser width to 480px
2. ✅ Verify:
   - Table scrollable horizontally
   - Modal full width
   - Footer buttons stacked vertically
   - Buttons large enough to touch

---

### Test 9: Tab Filtering with Counts

1. ✅ Verify each tab shows user count:
   - "All Users (X)" - Total users
   - "Cashiers (Y)" - Number of Cashiers
   - "Managers (Z)" - Number of Managers
   - "Active (W)" - Number of Active users
2. Add new user as Cashier
3. ✅ Verify count updates automatically

---

### Test 10: User Table Information

#### Verify Table Shows:
- ✅ User Name (bold)
- ✅ Email address
- ✅ Role (as badge)
- ✅ Status (with icon: ✓ or ✗)
- ✅ Login Count (number)
- ✅ Joined date (YYYY-MM-DD)
- ✅ Action buttons (Edit, Block, Delete)

---

## 📊 Sample Test Data

After testing, you should have users like:

| Name | Email | Role | Status | Logins | Joined |
|------|-------|------|--------|--------|--------|
| John Doe | john@shop.com | Cashier | Active | 45 | 2025-01-15 |
| Jane Smith | jane@shop.com | Manager | Active | 23 | 2025-02-10 |
| Bob Wilson | bob@shop.com | Cashier | Blocked | 12 | 2025-01-20 |
| Test Cashier | testcashier@shop.com | Cashier | Active | 0 | 2026-02-27 |

---

## ✅ Checklist

### Core Functionality
- [ ] Add user with all fields
- [ ] Edit user details
- [ ] Delete user with confirmation
- [ ] Block/Unblock user (both methods)
- [ ] View all users in table
- [ ] Filter by role (Cashiers, Managers)
- [ ] Filter by status (Active)

### Form Validation
- [ ] Name - Required field validation
- [ ] Email - Format validation
- [ ] Email - Uniqueness validation
- [ ] Email - Duplicate on edit validation
- [ ] Role - Dropdown working
- [ ] Status - Dropdown working

### UX/UI
- [ ] Modal opens smoothly (slide-up animation)
- [ ] Modal closes on ✕ button
- [ ] Modal closes on Cancel button
- [ ] Form resets after save
- [ ] Error messages show in red
- [ ] Table updates immediately
- [ ] Tab counts update correctly
- [ ] Buttons have hover effects

### Responsive
- [ ] Desktop layout (>1024px)
- [ ] Tablet layout (768-1024px)
- [ ] Mobile layout (<768px)
- [ ] Modal responsive
- [ ] Table scrollable on mobile

### Accessibility
- [ ] All buttons have titles (hover text)
- [ ] Error messages clear
- [ ] Form labels visible
- [ ] Touch-friendly on mobile
- [ ] Focus states visible

---

## 🐛 Common Issues & Solutions

### Issue: Modal won't submit
**Check**:
- All required fields filled
- No validation errors (red borders)
- Email is unique
- Email format is valid

### Issue: Changes not appearing
**Solution**:
- Refresh page (F5)
- Check data in table
- Verify filter tabs not hiding data

### Issue: Delete button not working
**Check**:
- Confirm dialog appeared
- Clicked OK (not Cancel)
- User is in current filtered view

### Issue: Form reset not working
**Check**:
- Page needs refresh
- Or try adding another user

---

## 🎯 Success Criteria

✅ All tests passing = Feature Complete!

**You should be able to**:
1. ✅ Add new users with validation
2. ✅ Edit user information
3. ✅ Block/Unblock users
4. ✅ Delete users (with confirmation)
5. ✅ Filter by role and status
6. ✅ See live count updates
7. ✅ Use responsive design on all devices

---

## 📱 Testing on Different Browsers

### Chrome/Edge
- [ ] All features working
- [ ] Modal animations smooth
- [ ] Form validation working

### Firefox
- [ ] All features working
- [ ] Styling correct
- [ ] Performance good

### Safari
- [ ] All features working
- [ ] Mobile layout correct
- [ ] Touch gestures responsive

---

## 🔗 Next Steps

### When Backend Ready:
1. Replace mock data array with API calls
2. Add `useEffect` for fetching users
3. Connect CRUD operations to backend
4. Add loading states
5. Add error handling
6. Implement email notifications

### Additional Features:
- [ ] Bulk user import
- [ ] User activity logs
- [ ] Permission management
- [ ] Password reset emails
- [ ] Two-factor authentication

---

## 📞 Getting Help

If tests fail:
1. Check browser console (F12) for errors
2. Verify all form fields are filled
3. Check email is unique
4. Refresh page (F5)
5. Restart dev server

---

**Happy Testing! 🎉**

For detailed documentation, see `USER_MANAGEMENT_GUIDE.md`
