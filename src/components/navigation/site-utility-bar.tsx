import { getVerifiedContact } from '@/config/contact';
import { SOCIAL_LABELS, socialLinks } from '@/config/social-links';

function InstagramIcon() {
  return (
    <svg
      className="site-utility-bar-icon"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="is-dot" cx="17.4" cy="6.6" r="0.85" />
    </svg>
  );
}

export function SiteUtilityBar() {
  const contact = getVerifiedContact();
  const instagram = socialLinks.find((link) => link.platform === 'instagram');

  if (!instagram && !contact.phone) {
    return null;
  }

  return (
    <div className="site-utility-bar">
      <div className="site-utility-bar-inner site-container">
        {instagram ? (
          <a
            href={instagram.href}
            className="site-utility-bar-link"
            rel="noopener noreferrer"
            target="_blank"
          >
            <InstagramIcon />
            <span>{SOCIAL_LABELS[instagram.labelKey]}</span>
          </a>
        ) : (
          <span />
        )}
        {contact.phone ? (
          <a
            href={contact.phoneHref}
            className="site-utility-bar-link"
            dir="ltr"
          >
            {contact.phone}
          </a>
        ) : null}
      </div>
    </div>
  );
}
