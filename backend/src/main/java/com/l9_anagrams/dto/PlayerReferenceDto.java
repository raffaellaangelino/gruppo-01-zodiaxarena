package com.l9_anagrams.dto;

import com.l9_anagrams.entity.Player;

public record PlayerReferenceDto(Long id, String nickname) {
	public static PlayerReferenceDto from(Player player) {
		return new PlayerReferenceDto(player.getId(), player.getNickName());
	}
}
