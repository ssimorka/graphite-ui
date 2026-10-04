'use client'

import { useId, useState } from 'react'
import type { ComponentProps } from 'react'
import { KitIcon } from '@/components/kit-icon'
import { TextInput } from './text-input'
import styles from './password-input.module.scss'

/**
 * Contract: docs/contracts/password-input.md (1.0.0)
 *
 * The kit's Password input - Default (5621:280380) and - Fluid (68771:7312):
 * the governed Text input, masked, with the kit's eye at the end to show what
 * was typed. Show text is the reader's toggle, not a prop.
 */

type PasswordInputProps = Omit<ComponentProps<typeof TextInput>, 'type' | 'trailing'>

export function PasswordInput({ id, disabled, ...rest }: PasswordInputProps) {
  const auto = useId()
  const inputId = id ?? auto
  const [shown, setShown] = useState(false)
  const off = disabled || rest.state === 'disabled'

  return (
    <div className={styles.password}>
      <TextInput
        {...rest}
        id={inputId}
        disabled={disabled}
        type={shown ? 'text' : 'password'}
        autoComplete={rest.autoComplete ?? 'current-password'}
        spellCheck={false}
        trailing={
          <button
            type="button"
            className={styles.toggle}
            aria-label="Show password"
            aria-pressed={shown}
            aria-controls={inputId}
            disabled={off}
            onClick={() => setShown((s) => !s)}
          >
            <KitIcon name={shown ? 'eye-crossed' : 'eye'} />
          </button>
        }
      />
    </div>
  )
}
