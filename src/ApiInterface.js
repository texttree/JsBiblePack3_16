class ApiInterface {
  constructor(apiKey) {
    this.apiKey = apiKey;
  }

  async get(url) {
    try {
      let response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "API-Key": this.apiKey,
        },
      });
      if (response.status === 200) {
        console.log(161, response);
        const data = await response.json();
        return data;
      } else {
        console.log(20, response);
        throw new Error(response);
      }
    } catch (error) {
      console.log(24, response);
      console.log(25, error);

      throw new Error(error);
    }
  }
}

export { ApiInterface };
