import { Fragment } from 'react';
import styles from './three.module.css';

interface IThreeRootProps {
    title: string,
    children: JSX.Element|JSX.Element[],
}

export default function ThreeRoot(props: IThreeRootProps) {
    const condancedTitle = props.title.replace(/[^a-zA-Z\d\s:]|\ /g, '');
    const id = 'three-root-' + condancedTitle;

    return (
        <Fragment>
            <span id={id}>{ props.title }</span>
            <ul role="tree" aria-labelledby={id} className={ styles.threeRoot }>
                {props.children}
            </ul>
        </Fragment>
    );
}