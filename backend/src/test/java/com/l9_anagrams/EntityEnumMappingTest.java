package com.l9_anagrams;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;

import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import java.lang.reflect.Field;

import org.junit.jupiter.api.Test;

import com.l9_anagrams.dto.CardDefinitionResponseDto;
import com.l9_anagrams.entity.CardDefinition;
import com.l9_anagrams.entity.Planet;
import com.l9_anagrams.entity.Player;
import com.l9_anagrams.entity.Sign;
import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.House;

class EntityEnumMappingTest {
	@Test
	void godAndCardHouseEnumsAreStoredByName() throws ReflectiveOperationException {
		assertStringEnum(Player.class, "god");
		assertStringEnum(CardDefinition.class, "house");
	}

	@Test
	void creaturesDefaultToCasaOneAndAscendantsHaveNoHouse() {
		Sign sign = new Sign("Ariete", SignType.FIRE, 7, 13);
		Planet planet = new Planet("Sole", 1, 8, 9);
		CardDefinition creature = new CardDefinition(sign, planet, "creature.png");
		CardDefinition ascendant = new CardDefinition(sign, "ascendant.png");

		assertEquals(House.I, creature.getHouse());
		assertNull(ascendant.getHouse());
		assertEquals(House.I, CardDefinitionResponseDto.from(creature).house());
		assertNull(CardDefinitionResponseDto.from(ascendant).house());
	}

	private static void assertStringEnum(Class<?> type, String fieldName) throws ReflectiveOperationException {
		Field field = type.getDeclaredField(fieldName);
		assertEquals(EnumType.STRING, field.getAnnotation(Enumerated.class).value());
	}
}