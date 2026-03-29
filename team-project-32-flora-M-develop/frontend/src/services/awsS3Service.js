import S3 from 'react-aws-s3'
import axios from 'axios';
import { apiUri } from '../assets/constants';

const config = {
    bucketName: 'flora-bucket',
    dirName: 'photos', /* optional */
    region: 'us-east-2',
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY,
    secretAccessKey: process.env.REACT_APP_AWS_SECERET_KEY,
}
const ReactS3Client = new S3(config);

const upload = async (file) => {
    try {
        const newFileName = "test-file"
        const response = await ReactS3Client.uploadFile(file)
        return response.location;
    } catch (e) {
        console.error(e);
    }
}

const remove = async (url) => {
    // url = https://flora-bucket.s3.amazonaws.com/photos/apple.jpeg
    // extract file name from the url
    try {
        const filename = url.match(/\/photos\/(.*)/)[1]
        const response = await axios.delete(apiUri + "/deletePicture?pictureName=" + filename)
        console.log(response.data.errmsg);
    }
    catch (e) {
        console.error(e);
    }
}

const awsS3Service = {
    upload,
    remove,
}

export default awsS3Service