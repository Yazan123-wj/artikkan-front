import { getVerifiedContact } from '@/config/contact';
import { SOCIAL_LABELS, socialLinks } from '@/config/social-links';

function InstagramIcon() {
  return (
    <svg
      className="site-header-contact-icon"
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

export function SiteHeaderContact() {
  const contact = getVerifiedContact();
  const instagram = socialLinks.find((link) => link.platform === 'instagram');

  if (!instagram && !contact.phone) {
    return null;
  }

  return (
    <div className="site-header-contact">
      {instagram ? (
        <a
          href={instagram.href}
          className="site-header-contact-link"
          rel="noopener noreferrer"
          target="_blank"
        >
          <InstagramIcon />
          <span className="site-header-contact-label">
            {SOCIAL_LABELS[instagram.labelKey]}
          </span>
        </a>
      ) : null}
      {contact.phone ? (
        <a
          href={contact.phoneHref}
          className="site-header-contact-link"
          dir="ltr"
        >
          {contact.phone}
        </a>
      ) : null}
    </div>
  );
}
