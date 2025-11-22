---
description: Comprehensive validation for Estimate Maker application
---

# Validate Estimate Maker

Comprehensive validation command that ensures all code quality, type safety, build integrity, and user workflows are functioning correctly.

## Phase 1: Linting

Run ESLint to check code quality and catch potential bugs:

```bash
npm run lint
```

**Expected**: No linting errors or warnings. All TypeScript/React code follows project standards.

**If errors found**: Fix ESLint violations before proceeding.

---

## Phase 2: Type Checking

Verify TypeScript compilation without emitting files:

```bash
npx tsc --noEmit
```

**Expected**: No type errors. All types are correctly defined and used.

**Critical checks**:
- All imports resolve correctly
- Type definitions match actual usage
- No `any` types slipping through
- Context providers properly typed
- Component props match interfaces

---

## Phase 3: Build Verification

Ensure the application builds successfully for production:

```bash
npm run build
```

**Expected**: Build completes without errors, generates `dist/` directory with optimized assets.

**Verify**:
- No build-time errors
- All assets are generated
- `dist/index.html` exists
- JavaScript bundles are created
- CSS is properly bundled
- Source maps are generated (if configured)

**Clean up after verification**:
```bash
rm -rf dist
```

---

## Phase 4: Code Structure Validation

### 4.1 Type Definitions Integrity

Verify all TypeScript types are properly exported and used:

```bash
# Check that all type files exist and are importable
npx tsc --noEmit --listFiles | grep -E "(types|interfaces)" | head -20
```

**Verify**:
- `src/types/estimate.ts` exports all required types
- `src/types/voice.ts` exports all voice-related types
- No circular dependencies
- All interfaces are properly defined

### 4.2 Import Resolution

Check that all imports resolve correctly:

```bash
npx tsc --noEmit 2>&1 | grep -i "cannot find module" || echo "All imports resolve correctly"
```

**Expected**: No "cannot find module" errors.

---

## Phase 5: Utility Functions Validation

### 5.1 Calculations Module

Test calculation functions for correctness:

**Manual verification checklist**:
- [ ] `calculateLineItemTotal`: quantity × unitCost = total
- [ ] `calculateCategorySubtotal`: Sums all items in a category correctly
- [ ] `calculateGrandTotal`: Sums all line items correctly
- [ ] `calculateAllocationTotal`: Sums allocations correctly
- [ ] `getUnallocatedQuantity`: Correctly calculates remaining quantity

**Test cases to verify**:
```javascript
// Test calculateLineItemTotal
// Input: { quantity: 5, unitCost: 10 }
// Expected: 50

// Test calculateGrandTotal
// Input: [{ total: 100 }, { total: 200 }, { total: 50 }]
// Expected: 350

// Test getUnallocatedQuantity
// Input: lineItemQuantity: 10, allocations: [{ quantity: 3 }, { quantity: 2 }]
// Expected: 5
```

### 5.2 Storage Module

Verify localStorage operations work correctly:

**Test in browser console** (after running dev server):
```javascript
// Test saveEstimate
const testEstimate = {
  id: 'test_123',
  projectName: 'Test Project',
  client: 'Test Client',
  address: '123 Test St',
  bidDate: '2024-01-01',
  projectType: 'Multi-Family',
  buildings: 1,
  units: 1,
  lineItems: [],
  allocations: [],
  scope: { inclusions: [], exclusions: [], deliveryTerms: [], comments: '' },
  status: 'draft',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString()
};

// Import storage (adjust import path as needed)
// await storage.saveEstimate(testEstimate);
// const loaded = await storage.getEstimate('test_123');
// console.assert(loaded?.projectName === 'Test Project', 'Save/load failed');
// await storage.deleteEstimate('test_123');
```

**Verify**:
- Estimates save to localStorage correctly
- Estimates load from localStorage correctly
- Multiple estimates can be stored
- Estimates can be deleted
- Data persists across page reloads

### 5.3 Validation Module

Test validation logic:

**Test cases**:
- [ ] Empty project name → validation error
- [ ] Empty client → validation error
- [ ] Empty address → validation error
- [ ] Missing bid date → validation error
- [ ] Invalid project type → validation error
- [ ] Buildings < 1 → validation error
- [ ] Units < 1 → validation error
- [ ] Complete estimate with line items → passes validation

### 5.4 PDF Generation Module

Verify PDF generation doesn't crash:

**Note**: Full PDF testing requires browser environment. Verify:
- [ ] `generatePDF` function exists and is callable
- [ ] No syntax errors in PDF generation code
- [ ] All required dependencies (jsPDF, autoTable) are installed
- [ ] PDF generation handles empty line items gracefully
- [ ] PDF generation handles allocations correctly
- [ ] PDF generation includes all scope details

