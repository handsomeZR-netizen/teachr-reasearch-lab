# Turbopack Chinese Path Fix

## Problem
Next.js 16 uses Turbopack by default, which has a bug handling Chinese characters in file paths. Your project is in:
`C:\Users\86151\Desktop\网页需求材料\code`

The Chinese characters (网页需求材料) cause Turbopack to crash with:
```
byte index X is not a char boundary; it is inside '网'/'页' (bytes X..Y)
```

## Solution

### Move the project to a path without Chinese characters:

1. **Close all terminals and editors**

2. **Move the folder** (choose one):
   ```cmd
   # Option 1: Move to Desktop root
   move "C:\Users\86151\Desktop\网页需求材料\code" "C:\Users\86151\Desktop\code"
   
   # Option 2: Create a projects folder
   mkdir "C:\Users\86151\projects"
   move "C:\Users\86151\Desktop\网页需求材料\code" "C:\Users\86151\projects\teacher-lab"
   ```

3. **Open the new location in your editor**

4. **Run the build**:
   ```cmd
   npm run build
   ```

## Alternative (Not Recommended)
Downgrade to Next.js 15 which doesn't use Turbopack by default:
```cmd
npm install next@15
```

But this loses Next.js 16 features and React 19 improvements.
