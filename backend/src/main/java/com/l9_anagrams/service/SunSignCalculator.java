package com.l9_anagrams.service;

import java.time.LocalDate;
import java.time.MonthDay;
import java.util.List;

import org.springframework.stereotype.Component;

@Component
public class SunSignCalculator {
	private static final List<DateRange> RANGES = List.of(
			new DateRange("Capricorno", MonthDay.of(12, 22), MonthDay.of(1, 19)),
			new DateRange("Acquario", MonthDay.of(1, 20), MonthDay.of(2, 18)),
			new DateRange("Pesci", MonthDay.of(2, 19), MonthDay.of(3, 20)),
			new DateRange("Ariete", MonthDay.of(3, 21), MonthDay.of(4, 19)),
			new DateRange("Toro", MonthDay.of(4, 20), MonthDay.of(5, 20)),
			new DateRange("Gemelli", MonthDay.of(5, 21), MonthDay.of(6, 20)),
			new DateRange("Cancro", MonthDay.of(6, 21), MonthDay.of(7, 22)),
			new DateRange("Leone", MonthDay.of(7, 23), MonthDay.of(8, 22)),
			new DateRange("Vergine", MonthDay.of(8, 23), MonthDay.of(9, 22)),
			new DateRange("Bilancia", MonthDay.of(9, 23), MonthDay.of(10, 22)),
			new DateRange("Scorpione", MonthDay.of(10, 23), MonthDay.of(11, 21)),
			new DateRange("Sagittario", MonthDay.of(11, 22), MonthDay.of(12, 21)));

	public String calculateName(LocalDate birthDate) {
		if (birthDate == null) {
			throw new IllegalArgumentException("Birth date is required");
		}

		MonthDay monthDay = MonthDay.from(birthDate);
		return RANGES.stream()
				.filter(range -> range.contains(monthDay))
				.findFirst()
				.orElseThrow(() -> new IllegalStateException("No Sun sign range for " + birthDate))
				.signName();
	}

	private record DateRange(String signName, MonthDay start, MonthDay end) {
		private boolean contains(MonthDay date) {
			if (start.compareTo(end) <= 0) {
				return date.compareTo(start) >= 0 && date.compareTo(end) <= 0;
			}
			return date.compareTo(start) >= 0 || date.compareTo(end) <= 0;
		}
	}
}