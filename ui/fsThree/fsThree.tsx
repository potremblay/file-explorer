import { Fragment } from "react";
import { EThreeItemType, IDirectory, IFile } from "../../core/fileProvider.interface";
import ThreeGroup from "../three/threeGroup";
import ThreeItem from "../three/threeItem";
import ThreeRoot from "../three/threeRoot";

/*
    @TODO: Implement arrow navigation with up/down arrow and not use tab only for the active element
           Refs: https://www.w3.org/TR/wai-aria-practices/examples/treeview/treeview-1/treeview-1b.html
    
    @TODO: Add Tablable on the first element
*/


interface IFsThree {
    root: IDirectory
}
 
function renderFile(file: IFile, index: number, level: number, nbSibling: number) {
    const isFirstFile = index === 0 && level === 1;

    return (
        <ThreeItem title={file.name} key={index} level={level} index={index} size={nbSibling} isTabblable={isFirstFile}></ThreeItem>
    )
}

function renderDirectory(directory: IDirectory, index: number, level: number, nbSibling: number) {
    const isFirstFile = index === 0 && level === 1;
    const folderContent = () => {
        return (
            <ThreeGroup>
                { loopDirectory(directory, level+1) }
            </ThreeGroup>
        );
    }

    return (
        <ThreeItem title={directory.name} key={index} level={level} index={index} size={nbSibling} isTabblable={isFirstFile} isCollabsable={true}>
            { directory.children.length ? folderContent() : <Fragment></Fragment>  }
        </ThreeItem>
    )
}

function loopDirectory(directory: IDirectory, level: number) {
    return directory.children.map((item, index) => {
        if (item.type === EThreeItemType.FILE) {
            return renderFile(item, index, level, directory.children.length);
        }

        if (item.type === EThreeItemType.DIRECTORY) {
            return renderDirectory(item, index, level, directory.children.length);
        }
    })
}

export default function FileThree(props: IFsThree) {
    return (
        <ThreeRoot title={ props.root.name }>
            { loopDirectory(props.root, 1) }
        </ThreeRoot>
    )
}