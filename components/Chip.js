import IconButton from './IconButton'
import Icon from './Icon'
import IconStyles from '../styles/components/Icon.module.scss'

export default function Chip({ chipText, iconEnabled, selected, onClick, onClickIcon }) {
  return (
    <div style={{ display: 'inline-block', margin: '5px' }}>
      <div
        style={{
          overflowWrap: 'normal',
          width: '100%',
        border: '1px solid gray',
          borderRadius: '5px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: selected ? '#4d8093' : 'gray',
        }}
      >
        <div style={{ maxWidth: '150px', overflow: 'hidden', marginRight: '5px' }}>
          <span
            onClick={() => {
              onClick(chipText)
            }}
            style={{
              display: 'inline-block',
              width: '100%',
              flex: '1',
              overflow: 'hidden',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              color: selected ? 'white' : 'white',
            }}
          >
            {selected ? <strong>{chipText}</strong> : chipText}
          </span>
        </div>
        {iconEnabled && (
          <div style={{ flex: 1 }}>
            <Icon
              name="trash"
              extraClasses={selected ? IconStyles.white : ''}
              onClick={onClickIcon}
            />
          </div>
        )}
      </div>
    </div>
  )
}
