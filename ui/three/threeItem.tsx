import { useState } from "react";
import { AiFillDelete, AiOutlineEdit, AiOutlineFileAdd, AiOutlineFolderAdd, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import styles from './three.module.css';

interface IThreeItemProps {
    title: string,
    level: number,
    index: number
    size?: number
    isTabblable: boolean,
    onNavUp?: Function,
    onNavDown?: Function,
    isCollabsable?: boolean,
    children?: JSX.Element|JSX.Element[],
}

export default function ThreeItem(props: IThreeItemProps) {
    const [ isFocused, setIsFocus ] = useState(false);
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ isModeEdit, setModeEdit] = useState(false);

    const rightKey = 37;
    const leftKey = 39;
    const upKey = 38;
    const downKey = 40;

    const keyPressHandler = event => {
        if (isFocused === false) {
            return;
        }

        if (event.keyCode === rightKey && props.isCollabsable) {
            setIsExpanded(false);
        }

        if (event.keyCode === leftKey && props.isCollabsable) {
            setIsExpanded(false);
        }

        if (event.keyCode === upKey && props.onNavUp) {
            props.onNavUp();
        }

        if (event.keyCode === downKey && props.onNavDown) {
            props.onNavDown();
        }
    }

    return (
        <li className={styles.threeItem}
            role="treeitem"
            aria-level={props.level}
            aria-posinset={props.index+1}
            tabIndex={props.isTabblable ? 0 : -1}
            { ...(props.isCollabsable ? { 'aria-expanded': isExpanded } : '') }
            { ...(props.size       ? { 'aria-setsize' : props.size } : '' ) }
        >
            <div className={styles.threeItemTitle}>
                <span  onFocus={ () => setIsFocus(true) }
                    onBlur={ () => setIsFocus(false) }
                    onKeyDown={ event => keyPressHandler(event) }
                    onClick={ () => setIsExpanded(!isExpanded) }
                >{ props.title }</span>
                <div className={ styles.actions }>
                    <div className={ styles.actions_threeAction } style={{ display: isModeEdit ? 'none' : 'block' }}>
                        <button className={ styles.iconBtn } aria-label="Edit" onClick={ () => setModeEdit(true) } tabIndex={props.isTabblable ? 0 : -1}>
                            <AiOutlineEdit className={ styles.icon } aria-hidden="true"></AiOutlineEdit>
                        </button>
                        <button className={ styles.iconBtn } aria-label="Delete" tabIndex={props.isTabblable ? 0 : -1}>
                            <AiFillDelete className={ styles.icon } aria-hidden="true"></AiFillDelete>
                        </button>
                        <button className={ styles.iconBtn } aria-label="Create file" tabIndex={props.isTabblable ? 0 : -1}>
                            <AiOutlineFileAdd className={ styles.icon } aria-hidden="true"></AiOutlineFileAdd>
                        </button>
                        <button className={ styles.iconBtn } aria-label="Create directory" tabIndex={props.isTabblable ? 0 : -1}>
                            <AiOutlineFolderAdd className={ styles.icon } aria-hidden="true"></AiOutlineFolderAdd>
                        </button>
                    </div>
                    <div style={{ display: isModeEdit ? 'block' : 'none' }}>
                        <button aria-label="Confirm"><AiOutlineCheck></AiOutlineCheck></button>
                        <button aria-label="Cancel" onClick={ () => setModeEdit(false) }><AiOutlineClose></AiOutlineClose></button>
                    </div>
                </div>
                
            </div>

            { props.children }
        </li>
    );
}
