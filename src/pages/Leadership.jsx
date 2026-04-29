import { officers } from '../data/officers'
import PageHeader from '../components/PageHeader'
import OfficerCard from '../components/OfficerCard'
import AnimatedPage from '../components/AnimatedPage'
import { motion, useReducedMotion } from 'framer-motion'
import './Leadership.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: 'easeOut' } },
}

export default function Leadership() {
  const prefersReduced = useReducedMotion()
  return (
    <AnimatedPage>
    <div className="page">
      <PageHeader tag="The Team" title="Leadership" subtitle="Meet the officers running MIMS for 2024–25." />
      <div className="section-heading">Executive Board</div>
      <motion.div
        className="leadership__grid"
        variants={prefersReduced ? {} : gridVariants}
        initial="hidden"
        animate="visible"
      >
        {officers.map(officer => (
          <motion.div key={officer.id} variants={prefersReduced ? {} : cardVariants}>
            <OfficerCard officer={officer} />
          </motion.div>
        ))}
      </motion.div>
    </div>
    </AnimatedPage>
  )
}
