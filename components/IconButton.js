import Icon from './Icon'

const IconButton = ({
  onClick, disableButton = false, disableReason = null, title = null, name, extraClasses,
}) => (
  <button type="button" className="btn btn-xs" onClick={onClick} title={disableReason ?? title} disabled={disableButton}>
    <Icon name={name} extraClasses={extraClasses} />
  </button>
)

// eslint-disable-next-line react/jsx-props-no-spreading
export const TrashButton = props => <IconButton name="trash" {...props} />
// eslint-disable-next-line react/jsx-props-no-spreading
export const RestoreButton = props => <IconButton name="repeat" extraClasses="mirror" {...props} />
// eslint-disable-next-line react/jsx-props-no-spreading
export const EditButton = props => <IconButton name="edit" {...props} />

export default IconButton