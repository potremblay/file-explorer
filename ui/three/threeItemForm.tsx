import styles from './three.module.css';
import a11yStyles from '../util/a11y.module.css';
import { useEffect, useRef, useState } from 'react';
import { AiOutlineCheck, AiOutlineClose } from "react-icons/ai";


interface IThreeItemFormProps {
    id: string
    onConfirm: (newName: string) => any
    onCancel: Function
    haveFocus: boolean
    value: string
    style?: any
}

export default function ThreeItemForm(props: IThreeItemFormProps) {
    const input = useRef(null);
    const [ newValue, setNewValue ] = useState(props.value);

    useEffect(() => {
        if (props.haveFocus) {
            input.current.focus();
        }
    }, [props.haveFocus, props.style]);

    const cancelEdit = () => {
        setNewValue(props.value);
        props.onCancel()
    }

    const onSubmit = event => {
        event.preventDefault();
        props.onConfirm(newValue)
    }

    return (
        <form onSubmit={e => onSubmit(e) } className={ styles.threeItemForm } style={ props.style ? props.style: {} } >
            <div className={ styles.threeItemFormField }>
                <label className={ a11yStyles.visuallyHidden } htmlFor={props.id}></label>
                <input ref={ input } type="text" id={props.id} value={ newValue } onChange={event => setNewValue(event.target.value)} />
            </div>
            <div>
                <button className={ styles.iconBtn } type="submit" aria-label="Confirm">
                    <AiOutlineCheck className={ styles.icon }></AiOutlineCheck>
                </button>
                <button className={ styles.iconBtn } type="reset" aria-label="Cancel" onClick={ () => cancelEdit() }>
                    <AiOutlineClose className={ styles.icon }></AiOutlineClose>
                </button>
            </div>
        </form>
    )
}