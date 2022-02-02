const Responses = require('../common/API_Responses')
const AWS = require('aws-sdk')
const Axios = require('axios')

const SES = new AWS.SES()
const newURL = 'https://newsapi.org'
exports.handler = async (event) => {
    console.log({event})
    const techNews = await getNews()
    const emailHTML = createEmailHTML(techNews)
    const params = {
        Destination: {
            ToAddresses: ['sherutoppr@gmail.com'],
        },
        Message: {
            Body: {
                Html: { Data: emailHTML },
            },
            Subject: { Data: 'morning News' },
        },
        Source: 'sherutoppr@gmail.com'
    }

    try {
        await SES.sendEmail(params).promise()
        return Responses._200({message: 'email sent'})
    } catch (error) {
        console.log("error while reminder email: ", error)
        return Responses._400({message: 'failed to sent email'})
    }
}

const createEmailHTML = (techNews) => {
    return `<html>
    <body>
        <h1>Top Tech News</h1>
        ${techNews.map(article => {
            return `
            <h3>${article.title}</h3>
            <p>${article.description}</p>
            <a href=${article.url}><button>Read More</button></a>
            `
        })}
    </body>
    </html>
    `
}

const getNews = async () => {
    const options = {
        params: {
            q: 'technology',
            language: 'en'
        },
        headers: {
            'X-Api-Key': "bf74603deeb54db28276d34494abab0d"
        }
    }

    const {data: newsData} = await Axios.get(`${newURL}/v2/top-headlines`, options)

    if(!newsData) {
        throw Error('no data from the new api')
    }

    return newsData.articles.slice(0,5)
}