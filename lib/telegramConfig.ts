import fs from "fs";
import path from "path";

export function getTelegramConfig() {
  const getEnvVal = (key: string): string => {
    try {
      const envPath = path.join(process.cwd(), '.env');
      if (fs.existsSync(envPath)) {
        const content = fs.readFileSync(envPath, 'utf8');
        const match = content.match(new RegExp(`^${key}=(.*)`, 'm'));
        if (match && match[1]) {
          return match[1].trim().replace(/['"]/g, '');
        }
      }
    } catch {}
    return process.env[key] || '';
  };

  let botToken = getEnvVal('TELEGRAM_BOT');
  let chatId = getEnvVal('TELEGRAM_CHAT');

  try {
    const configPath = path.join(process.cwd(), "traffic-config.json");
    if (fs.existsSync(configPath)) {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"));
      if (config.botToken) botToken = config.botToken;
      if (config.chatId) chatId = config.chatId;
    }
  } catch (err) {
    console.error("Error reading traffic config in getTelegramConfig:", err);
  }

  return { botToken, chatId };
}
