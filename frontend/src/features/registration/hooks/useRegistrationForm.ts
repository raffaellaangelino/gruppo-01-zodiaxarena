import { useQuery } from '@tanstack/react-query'
import { useState, type ChangeEvent } from 'react'
import { ApiError } from '@/lib/http'
import { useAuth } from '@/features/auth/useAuth'
import { registerRequest } from '@/features/registration/api'
import { useNicknameCheck } from '@/features/registration/hooks/useNicknameCheck'
import {
  BIRTH_DATE_MESSAGES,
  NICKNAME_MESSAGES,
  EMAIL_MESSAGES,
  PASSWORD_RULES,
  SERVER_FIELD_MESSAGES,
  STEP_ORDER,
  passwordProblem,
} from '@/features/registration/messages'
import { registrationPreviewQuery } from '@/features/registration/queries'
import type {
  AccountValues,
  BirthDateValues,
  RegistrationFailure,
  RegistrationStep,
  ServerFieldError,
} from '@/features/registration/types'
import {
  checkPassword,
  isEmailValid,
  isNicknameFormatValid,
  isPasswordValid,
  toBirthDate,
} from '@/features/registration/validation'

type AccountField = keyof AccountValues

/** Dove il backend può segnalare un errore: i tre campi dell'account, la data, le conferme. */
type ServerErrorTarget = AccountField | 'birthDate' | 'consents'

