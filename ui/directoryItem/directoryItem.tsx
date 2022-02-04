import { useState } from 'react';
import { v4 as uuid } from 'uuid';
import { EThreeItemType, IDirectory } from '../../core/fileProvider.interface';
import FileItem from '../fileItem/fileItem';
import style from './directoryItem.module.css';

interface IDirectoryItemProps {
    directory: IDirectory
}

export default function DirectoryItem(props: IDirectoryItemProps) {
    const id = uuid();
    const [isExpended, setIsExpended] = useState(false);

    return (
        <div>
            <div className={style.header}>
                <button aria-expanded={ isExpended } aria-controls={ id + '-content' } id={ id + '-control' } onClick={() => setIsExpended(!isExpended)}>
                    <span>
                        <span className={ style.visuallyHidden }>Directory </span>
                        { props.directory.name }
                    </span>
                </button>
                <button>
                    <span className={ style.visuallyHidden }>Access actions menu for { props.directory.name }</span>
                </button>
            </div>

            <div className={style.directoryContent} id={ id + '-content' } role="region" aria-labelledby={ id + '-control' } >
                { props.directory.children.map(item => {
                    if (item.type === EThreeItemType.DIRECTORY) {
                        return <DirectoryItem key={item.name} directory={item}></DirectoryItem>
                    }
                    return <FileItem file={item} key={item.name}></FileItem>;
                }) }
            </div>
        </div>
    );
}