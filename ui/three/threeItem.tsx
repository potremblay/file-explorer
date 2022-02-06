import { Fragment, useEffect, useRef, useState } from "react";
import { AiFillDelete, AiOutlineEdit, AiOutlineFileAdd, AiOutlineFolderAdd } from "react-icons/ai";
import styles from './three.module.css';
import ThreeGroup from "./threeGroup";
import ThreeItemForm from "./threeItemForm";

/*
    @TODO: The component is big, we should cut it appart to many little components after we put some unit test
*/

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
    onRename?: (newName:string, Function) => void,
    onDelete?: Function
    onAddfile?: Function
    onAddDirectory?: Function
}

export default function ThreeItem(props: IThreeItemProps) {
    const [ isFocused, setIsFocus ] = useState(false);
    const [ isExpanded, setIsExpanded ] = useState(false);
    const [ isModeEdit, setModeEdit] = useState(false);
    const [ isModeNewFile, setModeNewFile ] = useState(false);
    const [ isModeNewDirectory, setModeNewDirectory ] = useState(false);

    const itemRef = useRef(null);

    const rightKey = 37;
    const leftKey = 39;
    const upKey = 38;
    const downKey = 40;
    const id = `three-item-${props.level}-${props.index}`;
    const newFileItemId = id + '-add-file';
    const newDirectoryItemId = id + '-add-directory';

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

    useEffect( () => {
        if (isModeEdit === false) {
            itemRef.current.focus();
        }
    }, [isModeEdit])

    const activeEditMode = () => {
        setModeEdit(true);
    }

    const cancelEdit = () => {
        setModeEdit(false);
    }

    const renameConfirm = (newValue: string) => {
        if (props.onRename) {
            props.onRename(newValue, () => {
                setModeEdit(false);
            });
        }
    }

    const createFileConfirm = (newFileName: string) => {
        setModeNewFile(false);
        
        if (props.onAddfile) {
            props.onAddfile(newFileName);
        }
    }

    const cancelFileCreation = () => {
        setModeNewFile(false);
    }

    const createDirectoryConfirm = (newDirectoryName: string) => {
        setModeNewDirectory(false);

        if (props.onAddDirectory) {
            props.onAddDirectory(newDirectoryName);
        }
    }

    const cancelDirectoryCreation = () => {
        setModeNewDirectory(false);
    }

    return (
        <Fragment>
            <li className={styles.threeItem + ' ' + ( isModeEdit ? styles.editMode : '' )}
                ref={ itemRef }
                role="treeitem"
                aria-level={props.level}
                aria-posinset={props.index+1}
                tabIndex={props.isTabblable ? 0 : -1}
                { ...(props.isCollabsable ? { 'aria-expanded': isExpanded } : '') }
                { ...(props.size       ? { 'aria-setsize' : props.size } : '' ) }
            >
                <div className={styles.threeItemHeader}>
                    <span className={styles.threeItemHeaderTitle} onFocus={ () => setIsFocus(true) }
                        onBlur={ () => setIsFocus(false) }
                        onKeyDown={ event => keyPressHandler(event) }
                        onClick={ () => setIsExpanded(!isExpanded) }
                        style={{ display: isModeEdit ? 'none' : 'block' }}
                    >{ props.title }</span>

                    <div className={ styles.actions }>
                        <div className={ styles.actions_threeAction } style={{ display: isModeEdit ? 'none' : 'block' }}>
                            { props.onRename && <button className={ styles.iconBtn } aria-label="Edit" onClick={ () => activeEditMode() } tabIndex={props.isTabblable ? 0 : -1}>
                                            <AiOutlineEdit className={ styles.icon } aria-hidden="true"></AiOutlineEdit>
                                          </button> }
                            
                            { props.onDelete && <button className={ styles.iconBtn }
                                                    aria-label="Delete"
                                                    tabIndex={props.isTabblable ? 0 : -1}
                                                    onClick={ () => props.onDelete() } // @TODO add a confirmation modal. Right now it's evil XD
                                                >
                                                    <AiFillDelete className={ styles.icon } aria-hidden="true"></AiFillDelete>
                                                </button> }

                            { props.onAddfile && <button className={ styles.iconBtn }
                                                    aria-label="Create file"
                                                    tabIndex={props.isTabblable ? 0 : -1}
                                                    onClick={() => {
                                                        setModeNewFile(true);
                                                        setIsExpanded(true);
                                                        setModeNewDirectory(false);
                                                    }}
                                                >
                                                    <AiOutlineFileAdd className={ styles.icon } aria-hidden="true"></AiOutlineFileAdd>
                                                </button> }
                            
                            { props.onAddDirectory && <button
                                                        className={ styles.iconBtn }
                                                        aria-label="Create directory"
                                                        tabIndex={props.isTabblable ? 0 : -1}
                                                        onClick={() => {
                                                            setModeNewFile(false);
                                                            setIsExpanded(true);
                                                            setModeNewDirectory(true);
                                                        }}
                                                    >
                                                        <AiOutlineFolderAdd className={ styles.icon } aria-hidden="true"></AiOutlineFolderAdd>
                                                    </button> }
                            
                        </div>
                    </div>

                    <ThreeItemForm 
                        id={id}
                        onConfirm={renameConfirm}
                        onCancel={cancelEdit}
                        haveFocus={true}
                        value={props.title}
                        style={ !isModeEdit ? { display: 'none' } : {} }

                    ></ThreeItemForm>
                </div>

                { props.children }
            </li>

            { (isModeNewFile || isModeNewDirectory) && <ThreeGroup>
                { isModeNewFile && <li>
                    <ThreeItemForm 
                        id={newFileItemId}
                        onConfirm={createFileConfirm}
                        onCancel={cancelFileCreation}
                        haveFocus={true}
                        value={''}

                    ></ThreeItemForm>
                </li> }
            
                { isModeNewDirectory && <li>
                    <ThreeItemForm 
                        id={newDirectoryItemId}
                        onConfirm={createDirectoryConfirm}
                        onCancel={cancelDirectoryCreation}
                        haveFocus={true}
                        value={''}

                    ></ThreeItemForm>
                </li> }
            </ThreeGroup> }

            

            
        </Fragment>
    );
}
