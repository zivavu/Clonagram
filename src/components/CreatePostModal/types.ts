export interface SelectedFile {
   file: File;
   preview: string;
   aspectRatio: 'original' | '1:1' | '4:5' | '16:9' | '9:16';
   zoom: number;
}

export type Step = 'upload' | 'crop';
