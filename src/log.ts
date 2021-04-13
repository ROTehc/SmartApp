const baseStyles = [
  "padding: 2px 4px",
  "border-radius: 2px",
].join(";");

const infoStyle = [
  "color: #0e90db",
].join(";");

const subscriptionStyle = [
  "color: lime",
].join(";");

const errorStyle = [
  "color: red",
].join(";");

export function logger(type: string, ...message: string[] | Error[]) {
  let emoji;
  switch (type) {
    case "INF":
      emoji = "📣";
      break;
    case "SUB":
      emoji = "🤙";
      break;
    case "AQI":
      emoji = "☁️";
      break;
    case "DAT":
      emoji = "🌡️";
      break;
    case "LOC":
      emoji = "📍";
      break;
    case "SUCCESS":
      emoji = "✅";
      break;
    case "ERR":
      emoji = "❌";
      break;
  }
  console.log(emoji, message.join(" "));
}
