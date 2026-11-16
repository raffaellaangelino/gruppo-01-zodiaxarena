package com.l9_anagrams.dto;

import com.l9_anagrams.enums.OnboardingStep;

public record PlayerOnboardingDto(boolean completed, OnboardingStep currentStep) {
}