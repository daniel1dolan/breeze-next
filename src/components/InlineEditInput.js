import { useState, useRef, useCallback, useEffect } from 'react'

/** Component used to handle an inline editable value. */
const InlineEditInput = props => {
    const { initialValue, onSubmit } = props
    const [inputValue, setInputValue] = useState(initialValue)
    const [isEditing, setIsEditing] = useState(false)

    const inputRef = useRef(null)

    const handleSubmit = useCallback(() => {
        setIsEditing(false)
        if (inputValue !== initialValue) onSubmit(inputValue)
    }, [inputValue, initialValue, onSubmit])

    const handleCancel = useCallback(() => {
        setInputValue(initialValue)
        setIsEditing(false)
    }, [initialValue])

    const handleChange = event => {
        setInputValue(event.target.value)
    }

    const handleKeyDown = event => {
        switch (event.key) {
            case 'Enter':
                handleSubmit()
                break
            case 'Escape':
                handleCancel()
                break
            case 'Tab':
                handleCancel()
                break
            default:
                break
        }
    }

    const handleClickFocus = () => {
        setIsEditing(true)
    }

    useEffect(() => {
        // Required when value is changed outside of inline edit.
        if (!isEditing) {
            setInputValue(initialValue)
        }
    }, [initialValue])

    return (
        <input
            ref={inputRef}
            className="read-only:bg-transparent read-only:outline-0 hover:bg-gray-light2 focus:bg-transparent transition rounded"
            value={inputValue}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onClick={handleClickFocus}
            onFocus={handleClickFocus}
            readOnly={!isEditing}
        />
    )
}

export default InlineEditInput
