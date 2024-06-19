
// Translated using GPT, list: https://firebase.google.com/docs/auth/admin/errors

export const errorText = (code: string): string =>
  [
    { code: 'auth/claims-too-large', message: 'Kravene er for store' },
    { code: 'auth/email-already-exists', message: 'E-postadressen eksisterer allerede' },
    { code: 'auth/email-already-in-use', message: 'E-postadressen eksisterer allerede' },
    { code: 'auth/id-token-expired', message: 'ID-tokenet er utløpt' },
    { code: 'auth/id-token-revoked', message: 'ID-tokenet er tilbakekalt' },
    { code: 'auth/insufficient-permission', message: 'Utilstrekkelige tillatelser' },
    { code: 'auth/internal-error', message: 'Intern feil' },
    { code: 'auth/invalid-argument', message: 'Ugyldig argument' },
    { code: 'auth/invalid-claims', message: 'Ugyldige krav' },
    { code: 'auth/invalid-continue-uri', message: 'Ugyldig fortsettelses-URI' },
    { code: 'auth/invalid-creation-time', message: 'Ugyldig opprettelsestid' },
    { code: 'auth/invalid-credential', message: 'Ugyldig e-post eller passord' },
    { code: 'auth/invalid-disabled-field', message: 'Ugyldig deaktivert felt' },
    { code: 'auth/invalid-display-name', message: 'Ugyldig visningsnavn' },
    { code: 'auth/invalid-dynamic-link-domain', message: 'Ugyldig dynamisk lenkedomen' },
    { code: 'auth/invalid-email', message: 'Ugyldig e-postadresse' },
    { code: 'auth/invalid-email-verified', message: 'E-posten er ikke bekreftet' },
    { code: 'auth/invalid-hash-algorithm', message: 'Ugyldig hash-algoritme' },
    { code: 'auth/invalid-hash-block-size', message: 'Ugyldig hash-blokkstørrelse' },
    { code: 'auth/invalid-hash-derived-key-length', message: 'Ugyldig hash-avledet nøkkellengde' },
    { code: 'auth/invalid-hash-key', message: 'Ugyldig hash-nøkkel' },
    { code: 'auth/invalid-hash-memory-cost', message: 'Ugyldig hash-minne-kostnad' },
    { code: 'auth/invalid-hash-parallelization', message: 'Ugyldig hash-parallellisering' },
    { code: 'auth/invalid-hash-rounds', message: 'Ugyldig hash-runder' },
    { code: 'auth/invalid-hash-salt-separator', message: 'Ugyldig hash-saltseparator' },
    { code: 'auth/invalid-id-token', message: 'Ugyldig ID-token' },
    { code: 'auth/invalid-last-sign-in-time', message: 'Ugyldig siste påloggingstid' },
    { code: 'auth/invalid-page-token', message: 'Ugyldig side-token' },
    { code: 'auth/invalid-password', message: 'Ugyldig passord' },
    { code: 'auth/invalid-password-hash', message: 'Ugyldig passord-hash' },
    { code: 'auth/invalid-password-salt', message: 'Ugyldig passord-salt' },
    { code: 'auth/invalid-phone-number', message: 'Ugyldig telefonnummer' },
    { code: 'auth/invalid-photo-url', message: 'Ugyldig foto-URL' },
    { code: 'auth/invalid-provider-data', message: 'Ugyldige leverandørdata' },
    { code: 'auth/invalid-provider-id', message: 'Ugyldig leverandør-ID' },
    { code: 'auth/invalid-oauth-responsetype', message: 'Ugyldig OAuth-svarstype' },
    { code: 'auth/invalid-session-cookie-duration', message: 'Ugyldig sesjons-cookie-varighet' },
    { code: 'auth/invalid-uid', message: 'Ugyldig UID' },
    { code: 'auth/invalid-user-import', message: 'Ugyldig brukerimport' },
    { code: 'auth/maximum-user-count-exceeded', message: 'Maksimalt antall brukere overskredet' },
    { code: 'auth/missing-android-pkg-name', message: 'Mangler Android-pakkenavn' },
    { code: 'auth/missing-continue-uri', message: 'Mangler fortsettelses-URI' },
    { code: 'auth/missing-hash-algorithm', message: 'Mangler hash-algoritme' },
    { code: 'auth/missing-ios-bundle-id', message: 'Mangler iOS-bundle-ID' },
    { code: 'auth/missing-uid', message: 'Mangler UID' },
    { code: 'auth/missing-oauth-client-secret', message: 'Mangler OAuth-klienthemmelighet' },
    { code: 'auth/operation-not-allowed', message: 'Operasjon ikke tillatt' },
    { code: 'auth/phone-number-already-exists', message: 'Telefonnummeret eksisterer allerede' },
    { code: 'auth/project-not-found', message: 'Prosjekt ikke funnet' },
    { code: 'auth/reserved-claims', message: 'Reserverte krav' },
    { code: 'auth/session-cookie-expired', message: 'Sesjons-cookie utløpt' },
    { code: 'auth/session-cookie-revoked', message: 'Sesjons-cookie tilbakekalt' },
    { code: 'auth/too-many-requests', message: 'For mange forespørsler' },
    { code: 'auth/uid-already-exists', message: 'UID eksisterer allerede' },
    { code: 'auth/unauthorized-continue-uri', message: 'Uautorisert fortsettelses-URI' },
    { code: 'auth/user-not-found', message: 'Bruker ikke funnet' },
  ].find((e) => e.code === code)?.message || 'Ukjent feil'
