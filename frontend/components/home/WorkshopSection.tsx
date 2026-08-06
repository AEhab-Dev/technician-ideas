import Link from "next/link";

const services = [
  {
    id: "service-1",
    title: "Mobile Mechanic Service",
    description:
      "We come to you — at home, work, or on the road. Our mobile mechanics handle most repairs and maintenance on-site so you never have to tow your vehicle.",
    date: "Available 7 days a week",
    spots: "Book a time slot online",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <rect x="1" y="3" width="15" height="13" rx="2" />
        <path d="M16 8h4l3 5v3h-7V8z" />
        <circle cx="5.5" cy="18.5" r="2.5" />
        <circle cx="18.5" cy="18.5" r="2.5" />
      </svg>
    ),
  },
  {
    id: "service-2",
    title: "Drop-Off Service",
    description:
      "Drop your vehicle off and we'll handle the rest. Full diagnostics, repairs, and maintenance performed at our service location with same-day turnaround on most jobs.",
    date: "Mon – Sat, 8 AM – 6 PM",
    spots: "Walk-ins welcome",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
  },
  {
    id: "service-3",
    title: "Emergency Roadside Assistance",
    description:
      "Stranded? We've got you. Battery jumps, flat tires, emergency fuel delivery, and on-the-spot diagnostics — fast response, any time you need us.",
    date: "Emergency calls accepted daily",
    spots: "Call (916) 530-7539",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    ),
  },
];

export default function WorkshopSection() {
  return (
    <section
      className="section-padding bg-background-secondary"
      aria-labelledby="services-heading"
    >
      <div className="content-width px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="text-center mb-12">
          <p className="font-display text-xs font-semibold tracking-widest uppercase text-gold mb-3">
            How We Work
          </p>
          <h2
            id="services-heading"
            className="font-display font-bold text-brand-white text-3xl md:text-4xl mb-4"
          >
            Auto Repair,{" "}
            <span className="text-gold-gradient">On Your Terms</span>
          </h2>
          <div className="divider-gold w-24 mx-auto mb-6" aria-hidden="true" />
          <p className="text-silver max-w-xl mx-auto text-base leading-relaxed">
            Whether you need us at your door or prefer to drop off your vehicle, we
            make quality auto repair simple and stress-free.
          </p>
        </div>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {services.map((service) => (
            <article
              key={service.id}
              className="card-dark p-6 flex flex-col gap-4"
              aria-label={service.title}
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-lg bg-background-elevated border border-gold/20 flex items-center justify-center text-gold flex-shrink-0">
                {service.icon}
              </div>

              {/* Content */}
              <div className="flex flex-col gap-2 flex-1">
                <h3 className="font-display font-semibold text-brand-white text-base">
                  {service.title}
                </h3>
                <p className="text-silver text-sm leading-relaxed flex-1">
                  {service.description}
                </p>
              </div>

              {/* Meta */}
              <div className="flex flex-col gap-1.5 pt-3 border-t border-border">
                <div className="flex items-center gap-2 text-xs text-silver-dark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
                  </svg>
                  <span>{service.date}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-silver-dark">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                  </svg>
                  <span>{service.spots}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Gold divider */}
        <div className="divider-gold my-10" aria-hidden="true" />

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/booking"
            className="inline-flex items-center gap-2 px-8 py-3.5 font-display font-semibold text-sm rounded-md bg-gold-gradient text-background hover:shadow-gold-glow-strong transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background-secondary"
          >
            Book a Service
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
