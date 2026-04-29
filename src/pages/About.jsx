import PageHeader from '../components/PageHeader'
import AnimatedPage from '../components/AnimatedPage'
import './About.css'

const whatWeDo = [
  { title: 'Industry Panels', desc: 'Hear directly from label executives, managers, and artists.' },
  { title: 'Networking Mixers', desc: 'Build your professional network before you graduate.' },
  { title: 'Workshops', desc: 'Hands-on skills in music marketing, A&R, and more.' },
  { title: 'Career Support', desc: 'Resume reviews, mock interviews, and internship leads.' },
]

export default function About() {
  return (
    <AnimatedPage>
    <div className="page">
      <PageHeader tag="Who We Are" title="About MIMS" />

      <section className="about__mission" style={{ paddingBottom: '8px' }}>
        <h2 className="section-heading">Our Mission</h2>
        <p>
          MIMS — Music Industry for Madison Students — bridges the gap between UW–Madison academics
          and the professional music business world. We bring together students passionate about
          labels, publishing, management, marketing, and live events.
        </p>
      </section>

      <hr className="divider" style={{ margin: '28px 0' }} />

      <section style={{ paddingBottom: '8px' }}>
        <h2 className="section-heading">What We Do</h2>
        <div className="about__what-grid">
          {whatWeDo.map(item => (
            <div key={item.title} className="about__what-card">
              <h3>{item.title}</h3>
              <p>{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <hr className="divider" style={{ margin: '28px 0' }} />

      <section className="about__membership">
        <h2 className="section-heading">Membership</h2>
        <p>
          Open to all UW–Madison students. No audition, no experience required — just a passion
          for the music industry. Meetings are biweekly on Tuesdays.
        </p>
      </section>
    </div>
    </AnimatedPage>
  )
}