/** Proprietà da passare a un campo del passo "Account". */
export interface AccountFieldProps {
  name: AccountField
  value: string
  onChange: (event: ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  /** Messaggio d'errore; vince sull'indicazione. */
  error?: string
  /** Indicazione sotto il campo, verde se il campo è valido. */
  hint?: string
  valid: boolean
}

/** Passo in cui il giocatore corregge un errore del backend. */
const STEP_OF_TARGET: Record<ServerErrorTarget, RegistrationStep> = {
  nickname: 'account',
  email: 'account',
  password: 'account',
  birthDate: 'sign',
  consents: 'confirm',
}

/** Nome del campo nel backend → dove sta nel modulo, e quale errore mostrare. */
const BACKEND_FIELDS: Record<string, { target: ServerErrorTarget; error: ServerFieldError }> = {
  nickName: { target: 'nickname', error: 'nicknameInvalid' },
  email: { target: 'email', error: 'emailInvalid' },
  password: { target: 'password', error: 'passwordInvalid' },
  birthDate: { target: 'birthDate', error: 'birthDateInvalid' },
  acceptedTerms: { target: 'consents', error: 'consentMissing' },
  ageConfirmed: { target: 'consents', error: 'consentMissing' },
}

/** Un nickname con caratteri non ammessi o troppo lungo si segnala subito, senza aspettare l'uscita dal campo. */
const NICKNAME_CANNOT_BECOME_VALID = /[^A-Za-z0-9_]|^.{17,}$/

/**
 * Traduce l'errore della registrazione negli errori dei campi da mostrare.
 *
 * @param error Errore lanciato da `registerRequest`.
 * @returns Gli errori per campo, oppure il motivo generale.
 */
function readRegisterError(
  error: unknown,
):
  | { fields: Partial<Record<ServerErrorTarget, ServerFieldError>> }
  | { failure: RegistrationFailure } {
  if (!(error instanceof ApiError)) return { failure: 'server' }
  if (error.isNetworkError) return { failure: 'network' }
  if (error.code === 'EMAIL_TAKEN') return { fields: { email: 'emailTaken' } }
  if (error.code === 'NICKNAME_TAKEN') return { fields: { nickname: 'nicknameTaken' } }
  if (error.status === 400) {
    const fields: Partial<Record<ServerErrorTarget, ServerFieldError>> = {}
    for (const name of Object.keys(error.fieldErrors)) {
      const known = BACKEND_FIELDS[name]
      if (known) fields[known.target] = known.error
    }
    if (Object.keys(fields).length > 0) return { fields }
  }
  return { failure: 'server' }
}

/**
 * Stato e comportamento della registrazione a tre passi, separati dalla grafica.
 *
 * - **Account:** nickname controllato mentre lo si scrive, email e password con le regole sotto
 *   il campo. "Continua" è attivo solo con tutto in regola (FOUNDATIONS §6b-decies).
 * - **Il tuo segno:** quando la data è completa il backend calcola segno, Fazione proposta e
 *   primo cielo, e la scena li mostra. "Continua" si attiva con la risposta.
 * - **Conferma:** riepilogo e due conferme obbligatorie, poi la creazione dell'account.
 * - "Indietro" non perde nulla di quanto scritto.
 * - Se il backend rifiuta un dato (email o nickname già usati, un campo non valido), si torna
 *   al passo di quel campo con l'errore sotto il campo. Scriverci di nuovo lo toglie.
 * - Se va tutto bene, la sessione si apre e la pagina cambia da sola (GuestOnly).
 *
 * @returns Passo, campi, anteprima, azioni e stato dell'invio.
 */
export function useRegistrationForm() {
  const { startSession } = useAuth()
  const [step, setStep] = useState<RegistrationStep>('account')
  const [account, setAccount] = useState<AccountValues>({ nickname: '', email: '', password: '' })
  const [touched, setTouched] = useState<Partial<Record<AccountField, boolean>>>({})
  const [birthDate, setBirthDate] = useState<BirthDateValues>({ day: '', month: '', year: '' })
  const [consents, setConsents] = useState({ terms: false, age: false })
  const [serverErrors, setServerErrors] = useState<
    Partial<Record<ServerErrorTarget, ServerFieldError>>
  >({})
  const [failure, setFailure] = useState<RegistrationFailure | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const nickname = account.nickname.trim()
  const nicknameStatus = useNicknameCheck(account.nickname)
  const passwordCheck = checkPassword(account.password)
  const passwordValid = isPasswordValid(passwordCheck)
  const emailValid = isEmailValid(account.email)

  const birth = toBirthDate(birthDate)
  const birthIso = 'date' in birth ? birth.date : null
  const preview = useQuery({ ...registrationPreviewQuery(birthIso ?? ''), enabled: !!birthIso })

  /** Toglie l'errore del backend da un campo quando il giocatore lo cambia. */
  const clearServerError = (target: ServerErrorTarget) => {
    setServerErrors(({ [target]: _removed, ...rest }) => rest)
    setFailure(null)
  }

  const nicknameError = (() => {
    const server = serverErrors.nickname
    if (server === 'nicknameTaken') return NICKNAME_MESSAGES.taken(nickname)
    if (server) return SERVER_FIELD_MESSAGES.nicknameInvalid
    if (nickname && !isNicknameFormatValid(nickname)) {
      if (touched.nickname || NICKNAME_CANNOT_BECOME_VALID.test(nickname))
        return NICKNAME_MESSAGES.format
    }
    if (nicknameStatus === 'taken') return NICKNAME_MESSAGES.taken(nickname)
    return undefined
  })()

  const nicknameHint = {
    idle: undefined,
    checking: NICKNAME_MESSAGES.checking,
    available: NICKNAME_MESSAGES.available,
    taken: undefined,
    unknown: NICKNAME_MESSAGES.unknown,
  }[nicknameStatus]

  const emailError = (() => {
    const server = serverErrors.email
    if (server === 'emailTaken') return EMAIL_MESSAGES.taken
    if (server) return SERVER_FIELD_MESSAGES.emailInvalid
    if (touched.email && account.email.trim() && !emailValid) return EMAIL_MESSAGES.invalid
    return undefined
  })()

  const passwordError = (() => {
    if (serverErrors.password) return SERVER_FIELD_MESSAGES.passwordInvalid
    if (touched.password && account.password && !passwordValid)
      return passwordProblem(passwordCheck)
    return undefined
  })()

  /**
   * @param name Campo del passo "Account".
   * @returns Valore, eventi, messaggi e stato da passare al campo.
   */
  const accountField = (name: AccountField): AccountFieldProps => {
    const base = {
      name,
      value: account[name],
      onChange: (event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target
        setAccount((prev) => ({ ...prev, [name]: value }))
        clearServerError(name)
      },
      onBlur: () => setTouched((prev) => ({ ...prev, [name]: true })),
    }
    if (name === 'nickname')
      return {
        ...base,
        error: nicknameError,
        hint: nicknameHint,
        valid: nicknameStatus === 'available',
      }
    if (name === 'email') return { ...base, error: emailError, valid: false }
    return { ...base, error: passwordError, hint: PASSWORD_RULES, valid: passwordValid }
  }

  const accountReady =
    isNicknameFormatValid(nickname) &&
    (nicknameStatus === 'available' || nicknameStatus === 'unknown') &&
    !serverErrors.nickname &&
    emailValid &&
    !serverErrors.email &&
    passwordValid &&
    !serverErrors.password

  const signReady = preview.isSuccess && !serverErrors.birthDate
  const confirmReady = consents.terms && consents.age

  const birthDateError = serverErrors.birthDate
    ? SERVER_FIELD_MESSAGES.birthDateInvalid
    : 'problem' in birth && birth.problem === 'future'
      ? BIRTH_DATE_MESSAGES.future
      : undefined

  /**
   * @param part Giorno, mese o anno.
   * @param value Valore scelto.
   */
  const changeBirthDate = (part: keyof BirthDateValues, value: string) => {
    setBirthDate((prev) => ({ ...prev, [part]: value }))
    clearServerError('birthDate')
  }

  /**
   * @param name Quale conferma.
   * @param checked Spuntata o no.
   */
  const changeConsent = (name: keyof typeof consents, checked: boolean) => {
    setConsents((prev) => ({ ...prev, [name]: checked }))
    clearServerError('consents')
  }

  const goNext = () => {
    if (step === 'account' && accountReady) setStep('sign')
    else if (step === 'sign' && signReady) setStep('confirm')
  }

  const goBack = () => {
    setFailure(null)
    setStep((current) => STEP_ORDER[Math.max(0, STEP_ORDER.indexOf(current) - 1)])
  }

  const submit = async () => {
    if (!accountReady || !birthIso || !confirmReady || submitting) return
    setSubmitting(true)
    setFailure(null)
    try {
      const token = await registerRequest({
        email: account.email.trim(),
        password: account.password,
        nickName: nickname,
        birthDate: birthIso,
        acceptedTerms: consents.terms,
        ageConfirmed: consents.age,
      })
      startSession(token)
      // Riuscito: la sessione è aperta e la pagina cambia da sola (GuestOnly).
    } catch (error) {
      setSubmitting(false)
      const result = readRegisterError(error)
      if ('failure' in result) {
        setFailure(result.failure)
        return
      }
      setServerErrors(result.fields)
      const targets = Object.keys(result.fields) as ServerErrorTarget[]
      const steps = targets.map((target) => STEP_ORDER.indexOf(STEP_OF_TARGET[target]))
      setStep(STEP_ORDER[Math.min(...steps)])
    }
  }

  return {
    step,
    accountField,
    emailTaken: serverErrors.email === 'emailTaken',
    accountReady,
    birthDate,
    changeBirthDate,
    birthDateError,
    preview,
    signReady,
    summary: { nickname, email: account.email.trim() },
    consents,
    changeConsent,
    consentError: serverErrors.consents ? SERVER_FIELD_MESSAGES.consentMissing : undefined,
    confirmReady,
    goNext,
    goBack,
    submit,
    submitting,
    failure,
  }
}
