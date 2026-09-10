import styles from './brand.module.scss'

/**
 * The mark and wordmark, shared by the site header and the footer.
 *
 * The kit draws these as the same Brand frame in both places — 11862:2929 and
 * 11844:289119 agree down to the asset, the 22px mark, the 10px gap and the
 * Title/3 wordmark. They were built separately here and promptly diverged: the
 * footer ended up with a primary-container swatch at 28px against the header's
 * image at 22px. One component is what stops that happening a third time.
 *
 * Not a governed component: this is site chrome, which governance rule 6 keeps
 * out of components/ui/ by construction.
 */
export function Brand() {
  return (
    <span className={styles.brand}>
      {/* The kit's own Mark asset, committed rather than linked — Figma's
          export URLs expire after a week. Sized on both axes so a failed load
          cannot stretch it to its intrinsic 280px. */}
      <img className={styles.mark} src="/graphite/mark.png" alt="" />
      <span className={styles.wordmark}>Graphite UI</span>
    </span>
  )
}
