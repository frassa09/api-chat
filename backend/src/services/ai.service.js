const urlIa = process.env.API_AI_URL;

export const aiService = {
  generate: async (prompt, model) => {
    const jsonBody = JSON.stringify({
      model,
      prompt,
      stream: false
    });

    try {
      const response = await fetch(`${urlIa}/api/generate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: jsonBody,
      });

      return response;
    } catch (err) {
      console.log(err.message);

      return err;
    }
  },
};
