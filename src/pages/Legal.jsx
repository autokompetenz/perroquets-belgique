import { Link } from 'react-router-dom';
import { useLangStore } from '../store';
import { useBreakpoint } from '../hooks';
import { t } from '../utils/i18n';

const SECTIONS = {
  fr: [
    {
      id: 'identite',
      title: "Identité de l'élevage",
      content: `Le Parc des Perroquets
1235 Route de Claveyson, 26260 Bren, France
TVA : FR72498339654
SIREN : 498 339 654
RNE (Registre National des Entreprises) : 498 339 654
Code APE : 01.49Z (Autres animaux)

Dirigeant : Vuillamy Jérôme
Forme juridique : Entrepreneur individuel

Contact : nous contacter par email
Hébergeur : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA`,
    },
    {
      id: 'privacy',
      title: 'Politique de confidentialité (RGPD)',
      sections: [
        {
          sub: '1. Responsable du traitement',
          text: "Le responsable du traitement des données est Le Parc des Perroquets, 1235 Route de Claveyson, 26260 Bren, France. Pour toute question concernant vos données, contactez-nous par email.",
        },
        {
          sub: '2. Données collectées',
          text: 'Nous collectons uniquement les données nécessaires à la gestion des réservations : nom, prénom, adresse email, numéro de téléphone et éventuellement les notes que vous nous communiquez volontairement. Nous ne collectons aucune donnée sensible.',
        },
        {
          sub: '3. Finalités du traitement',
          text: "Vos données sont utilisées pour : (a) la gestion et le suivi de votre réservation ; (b) la communication relative à votre futur compagnon ; (c) le respect de nos obligations légales (registre d'élevage, facturation).",
        },
        {
          sub: '4. Base légale',
          text: "Le traitement repose sur l'exécution d'un contrat (réservation) et le respect d'obligations légales. Le consentement est recueilli pour les cookies non essentiels via notre bannière.",
        },
        {
          sub: '5. Durée de conservation',
          text: "Vos données sont conservées pendant toute la durée de la relation contractuelle, puis archivées 5 ans pour les obligations fiscales et légales.",
        },
        {
          sub: '6. Destinataires des données',
          text: "Vos données ne sont jamais cédées à des tiers. Elles sont accessibles uniquement à l'équipe du Parc des Perroquets. Les données de paiement sont traitées via notre prestataire bancaire sécurisé.",
        },
        {
          sub: '7. Transferts hors UE',
          text: "Nos serveurs sont hébergés en Europe (UE). Aucun transfert de données hors de l'Espace Économique Européen n'est effectué.",
        },
        {
          sub: '8. Vos droits',
          text: 'Conformément au RGPD, vous disposez des droits suivants : accès, rectification, effacement, limitation, portabilité et opposition. Pour les exercer, contactez-nous par email. Nous répondons sous 30 jours maximum.',
        },
        {
          sub: '9. Cookies',
          text: "Notre site utilise uniquement des cookies techniques nécessaires au fonctionnement du site (session, authentification admin). Aucun cookie de tracking ou publicitaire n'est utilisé. Une bannière vous informe lors de votre première visite.",
        },
        {
          sub: '10. Réclamation',
          text: "Si vous estimez que vos droits ne sont pas respectés, vous pouvez introduire une réclamation auprès de la CNIL : 3 Place de Fontenoy, 75007 Paris — cnil.fr.",
        },
      ],
    },
    {
      id: 'terms',
      title: 'Conditions Générales de Vente',
      sections: [
        {
          sub: '1. Objet',
          text: "Les présentes CGV régissent la réservation et l'achat de perroquets et perruches auprès du Parc des Perroquets (Jérôme Vuillamy, EI), élevage familial situé à Bren, France. Elles s'appliquent à toute réservation effectuée via le site leparcdesperroquets.fr.",
        },
        {
          sub: '2. Réservation',
          text: "La réservation est effectuée via le formulaire en ligne. Elle est confirmée après validation par Le Parc des Perroquets et paiement d'un acompte de 50% du prix total. Le numéro de réservation unique est communiqué par email et permet le suivi en ligne.",
        },
        {
          sub: '3. Prix et modalités de paiement',
          text: "Les prix sont indiqués en euros (€), TVA non applicable (entrepreneur individuel, art. 293 B du CGI — franchise en base de TVA). L'acompte de 50% est à verser à la confirmation. Le solde de 50% est dû au moment de la remise du perroquet, en espèces ou par virement bancaire.",
        },
        {
          sub: '4. Délai de rétractation',
          text: "Conformément à l'article L221-28 du Code de la consommation, le délai de rétractation de 14 jours ne s'applique pas aux animaux vivants. La réservation est donc ferme dès confirmation.",
        },
        {
          sub: '5. Annulation par le client',
          text: "Tout acompte versé reste acquis au Parc des Perroquets en cas d'annulation par le client, à quelque stade que ce soit. Cette clause couvre les frais de gestion, de baguage, de suivi vétérinaire et de soins déjà engagés.",
        },
        {
          sub: "6. Annulation par l'élevage",
          text: "Le Parc des Perroquets se réserve le droit d'annuler une réservation en cas de : problème de santé vétérinaire du perroquet, décès du perroquet, ou non-conformité avant le départ. Dans ces seuls cas, l'acompte est intégralement remboursé.",
        },
        {
          sub: '7. Remise du perroquet',
          text: "Le perroquet est remis après sevrage complet et baguage, conformément à la réglementation française (arrêté du 10 août 2004 relatif à l'identification des oiseaux). La remise a lieu de préférence sur place à Bren. Un certificat de santé vétérinaire, la bague fermée et le pedigree sont fournis.",
        },
        {
          sub: '8. Santé et garantie',
          text: "Le Parc des Perroquets garantit que le perroquet est en bonne santé au moment de la remise, bagué et suivi par un vétérinaire. Un certificat vétérinaire est remis. Aucune garantie n'est donnée quant aux maladies non décelables au moment de la vente (période d'incubation). L'acquéreur s'engage à faire examiner le perroquet par un vétérinaire dans les 7 jours suivant la remise.",
        },
        {
          sub: '9. Transport',
          text: "Le transport du perroquet est sous l'entière responsabilité de l'acquéreur. Le Parc des Perroquets peut recommander un transporteur agréé mais décline toute responsabilité en cas de problème pendant le transport.",
        },
        {
          sub: '10. Litiges',
          text: "Tout litige relève du droit français et de la compétence exclusive des tribunaux de Valence (France). En cas de litige, une solution amiable sera recherchée avant toute action judiciaire.",
        },
        {
          sub: '11. Données personnelles',
          text: 'Voir notre Politique de confidentialité ci-dessus pour le traitement de vos données personnelles.',
        },
      ],
    },
  ],
  nl: [
    {
      id: 'identite',
      title: 'Identiteit van de fokkerij',
      content: `Le Parc des Perroquets
1235 Route de Claveyson, 26260 Bren, Frankrijk
BTW : FR72498339654
SIREN : 498 339 654
RNE : 498 339 654
APE-code : 01.49Z

Directeur : Vuillamy Jérôme
Rechtsvorm : Eenmanszaak (Entrepreneur individuel)

Contact : neem contact op per e-mail
Hosting : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, VS`,
    },
    {
      id: 'privacy',
      title: 'Privacybeleid (AVG)',
      sections: [
        { sub: '1. Verwerkingsverantwoordelijke', text: 'De verwerkingsverantwoordelijke is Le Parc des Perroquets, 1235 Route de Claveyson, 26260 Bren, Frankrijk. Neem per e-mail contact met ons op voor vragen over uw gegevens.' },
        { sub: '2. Verzamelde gegevens', text: 'We verzamelen alleen de gegevens die nodig zijn voor reserveringen: naam, e-mailadres, telefoonnummer en eventuele notities die u vrijwillig verstrekt. We verzamelen geen gevoelige gegevens.' },
        { sub: '3. Doeleinden van verwerking', text: 'Uw gegevens worden gebruikt voor: (a) het beheer en de opvolging van uw reservering; (b) communicatie over uw toekomstige metgezel; (c) naleving van wettelijke verplichtingen (fokregister, facturatie).' },
        { sub: '4. Rechtsgrond', text: 'De verwerking is gebaseerd op de uitvoering van een overeenkomst (reservering) en wettelijke verplichtingen. Toestemming wordt gevraagd voor niet-essentiële cookies via onze banner.' },
        { sub: '5. Bewaartermijn', text: 'Uw gegevens worden bewaard tijdens de contractuele relatie en vervolgens 5 jaar gearchiveerd voor fiscale en wettelijke verplichtingen.' },
        { sub: '6. Ontvangers van gegevens', text: 'Uw gegevens worden nooit aan derden verstrekt. Ze zijn alleen toegankelijk voor het team van Le Parc des Perroquets. Betalingsgegevens worden verwerkt via onze beveiligde bankpartner.' },
        { sub: '7. Doorgifte buiten EU', text: 'Onze servers worden gehost in Europa (EU). Er vindt geen doorgifte van gegevens buiten de Europese Economische Ruimte plaats.' },
        { sub: '8. Uw rechten', text: 'Overeenkomstig de AVG heeft u recht op toegang, rectificatie, wissen, beperking, overdraagbaarheid en bezwaar. Neem per e-mail contact met ons op om deze rechten uit te oefenen. We reageren binnen maximaal 30 dagen.' },
        { sub: '9. Cookies', text: 'Onze site gebruikt alleen technische cookies die nodig zijn voor de werking (sessie, admin-authenticatie). Er worden geen tracking- of advertentiecookies gebruikt. Een banner informeert u bij uw eerste bezoek.' },
        { sub: '10. Klacht', text: 'Als u van mening bent dat uw rechten niet worden gerespecteerd, kunt u een klacht indienen bij de CNIL (Franse gegevensbeschermingsautoriteit): 3 Place de Fontenoy, 75007 Paris — cnil.fr.' },
      ],
    },
    {
      id: 'terms',
      title: 'Algemene Verkoopvoorwaarden',
      sections: [
        { sub: '1. Toepasselijkheid', text: "Deze voorwaarden regelen de reservering en aankoop van papegaaien en parkieten bij Le Parc des Perroquets (Jérôme Vuillamy, EI), een familiale fokkerij in Bren, Frankrijk. Ze zijn van toepassing op elke reservering via leparcdesperroquets.fr." },
        { sub: '2. Reservering', text: 'De reservering wordt gemaakt via het online formulier. Ze wordt bevestigd na goedkeuring door Le Parc des Perroquets en betaling van een aanbetaling van 50% van de totale prijs. Het unieke reserveringsnummer wordt per e-mail verstrekt voor online opvolging.' },
        { sub: '3. Prijs en betaling', text: 'Prijzen zijn in euro (€), BTW niet van toepassing. De aanbetaling van 50% is verschuldigd bij bevestiging. Het saldo van 50% is verschuldigd bij levering van de papegaai.' },
        { sub: '4. Herroepingsrecht', text: 'Overeenkomstig de Franse wetgeving (art. L221-28 Consommatiewetboek) is het herroepingsrecht van 14 dagen niet van toepassing op levende dieren. De reservering is daarom definitief vanaf bevestiging.' },
        { sub: '5. Annulering door klant', text: 'Eventuele aanbetalingen blijven eigendom van Le Parc des Perroquets bij annulering door de klant, in elk stadium. Deze clausule dekt de kosten van beheer, veterinaire zorg en reeds gemaakte zorgkosten.' },
        { sub: '6. Annulering door fokker', text: 'Le Parc des Perroquets behoudt zich het recht voor een reservering te annuleren bij: veterinair gezondheidsprobleem van de papegaai, overlijden van de papegaai, of non-conformiteit voor vertrek. In deze gevallen wordt de aanbetaling volledig terugbetaald.' },
        { sub: '7. Levering van de papegaai', text: 'De papegaai wordt geleverd na volledig spenen en ringen, conform de Franse regelgeving. Levering vindt bij voorkeur plaats op locatie in Bren. Een veterinair gezondheidscertificaat, gesloten ring en stamboom worden meegegeven.' },
        { sub: '8. Gezondheid en garantie', text: 'Le Parc des Perroquets garandeert dat de papegaai bij levering in goede gezondheid verkeert, geringd en gevolgd door een dierenarts. Een veterinair certificaat wordt overhandigd. Er wordt geen garantie gegeven voor niet-detecteerbare ziekten op het moment van verkoop. De koper moet de papegaai binnen 7 dagen na levering door een dierenarts laten onderzoeken.' },
        { sub: '9. Vervoer', text: 'Het vervoer van de papegaai is volledig de verantwoordelijkheid van de koper. Le Parc des Perroquets kan een erkende vervoerder aanbevelen maar is niet aansprakelijk voor problemen tijdens het vervoer.' },
        { sub: '10. Geschillen', text: 'Geschillen vallen onder het Frans recht en de exclusieve bevoegdheid van de rechtbanken van Valence (Frankrijk). Bij een geschil wordt eerst een minnelijke schikking gezocht.' },
        { sub: '11. Privacy', text: 'Zie ons Privacybeleid hierboven voor de verwerking van uw persoonsgegevens.' },
      ],
    },
  ],
  en: [
    {
      id: 'identite',
      title: 'Breeding Identity',
      content: `Le Parc des Perroquets
1235 Route de Claveyson, 26260 Bren, France
VAT : FR72498339654
SIREN : 498 339 654
RNE : 498 339 654
APE Code : 01.49Z

Owner : Vuillamy Jérôme
Legal form : Sole proprietorship (Entrepreneur individuel)

Contact : contact us by email
Hosting : Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, USA`,
    },
    {
      id: 'privacy',
      title: 'Privacy Policy (GDPR)',
      sections: [
        { sub: '1. Data Controller', text: 'The data controller is Le Parc des Perroquets, 1235 Route de Claveyson, 26260 Bren, France. For any questions regarding your data, contact us by email.' },
        { sub: '2. Data Collected', text: 'We only collect data necessary for reservation management: name, email address, phone number, and any notes you voluntarily provide. We do not collect any sensitive data.' },
        { sub: '3. Purposes of Processing', text: 'Your data is used for: (a) managing and tracking your reservation; (b) communication regarding your future companion; (c) compliance with our legal obligations (breeding register, invoicing).' },
        { sub: '4. Legal Basis', text: 'Processing is based on contract execution (reservation) and legal obligations. Consent is obtained for non-essential cookies via our banner.' },
        { sub: '5. Retention Period', text: 'Your data is kept for the duration of the contractual relationship, then archived for 5 years for tax and legal obligations.' },
        { sub: '6. Data Recipients', text: 'Your data is never shared with third parties. It is only accessible to the Le Parc des Perroquets team. Payment data is processed through our secure banking partner.' },
        { sub: '7. International Transfers', text: 'Our servers are hosted in Europe (EU). No data transfer outside the European Economic Area occurs.' },
        { sub: '8. Your Rights', text: 'Under GDPR, you have the right to access, rectify, erase, restrict, port, and object. To exercise these rights, email us. We respond within 30 days maximum.' },
        { sub: '9. Cookies', text: 'Our site only uses technical cookies necessary for operation (session, admin authentication). No tracking or advertising cookies are used. A banner informs you on your first visit.' },
        { sub: '10. Complaint', text: 'If you believe your rights are not respected, you can file a complaint with the CNIL (French data protection authority): 3 Place de Fontenoy, 75007 Paris — cnil.fr.' },
      ],
    },
    {
      id: 'terms',
      title: 'Terms and Conditions of Sale',
      sections: [
        { sub: '1. Scope', text: "These terms govern the reservation and purchase of parrots and parakeets from Le Parc des Perroquets (Jérôme Vuillamy, EI), a family aviary in Bren, France. They apply to any reservation made via leparcdesperroquets.fr." },
        { sub: '2. Reservation', text: 'Reservations are made via the online form. They are confirmed after validation by Le Parc des Perroquets and payment of a 50% deposit of the total price. A unique reservation number is provided by email for online tracking.' },
        { sub: '3. Price and Payment', text: 'Prices are in euros (€), VAT not applicable. The 50% deposit is due upon confirmation. The 50% balance is due upon parrot handover.' },
        { sub: '4. Withdrawal Right', text: "Under French law (art. L221-28 Consumer Code), the 14-day withdrawal right for distance sales does not apply to live animals. The reservation is therefore firm upon confirmation." },
        { sub: '5. Cancellation by Client', text: 'Any deposit paid is retained by Le Parc des Perroquets in case of cancellation by the client, at any stage. This clause covers management, veterinary care, and costs already incurred.' },
        { sub: '6. Cancellation by Aviary', text: 'Le Parc des Perroquets reserves the right to cancel a reservation in case of: veterinary health issue of the parrot, death of the parrot, or non-compliance before departure. In these cases only, the deposit is fully refunded.' },
        { sub: '7. Parrot Handover', text: 'The parrot is handed over after complete weaning and ringing, in accordance with French regulations. Handover preferably takes place on-site in Bren. A veterinary health certificate, closed ring, and pedigree are provided.' },
        { sub: '8. Health and Warranty', text: 'Le Parc des Perroquets guarantees the parrot is in good health at handover, ringed, and followed by a veterinarian. A veterinary certificate is provided. No warranty is given for diseases undetectable at the time of sale (incubation period). The buyer must have the parrot examined by a veterinarian within 7 days of handover.' },
        { sub: '9. Transport', text: "Parrot transport is entirely the buyer's responsibility. Le Parc des Perroquets may recommend an approved transporter but declines any liability for issues during transport." },
        { sub: '10. Disputes', text: 'Any dispute falls under French law and the exclusive jurisdiction of the courts of Valence (France). An amicable solution will be sought before any legal action.' },
        { sub: '11. Privacy', text: 'See our Privacy Policy above regarding the processing of your personal data.' },
      ],
    },
  ],
};

