import type { PasswordCheck } from '@/features/registration/validation'
import type { RegistrationFailure, RegistrationStep } from '@/features/registration/types'

/**
 * Testi della registrazione (tavole Registrati, Registrati-Segno, Registrati-Conferma,
 * Registrati-Errori). Ogni errore dice cosa è successo e cosa fare.
 */

/** Nomi dei passi, nell'ordine dell'indicatore. */
export const STEP_LABELS = ['Account', 'Il tuo segno', 'Conferma'] as const

/** Ordine dei passi. */
export const STEP_ORDER: readonly RegistrationStep[] = ['account', 'sign', 'confirm']

/** Titolo e sottotitolo di ogni passo. */
export const STEP_TEXTS: Record<RegistrationStep, { title: string; subtitle: string }> = {
  account: {
    title: 'Crea il tuo account',
    subtitle: 'Il nome con cui ti conosceranno gli altri Astromanti.',
  },
  sign: {
    title: 'Quando sei nato?',
    subtitle: 'Le stelle di quel giorno decidono il tuo primo cielo.',
  },
  confirm: {
    title: 'Tutto pronto',
    subtitle: 'Controlla e crea il tuo account: Ermes ti aspetta.',
  },
}

export const NICKNAME_MESSAGES = {
  format: 'Da 3 a 16 caratteri: lettere, numeri e trattino basso (_).',
  checking: 'Controllo se è libero…',
  available: 'Disponibile · è il nome che vedranno gli altri',
  unknown: "Non riusciamo a controllarlo ora: lo verifichiamo quando crei l'account.",
  /**
   * @param nickname Nickname già usato.
   * @returns Il messaggio.
   */
  taken: (nickname: string) => `${nickname} è già usato da un altro Astromante.`,
}

export const EMAIL_MESSAGES = {
  invalid: "Controlla l'email: manca qualcosa (es. nome@esempio.it).",
  taken: 'Esiste già un account con questa email.',
}

/** Le regole della password, come indicazione sotto il campo. */
export const PASSWORD_RULES = 'Almeno 8 caratteri · una lettera e un numero'

/**
 * Cosa manca alla password, in una riga (tavola Registrati-Errori: "Almeno 8 caratteri · manca un numero").
 *
 * @param check Regole non rispettate.
 * @returns Il messaggio.
 */
export function passwordProblem(check: PasswordCheck): string {
  if (check.tooLong) return 'Al massimo 72 caratteri.'
  const missing = [
    check.missingLetter && 'manca una lettera',
    check.missingNumber && 'manca un numero',
  ].filter(Boolean)
  return [check.tooShort && 'Almeno 8 caratteri', ...missing].filter(Boolean).join(' · ')
}

export const BIRTH_DATE_MESSAGES = {
  hint: 'Ci serve per il tuo segno. Salviamo solo il segno, non la data.',
  future: "Questa data non è ancora arrivata: controlla l'anno.",
  previewFailed: 'Non riusciamo a leggere il tuo segno. Controlla la connessione e riprova.',
}

/** Errori del backend su un campo che il controllo nel browser non può prevedere. */
export const SERVER_FIELD_MESSAGES = {
  nicknameInvalid: NICKNAME_MESSAGES.format,
  emailInvalid: EMAIL_MESSAGES.invalid,
  passwordInvalid: PASSWORD_RULES,
  birthDateInvalid: 'Il server non ha accettato questa data: controllala e riprova.',
  consentMissing: "Per creare l'account servono entrambe le conferme.",
}

export const REGISTRATION_FAILURE_MESSAGES: Record<RegistrationFailure, string> = {
  network: 'Non riusciamo a raggiungere il server. Controlla la connessione e riprova.',
  server: 'Qualcosa non ha funzionato da parte nostra. Riprova tra poco.',
}

/** Nomi dei mesi per il selettore della data. */
export const MONTHS = [
  'gennaio',
  'febbraio',
  'marzo',
  'aprile',
  'maggio',
  'giugno',
  'luglio',
  'agosto',
  'settembre',
  'ottobre',
  'novembre',
  'dicembre',
] as const
