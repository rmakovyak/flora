const fetch = require('node-fetch');

const index = async (event) => {
  const {
    pathParameters: { q },
  } = event;

  try {
    const searchResponse = await fetch(
      `https://trefle.io/api/v1/plants/search?token=ULosZ1ks-QMO5atGgsvRqS35L_MtkjTN_SlFOx8EAe0&q=${q}`,
    );

    const json = await searchResponse.json();
    const payload = {
      data: json.data,
      meta: json.meta,
    };

    const response = {
      statusCode: 200,
      body: JSON.stringify(payload),
    };

    return response;
  } catch (e) {
    return {
      statusCode: 500,
    };
  }
};

exports.handler = index;
