export const playMusic = async (interaction) => {
    const { client } = interaction;

    // Check if the user is in a voice channel
    const voiceChannel = interaction.member.voice.channel;
    if (!voiceChannel) {
        return interaction.reply("Você precisa estar em um canal de voz para tocar música!");
    }

    // Join the voice channel
    const connection = await voiceChannel.join();

    // Here you would typically use a music library to play a song
    // For demonstration, we'll just send a message
    interaction.reply("Tocando uma música! 🎶");

    // Example of how to leave the voice channel after playing
    // connection.on('finish', () => {
    //     voiceChannel.leave();
    // });
};