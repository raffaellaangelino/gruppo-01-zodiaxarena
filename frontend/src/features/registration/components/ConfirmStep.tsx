import { Link } from 'react-router'
import { PATHS } from '@/app/paths'
import { Checkbox } from '@/components/ui/Checkbox'
import { FieldMessage } from '@/components/ui/FieldMessage'
import { FormAlert } from '@/components/ui/FormAlert'
import { GoldButton } from '@/components/ui/GoldButton'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { GOD_LABELS, SIGN_GLYPHS, SIGN_LABELS } from '@/domain/labels'
import { SignReveal } from '@/features/registration/components/SignReveal'
import { REGISTRATION_FAILURE_MESSAGES } from '@/features/registration/messages'
import type { RegistrationFailure, RegistrationPreview } from '@/features/registration/types'

/** Proprietà di {@link ConfirmStep}. */
export interface ConfirmStepProps {
  summary: { nickname: string; email: string }
  preview: RegistrationPreview
  consents: { terms: boolean; age: boolean }
  onConsentChange: (name: 'terms' | 'age', checked: boolean) => void
  consentError?: string
  ready: boolean
  submitting: boolean
  failure: RegistrationFailure | null
  onBack: () => void
}

/**
 * Passo 3 · Conferma (tavola Registrati-Conferma): il riepilogo, le due conferme obbligatorie
 * e il pulsante eroico "Crea l'account" (l'unico della schermata), con "Indietro" alla stessa altezza.
 *
 * Rispetto alla tavola, "Termini" non è un collegamento: la pagina dei Termini non esiste ancora,
 * e niente collegamenti a vuoto. L'Informativa privacy invece c'è.
 */
export function ConfirmStep({
  summary,
  preview,
  consents,
  onConsentChange,
  consentError,
  ready,
  submitting,
  failure,
  onBack,
}: ConfirmStepProps) {
  const rows = [
    { label: 'Nickname', value: summary.nickname },
    { label: 'Email', value: summary.email },
    {
      label: 'Il tuo segno',
      value: (
        <>
          Sole in {SIGN_LABELS[preview.sign]}{' '}
          <span aria-hidden="true" className="font-symbol">
            {SIGN_GLYPHS[preview.sign]}
          </span>
        </>
      ),
    },
    {
      label: 'Fazione proposta',
      value: `${GOD_LABELS[preview.proposedGod].name} · la sceglierai dopo`,
    },
  ]

  return (
    <>
      {failure && <FormAlert>{REGISTRATION_FAILURE_MESSAGES[failure]}</FormAlert>}
      <dl className="flex flex-col">
        {rows.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-baseline justify-between gap-4 border-t border-line-soft py-2.5"
          >
            <dt className="text-text-muted type-body">{label}</dt>
            <dd className="min-w-0 truncate text-right text-text type-body-strong">{value}</dd>
          </div>
        ))}
      </dl>
      <div className="md:hidden">
        <SignReveal preview={preview} variant="compact" />
      </div>
      <div className="flex flex-col gap-2.5 pt-3">
        <Checkbox
          checked={consents.terms}
          onChange={(event) => onConsentChange('terms', event.target.checked)}
          required
        >
          Accetto i <span className="font-extrabold text-gold-bright">Termini</span> e l'
          <Link
            to={PATHS.privacy}
            target="_blank"
            className="font-extrabold text-gold-bright no-underline"
          >
            Informativa privacy
          </Link>
        </Checkbox>
        <Checkbox
          checked={consents.age}
          onChange={(event) => onConsentChange('age', event.target.checked)}
          required
        >
          Ho almeno 14 anni
        </Checkbox>
        {consentError && (
          <FieldMessage id="consensi-errore" tone="error">
            {consentError}
          </FieldMessage>
        )}
      </div>
      <div className="mt-2 flex items-center gap-3">
        <SecondaryButton size="l" onClick={onBack} disabled={submitting} className="w-36">
          Indietro
        </SecondaryButton>
        <GoldButton
          hero
          size="l"
          type="submit"
          disabled={!ready}
          busy={submitting}
          className="flex-1"
        >
          {submitting ? 'Creazione…' : "Crea l'account"}
        </GoldButton>
      </div>
    </>
  )
}
