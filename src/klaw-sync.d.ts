/**
 * Rough type declarations for klaw-sync
 */
declare module 'klaw-sync' {
    // Interfaces
    export interface KlawFile {
        path: string;
    }

    export interface KlawOptions {
        nodir?: boolean;
        traverseAll?: boolean;
        filter?: (file: KlawFile) => boolean;
    }

    // Main Function
    export default function KlawSync(directory: string, options: KlawOptions): KlawFile[];
}