export const phrases = [
    "AI QUE LOUCURA",
    "GLBT DIVERSIDADE",
    "TOCA UMA MUSICA PROS GAYS"
];

export function sendPhrase(command: string): string | null {
    switch (command) {
        case 'ai_que_loucura':
            return phrases[0];
        case 'glbt_diversidade':
            return phrases[1];
        case 'toca_uma_musica_pros_gays':
            return phrases[2];
        default:
            return null;
    }
}