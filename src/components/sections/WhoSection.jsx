import { motion } from 'framer-motion';

const audiences = [
  {
    title: 'SMEs',
    image: 'https://images.unsplash.com/photo-1556761175-4b46a572b786?w=400&h=300&fit=crop',
  },
  {
    title: 'Startups',
    image: 'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400&h=300&fit=crop',
  },
  {
    title: 'Corporate teams',
    image: 'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=400&h=300&fit=crop',
  },
  {
    title: 'Professional service providers',
    image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop',
  },
  {
    title: 'Industry experts & consultants',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
  },
  {
    title: 'Business leaders',
    image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=300&fit=crop',
  },
];

const WhoSection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Who Connectin Is For
          </h2>
          <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto">
            Connectin is built for individuals and organizations looking for real value, real partnerships, and real results.
          </p>
        </motion.div>

        {/* Top row - 4 cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-4 md:mb-6">
          {audiences.slice(0, 4).map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-sm font-semibold text-gray-900 text-center">{item.title}</p>
            </motion.div>
          ))}
        </div>

        {/* Bottom row - 2 cards centered */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          <div className="hidden md:block" />
          {audiences.slice(4).map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
              className="group"
            >
              <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3 bg-gray-200">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <p className="text-sm font-semibold text-gray-900 text-center">{item.title}</p>
            </motion.div>
          ))}
          <div className="hidden md:block" />
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center text-gray-500 text-sm md:text-base mt-10"
        >
          If your work depends on people, partners, or opportunity — Connectin is built for you.
        </motion.p>
      </div>
    </section>
  );
};

export default WhoSection;