**Browser test** (run in dev environment):
```javascript
// Create a test estimate and call generatePDF
// Verify PDF downloads without errors
```

---

## Phase 6: Component Integration Validation

### 6.1 Context Provider

Verify EstimateContext works correctly:

**Check**:
- [ ] `EstimateProvider` wraps app correctly
- [ ] `useEstimate` hook works outside provider → throws error
- [ ] `useEstimate` hook works inside provider → returns context
- [ ] Auto-save triggers on estimate changes
- [ ] New estimate creation works
- [ ] Estimate updates propagate correctly

### 6.2 Component Dependencies

Verify all components can render without crashing:

**Check imports**:
```bash
# Verify all component imports resolve
grep -r "from.*components" src/ | grep -v node_modules | head -20
```

**Manual verification** (run dev server and check browser console):
- [ ] App.tsx renders without errors
- [ ] ProjectDetailsForm renders
- [ ] LineItemTable renders
- [ ] AllocationsEditor renders
- [ ] ScopeDetailsEditor renders
- [ ] VoiceInput renders
- [ ] PDFPreview renders
- [ ] QuickAddChips renders
- [ ] ProgressPanel renders
- [ ] All common components (Button, Input, Select, Logo) render

---

## Phase 7: End-to-End User Workflow Testing

### 7.1 Complete Estimate Creation Workflow

**Test the full user journey from README.md**:

1. **Create New Estimate**
   - [ ] Click "New Estimate" button
   - [ ] New estimate is created with default values
   - [ ] Estimate ID is generated
   - [ ] Status is set to 'draft'

2. **Fill Project Details**
   - [ ] Enter project name → saved to estimate
   - [ ] Enter client name → saved to estimate
   - [ ] Enter address → saved to estimate
   - [ ] Select bid date → saved to estimate
   - [ ] Select project type → saved to estimate
   - [ ] Enter buildings count → saved to estimate
   - [ ] Enter units count → saved to estimate
   - [ ] All fields persist after page reload

3. **Add Line Items**
   - [ ] Add line item manually → appears in table
   - [ ] Edit line item description → updates correctly
   - [ ] Edit quantity → total recalculates automatically
   - [ ] Edit unit cost → total recalculates automatically
   - [ ] Change category → item moves to correct category
   - [ ] Delete line item → removed from table
   - [ ] Grand total updates correctly
   - [ ] Category subtotals calculate correctly

4. **Voice Input** (if OpenAI API key configured)
   - [ ] Click "Start Voice Input" → recording starts
   - [ ] Speak line item → transcribed correctly
   - [ ] Parsed data appears in estimate
   - [ ] Multiple items can be added via voice
   - [ ] Project details can be updated via voice
   - [ ] Scope details can be updated via voice
   - [ ] Error handling works if API fails

5. **Quick Add Chips**
   - [ ] Quick add chips are visible
   - [ ] Clicking chip adds item to estimate
   - [ ] Items are added with correct defaults

6. **Allocations**
   - [ ] Add allocation for line item → appears in list
   - [ ] Edit allocation quantity → total recalculates
   - [ ] Cannot allocate more than available quantity
   - [ ] Delete allocation → removed correctly
   - [ ] Unallocated quantity displays correctly

7. **Scope Details**
   - [ ] Add inclusion → saved to estimate
   - [ ] Add exclusion → saved to estimate
   - [ ] Add delivery term → saved to estimate
   - [ ] Add comment → saved to estimate
   - [ ] All scope details persist

8. **Save Estimate**
   - [ ] Click "Save" button → estimate saved to localStorage
   - [ ] Auto-save triggers after 1 second of inactivity
   - [ ] Multiple estimates can be saved
   - [ ] Estimates persist across browser sessions

9. **PDF Generation**
   - [ ] Click "Preview PDF" → preview page loads
   - [ ] PDF preview displays all estimate data
   - [ ] Click "Generate PDF" → PDF downloads
   - [ ] PDF contains project details
   - [ ] PDF contains all line items
   - [ ] PDF contains grand total
   - [ ] PDF contains allocations (if any)
   - [ ] PDF contains scope details
   - [ ] PDF filename matches project name

10. **Progress Panel**
    - [ ] Progress panel shows completion status
    - [ ] Progress updates as estimate is filled
    - [ ] All sections tracked correctly

### 7.2 Error Handling & Edge Cases

**Test error scenarios**:

- [ ] Missing OpenAI API key → graceful error message
- [ ] Invalid estimate data → validation errors shown
- [ ] Empty estimate → PDF generation handles gracefully
- [ ] Very large numbers → calculations don't overflow
- [ ] Special characters in project name → handled correctly
- [ ] localStorage quota exceeded → error handled gracefully
- [ ] Network error during voice transcription → error shown

### 7.3 Data Integrity

