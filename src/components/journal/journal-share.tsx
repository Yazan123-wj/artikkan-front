'use client';

import { useState } from 'react';

type JournalShareProps = {
  url: string;
  title: string;
  shareLabel: string;
  whatsappLabel: string;
  linkedinLabel: string;
  copyLabel: string;
  copiedLabel: string;
  copyFailedLabel: string;
};

type CopyStatus = 'idle' | 'copied' | 'error';

export function JournalShare({
  url,
  title,
  shareLabel,
  whatsappLabel,
  linkedinLabel,
  copyLabel,
  copiedLabel,
  copyFailedLabel,
}: JournalShareProps) {
  const [status, setStatus] = useState<CopyStatus>('idle');
  const shareText = `${title} ${url}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error('Clipboard unavailable');
      }

      await navigator.clipboard.writeText(url);
      setStatus('copied');
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="journal-share">
      <p className="journal-share-label">{shareLabel}</p>
      <ul className="journal-share-list">
        <li>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {whatsappLabel}
          </a>
        </li>
        <li>
          <a
            href={linkedinHref}
            target="_blank"
            rel="noopener noreferrer"
          >
            {linkedinLabel}
          </a>
        </li>
        <li>
          <button type="button" className="journal-share-copy" onClick={copyLink}>
            {copyLabel}
          </button>
        </li>
      </ul>
      <p className="journal-share-status" aria-live="polite">
        {status === 'copied' ? copiedLabel : null}
        {status === 'error' ? copyFailedLabel : null}
      </p>
      {status === 'error' ? (
        <input
          className="journal-share-fallback"
          value={url}
          readOnly
          aria-label={copyFailedLabel}
          onFocus={(event) => event.currentTarget.select()}
        />
      ) : null}
    </div>
  );
}
