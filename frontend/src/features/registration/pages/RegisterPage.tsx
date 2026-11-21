import { useEffect, useRef, type FormEvent } from 'react'
import { PATHS } from '@/app/paths'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { StepIndicator } from '@/components/progress/StepIndicator'
import { AuthSwitchLink } from '@/features/auth/components/AuthSwitchLink'
import { AccountStep } from '@/features/registration/components/AccountStep'
import { ConfirmStep } from '@/features/registration/components/ConfirmStep'
import { SignReveal } from '@/features/registration/components/SignReveal'
import { SignStep } from '@/features/registration/components/SignStep'
import { useRegistrationForm } from '@/features/registration/hooks/useRegistrationForm'
import { STEP_LABELS, STEP_ORDER, STEP_TEXTS } from '@/features/registration/messages'

/**
 * Registrazione a tre passi (S02, tavole Registrati, Registrati-Segno, Registrati-Conferma,
 * Registrati-Errori): Account → Il tuo segno → Conferma, nella colonna dell'accesso.
 * Dal secondo passo, appena il segno è calcolato, la scena accanto lo mostra con il primo cielo.
 *
 * La logica è in {@link useRegistrationForm}; qui c'è solo l'impaginazione. A ogni cambio di passo
 * il focus va al titolo, così chi usa uno screen reader sente dove si trova.
 */
export function RegisterPage() {
  const form = useRegistrationForm()
  const { step, preview } = form
  const headingRef = useRef<HTMLHeadingElement>(null)
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }
    headingRef.current?.focus()
  }, [step])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (step === 'confirm') void form.submit()
    else form.goNext()
  }

  const { title, subtitle } = STEP_TEXTS[step]
  const scene =
    step !== 'account' && preview.isSuccess ? (
      <SignReveal preview={preview.data} variant="scene" />
    ) : undefined

  return (
    <AuthLayout scene={scene}>
      <title>Registrati · Zodiax Arena</title>
      <div className="flex flex-col gap-6">
        <StepIndicator steps={STEP_LABELS} current={STEP_ORDER.indexOf(step)} />
        <header className="flex flex-col gap-2">
          <h1
            ref={headingRef}
            tabIndex={-1}
            className="text-text outline-none type-h1-m md:type-h1"
          >
            {title}
          </h1>
          <p className="text-text-soft type-body">{subtitle}</p>
        </header>

        <form noValidate onSubmit={handleSubmit} className="flex flex-col gap-4">
          {step === 'account' && (
            <AccountStep
              field={form.accountField}
              emailTaken={form.emailTaken}
              ready={form.accountReady}
            />
          )}
          {step === 'sign' && (
            <SignStep
              birthDate={form.birthDate}
              onChange={form.changeBirthDate}
              error={form.birthDateError}
              preview={preview}
              ready={form.signReady}
              onBack={form.goBack}
            />
          )}
          {step === 'confirm' && preview.isSuccess && (
            <ConfirmStep
              summary={form.summary}
              preview={preview.data}
              consents={form.consents}
              onConsentChange={form.changeConsent}
              consentError={form.consentError}
              ready={form.confirmReady}
              submitting={form.submitting}
              failure={form.failure}
              onBack={form.goBack}
            />
          )}
        </form>

        <AuthSwitchLink question="Hai già un account?" label="Accedi" to={PATHS.login} />
      </div>
    </AuthLayout>
  )
}
