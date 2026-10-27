import type {Metadata} from 'next'
import Link from 'next/link'
import {Calendar, Mail, MapPin, Phone, ShieldCheck, ArrowRight, Gauge} from 'lucide-react'

export const metadata: Metadata = {
  title: 'Réserver un Essai Yamaha XSR 900 // Contact & Concessionnaires',
  description:
    'Prenez le guidon du roadster CP3 : réservez votre essai Yamaha XSR 900 en concession officielle ou contactez notre rédaction passionnée.',
  alternates: {
    canonical: '/contact',
  },
  openGraph: {
    title: 'Essai Yamaha XSR 900 & Contact Concessionnaire',
    description:
      'Demande d’essai gratuit de la Yamaha XSR 900 en concession et prise de contact avec notre équipe technique.',
    url: '/contact',
    type: 'website',
  },
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-black text-zinc-100 py-12 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 max-w-5xl">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-10 mb-12">
          <div className="flex items-center gap-2 font-mono text-xs text-amber-400 uppercase tracking-widest mb-3">
            <Gauge className="h-4 w-4" />
            <span>[ CONTACT // EXPÉRIENCE PILOTE ]</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight uppercase">
            RÉSERVER UN ESSAI OU NOUS CONTACTER
          </h1>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-light max-w-2xl leading-relaxed">
            Envie de ressentir la poussée et la sonorité inimitable du 3-cylindres CP3 ?
            Programmez votre créneau d’essai chez un concessionnaire agréé ou échangez avec notre équipe.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Form Col */}
          <div className="lg:col-span-7 bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 sm:p-8">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-amber-400" />
              <span>Demande d’essai concessionnaire</span>
            </h2>

            <form action="#" method="POST" className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="prenom" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Prénom
                  </label>
                  <input
                    type="text"
                    id="prenom"
                    name="prenom"
                    placeholder="Marc"
                    className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label htmlFor="nom" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                    Nom
                  </label>
                  <input
                    type="text"
                    id="nom"
                    name="nom"
                    placeholder="Dupont"
                    className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="nom@exemple.fr"
                  className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="ville" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Ville / Région souhaitée
                </label>
                <input
                  type="text"
                  id="ville"
                  name="ville"
                  placeholder="Paris, Lyon, Marseille..."
                  className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <div>
                <label htmlFor="permis" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Permis moto
                </label>
                <select
                  id="permis"
                  name="permis"
                  className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white focus:border-amber-400 focus:outline-none"
                >
                  <option value="A">Permis A (Accès pleine puissance 119 ch)</option>
                  <option value="A2">Permis A2 (Modèle XSR 900 35 kW / 70 kW)</option>
                </select>
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-mono uppercase text-zinc-400 mb-2">
                  Message ou questions
                </label>
                <textarea
                  id="message"
                  name="message"
                  rows={4}
                  placeholder="Précisez votre recherche (disponibilité, coloris, reprise éventuelle...)"
                  className="w-full rounded-lg bg-black border border-white/[0.1] px-4 py-3 text-sm text-white placeholder-zinc-600 focus:border-amber-400 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-wider text-black hover:bg-zinc-200 transition-colors"
              >
                <span>Envoyer ma demande d’essai</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              <p className="text-[11px] text-zinc-500 font-mono text-center flex items-center justify-center gap-1.5 pt-2">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>Données strictement réservées au traitement de votre demande.</span>
              </p>
            </form>
          </div>

          {/* Info Side Col */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 space-y-4">
              <h3 className="font-mono text-xs text-amber-400 uppercase tracking-widest font-bold">
                [ CONSEIL ESSAI ROUTE ]
              </h3>
              <h4 className="text-lg font-bold text-white">Préparez votre roulage CP3</h4>
              <p className="text-sm text-zinc-400 font-light leading-relaxed">
                Munissez-vous de votre permis de conduire moto valide, de votre casque homologué, gants et blouson.
                Les concessions officielles fournissent le véhicule plein fait avec assurance dédiée au roulage d’essai.
              </p>
            </div>

            <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6 space-y-4 font-mono text-xs">
              <h3 className="text-zinc-300 font-semibold uppercase tracking-wider">
                COORDONNÉES DE LA RÉDACTION
              </h3>
              <div className="space-y-3 text-zinc-400">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-zinc-500" />
                  <span>contact@yamaha-xsr900.fr</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  <span>Réseau Concessionnaires France & Benelux</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-zinc-500" />
                  <span>Assistance éditoriale & dossiers techniques</span>
                </div>
              </div>
            </div>

            <div className="bg-zinc-950 border border-white/[0.08] rounded-2xl p-6">
              <div className="font-mono text-xs text-zinc-500 mb-2">RETOUR AU MAGAZINE</div>
              <Link
                href="/blog"
                className="text-white hover:text-amber-400 text-sm font-bold flex items-center gap-2 transition-colors"
              >
                <span>Lire les derniers essais et comparatifs</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