function Section({ title, content, subs }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 16, padding: 'clamp(20px,3vw,32px)', boxShadow: 'var(--shadow-sm)' }}>
      <h2 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(18px,2.5vw,26px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:18 }}>
        {title}
      </h2>
      {content && <pre style={{ fontFamily:'Nunito,Outfit,sans-serif', fontSize:14, color:'var(--text-2)', lineHeight:1.75, whiteSpace:'pre-wrap', wordBreak:'break-word', margin:0 }}>{content}</pre>}
      {subs && (
        <div style={{ display:'flex', flexDirection:'column', gap:18 }}>
          {subs.map((s, i) => (
            <div key={i}>
              <h3 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:800, fontSize:15, color:'var(--text)', marginBottom:6, lineHeight:1.3 }}>{s.sub}</h3>
              <p style={{ fontSize:14, color:'var(--text-2)', lineHeight:1.75 }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Legal() {
  const { lang } = useLangStore();
  const { isMobile } = useBreakpoint();
  const l = lang || 'fr';
  const sections = SECTIONS[l] || SECTIONS.fr;

  const title = l === 'fr' ? 'Mentions légales' : l === 'nl' ? 'Wettelijke vermeldingen' : 'Legal Notices';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', paddingTop: 76 }}>
      <div style={{ background: 'var(--bg-card2)', borderBottom: '1px solid var(--border)', padding: isMobile ? '36px 4% 28px' : '56px 6% 40px' }}>
        <div style={{ maxWidth: 800, margin: '0 auto' }}>
          <div className="section-eyebrow">{l === 'fr' ? 'Informations légales' : l === 'nl' ? 'Juridische informatie' : 'Legal information'}</div>
          <h1 style={{ fontFamily:"'Outfit',sans-serif", fontWeight:900, fontSize:'clamp(32px,5vw,64px)', color:'var(--text)', letterSpacing:'-0.02em', marginBottom:12, lineHeight:1.05 }}>
            {title}
          </h1>
          <p style={{ fontSize:16, color:'var(--text-3)', maxWidth:520, lineHeight:1.65 }}>
            {l === 'fr' ? "Conformité légale, protection de vos données et conditions de réservation." :
             l === 'nl' ? 'Wettelijke conformiteit, gegevensbescherming en reserveringsvoorwaarden.' :
             'Legal compliance, data protection and reservation terms.'}
          </p>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: isMobile ? '24px 4% 60px' : '40px 6% 80px', display:'flex', flexDirection:'column', gap:20 }}>
        {sections.map(section => (
          <Section key={section.id} title={section.title} content={section.content} subs={section.sections} />
        ))}
      </div>
    </div>
  );
}