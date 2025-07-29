require('dotenv').config();
const { Client, GatewayIntentBits, ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');
const { DisTube } = require('distube');
const { SpotifyPlugin } = require('@distube/spotify');
const { SoundCloudPlugin } = require('@distube/soundcloud');

const frases = [
  "AI QUE LOUCURA, VOCÊ ME CHAMOU? 😂",
  "ME SEGURA SENÃO EU SURTO! 💥",
  "TOCA UMA COISA BOA QUE EU TÔ NERVOSA! 🔥",
  "EU SOU RICA! 💎",
  "GLBT DIVERSIDADE! 🌈",
  "AI, QUE DELÍCIA DE MÚSICA! 🎶"
];

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

// ✅ Nova forma de criar o DisTube no v5
const distube = new DisTube(client, {
  emitAddSongWhenCreatingQueue: true,
  emitNewSongOnly: true,
  plugins: [
    new SpotifyPlugin(),
    new SoundCloudPlugin()
  ]
});

client.once('ready', () => {
  console.log('✅ Narcisa está online!');
});

// Narcisa responde menções
client.on('messageCreate', async message => {
  if (message.author.bot) return;

  if (message.content.toLowerCase().includes('narcisa')) {
    const frase = frases[Math.floor(Math.random() * frases.length)];
    const embed = new EmbedBuilder()
      .setColor('#ff00ff')
      .setTitle('✨ Narcisa Diz:')
      .setDescription(frase)
      .setFooter({ text: '💖 Sempre um show!' });
    message.channel.send({ embeds: [embed] });
  }
});

// Função para criar botões
function createButtons() {
  return new ActionRowBuilder().addComponents(
    new ButtonBuilder().setCustomId('pause').setLabel('⏸ Pausar').setStyle(ButtonStyle.Secondary),
    new ButtonBuilder().setCustomId('resume').setLabel('▶ Retomar').setStyle(ButtonStyle.Success),
    new ButtonBuilder().setCustomId('skip').setLabel('⏭ Pular').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId('stop').setLabel('⛔ Parar').setStyle(ButtonStyle.Danger)
  );
}

// Eventos do DisTube
distube.on('playSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#ff00ff')
    .setTitle('🎶 Tocando agora!')
    .setDescription(`AI QUE LOUCURA! Tocando: **${song.name}**`)
    .setFooter({ text: 'Me segura, senão eu surto!' });
  queue.textChannel.send({ embeds: [embed], components: [createButtons()] });
});

distube.on('addSong', (queue, song) => {
  const embed = new EmbedBuilder()
    .setColor('#00ff99')
    .setTitle('🎵 Música adicionada!')
    .setDescription(`Coloquei na fila: **${song.name}**. UMA MÚSICA PROS GAYS`)
    .setFooter({ text: 'GLBT DIVERSIDADE!' });
  queue.textChannel.send({ embeds: [embed] });
});

distube.on('finish', queue => {
  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('✅ Fila encerrada!')
    .setDescription('Acabou a festa, meu amooor! 💃 Vou esperar 15 minutos antes de sair...')
    .setFooter({ text: 'Quer mais música? Chama a Narcisa!' });

  queue.textChannel.send({ embeds: [embed] });
});

// Tratamento correto do erro para evitar channel.send não ser função
distube.on('error', (channelOrQueue, error) => {
  let textChannel;

  if (channelOrQueue?.textChannel) {
    textChannel = channelOrQueue.textChannel;
  } else if (channelOrQueue?.send) {
    textChannel = channelOrQueue;
  } else {
    console.error('Não foi possível identificar o canal para enviar mensagem de erro');
    console.error(error);
    return;
  }

  const embed = new EmbedBuilder()
    .setColor('#ff0000')
    .setTitle('❌ Erro!')
    .setDescription('AI QUE LOUCURA! Deu erro na música, tenta outro link!')
    .setFooter({ text: 'Respira, não pira!' });

  textChannel.send({ embeds: [embed] }).catch(console.error);

  console.error(error);
});

// Comandos
client.on('messageCreate', async message => {
  if (message.author.bot || !message.guild) return;

  const prefix = '!';
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const command = args.shift().toLowerCase();

  if (command === 'play') {
    if (!args[0]) return message.reply('TA MALUCA MON AMOUR? VOCÊ NÃO PEDIU NENHUMA MUSICA HAHAHAHA');
    const userMessage = message;
    await distube.play(message.member.voice.channel, args.join(' '), {
      textChannel: message.channel,
      member: message.member
    });
    setTimeout(() => userMessage.delete().catch(() => {}), 2000);
  }
});

// Botões
client.on('interactionCreate', async interaction => {
  if (!interaction.isButton()) return;

  const queue = distube.getQueue(interaction.guildId);
  if (!queue) return interaction.reply({ content: 'TA MALUCA MONAMUR, VOCÊ NÃO PEDIU NENHUMA MUSICA HAHAHAHA', ephemeral: true });

  switch (interaction.customId) {
    case 'pause':
      distube.pause(interaction);
      await interaction.reply({ content: '⏸ PAUSA! PRECISO RESPIRAR, CADÊ MINHAS GOTAS?', ephemeral: true });
      break;
    case 'resume':
      distube.resume(interaction);
      await interaction.reply({ content: '▶ VOLTEI COM A MÚSICA, SEGURA ESSE BADALO! 🔥', ephemeral: true });
      break;
    case 'skip':
      distube.skip(interaction);
      await interaction.reply({ content: '⏭ AI QUE LOUCURA, já enjoei dessa! Próxima, meu amor! 💃', ephemeral: true });
      break;
    case 'stop':
      distube.stop(interaction);
      await interaction.reply({ content: '⛔ Parei tudo! MAS É SÓ CHAMAR QUE EU TOCO UMA MÚSICA PROS GAYS, AI QUE BADALO!', ephemeral: true });
      break;
  }
});

client.login(process.env.DISCORD_TOKEN);
