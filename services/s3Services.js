const AWS = require('aws-sdk');

const accessKey = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const bucketName = process.env.BUCKET_NAME;


// let s3 = new AWS.S3({
//     accessKey: accessKey,
//     secretAccessKey: secretAccessKey
// })



// exports.uploadToS3 = (image, filename) => {

//     return new Promise((resolve, reject) => {
//         const params = {
//             Bucket: bucketName,
//             Body: image,
//             Key: filename,
//             ACL: 'public-read',
//             ContentType: "image/jpeg"
//         }

//         s3.upload(params, (err, response) => {
//             if (err) {
//                 console.log('something went wrong');
//                 reject(err);
//             }
//             else {
//                 resolve(response.Location);
//             }

//         })
//     })

// };

const uploadToS3 = (image, filename) => {
    return new Promise((resolve, reject) => {
        const BUCKET_NAME = process.env.BUCKET_NAME;
        const IAM_USER_KEY = process.env.AWS_ACCESS_KEY;
        const IAM_USER_SECRET = process.env.AWS_SECRET_ACCESS_KEY;

        let s3bucket = new AWS.S3({
            accessKeyId: IAM_USER_KEY,
            secretAccessKey: IAM_USER_SECRET
        })

        var params = {
            Bucket: BUCKET_NAME,
            Key: filename,
            Body: image,
            ACL: 'public-read',
            ContentType: "image/jpeg"
        }
        s3bucket.upload(params, (err, response) => {
            if (err) {
                console.log('something went wrong', err);
                reject(err);
            }
            else {
                //console.log('success', response)
                resolve(response.Location)
            }
        })
    })


}

module.exports = {
    uploadToS3
}