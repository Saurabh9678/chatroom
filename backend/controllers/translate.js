const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
const { Translate } = require("@google-cloud/translate").v2;

const translate = new Translate({
  credentials: CREDENTIALS,
  projectId: CREDENTIALS.projectId,
});

const detectLanguage = async (text) => {
  try {
    let response = await translate.detect(text);
    return response[0].language
  } catch (e) {
    console.log("Error at translation------>" + e);
    return 0
  }
};

const translatetext = async (text, targetLanguage)=>{
    try {
        let [response] = await translate.translate(text,targetLanguage);
        return response
    } catch (error) {
        console.log("Error at translation------>"+ error);
        return 0
    }

}

module.exports = {detectLanguage, translatetext};
