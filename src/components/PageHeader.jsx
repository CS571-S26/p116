import './PageHeader.css'

export default function PageHeader({ tag, title, subtitle }) {
  return (
    <div className="page-header">
      <span className="mims-tag">{tag}</span>
      <h1 className="page-title">{title}</h1>
      {subtitle && <p className="page-subtitle">{subtitle}</p>}
      <hr className="divider" />
    </div>
  )
}
