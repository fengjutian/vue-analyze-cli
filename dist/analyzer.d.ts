export interface TemplateInfo {
    file: string;
    interpolations: string[];
    vFors: string[];
    vIfs: string[];
}
export declare function analyzeVueFile(filePath: string): TemplateInfo;
export declare function analyzeProject(projectPath: string): TemplateInfo[];
export declare function generateHtmlReport(report: TemplateInfo[], outputPath: string): void;
//# sourceMappingURL=analyzer.d.ts.map