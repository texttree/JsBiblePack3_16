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
        const data = await response.json();
        return data;
      } else {
        throw Error(
          `STATUS: code:${response.status}, statusText:${response.statusText}`
        );
      }
    } catch (error) {
      throw error;
    }
  }
}

export { ApiInterface };
