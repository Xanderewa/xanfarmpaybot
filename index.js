const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

const app = express();
const PORT = 3000;

app.get('/', (req, res) => {
  res.status(200).send('Bot de XanFarm activo 🚀');
});

app.listen(PORT, () => {
  console.log(`✅ Servidor Express activo en puerto ${PORT}`);
});

const bot = new TelegramBot(process.env.TOKEN, { polling: true });

const paquetes = {
  1: { nombre: "Starter", llaves: 100, cultivos: "1 Épico (aleatorio)", precio: 2.99, emoji: "🌱" },
  2: { nombre: "Pro Farmer", llaves: 250, cultivos: "3 Raros (aleatorios)", precio: 4.99, emoji: "🚜" },
  3: { nombre: "Advanced", llaves: 500, cultivos: "2 Épicos + 2 Raros", precio: 9.99, emoji: "🏆" },
  4: { nombre: "Mega Epic", llaves: 1000, cultivos: "2 Épicos + 1 Legendario", precio: 40, emoji: "💎" },
  5: { nombre: "Legendary Farmer", llaves: 2000, cultivos: "Rango VIP + extras", precio: 100, emoji: "👑" }
};

const metodosPago = `
💳 Métodos de Pago aceptados:

1. TON (Red TON)
   - Wallet: \`UQCYMhHI41vJfLh2JTHAThm-MSr2w9RD6kWVweFVXWqdb0v4\`

2. USDT (BEP20)
   - Wallet: \`0xbbfbfccda7d9a8fb437dc3b107227da3afb36731\`

Enviá tu comprobante a @soporteXanFarm con tu ID de Telegram
`;

const tecladoPrincipal = {
  reply_markup: {
    keyboard: [
      ["🎁 Comprar paquetes", "💳 Métodos de pago"],
      ["📊 Mi perfil", "🆘 Soporte"]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  }
};

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, `🎮 ¡Bienvenido a XanFarm!\nUsá los botones o comandos para comenzar:`, {
    parse_mode: 'Markdown',
    reply_markup: tecladoPrincipal.reply_markup
  });
});

bot.onText(/\/comprar/, (msg) => {
  mostrarPaquetes(msg.chat.id);
});

bot.onText(/\/pago/, (msg) => {
  mostrarMetodosPago(msg.chat.id);
});

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const texto = msg.text;

  switch (texto) {
    case "🎁 Comprar paquetes":
      mostrarPaquetes(chatId);
      break;
    case "💳 Métodos de pago":
      mostrarMetodosPago(chatId);
      break;
    case "📊 Mi perfil":
      mostrarPerfil(chatId);
      break;
    case "🆘 Soporte":
      mostrarSoporte(chatId);
      break;
  }
});

bot.onText(/\/start buy_(\d+)/, (msg, match) => {
  const chatId = msg.chat.id;
  const paqueteId = match[1];
  const pack = paquetes[paqueteId];

  if (pack) {
    const mensaje = `🛒 Confirmación de compra\n\n` +
                    `${pack.emoji} *${pack.nombre}*\n` +
                    `🔑 ${pack.llaves} llaves\n` +
                    `🌾 ${pack.cultivos}\n` +
                    `💵 $${pack.precio} USD\n\n` +
                    `Para continuar, usá /pago o tocá abajo.`;

    bot.sendMessage(chatId, mensaje, {
      parse_mode: 'Markdown',
      reply_markup: tecladoPrincipal.reply_markup
    });
  }
});

function mostrarPaquetes(chatId) {
  let mensaje = "*Paquetes disponibles*\n\n";
  Object.keys(paquetes).forEach(key => {
    const p = paquetes[key];
    mensaje += `${p.emoji} *${p.nombre}*\n` +
               `🔑 ${p.llaves} llaves\n` +
               `🌾 ${p.cultivos}\n` +
               `💵 $${p.precio} USD\n\n` +
               `👉 [Comprar ahora](https://t.me/XanFarmPayBot?start=buy_${key})\n\n` +
               "------------------------\n\n";
  });

  bot.sendMessage(chatId, mensaje, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: {
      inline_keyboard: [
        [{ text: "💳 Ver métodos de pago", callback_data: "ver_pago" }]
      ]
    }
  });
}

function mostrarMetodosPago(chatId) {
  bot.sendMessage(chatId, metodosPago, {
    parse_mode: 'Markdown',
    disable_web_page_preview: true,
    reply_markup: tecladoPrincipal.reply_markup
  });
}

function mostrarPerfil(chatId) {
  bot.sendMessage(chatId, `👤 Tu perfil\n\n` +
                          `🆔 ID: \`${chatId}\`\n` +
                          `📅 Ingreso: Hoy\n` +
                          `💼 Paquetes comprados: 0`, {
    parse_mode: 'Markdown',
    reply_markup: tecladoPrincipal.reply_markup
  });
}

function mostrarSoporte(chatId) {
  bot.sendMessage(chatId, `🛎️ Soporte\n\nContacto: @soporteXanFarm`, {
    parse_mode: 'Markdown',
    reply_markup: tecladoPrincipal.reply_markup
  });
}

bot.on('callback_query', (query) => {
  const chatId = query.message.chat.id;
  if (query.data === 'ver_pago') {
    mostrarMetodosPago(chatId);
  }
});

setInterval(() => {
  console.log('Ping interno cada 10 segundos ✅');
}, 10000); // 10000 milisegundos = 10 segundos
