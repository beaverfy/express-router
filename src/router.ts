import type { ExpressRouterConfiguration } from "./types";
import type { Application, Request, Response } from "express";
import klawSync from "klaw-sync";
import type { Route } from "./route";
import { FileSystemWalker } from "file-system-walker";
import "colors";
import path from "path";
import { walkTree } from "./walker";

const currentDirectory = process.cwd();
const defaultRouterConfiguration: ExpressRouterConfiguration = {
    directory: `./${currentDirectory}/routes`,
    authentication: {
        token: process.env.ROUTER_TOKEN as string,
        enabledByDefault: true
    },
    advanced: {
        useExperimentalDirectoryHelper: false,
        authenticationQueryKey: "token"
    }
}

export async function useExpressRouter(app: Application, _config?: ExpressRouterConfiguration) {
    // merge default configuration
    const configuration = {
        ...defaultRouterConfiguration,
        ..._config
    };

    const routePath = currentDirectory + configuration.directory.replaceAll(".", "");

    if (!configuration.directory) throw new Error(`[ExpressRouter] expected string for directory but got ${configuration.directory}`);
    async function fetchRouteFiles(): Promise<(Route & { path: string })[]> {
        console.log(currentDirectory, configuration.directory);
        const walker = walkTree(routePath);
        const routeFiles: (Route & { path: string })[] = [];

        for await (const file of walker) {
            if (!file.name.endsWith(".js")) continue;

            try {
                const filepath = path.parse(file.path);
                console.log(filepath)
                // Explicitly define the type of the imported module
                const fileContent: {
                    default: new () => Route, expressRouter?: {
                        expressRouter?: {
                            ignoreFile?: boolean;
                        }
                    }
                } = await import(
                    path.join(file.path, file.name)
                );

                if (fileContent?.expressRouter?.expressRouter?.ignoreFile) continue;
                // Check if the imported module has a default export
                if (fileContent.default) {
                    const route: Route = new fileContent.default();
                    console.log(route, file, fileContent);
                    routeFiles.push({
                        ...route,
                        path: file.name,
                    });
                } else {
                    console.warn(`${file.name.gray} does not have a ${"default export".red}, make sure you've defined one with ${"export default ...".blue}`);
                }
            } catch (error) {
                console.warn(`${"Could not import".red} ${file.name.gray}, make sure ${"this file exists".blue} and is a ${"valid javascript file".blue}: ${error}`);
                continue;
            }
        }

        return routeFiles;
    }


    function addAuthentication(route: (req: Request, res: Response) => unknown, config: Route) {
        if (configuration.authentication?.token != null && (config?.requireAuthorization == true || (
            config.requireAuthorization == null && configuration.authentication?.enabledByDefault
        ))) {
            return (req: Request, res: Response) => {
                if (
                    req.headers?.authorization != configuration.authentication?.token &&
                    req.query?.[configuration?.advanced?.authenticationQueryKey as string] != configuration.authentication?.token
                ) {
                    return res
                        .status(401)
                        .send("Unauthorized");
                } else return route(req, res);
            }
        } else return route;
    }

    const routes = new Set<Route & { path: string; }>(
        await fetchRouteFiles()
    );

    /**
     * Not well made method that dangerously replaces things to get the route path for express
     */
    function resolvePath(filePath: string): string {
        console.log("resolving: ", filePath);

        // // Normalize the paths using path.join
        // const normalizedBasePath = path.join(basePath);
        // const normalizedFilePath = path.join(filePath);

        // Remove the base path
        let relativePath = filePath;

        // Remove ".js" if present
        relativePath = relativePath.replace(".js", "");

        // Remove current path
        relativePath = relativePath.replace(routePath, "");

        // Remove "index" and leading "/" if present
        relativePath = relativePath.replace("index", "");

        if (!relativePath.startsWith("/")) relativePath = `/${relativePath}`;

        // Handle dynamic paths like "/blog/[author]/[id].ts"
        while (relativePath.includes("[") && relativePath.includes("]")) {
            const paramStart = relativePath.indexOf("[");
            const paramEnd = relativePath.indexOf("]");
            const param = relativePath.substring(paramStart + 1, paramEnd);

            // Update the path to include the dynamic parameter
            relativePath = relativePath.replace(`[${param}]`, `:${param}`);
        }

        console.log("resolved: ", relativePath);

        return relativePath;
    }

    for (const route of routes.values()) {
        const defaultPath = resolvePath(route.path);
        const path = typeof route?.routeName != "string" ?
            defaultPath :
            route.routeName.replaceAll("%DEFAULT_PATH%", defaultPath);

        console.log("available methods:", route.onGet != null, route)
        if (route.onGet) app.get(path, addAuthentication(route.onGet, route));
        if (route.onHead) app.head(path, addAuthentication(route.onHead, route));
        if (route.onPost) app.post(path, addAuthentication(route.onPost, route));
        if (route.onPut) app.put(path, addAuthentication(route.onPut, route));
        if (route.onPatch) app.patch(path, addAuthentication(route.onPatch, route));
        if (route.onDelete) app.delete(path, addAuthentication(route.onDelete, route));
    }
}