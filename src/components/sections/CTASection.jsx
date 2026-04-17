import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section className="py-20 md:py-28 px-4 bg-white">
      <div className="max-w-3xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Ready to Grow With the Right People?
          </h2>
          <p className="text-gray-500 text-base md:text-lg mb-8">
            Join a platform built for partnership, trust, and real business connections.
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            className="px-8 py-3.5 bg-accent hover:bg-accent-dark text-white font-semibold rounded-lg text-base transition-colors shadow-lg shadow-accent/20"
          >
            Get Started
          </motion.button>

          <p className="text-gray-400 text-sm mt-8 italic">
            Because your next breakthrough is one connection away.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
