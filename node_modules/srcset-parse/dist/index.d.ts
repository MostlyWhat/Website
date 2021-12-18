declare const DescriptorNames: {
    readonly w: "width";
    readonly x: "density";
};
declare type Descriptor = keyof typeof DescriptorNames;
export declare type DescriptorName = typeof DescriptorNames[Descriptor];
export declare type ImageCandidate = {
    url: string;
} & {
    [K in DescriptorName]?: number;
};
declare const parse: (srcset: string) => ImageCandidate[];
export default parse;
