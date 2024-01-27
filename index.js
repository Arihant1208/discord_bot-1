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
    console.error("Error fetching form data:", error);
    return false;
  }
}

module.exports = verifypayment;