**Verify data consistency**:

- [ ] Line item totals always match quantity × unitCost
- [ ] Grand total always matches sum of line items
- [ ] Allocation totals match quantity × unitCost
- [ ] Unallocated quantity never exceeds line item quantity
- [ ] Estimate updatedAt timestamp updates on changes
- [ ] No data loss on page reload
- [ ] Estimates don't interfere with each other

---

## Phase 8: External Integration Validation

### 8.1 OpenAI API Integration

**If API key is configured** (`VITE_OPENAI_API_KEY`):

- [ ] Whisper API transcription works
- [ ] GPT-4 parsing works
- [ ] Error handling for API failures
- [ ] Rate limiting handled gracefully
- [ ] API key validation on app load

**If API key is NOT configured**:

- [ ] App loads without crashing
- [ ] Voice input shows appropriate error message
- [ ] Manual input still works

### 8.2 Browser Compatibility

**Test in multiple browsers**:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari
- [ ] Mobile browsers (iOS Safari, Chrome Mobile)

**Verify**:
- [ ] localStorage works in all browsers
- [ ] PDF generation works in all browsers
- [ ] Voice recording works (if supported)
- [ ] All CSS styles render correctly

---

## Phase 9: Performance Validation

### 9.1 Build Performance

```bash
# Measure build time
time npm run build
```

**Expected**: Build completes in reasonable time (< 30 seconds for this project size).

### 9.2 Runtime Performance

**Browser DevTools checks** (run in dev mode):

- [ ] No console errors or warnings
- [ ] No memory leaks (check Memory tab)
- [ ] Components render quickly
- [ ] Large estimates (100+ line items) render without lag
- [ ] PDF generation completes in < 5 seconds

---

## Phase 10: Deployment Readiness

### 10.1 Environment Variables

**Verify**:
- [ ] `.env.local` template exists (if needed)
- [ ] `netlify.toml` configured correctly
- [ ] Environment variables documented in README
- [ ] Build works without environment variables (graceful degradation)

### 10.2 Production Build

```bash
# Clean build
rm -rf dist node_modules/.vite
npm run build

# Verify build output
ls -la dist/
```

**Verify**:
- [ ] `dist/index.html` exists
- [ ] All assets are in `dist/assets/`
- [ ] No source maps in production (if configured)
- [ ] File sizes are reasonable
- [ ] `_redirects` file is present (for Netlify)

### 10.3 Netlify Configuration

**Check `netlify.toml`**:
- [ ] Build command is correct
- [ ] Publish directory is `dist`
- [ ] Redirects are configured
- [ ] Environment variables documented

---

## Quick Validation Script

Run this script to perform basic validation quickly:

```bash
#!/bin/bash
set -e

echo "🔍 Phase 1: Linting..."
npm run lint

echo "✅ Phase 2: Type Checking..."
npx tsc --noEmit

echo "🏗️  Phase 3: Build Verification..."
npm run build
rm -rf dist

echo "✅ Basic validation complete!"
```

Save as `validate.sh`, make executable: `chmod +x validate.sh`

---

## Validation Checklist Summary

Before considering the application production-ready, verify:

- [x] **Code Quality**: Linting passes
- [x] **Type Safety**: TypeScript compilation succeeds
- [x] **Build**: Production build completes successfully
- [x] **Calculations**: All math functions work correctly
- [x] **Storage**: localStorage operations work
- [x] **Validation**: Form validation works
- [x] **PDF Generation**: PDFs generate without errors
- [x] **Components**: All components render correctly
- [x] **User Workflows**: Complete estimate creation flow works
- [x] **Error Handling**: Errors are handled gracefully
- [x] **Data Integrity**: No data loss or corruption
- [x] **External APIs**: OpenAI integration works (if configured)
- [x] **Browser Compatibility**: Works in major browsers
- [x] **Performance**: Acceptable load times
- [x] **Deployment**: Ready for Netlify deployment

---

## Notes

- **Voice Input Testing**: Requires OpenAI API key. If not available, skip voice-related tests but verify error handling.
- **Browser Testing**: Some validations require manual browser testing. Use browser DevTools to verify.
- **E2E Testing**: Consider adding automated E2E tests with Playwright or Cypress for future iterations.
- **Unit Tests**: Currently no unit test framework configured. Consider adding Jest/Vitest for utility function testing.

---

## If Validation Fails

1. **Linting errors**: Fix code style issues, unused variables, etc.
2. **Type errors**: Fix type mismatches, missing types, incorrect imports
3. **Build errors**: Check for missing dependencies, incorrect imports, syntax errors
4. **Runtime errors**: Check browser console, verify all dependencies are installed
5. **Workflow failures**: Test manually in browser, check component state management

**Always fix issues before deploying to production.**

