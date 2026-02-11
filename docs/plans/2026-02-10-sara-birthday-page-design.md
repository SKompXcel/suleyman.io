# Sara's 19th Birthday Page Design

**Route:** `/sara-stinks`
**Purpose:** Password-protected birthday surprise with photo carousel and heartfelt message
**Date:** February 10, 2026

## Overview

A three-part experience: password lock screen → heartfelt message → auto-playing photo carousel with Polaroid-style frames. Responsive, elegant, and playful.

---

## Visual Aesthetic

**Style:** Soft & elegant meets minimalist luxury
- Pastel gradients: blush pink → lavender → cream
- Gold accents throughout
- Serif font for heartfelt message
- Modern sans-serif for UI elements
- Clean lines, generous spacing
- Subtle animations, no corniness

---

## User Flow

### 1. Password Lock Screen

**Layout:**
- Full-screen centered content
- Soft gradient background (blush pink → lavender → cream)
- Gold lock icon with gentle pulse animation
- Question in elegant serif: *"Who's your favourite brother?"*
- Clean text input with gold border (glows on focus)
- Submit button or Enter key to submit

**Interaction:**
- Password: "suleyman" (case-insensitive)
- Wrong answer: Shake animation + hint message ("Try again... hint: it's not Suleyman... jk it definitely is")
- Correct answer: Gold sparkle particle effect → smooth fade out

**Responsive:**
- Mobile: Full screen, vertically centered, touch-friendly input
- Desktop: Same layout, slightly larger typography

---

### 2. Intro & Message Section

**After unlock, smooth fade-in to:**

**Intro block:**
- Small gold sparkle icon
- Text: *"I wanted to build you something special to show my appreciation. Happy 19th Birthday, Sara. 🤍"*
- Modern sans-serif font
- Continues gradient background

**Main message card:**
- Frosted glass effect container
- Serif font for readability and elegance
- Generous line spacing
- Gold accent border on left edge
- Message content:

```
Hi Sara,

Today's a big day. It's honestly kind of bittersweet.

I don't really know where to start, so I'll keep it simple. You once told me I inspire you. That's one of the best things an older brother can hear. But you should know you inspire me every day too. You're a big reason I work as hard as I do.

This past year has been stressful, and I know you've carried a lot on your shoulders. I see it. And I'm genuinely grateful for it. It makes me proud — and it makes me happy, even if I don't always say it properly.

I wish I could do more for you and for the whole family. Inshallah, one day I will.

I'm also grateful for the age gap. I got to watch you grow into who you are — from the tiny little menace running around my legs (little chinese minion)… to the day I watched you start at McMaster… to now. It's been a blessing seeing you become the person you've become.

And for the record, you're the glue of this family. Mama and Baba raised us to protect our only sister like it's a job title, and honestly… fair. You have this way of calming everyone down when things get heated, like you're the family's option.

I won't make this too sadies. Just know I'm always here. If you need me, I'm one call away. I hope you take comfort in that.

So, from the proudest, strongest, most handsomest brother in the world (objectively, scientifically, unanimously agreed upon):

Happy Birthday, Sara. 🤍

Love,
Suleyman

You're ugly and fat
```

- The ending line styled slightly differently (italics or smaller) for playful contrast

**Responsive:**
- Mobile: Full width with padding, scrollable
- Desktop: Max-width ~700px, centered, more spacious

---

### 3. Photo Carousel

**Source:** Images from `public/SaraBDAY/`

**Polaroid Frame Design:**
- White frames with classic thick bottom border
- Soft drop shadows for depth
- Slight rotation (alternating -2° and 2°) for organic, scattered look
- Photos centered within frame

**Carousel Features:**
- **Auto-play:** 4-second intervals, smooth fade + slide transition
- **Manual controls:**
  - Gold arrow buttons (left/right) - visible on hover (desktop), always visible (mobile)
  - Play/Pause button (gold icon, top-right corner)
  - Dot indicators at bottom (gold for active, light gray for inactive)
- **Touch support:** Swipe gestures work on mobile
- **Keyboard support:** Arrow keys navigate (desktop)

**Background:** Continues soft gradient, slightly darker for photo contrast

**Responsive:**
- Mobile: Single photo fills most screen width, Polaroid scales proportionally
- Desktop: Larger centered photo with more breathing room

---

## Technical Implementation

**Framework:** Next.js 16 (App Router)
**Styling:** Tailwind CSS
**Animations:** Framer Motion
**Image optimization:** Next.js Image component

**File structure:**
- Route: `src/app/sara-stinks/page.tsx`
- Images: `public/SaraBDAY/` (already populated)

**Key components to build:**
1. `PasswordLock` - Lock screen with validation
2. `MessageSection` - Intro + heartfelt message
3. `PhotoCarousel` - Polaroid frames with auto-play controls

---

## Animations & Polish

**Micro-interactions:**
- Page load: Gentle fade-in
- Lock screen unlock: Gold sparkle particle effect dispersing
- Scroll reveal: Message and carousel fade up
- Carousel transitions: 0.6s crossfade
- Polaroid entrance: Subtle "drop in" effect
- Hover states: Arrow buttons grow slightly, gold glow

**Background:**
- Animated gradient that slowly shifts between pastel tones
- Smooth, barely noticeable movement

**Optional:**
- Very subtle confetti burst on correct password

---

## Success Criteria

- ✅ Works beautifully on mobile and desktop
- ✅ Password is case-insensitive "suleyman"
- ✅ Auto-play carousel with manual controls
- ✅ Elegant, boujee but not corny aesthetic
- ✅ Fast loading with optimized images
- ✅ Smooth animations, no jank
- ✅ Touch-friendly on mobile
- ✅ Keyboard accessible on desktop

---

## Notes

- Keep it lightweight and fast
- Test on mobile Safari and Chrome
- Ensure images are optimized (use Next.js Image)
- YAGNI: No unnecessary features, keep it focused on the experience
