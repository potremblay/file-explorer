import { IFile } from '../../core/fileProvider.interface';
import style from './fileItem.module.css';

interface IFileItemProps {
    file: IFile
}

export default function FileItem(props: IFileItemProps) {

    return (
        <div className={ style.item }>
            <span tabIndex={0} >{ props.file.name }</span>
            <button>
                <span className={ style.visuallyHidden }>Access actions menu for { props.file.name }</span>
            </button>
        </div>
    );
}