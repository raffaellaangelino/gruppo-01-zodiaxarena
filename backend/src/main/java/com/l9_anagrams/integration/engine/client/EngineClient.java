package com.l9_anagrams.integration.engine.client;

import java.net.http.HttpTimeoutException;
import java.net.SocketTimeoutException;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

import com.l9_anagrams.integration.engine.config.EngineProperties;
import com.l9_anagrams.integration.engine.dto.EngineGameRequest;
import com.l9_anagrams.integration.engine.dto.MatchParticipantSnapshot;
import com.l9_anagrams.integration.engine.exception.EngineClientException;
import com.l9_anagrams.integration.engine.mapper.EngineRequestMapper;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.json.JsonMapper;

/**
 * Client per l'invocazione dell'engine di gioco.
 *
 * <p>
 * Il client non interroga il database: il servizio chiamante deve caricare e
 * convertire in snapshot tutti i dati di entrambi i giocatori e dei rispettivi
 * mazzi selezionati prima di chiamare {@link #playMatch}. L'ordine degli
 * argomenti determina i riferimenti {@code PLAYER1} e {@code PLAYER2}
 * restituiti
 * dall'engine in caso di mazzo non valido.
 * </p>
 */
@Component
public class EngineClient {
	private static final JsonMapper ERROR_MAPPER = JsonMapper.builder().build();

	private final RestClient restClient;
	private final EngineProperties properties;
	private final EngineRequestMapper requestMapper;

	public EngineClient(RestClient engineRestClient, EngineProperties properties, EngineRequestMapper requestMapper) {
		this.restClient = engineRestClient;
		this.properties = properties;
		this.requestMapper = requestMapper;
	}

	/**
	 * Invia una partita all'engine e restituisce senza rimappatura il risultato
	 * JSON.
	 *
	 * <p>
	 * Prima della chiamata, il servizio deve fornire per ogni partecipante il
	 * giocatore con il Dio selezionato e il mazzo scelto, con Ascendente opzionale
	 * e tutte le carte creatura complete. Ogni creatura deve avere segno, pianeta,
	 * bonus del pianeta e Casa; il client non sceglie un mazzo e non recupera dati
	 * tramite repository.
	 * </p>
	 *
	 * <p>
	 * Se il seed e' presente, viene inoltrato per rendere la partita
	 * riproducibile; se e' vuoto, sara' l'engine a generarlo. Il JSON restituito
	 * contiene il risultato, il seed effettivo e il log degli eventi, che il
	 * chiamante puo' inoltrare o elaborare.
	 * </p>
	 *
	 * @param player1 snapshot del primo giocatore e del mazzo scelto; gli errori
	 *                di validazione lo identificano come {@code PLAYER1}
	 * @param player2 snapshot del secondo giocatore e del mazzo scelto; gli errori
	 *                di validazione lo identificano come {@code PLAYER2}
	 * @param seed    seed opzionale per una partita deterministica
	 * @return risposta JSON originale dell'engine
	 * @throws EngineClientException se la chiave API non e' configurata, l'engine
	 *                               non e' raggiungibile, la richiesta va in
	 *                               timeout o l'engine rifiuta il mazzo; lo stato
	 *                               HTTP e l'eventuale giocatore sono disponibili
	 *                               nell'eccezione
	 */
	public JsonNode playMatch(
			MatchParticipantSnapshot player1,
			MatchParticipantSnapshot player2,
			Optional<Long> seed) {
		if (properties.apiKey() == null || properties.apiKey().isBlank()) {
			throw new EngineClientException(HttpStatus.SERVICE_UNAVAILABLE, null,
					"Engine API key is not configured");
		}

		EngineGameRequest request = requestMapper.toEngineRequest(player1, player2, seed);
		try {
			JsonNode result = restClient.post()
					.uri("/api/play-game")
					.header("X-API-KEY", properties.apiKey())
					.contentType(MediaType.APPLICATION_JSON)
					.body(request)
					.retrieve()
					.body(JsonNode.class);
			if (result == null) {
				throw new EngineClientException(HttpStatus.BAD_GATEWAY, null,
						"Engine returned an empty response");
			}
			return result;
		} catch (RestClientResponseException exception) {
			throw mapResponseException(exception);
		} catch (ResourceAccessException exception) {
			if (hasTimeoutCause(exception)) {
				throw new EngineClientException(HttpStatus.GATEWAY_TIMEOUT, null,
						"Engine request timed out");
			}
			throw new EngineClientException(HttpStatus.SERVICE_UNAVAILABLE, null,
					"Engine is unavailable");
		}
	}

	private EngineClientException mapResponseException(RestClientResponseException exception) {
		int status = exception.getStatusCode().value();
		if (status == HttpStatus.SERVICE_UNAVAILABLE.value()) {
			return new EngineClientException(HttpStatus.SERVICE_UNAVAILABLE, null, "Engine is unavailable");
		}
		if (status == HttpStatus.GATEWAY_TIMEOUT.value()) {
			return new EngineClientException(HttpStatus.GATEWAY_TIMEOUT, null, "Engine request timed out");
		}
		if (status == HttpStatus.BAD_REQUEST.value()) {
			try {
				JsonNode body = ERROR_MAPPER.readTree(exception.getResponseBodyAsString());
				JsonNode playerNode = body.get("player");
				JsonNode messageNode = body.get("message");
				if (playerNode != null && messageNode != null) {
					return new EngineClientException(HttpStatus.BAD_REQUEST, playerNode.asString(),
							messageNode.asString());
				}
			} catch (RuntimeException ignored) {
				return new EngineClientException(HttpStatus.BAD_GATEWAY, null,
						"Engine returned an invalid deck error response");
			}
			return new EngineClientException(HttpStatus.BAD_GATEWAY, null,
					"Engine returned an invalid deck error response");
		}
		return new EngineClientException(HttpStatus.BAD_GATEWAY, null,
				"Engine returned an unexpected HTTP status: " + exception.getStatusCode().value());
	}

	private boolean hasTimeoutCause(Throwable throwable) {
		for (Throwable cause = throwable; cause != null; cause = cause.getCause()) {
			if (cause instanceof SocketTimeoutException || cause instanceof HttpTimeoutException) {
				return true;
			}
		}
		return false;
	}
}