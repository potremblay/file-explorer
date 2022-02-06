import { Fragment, useContext, useEffect, useState } from "react";
import FileExplorerContext, { FileExplorerContextProvider } from "../../context/fileExplorerContext";
import { EThreeItemType, IDirectory, IFile } from "../../core/fileProvider.interface";
import ThreeGroup from "./threeGroup";
import ThreeItem from "./threeItem";
import ThreeRoot from "./threeRoot";

/*
    @TODO: Implement arrow navigation with up/down arrow and not use tab only for the active element
           Refs: https://www.w3.org/TR/wai-aria-practices/examples/treeview/treeview-1/treeview-1b.html
    
    @TODO: Add Tablable on the first element
*/

export default function Three(props) {
    const provider = useContext(FileExplorerContext);
    
    const [ isLoading, setIsLoading ] = useState(true);
    const [ root, setRoot ] = useState(null);

    function refresh() {
        return provider.refresh().then(rootDirectory => {
            setRoot(rootDirectory);
            setIsLoading(false);
        });
    }

    function renderFile(file: IFile, index: number, level: number, nbSibling: number) {
        const isFirstFile = index === 0 && level === 1;
    
        return (
            <ThreeItem
                title={file.name}
                key={index}
                level={level}
                index={index}
                size={nbSibling}
                isTabblable={isFirstFile}
                onRename={ (newName, callback) => {
                    setIsLoading(true);
                    provider.renameFile(file, newName).then(refresh).then(callback);
                }}
                onDelete={ () => {
                    setIsLoading(true);
                    provider.deleteFile(file).then(refresh);
                } }
            ></ThreeItem>
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
            <ThreeItem
                title={directory.name}
                key={index}
                level={level}
                index={index}
                size={nbSibling}
                isTabblable={isFirstFile}
                isCollabsable={true}
                onRename={(newName, callback) => {
                    setIsLoading(true);
                    provider.renameDirectory(directory, newName).then(refresh).then(callback);
                }}
                onAddfile={fileName => {
                    setIsLoading(true);
                    const content = '';
                    provider.createFile(fileName, directory, content).then(refresh);
                }}
                onAddDirectory={directoryName => {
                    setIsLoading(true);
                    provider.createDirectory(directoryName, directory).then(refresh);
                }}
                onDelete={() => {
                    setIsLoading(true);
                    provider.deleteDirectory(directory).then(refresh);
                }}
            >
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

    // Load data for the first time
    useEffect(() => {
        refresh();
    }, []);

    return (
        <Fragment>
            { root && (
                <ThreeRoot title={ root.name } className={ props.className || '' }>
                    { loopDirectory(root, 1) }
                </ThreeRoot>
            ) }
        </Fragment>
    )
}