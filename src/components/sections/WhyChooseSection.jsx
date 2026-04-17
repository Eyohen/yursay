import { motion } from 'framer-motion';

const stats = [
  { label: 'Verified Businesses', value: '2,000+' },
  { label: 'Partnerships Formed', value: '500+' },
  { label: 'Industries Covered', value: '50+' },
  { label: 'Countries', value: '30+' },
];

const WhyChooseSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-navy-900">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.7 }}
          className="bg-navy-800 rounded-3xl p-8 md:p-14 text-center border border-white/5 overflow-hidden relative"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/5 via-transparent to-transparent pointer-events-none" />

          <div className="relative">
            <p className="text-accent font-bold tracking-widest text-sm mb-4 uppercase">Connectin</p>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-12">
              Why Businesses Choose Connectin
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <p className="text-3xl md:text-4xl font-bold text-white mb-2">{stat.value}</p>
                  <p className="text-gray-400 text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-400 text-sm md:text-base mt-10"
        >
          Businesses are not just joining Connectin.{' '}
          <span className="text-white font-medium">They&apos;re winning on Connectin.</span>
        </motion.p>
      </div>
    </section>
  );
};

export default WhyChooseSection;
