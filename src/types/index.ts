export interface Command {
    name: string;
    description: string;
    execute: (args: string[]) => void;
}

export interface PhraseResponse {
    trigger: string;
    response: string;
}