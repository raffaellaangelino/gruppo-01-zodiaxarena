import type { UseQueryResult } from '@tanstack/react-query'
import { GoldButton } from '@/components/ui/GoldButton'
import { InlineError } from '@/components/ui/InlineError'
import { SecondaryButton } from '@/components/ui/SecondaryButton'
import { BirthDateFields } from '@/features/registration/components/BirthDateFields'
import { SignReveal } from '@/features/registration/components/SignReveal'
import { BIRTH_DATE_MESSAGES } from '@/features/registration/messages'
import type { BirthDateValues, RegistrationPreview } from '@/features/registration/types'

/** Proprietà di {@link SignStep}. */
export interface SignStepProps {
  birthDate: BirthDateValues
  onChange: (part: keyof BirthDateValues, value: string) => void
  error?: string
  preview: UseQueryResult<RegistrationPreview>
  ready: boolean
  onBack: () => void
}

/**
 * Passo 2 · Il tuo segno (tavola Registrati-Segno): la data di nascita. Il segno appare nella
 * scena accanto (su mobile, in una riga sotto la data) appena il backend l'ha calcolato.
 */
export function SignStep({ birthDate, onChange, error, preview, ready, onBack }: SignStepProps) {
  return (
    <>
      <BirthDateFields value={birthDate} onChange={onChange} error={error} />
      {preview.isError && (
        <InlineError
          message={BIRTH_DATE_MESSAGES.previewFailed}
          onRetry={() => void preview.refetch()}
        />
      )}
      {preview.isSuccess && (
        <div className="md:hidden">
          <SignReveal preview={preview.data} variant="compact" />
        </div>
      )}
      <div className="mt-2 flex items-center gap-3">
        <SecondaryButton onClick={onBack} className="w-36">
          Indietro
        </SecondaryButton>
        <GoldButton type="submit" disabled={!ready} className="flex-1">
          Continua
        </GoldButton>
      </div>
    </>
  )
}
