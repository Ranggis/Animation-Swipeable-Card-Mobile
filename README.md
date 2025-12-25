<h1 align="center">Advanced Swipeable Card Stack (React Native)</h1>

<p align="center">
  <img src="https://raw.githubusercontent.com/Ranggis/Api-Image/main/Preview.gif" alt="Swipe Preview" width="300" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React_Native-0.72+-20232A?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Reanimated-3.x-blueviolet?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Gesture_Handler-2.x-orange?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Expo-Compatible-success?style=for-the-badge" />
  <img src="https://img.shields.io/badge/License-MIT-lightgrey?style=for-the-badge" />
</p>

---

## Overview

This repository contains an **advanced swipeable card stack interaction** built with **React Native**, **Reanimated v3**, and **React Native Gesture Handler**.
The implementation focuses on **natural motion**, **gesture-driven physics**, and **high-performance animations** suitable for production-grade mobile applications.

The component is inspired by modern discovery-based mobile interfaces, but designed with **clean architecture** and **precise animation control** rather than visual gimmicks.

---

## Interaction Design Principles

### Gesture-Based Decision Making

Swipe resolution is determined using **both translation distance and swipe velocity**, ensuring intuitive behavior:

* Short or slow gestures snap back
* Fast flicks trigger dismissal
* Direction is inferred automatically

This creates a balance between **precision** and **responsiveness**.

---

### Real-Time Visual Feedback

During swipe interaction, the top card dynamically:

* Elevates vertically (lift effect)
* Scales up slightly
* Rotates proportionally to horizontal movement

All effects are driven by shared animated values and calculated on the **UI thread**, maintaining smooth 60 FPS performance.

---

### Stack Progress Synchronization

A global animated value synchronizes background cards:

* Progressive scaling
* Vertical offset interpolation
* Seamless promotion of the next card

This avoids unnecessary re-renders and preserves animation continuity.

---

### Controlled Spring Physics

Spring animations are tuned to prevent jitter and overshoot:

* High damping for stability
* Overshoot clamping enabled
* Predictable rest thresholds

Result: cards stop **exactly** at their target position without bounce artifacts.

---

## Component Architecture

```
SwipeableCard (Root)
 └─ Card (Reusable Component)
     ├─ Pan Gesture Handler
     ├─ Animated Transforms
     ├─ Icon Overlays (Like / Dislike)
     └─ Text Overlay
```

Each card is isolated, reusable, and controlled entirely through shared animated values.

---

## Tech Stack

* React Native
* React Native Reanimated v3
* React Native Gesture Handler
* Expo Vector Icons
* Safe Area Context

All animations run on the **UI thread**, ensuring optimal performance on both Android and iOS.

---

## Performance Considerations

* No `setState` calls during gesture updates
* No layout recalculation during animation
* GPU-friendly transforms only (`translate`, `scale`, `rotate`)
* Minimal memory overhead

The component is safe to use in **large-scale applications**.

---

## Use Cases

* Dating or matching applications
* Discovery-based browsing interfaces
* Card-based onboarding flows
* Media or product exploration apps

---

## Customization

Easily adjustable parameters include:

* Swipe sensitivity
* Card dimensions
* Stack depth and spacing
* Rotation intensity
* Spring configuration

All core values are centralized for maintainability.

---

## Author

**Ranggis**
Created with coffee ☕ and a strong focus on interaction design, animation physics, and clean React Native architecture.
