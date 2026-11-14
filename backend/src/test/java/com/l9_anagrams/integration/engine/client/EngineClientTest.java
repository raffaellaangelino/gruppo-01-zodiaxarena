package com.l9_anagrams.integration.engine.client;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.header;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.jsonPath;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.method;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withBadRequest;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withStatus;

import java.net.SocketTimeoutException;
import java.time.Duration;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

import com.l9_anagrams.entity.SignType;
import com.l9_anagrams.enums.God;
import com.l9_anagrams.enums.House;
import com.l9_anagrams.integration.engine.config.EngineProperties;
import com.l9_anagrams.integration.engine.dto.CreatureCardSnapshot;
import com.l9_anagrams.integration.engine.dto.DeckSnapshot;
import com.l9_anagrams.integration.engine.dto.MatchParticipantSnapshot;
import com.l9_anagrams.integration.engine.dto.PlanetSnapshot;
import com.l9_anagrams.integration.engine.dto.PlayerSnapshot;
import com.l9_anagrams.integration.engine.dto.SignSnapshot;
import com.l9_anagrams.integration.engine.exception.EngineClientException;
import com.l9_anagrams.integration.engine.mapper.EngineRequestMapper;

class EngineClientTest {
	@Test
	void postsMappedRequestWithApiKeyAndReturnsEngineJson() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://engine.test");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		EngineClient client = new EngineClient(
				builder.build(), properties("api-secret"), new EngineRequestMapper());
		server.expect(requestTo("http://engine.test/api/play-game"))
				.andExpect(method(HttpMethod.POST))
				.andExpect(header("X-API-KEY", "api-secret"))
				.andExpect(jsonPath("$.player1.god").value("ERA"))
				.andExpect(jsonPath("$.player1.cards[0].sign.element").value("FUOCO"))
				.andExpect(jsonPath("$.player1.cards[0].house").value("I"))
				.andExpect(jsonPath("$.seed").value(42))
				.andRespond(withSuccess("{\"outcome\":\"PLAYER1_WINS\"}", MediaType.APPLICATION_JSON));

		var result = client.playMatch(participant(), participant(), Optional.of(42L));

		assertEquals("PLAYER1_WINS", result.get("outcome").asString());
		server.verify();
	}

	@Test
	void preservesDeckOwnerFromEngineValidationResponse() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://engine.test");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		EngineClient client = new EngineClient(
				builder.build(), properties("api-secret"), new EngineRequestMapper());
		server.expect(requestTo("http://engine.test/api/play-game"))
				.andRespond(withBadRequest().body("{\"player\":\"PLAYER2\",\"message\":\"invalid deck\"}")
						.contentType(MediaType.APPLICATION_JSON));

		EngineClientException error = assertThrows(EngineClientException.class,
				() -> client.playMatch(participant(), participant(), Optional.empty()));

		assertEquals(HttpStatus.BAD_REQUEST, error.status());
		assertEquals("PLAYER2", error.player());
		assertEquals("invalid deck", error.getMessage());
		server.verify();
	}

	@Test
	void mapsTransportTimeoutToGatewayTimeout() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://engine.test");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		EngineClient client = new EngineClient(
				builder.build(), properties("api-secret"), new EngineRequestMapper());
		server.expect(requestTo("http://engine.test/api/play-game"))
				.andRespond(request -> {
					throw new SocketTimeoutException("timed out");
				});

		EngineClientException error = assertThrows(EngineClientException.class,
				() -> client.playMatch(participant(), participant(), Optional.empty()));

		assertEquals(HttpStatus.GATEWAY_TIMEOUT, error.status());
	}

	@Test
	void mapsEngineUnavailableResponseToServiceUnavailable() {
		RestClient.Builder builder = RestClient.builder().baseUrl("http://engine.test");
		MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
		EngineClient client = new EngineClient(
				builder.build(), properties("api-secret"), new EngineRequestMapper());
		server.expect(requestTo("http://engine.test/api/play-game"))
				.andRespond(withStatus(HttpStatus.SERVICE_UNAVAILABLE));

		EngineClientException error = assertThrows(EngineClientException.class,
				() -> client.playMatch(participant(), participant(), Optional.empty()));

		assertEquals(HttpStatus.SERVICE_UNAVAILABLE, error.status());
		server.verify();
	}

	private static EngineProperties properties(String apiKey) {
		return new EngineProperties("http://engine.test", apiKey, Duration.ofSeconds(2), Duration.ofSeconds(5));
	}

	private static MatchParticipantSnapshot participant() {
		CreatureCardSnapshot card = new CreatureCardSnapshot(
				new SignSnapshot("Ariete", SignType.FIRE, 13, 7),
				new PlanetSnapshot("Sole", 9, 8),
				House.I);
		return new MatchParticipantSnapshot(
				new PlayerSnapshot(God.ERA),
				new DeckSnapshot(Optional.empty(), List.of(card)));
	}
}