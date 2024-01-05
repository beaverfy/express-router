import { readdirSync, statSync } from "fs"
import path from "path"

export const mergePaths = (...paths: string[]) =>
    "/" +
    paths
        .map(path => path.replace(/^\/|\/$/g, ""))
        .filter(path => path !== "")
        .join("/");

export const walkTree = (directory: string, tree: string[] = []) => {
    const files: {
        name: string;
        path: string;
        rel: string;
    }[] = []

    for (const fileName of readdirSync(directory)) {
        const filePath = path.join(directory, fileName)
        const fileStats = statSync(filePath)

        if (fileStats.isDirectory()) {
            files.push(...walkTree(filePath, [...tree, fileName]))
        } else {
            files.push({
                name: fileName,
                path: directory,
                rel: mergePaths(...tree, fileName)
            })
        }
    }

    return files;
}