import Chip from './Chip'
import Icon from './Icon'

const Accordionv2 = ({ sections, options }) => (
  <div
    id={options.id}
    className={`webfield-accordion panel-group ${options.extraClasses ?? ''}`}
    role="tablist"
    aria-multiselectable="true"
  >
    {sections.map((section, i) => {
      const sectionId = section.id || `${options.id}-section-${i}`
      return (
        <div key={sectionId} className="panel panel-default">
          <SectionHeading id={sectionId} heading={section.heading} options={options} keyphrases={section.keyphrases}/>
          <SectionBody id={sectionId} body={section.body} options={options} />
          <hr className="webfield-accordion-divider" />
        </div>
      )
    })}
  </div>
)

const SectionHeading = ({ id, heading, options, keyphrases }) => (
  <div className="panel-heading" role="tab">
    <h4 className="panel-title">
      <SectionHeadingLink targetId={id} parentId={options.id} collapsed={options.collapsed}>
        <Icon name="triangle-bottom" />
      </SectionHeadingLink>{' '}
      <SectionHeadingLink targetId={id} parentId={options.id} collapsed={options.collapsed}>
        {heading}
        <span style={{marginLeft: "10px"}}>
        {keyphrases.map((keyphrase) => {return <Chip chipText={keyphrase} iconEnabled={false}/>})}
        </span>
      </SectionHeadingLink>
    </h4>
  </div>
)

const SectionHeadingLink = ({ targetId, parentId, children, collapsed }) => (
  <a
    href={`#${targetId}`}
    className={`collapse-btn${collapsed ? ' collapsed' : ''}`}
    role="button"
    data-toggle="collapse"
    data-parent={parentId}
    aria-controls={targetId}
  >
    {children}
  </a>
)

const SectionBody = ({ id, body, options }) => {
  const renderBody = () => {
    switch (options.bodyContainer) {
      case 'div':
        return <div>{body}</div>
      case '':
        return body
      default:
        return <p>{body}</p>
    }
  }
  return (
    <div
      id={id}
      className={`panel-collapse collapse${options.collapsed ? '' : ' in'}`}
      role="tabpanel"
    >
      <div className="panel-body">
        {options.html ? (
          // eslint-disable-next-line react/no-danger
          <div dangerouslySetInnerHTML={{ __html: body }} />
        ) : (
          renderBody()
        )}
      </div>
    </div>
  )
}

export default Accordionv2
