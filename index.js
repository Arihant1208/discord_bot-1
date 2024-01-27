const { Client, GatewayIntentBits } = require("discord.js");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    // Add more intents as needed for your bot
  ],
});
// const Discord = require("discord.js");
// const client = new Discord.Client();
const prefix = "/"; // Change this to your desired command prefix

console.log("hey");
const fetch = require("node-fetch"); // Require 'node-fetch' if you are working in a Node.js environment

async function verifypayment(id) {
  const headers = {
    Authorization:
      "Basic " +
      Buffer.from("rzp_test_MWzywZoFXYDOaM:xBdJiutm9Tx7Je1gLNaWuWRM").toString(
        "base64"
      ),
  };
  const url = `https://api.razorpay.com/v1/payments/${id}`;

  try {
    const response = await fetch(url, {
      method: "GET",
      headers: headers,
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching form data:", error);
    return false;
  }
}

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("guildMemberAdd", (member) => {
  console.log(
    `New User "${member.user.username}" has joined "${member.guild.name}"`
  );
  // const targetMember = member.mentions.members.first();
  console.log(member);

  // // Check if a member was mentioned
  // if (targetMember) {
  //   // Get the role to add (adjust as needed)
  //   const roleToAdd = member.guild.roles.cache.find(
  //     (role) => role.name === "Unverified"
  //   );

  //   // Check if the role exists
  //   if (roleToAdd) {
  //     // Add the role to the member
  //     targetMember.roles
  //       .add(roleToAdd)
  //       .then(() => {
  //         message.reply(
  //           `Role ${roleToAdd.name} added to ${targetMember.user.tag}`
  //         );
  //       })
  //       .catch((error) => {
  //         // console.error("Error adding role:", error);
  //         message.reply("Error adding role. Please try again.");
  //       });
  //   } else {
  //     message.reply("Role not found.");
  //   }
  // } else {
  //   message.reply("Please mention a member.");
  // }
  member.guild.channels.cache
    .find((c) => c.name === "welcome")
    .send(`"${member.user.username}" has joined this server`);
});

client.on("messageCreate", async (message) => {
  // console.log(message.content, message.content.startsWith(prefix));
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(" ");
  const command = args.shift().toLowerCase();

  if (command === "verify") {
    // console.log("verify command run", message.member.roles.cache);
    // console.log(
    //   "/////////////////////////////////////////////////////////////////////"
    // );
    // console.log(message);
    // Check if the message author has the required role or permissions
    // You can customize this check based on your server's structure
    if (message.member.roles.cache.some((role) => role.name === "Unverified")) {
      // Assuming the ID is passed as an argument
      const idToVerify = args[0];
      const verifyData = await verifypayment(idToVerify);
      const unverifiedRole = message.guild.roles.cache.find(
        (role) => role.name === "Unverified"
      );
      // Check if the provided ID matches the expected ID
      if (verifyData.id) {
        // Grant the verified role
        console.log("###############################3");
        console.log(verifyData);
        const verifiedRole = message.guild.roles.cache.find(
          (role) => role.name === "Verified"
        );
        if (verifiedRole) {
          message.member.roles.add(verifiedRole);
          message.member.roles.remove(unverifiedRole);
          message.reply("You have been successfully verified!");
        } else {
          message.reply(
            "Error: Verified role not found. Please contact an administrator."
          );
        }
      } else if (idToVerify === "token") {
        // Grant the verified role
        const verifiedRole = message.guild.roles.cache.find(
          (role) => role.name === "plat member"
        );
        if (verifiedRole) {
          message.member.roles.add(verifiedRole);
          message.reply("You have been successfully verified!");
        } else {
          message.reply(
            "Error: Verified role not found. Please contact an administrator."
          );
        }
      } else {
        message.reply("Error: wrong verification ID.");
      }
    } else {
      message.reply("Error: You are already verified.");
    }
  }
});

client.login(DISCORD_BOT_TOKEN);

// service type
// one time only  and by one user only
// multiple role
