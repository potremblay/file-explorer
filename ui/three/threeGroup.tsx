import styles from './three.module.css';

interface IThreeGroupProps {
    children: JSX.Element|JSX.Element[],
}

export default function ThreeGroup(props: IThreeGroupProps) {

    return (
        <ul role="group" className={ styles.threeGroup }>
            {props.children}
        </ul>
    );
}