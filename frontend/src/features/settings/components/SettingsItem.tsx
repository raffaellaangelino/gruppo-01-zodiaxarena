import type { ReactNode } from 'react'

interface SettingsItemProps {
  title: string
  description: string
  value?: string
  actionLabel?: string
  onAction?: () => void
  control?: ReactNode
}

/** Riga compatta per un valore o una preferenza modificabile. */
export function SettingsItem({
  title,
  description,
  value,
  actionLabel,
  onAction,
  control,
}: SettingsItemProps) {
  return (
    <div className="settings-item">
      <div className="settings-item__copy">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
      <div className="settings-item__control">
        {control ?? (
          <>
            {value && <span className="settings-item__value">{value}</span>}
            {actionLabel && onAction && (
              <button type="button" className="settings-item__action" onClick={onAction}>
                {actionLabel}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  )
}

interface SettingsSwitchProps {
  label: string
  checked: boolean
  onChange: () => void
}

/** Interruttore accessibile per una preferenza locale. */
export function SettingsSwitch({ label, checked, onChange }: SettingsSwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      className={`settings-switch${checked ? ' settings-switch--on' : ''}`}
      onClick={onChange}
    >
      <span />
    </button>
  )
}
