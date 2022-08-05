const cds = require('@sap/cds')
const axios = require('axios').default;
const FormData = require('form-data');
const bodyParser = require("body-parser")

if (process.env.VCAP_SERVICES) {
    const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
    console.log(VCAP_SERVICES)
    const sdmCredentials = VCAP_SERVICES.sdm[0].credentials;
    console.log(sdmCredentials)
}

// JSON.parse(process.env.VCAP_SERVICES)
// // Access the sdm credentials (Document management, Integration option instance)


const _fetchJwtToken = async function (oauthUrl, oauthClient, oauthSecret) {
    // This is to get the oauth token , which is used to create the folder ID
    return new Promise((resolve, reject) => {
        const tokenUrl = oauthUrl + '/oauth/token?grant_type=client_credentials&response_type=token'
        const config = {
            headers: {
                Authorization: "Basic " + Buffer.from(oauthClient + ':' + oauthSecret).toString("base64")
            }
        }
        axios.get(tokenUrl, config)
            .then(response => {
                resolve(response.data.access_token)
            })
            .catch(error => {
                reject(error)
            })
    })
}

// This is to create a folder in the repository for every new salesorder that is getting created.
// So basically we create a new folder for every salesorder and user can add their respective attachments in that folder.
const _createFolder = async function (sdmUrl, jwtToken, repositoryId, rootFolderId, forlderName) {
    return new Promise((resolve, reject) => {
        const folderCreateURL = sdmUrl + "browser/" + repositoryId + "/root"

        const formData = new FormData();
        formData.append("objectId", rootFolderId);
        formData.append("cmisaction", "createFolder");
        formData.append("propertyId[0]", "cmis:name");
        formData.append("propertyValue[0]", forlderName);
        formData.append("propertyId[1]", "cmis:objectTypeId");
        formData.append("propertyValue[1]", "cmis:folder");
        formData.append("succinct", 'true');


        let headers = formData.getHeaders();
        headers["Authorization"] = "Bearer " + jwtToken;

        const config = {
            headers: headers
        }

        axios.post(folderCreateURL, formData, config)
            .then(response => {
                resolve(response.data.succinctProperties["cmis:objectId"])
            })
            .catch(error => {
                reject(error)
            })
    })
}

module.exports = cds.service.impl(async (service) => {
    // This will be called whenever a new draft sales order is getting created
    service.before("NEW", 'SalesOrders', async (context) => {
        const VCAP_SERVICES = JSON.parse(process.env.VCAP_SERVICES);
        const sdmCredentials = VCAP_SERVICES.sdm[0].credentials;
        console.log(sdmCredentials)
        // Fill the repositoryId
        context.data.repositoryId = "c983be51-f037-4182-bab5-ec2ed1e82f5b";
        const connJwtToken = await _fetchJwtToken(sdmCredentials.uaa.url, sdmCredentials.uaa.clientid, sdmCredentials.uaa.clientsecret)
        // Creating the folder id and fill it
        context.data.folderId = await _createFolder(sdmCredentials.endpoints.ecmservice.url, connJwtToken, context.data.repositoryId, "xgpZ4_EP3n9U7YDLZRUKWGQzNbOMoeGkB2YZnsJBbFs", context.data.ID);
    });
});